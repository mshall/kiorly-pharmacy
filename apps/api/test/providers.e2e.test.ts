import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { startFakeProvider } from "../src/providers/fake-provider-server";
import { MOCK_WEBHOOK_SECRET } from "../src/providers/provider-env";
import { signWebhook } from "../src/providers/webhook-signature";
import { NotificationsService } from "../src/platform/adapters/notifications.service";

const RUN = Date.now().toString(36); // event ids are deduped in the (persistent) test DB: unique per run
const evt = (id: string, type: string, ref: string, extra: Record<string, unknown> = {}) => JSON.stringify({ id: `${id}_${RUN}`, type, createdAt: new Date().toISOString(), data: { id: ref, ...extra } });
async function withEnv<T>(env: Record<string, string>, fn: () => Promise<T>): Promise<T> {
  const old: Record<string, string | undefined> = {};
  for (const k of Object.keys(env)) { old[k] = process.env[k]; process.env[k] = env[k]; }
  try { return await fn(); } finally { for (const k of Object.keys(env)) { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; } }
}

describe("provider go-live wiring: messaging + pay-by-link (mock end to end, real against a local fake provider)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f, "100.00"); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const hook = (kind: string, body: string, secret: string | null = MOCK_WEBHOOK_SECRET, sig?: string) =>
    t.http.post(`/api/v1/webhooks/providers/${kind}`).set({ "content-type": "application/json", ...(secret || sig ? { "x-kiorex-signature": sig ?? signWebhook(secret!, body) } : {}) }).send(body);

  /** A credit customer with an outstanding balance (a customer with email + phone). */
  async function creditCustomer(balance = 120) {
    const p = await t.prisma.patientRef.create({ data: { orgId: f.orgId, displayName: `Credit ${RUN}`, phone: "+201000000555", email: "credit.customer@example.test" } });
    const acc = await t.prisma.customerAccount.create({ data: { orgId: f.orgId, patientId: p.id, creditLimit: 1000, balance } });
    await t.prisma.customerCreditEntry.create({ data: { orgId: f.orgId, accountId: acc.id, kind: "CHARGE", amount: balance, createdBy: "t" } });
    return acc;
  }
  const balanceOf = async (id: string) => Number((await t.prisma.customerAccount.findUniqueOrThrow({ where: { id } })).balance);

  it("mock: demo runner sends order-ready / refill / receipt flows, delivers receipts through the signed webhook path, and exercises pay-by-link success, refund and failure", async () => {
    const run = await t.http.post("/api/v1/dev/providers/demo/run").set(owner()).send({});
    assert.equal(run.status, 201, JSON.stringify(run.body));
    assert.deepEqual(run.body.messages.map((m: { flow: string }) => m.flow), ["order ready (WhatsApp)", "refill reminder (WhatsApp)", "receipt email", "receipt SMS"]);
    for (const m of run.body.messages) { assert.equal(m.status, "SENT"); assert.equal(m.receipt.applied, 1); }
    const rows = await t.http.get("/api/v1/dev/providers/messages?limit=20").set(owner());
    const demo = rows.body.filter((r: { refType: string }) => r.refType === "DemoFlow");
    assert.equal(demo.length, 4);
    assert.ok(demo.every((r: { status: string; deliveredAt: string; body: string }) => r.status === "DELIVERED" && r.deliveredAt && r.body.length > 10));
    assert.ok(demo.find((r: { template: string }) => r.template === "rx.refill_reminder").body.includes("DEMO01"));
    const links = await t.http.get("/api/v1/dev/providers/pay-links").set(owner());
    assert.deepEqual(links.body.slice(0, 2).map((l: { status: string }) => l.status).sort(), ["FAILED", "REFUNDED"]);
    assert.equal(await balanceOf(run.body.payments.account), 120, "paid 1.00 then refunded 1.00");
    assert.match(run.body.payments.success.payUrl, /\/mock-pay\/mocklink_/);
  });

  it("public webhook: bad / missing / stale signatures are 401, valid applies once, replay is deduped, receipts never downgrade", async () => {
    const n = await t.app.get(NotificationsService).send({ orgId: f.orgId, channel: "SMS", recipient: "+201000000003", template: "expiry.alert", vars: { drug: "X", lot: "L", days: 3, qty: 4 } });
    const ref = n.providerMessageId!;
    assert.match(ref, /^mock_sms_/);
    const body = evt("evt_a1", "message.delivered", ref);
    assert.equal((await hook("sms", body, null)).status, 401);
    assert.equal((await hook("sms", body, "wrong-secret")).status, 401);
    assert.equal((await hook("sms", body, null, signWebhook(MOCK_WEBHOOK_SECRET, body, Math.floor(Date.now() / 1000) - 3600))).status, 401);
    assert.equal((await hook("sms", body + " ", null, signWebhook(MOCK_WEBHOOK_SECRET, body))).status, 401, "body tampered after signing");
    assert.equal((await hook("nope", body)).status, 404);
    const ok = await hook("sms", body);
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    assert.deepEqual([ok.body.applied, ok.body.duplicates], [1, 0]);
    assert.equal((await t.prisma.notification.findUniqueOrThrow({ where: { id: n.id } })).status, "DELIVERED");
    assert.equal((await hook("sms", body)).body.duplicates, 1, "replayed event id");
    await hook("sms", evt("evt_a2", "message.failed", ref, { error: "late failure" }));
    assert.equal((await t.prisma.notification.findUniqueOrThrow({ where: { id: n.id } })).status, "DELIVERED", "failed after delivered is ignored");
    assert.equal((await hook("sms", JSON.stringify({ nonsense: true }))).status, 400);
    assert.equal((await hook("sms", evt("evt_a3", "message.delivered", "unknown_ref"))).body.unmatched, 1);
  });

  it("pay-by-link lifecycle via the API: create + SMS, success books ONE payment, replay no-op, partial refund, failure path", async () => {
    const acc = await creditCustomer(120);
    const k = key();
    const a = await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set({ ...auth(f.users.cashier.token), "idempotency-key": k }).send({ amount: "100.00", sendVia: { channel: "SMS" } });
    assert.equal(a.status, 201, JSON.stringify(a.body));
    assert.equal(a.body.link.status, "PENDING");
    assert.equal(a.body.notification.status, "SENT");
    const sms = await t.prisma.notification.findUniqueOrThrow({ where: { id: a.body.notification.id } });
    assert.ok(sms.body.includes(a.body.link.payUrl));
    const again = await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set({ ...auth(f.users.cashier.token), "idempotency-key": k }).send({ amount: "100.00" });
    assert.equal(again.body.replayed, true);
    assert.equal(again.body.link.id, a.body.link.id);
    assert.equal((await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set(owner()).send({ amount: "500.00" })).status, 422, "over the balance");

    const ref = a.body.link.providerRef as string;
    assert.equal((await hook("payment", evt("evt_p1", "payment.succeeded", ref, { amount: "100.00" }))).status, 200);
    await hook("payment", evt("evt_p2", "payment.succeeded", ref, { amount: "100.00" }));
    assert.equal(await balanceOf(acc.id), 20);
    assert.equal(await t.prisma.customerCreditEntry.count({ where: { accountId: acc.id, kind: "PAYMENT" } }), 1, "two success events book one payment");
    const receipt = await t.prisma.notification.findFirst({ where: { orgId: f.orgId, template: "paylink.receipt", refId: a.body.link.id } });
    assert.equal(receipt?.channel, "EMAIL");

    const rf = await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({ amount: "40.00", reason: "customer request" });
    assert.equal(rf.status, 201, JSON.stringify(rf.body));
    assert.deepEqual([rf.body.pending, rf.body.link.refundedAmount, rf.body.link.status], [false, "40.00", "PAID"]);
    assert.equal(await balanceOf(acc.id), 60);
    assert.equal((await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({ amount: "61.00" })).status, 422);
    assert.equal((await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({})).body.link.status, "REFUNDED");
    assert.equal(await balanceOf(acc.id), 120);
    assert.equal((await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({})).status, 409);

    const b = await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set(owner()).send({ amount: "50.00" });
    await hook("payment", evt("evt_f1", "payment.failed", b.body.link.providerRef, { error: "card_declined" }));
    const failed = (await t.http.get(`/api/v1/pos/customers/${acc.id}/pay-links`).set(owner())).body.find((l: { id: string }) => l.id === b.body.link.id);
    assert.deepEqual([failed.status, failed.failureReason], ["FAILED", "card_declined"]);
    assert.equal(await balanceOf(acc.id), 120);
  });

  it("receipt email: sends the sale receipt through the email provider (customer contact or explicit address)", async () => {
    const drug = await seedDrug(t, f, { price: "40.00" });
    await receive(t, f, { drugId: drug.id, quantity: 10 });
    const sale = await t.http.post("/api/v1/pos/sales").set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CASH", amount: "80.00" }] });
    assert.equal(sale.status, 201, JSON.stringify(sale.body));
    const id = sale.body.sale.id as string;
    assert.equal((await t.http.post(`/api/v1/pos/sales/${id}/receipt/send`).set(auth(f.users.cashier.token)).send({ channel: "EMAIL" })).status, 422, "walk-in sale has no email on file");
    const sent = await t.http.post(`/api/v1/pos/sales/${id}/receipt/send`).set(auth(f.users.cashier.token)).send({ channel: "EMAIL", to: "buyer.demo@example.test" });
    assert.equal(sent.status, 201, JSON.stringify(sent.body));
    const row = await t.prisma.notification.findUniqueOrThrow({ where: { id: sent.body.id } });
    assert.deepEqual([row.channel, row.recipient, row.template, row.status], ["EMAIL", "buyer.demo@example.test", "receipt.email", "SENT"]);
    assert.ok(row.body.includes("80.00") || row.body.includes("EGP"));
    const msgs = await t.http.get("/api/v1/dev/providers/messages?channel=EMAIL").set(owner());
    assert.ok(msgs.body.find((m: { id: string; subject: string }) => m.id === row.id)?.subject);
  });

  it("dev tools are hidden when disabled (production behaviour); the simulator refuses real mode; status never shows secret values", async () => {
    await withEnv({ PROVIDER_DEV_TOOLS: "false" }, async () => {
      assert.equal((await t.http.get("/api/v1/dev/providers/messages").set(owner())).status, 404);
      assert.equal((await t.http.post("/api/v1/dev/providers/demo/run").set(owner()).send({})).status, 404);
    });
    assert.equal((await t.http.get("/api/v1/dev/providers/messages").set(auth(f.users.cashier.token))).status, 403);
    await withEnv({ SMS_MODE: "real" }, async () => {
      assert.equal((await t.http.post("/api/v1/dev/providers/simulate/webhook").set(owner()).send({ kind: "sms", type: "message.delivered", providerRef: "x" })).status, 409);
    });
    const st = await t.http.get("/api/v1/dev/providers/status").set(owner());
    assert.ok(st.body.every((s: Record<string, unknown>) => typeof s.apiKeySet === "boolean" && !("apiKey" in s)));
  });

  it("REAL mode against a local fake provider: SMS send, retry on 5xx, failure mapping, delivery receipt with the kind's own secret", async () => {
    const fake = await startFakeProvider((_r, n) => (n === 2 ? { status: 503, body: {} } : undefined), `fake${RUN}`);
    try {
      await withEnv({ SMS_MODE: "real", SMS_API_URL: fake.url, SMS_API_KEY: "k_sms", SMS_WEBHOOK_SECRET: "whsec_sms", SMS_SENDER_ID: "KIORLY", SMS_BACKOFF_MS: "5" }, async () => {
        const svc = t.app.get(NotificationsService);
        const ok = await svc.send({ orgId: f.orgId, channel: "SMS", recipient: "+201000000009", template: "expiry.alert", locale: "en", vars: { drug: "Panadol", lot: "L1", days: 5, qty: 9 } });
        assert.equal(ok.status, "SENT");
        assert.equal(ok.providerMessageId, `fake${RUN}_msg_1`);
        assert.equal(ok.provider, "sms");
        assert.equal(fake.requests[0]!.headers.authorization, "Bearer k_sms");
        assert.equal(fake.requests[0]!.headers["idempotency-key"], ok.id);
        assert.deepEqual([fake.requests[0]!.body.to, fake.requests[0]!.body.from], ["+201000000009", "KIORLY"]);
        assert.match(fake.requests[0]!.body.text, /Panadol lot L1 expires in 5 days/);
        const retried = await svc.send({ orgId: f.orgId, channel: "SMS", recipient: "+201000000010", template: "expiry.alert", locale: "en", vars: { drug: "Retry", lot: "L2", days: 2, qty: 1 } });
        assert.equal(retried.status, "SENT");
        const keys = fake.requests.filter((q) => q.body?.to === "+201000000010").map((q) => q.headers["idempotency-key"]);
        assert.equal(keys.length, 2);
        assert.equal(new Set(keys).size, 1, "same idempotency key on the retry");
        const body = evt("evt_r1", "message.delivered", ok.providerMessageId!);
        assert.equal((await hook("sms", body, MOCK_WEBHOOK_SECRET)).status, 401, "mock secret is not accepted once a real secret is set");
        assert.equal((await hook("sms", body, "whsec_sms")).status, 200);
        assert.equal((await t.prisma.notification.findUniqueOrThrow({ where: { id: ok.id } })).status, "DELIVERED");
      });
      const down = await startFakeProvider(() => ({ status: 500, body: {} }));
      try {
        await withEnv({ EMAIL_MODE: "real", EMAIL_API_URL: down.url, EMAIL_API_KEY: "k", EMAIL_WEBHOOK_SECRET: "w", EMAIL_FROM: "a@b.test", EMAIL_BACKOFF_MS: "5", EMAIL_MAX_RETRIES: "1" }, async () => {
          const r = await t.app.get(NotificationsService).send({ orgId: f.orgId, channel: "EMAIL", recipient: "x@y.test", template: "receipt.email", locale: "en", vars: { pharmacy: "P", receipt: "R1", date: "2026-01-01", total: "1.00", currency: "EGP" } });
          assert.equal(r.status, "FAILED");
          assert.match(r.error ?? "", /^PROVIDER_5XX/);
          assert.equal(down.requests.length, 2);
          assert.equal(down.requests[0]!.body.subject, "Your receipt R1");
        });
      } finally { await down.close(); }
    } finally { await fake.close(); }
  });

  it("REAL mode PSP: pay link from the fake PSP, payment.succeeded books it, a pending refund completes on refund.succeeded, charge maps to the till", async () => {
    const fake = await startFakeProvider(undefined, `fake${RUN}`);
    try {
      await withEnv({ PAYMENT_MODE: "real", PAYMENT_API_URL: fake.url, PAYMENT_API_KEY: "k_pay", PAYMENT_WEBHOOK_SECRET: "whsec_pay" }, async () => {
        const acc = await creditCustomer(120);
        const a = await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set(owner()).send({ amount: "70.00" });
        assert.equal(a.status, 201, JSON.stringify(a.body));
        assert.match(a.body.link.payUrl, /^https:\/\/pay\.fake\.test\//);
        const plReq = fake.requests.find((q) => q.path === "/pay-links")!;
        assert.equal(plReq.headers.authorization, "Bearer k_pay");
        assert.deepEqual([plReq.body.amount, plReq.body.reference], ["70.00", a.body.link.id]);
        assert.equal((await t.http.post("/api/v1/dev/providers/simulate/webhook").set(owner()).send({ kind: "payment", type: "payment.succeeded", providerRef: a.body.link.providerRef })).status, 409, "no simulating in real mode");
        assert.equal((await hook("payment", evt("e_ok", "payment.succeeded", a.body.link.providerRef, { amount: "70.00" }), MOCK_WEBHOOK_SECRET)).status, 401);
        assert.equal((await hook("payment", evt("e_ok", "payment.succeeded", a.body.link.providerRef, { amount: "70.00" }), "whsec_pay")).status, 200);
        assert.equal(await balanceOf(acc.id), 50);
        const rf = await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({ amount: "20.00" });
        assert.deepEqual([rf.status, rf.body.pending, rf.body.link.status], [201, true, "REFUND_PENDING"]);
        assert.equal(await balanceOf(acc.id), 50, "not booked until the PSP confirms");
        assert.equal((await hook("payment", evt("e_rf", "refund.succeeded", rf.body.link.refundRef), "whsec_pay")).status, 200);
        assert.equal(await balanceOf(acc.id), 70);
        const rf2 = await t.http.post(`/api/v1/pos/pay-links/${a.body.link.id}/refund`).set(owner()).send({ amount: "10.00" });
        await hook("payment", evt("e_rf2", "refund.failed", rf2.body.link.refundRef, { error: "insufficient settlement balance" }), "whsec_pay");
        const l = (await t.http.get(`/api/v1/pos/customers/${acc.id}/pay-links`).set(owner())).body[0];
        assert.equal(l.status, "PAID");
        assert.match(l.failureReason, /REFUND_FAILED/);
        assert.equal(await balanceOf(acc.id), 70);
        // till charge through the same PSP
        const { PspAdapter } = await import("../src/platform/adapters/psp.adapter");
        const psp = t.app.get(PspAdapter);
        const c = await psp.charge({ orgId: f.orgId, method: "CARD", amount: "10.00", idempotencyKey: `till-${RUN}` });
        assert.equal(c.status, "CAPTURED");
        assert.equal(c.reference, `fake${RUN}_ch_${fake.requests.findIndex((q) => q.path === "/charges") + 1}`);
        const ch = fake.requests.find((q) => q.path === "/charges")!;
        assert.deepEqual([ch.headers["idempotency-key"], ch.body.method, ch.body.amount], [`till-${RUN}`, "CARD", "10.00"]);
        // PSP outage -> 502 with a mapped code
        const down = await startFakeProvider(() => ({ status: 500, body: {} }));
        try {
          await withEnv({ PAYMENT_API_URL: down.url, PAYMENT_MAX_RETRIES: "0" }, async () => {
            const bad = await t.http.post(`/api/v1/pos/customers/${acc.id}/pay-link`).set(owner()).send({ amount: "10.00" });
            assert.equal(bad.status, 502);
            assert.equal(bad.body.providerCode, "PROVIDER_5XX");
            assert.equal((await psp.charge({ orgId: f.orgId, method: "CARD", amount: "10.00", idempotencyKey: `till2-${RUN}` })).declineReason, "PSP_PROVIDER_5XX");
          });
        } finally { await down.close(); }
      });
    } finally { await fake.close(); }
  });
});
