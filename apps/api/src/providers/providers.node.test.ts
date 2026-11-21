import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { startFakeProvider } from "./fake-provider-server";
import { HttpMessageProvider, MockMessageProvider, messageProvider } from "./messaging-provider";
import { HttpPaymentProvider, MockPaymentProvider, paymentProvider } from "./payment-provider";
import { ProviderError, providerRequest } from "./http";
import { ProviderConfigError, assertProviderConfig, devToolsEnabled, providerConfig, providerMode, validateProviderConfig, webhookSecretFor } from "./provider-env";
import { sendPush } from "./push-provider";
import { signWebhook, verifyWebhookSignature } from "./webhook-signature";
import type { MessageRequest } from "./provider-types";

const REAL_SMS = { SMS_MODE: "real", SMS_API_URL: "https://sms.example.test", SMS_API_KEY: "sk_live_SUPER_SECRET", SMS_WEBHOOK_SECRET: "whsec_SUPER_SECRET", SMS_SENDER_ID: "KIORLY" };
const msg = (over: Partial<MessageRequest> = {}): MessageRequest => ({ channel: "SMS", to: "+201000000001", templateId: "T", locale: "en", text: "hello", idempotencyKey: "idem-1", reference: "ref-1", ...over });
const fast = (url: string, kind: "SMS" | "PAYMENT" | "EMAIL" | "WHATSAPP" = "SMS") => ({ [`${kind}_MODE`]: "real", [`${kind}_API_URL`]: url, [`${kind}_API_KEY`]: "k_test", [`${kind}_WEBHOOK_SECRET`]: "w_test", SMS_SENDER_ID: "KIORLY", EMAIL_FROM: "noreply@kiorly.test", WHATSAPP_SENDER_ID: "123", [`${kind}_BACKOFF_MS`]: "5", [`${kind}_TIMEOUT_MS`]: "300", [`${kind}_MAX_RETRIES`]: "2" });

describe("provider env contract and fail-fast startup", () => {
  it("defaults to mock and reads legacy MESSAGING_MODE / PSP_MODE", () => {
    assert.equal(providerMode("SMS", {}), "mock");
    assert.equal(providerMode("SMS", { MESSAGING_MODE: "real" }), "real");
    assert.equal(providerMode("EMAIL", { MESSAGING_MODE: "real", EMAIL_MODE: "mock" }), "mock");
    assert.equal(providerMode("PAYMENT", { PSP_MODE: "real" }), "real");
    assert.equal(providerMode("PUSH", { MOBILE_PUSH_MODE: "real" }), "real");
    assert.deepEqual(validateProviderConfig({}), []);
  });
  it("MODE=real without URL / key / webhook secret / sender refuses to start, naming variables but never values", () => {
    const problems = validateProviderConfig({ SMS_MODE: "real", PAYMENT_MODE: "real", PAYMENT_API_KEY: "sk_live_SHOULD_NOT_LEAK" });
    for (const name of ["SMS_API_URL", "SMS_API_KEY", "SMS_WEBHOOK_SECRET", "SMS_SENDER_ID", "PAYMENT_API_URL", "PAYMENT_WEBHOOK_SECRET"]) assert.ok(problems.some((p) => p.includes(name)), name);
    assert.ok(!problems.some((p) => p.includes("PAYMENT_API_KEY")), "set variables are not reported");
    assert.throws(() => assertProviderConfig({ EMAIL_MODE: "real", EMAIL_API_KEY: "sk_live_SHOULD_NOT_LEAK" }), (e: Error) => e instanceof ProviderConfigError && /EMAIL_API_URL/.test(e.message) && !e.message.includes("sk_live_SHOULD_NOT_LEAK"));
    assert.doesNotThrow(() => assertProviderConfig({ ...REAL_SMS }));
  });
  it("rejects malformed URLs and plain http in production", () => {
    assert.ok(validateProviderConfig({ ...REAL_SMS, SMS_API_URL: "not a url" }).some((p) => /valid URL/.test(p)));
    assert.ok(validateProviderConfig({ ...REAL_SMS, SMS_API_URL: "http://sms.example.test", NODE_ENV: "production" }).some((p) => /https/.test(p)));
  });
  it("webhook secret falls back to the public simulator secret only in mock mode outside production", () => {
    assert.ok(webhookSecretFor("SMS", {}));
    assert.equal(webhookSecretFor("SMS", { NODE_ENV: "production" }), undefined);
    assert.equal(webhookSecretFor("SMS", { SMS_MODE: "real" }), undefined);
    assert.equal(webhookSecretFor("SMS", { ...REAL_SMS }), "whsec_SUPER_SECRET");
  });
  it("dev tools are off in production", () => {
    assert.equal(devToolsEnabled({ NODE_ENV: "development" }), true);
    assert.equal(devToolsEnabled({ NODE_ENV: "production" }), false);
    assert.equal(devToolsEnabled({ NODE_ENV: "test", PROVIDER_DEV_TOOLS: "false" }), false);
  });
});

describe("HMAC webhook signatures", () => {
  const body = JSON.stringify({ id: "evt_1", type: "message.delivered", data: { id: "m1" } });
  it("accepts a valid signature and rejects tampering, wrong secret, stale and malformed headers", () => {
    const now = 1_800_000_000;
    const sig = signWebhook("s3cret", body, now);
    assert.deepEqual(verifyWebhookSignature("s3cret", body, sig, now + 5), { ok: true });
    assert.deepEqual(verifyWebhookSignature("s3cret", body + " ", sig, now), { ok: false, reason: "MISMATCH" });
    assert.deepEqual(verifyWebhookSignature("other", body, sig, now), { ok: false, reason: "MISMATCH" });
    assert.deepEqual(verifyWebhookSignature("s3cret", body, sig, now + 10_000), { ok: false, reason: "STALE" });
    assert.deepEqual(verifyWebhookSignature("s3cret", body, undefined, now), { ok: false, reason: "MISSING" });
    assert.deepEqual(verifyWebhookSignature("s3cret", body, "garbage", now), { ok: false, reason: "MALFORMED" });
  });
});

describe("real HTTP messaging provider against a local fake server", () => {
  it("sends the mapped body with bearer auth, idempotency key and sender id, and maps the response", async () => {
    const fake = await startFakeProvider();
    try {
      const p = messageProvider("SMS", fast(fake.url));
      assert.ok(p instanceof HttpMessageProvider);
      const r = await p.send(msg());
      assert.deepEqual(r, { providerMessageId: "fake_msg_1", status: "QUEUED" });
      const q = fake.requests[0]!;
      assert.equal(q.path, "/messages");
      assert.equal(q.headers.authorization, "Bearer k_test");
      assert.equal(q.headers["idempotency-key"], "idem-1");
      assert.deepEqual(q.body, { to: "+201000000001", from: "KIORLY", text: "hello", reference: "ref-1", templateId: "T", locale: "en" });
    } finally { await fake.close(); }
  });
  it("email and WhatsApp use their own mapping (subject / template object)", async () => {
    const fake = await startFakeProvider();
    try {
      await messageProvider("EMAIL", fast(fake.url, "EMAIL")).send(msg({ channel: "EMAIL", to: "a@b.test", subject: "Subj" }));
      await messageProvider("WHATSAPP", fast(fake.url, "WHATSAPP")).send(msg({ channel: "WHATSAPP", templateId: "result_ready", params: { orderNumber: "O1" } }));
      assert.equal(fake.requests[0]!.body.subject, "Subj");
      assert.equal(fake.requests[0]!.body.from, "noreply@kiorly.test");
      assert.deepEqual(fake.requests[1]!.body.template, { name: "result_ready", language: "en", params: { orderNumber: "O1" } });
    } finally { await fake.close(); }
  });
  it("retries 5xx / 429 with the SAME idempotency key, then succeeds", async () => {
    const fake = await startFakeProvider((_r, n) => (n === 1 ? { status: 503, body: {} } : n === 2 ? { status: 429, body: {}, headers: { "retry-after": "0" } } : undefined));
    try {
      const r = await messageProvider("SMS", fast(fake.url)).send(msg());
      assert.equal(r.providerMessageId, "fake_msg_3");
      assert.equal(fake.requests.length, 3);
      assert.ok(fake.requests.every((q) => q.headers["idempotency-key"] === "idem-1"));
    } finally { await fake.close(); }
  });
  it("gives up after maxRetries and maps the error; 4xx and auth failures are not retried", async () => {
    const down = await startFakeProvider(() => ({ status: 500, body: {} }));
    try {
      await assert.rejects(() => messageProvider("SMS", fast(down.url)).send(msg()), (e: ProviderError) => e.code === "PROVIDER_5XX" && e.retryable);
      assert.equal(down.requests.length, 3);
    } finally { await down.close(); }
    const auth = await startFakeProvider(() => ({ status: 401, body: {} }));
    try {
      await assert.rejects(() => messageProvider("SMS", fast(auth.url)).send(msg()), (e: ProviderError) => e.code === "AUTH" && !/k_test/.test(e.message));
      assert.equal(auth.requests.length, 1);
    } finally { await auth.close(); }
    const bad = await startFakeProvider(() => ({ status: 422, body: { error: "invalid number" } }));
    try {
      await assert.rejects(() => messageProvider("SMS", fast(bad.url)).send(msg()), (e: ProviderError) => e.code === "REJECTED");
      assert.equal(bad.requests.length, 1);
    } finally { await bad.close(); }
  });
  it("times out a hanging provider", async () => {
    const slow = await startFakeProvider(() => ({ status: 200, body: { id: "x" }, delayMs: 400 }));
    try {
      await assert.rejects(() => messageProvider("SMS", { ...fast(slow.url), SMS_TIMEOUT_MS: "60", SMS_MAX_RETRIES: "1" }).send(msg()), (e: ProviderError) => e.code === "TIMEOUT");
      assert.equal(slow.requests.length, 2);
    } finally { await slow.close(); }
  });
  it("maps network failure and a response without an id", async () => {
    await assert.rejects(() => messageProvider("SMS", { ...fast("http://127.0.0.1:1"), SMS_MAX_RETRIES: "0" }).send(msg()), (e: ProviderError) => e.code === "NETWORK");
    const odd = await startFakeProvider(() => ({ status: 200, body: { nope: true } }));
    try { await assert.rejects(() => messageProvider("SMS", fast(odd.url)).send(msg()), (e: ProviderError) => e.code === "BAD_RESPONSE"); } finally { await odd.close(); }
  });
  it("mock provider is deterministic and rejects '-fail' recipients", async () => {
    const m = new MockMessageProvider("SMS");
    assert.equal((await m.send(msg())).providerMessageId, (await m.send(msg())).providerMessageId);
    await assert.rejects(() => m.send(msg({ to: "+2010-fail" })), (e: ProviderError) => e.code === "REJECTED");
    assert.ok(messageProvider("SMS", {}) instanceof MockMessageProvider);
  });
  it("parses generic webhook events and rejects malformed ones", () => {
    const m = new MockMessageProvider("WHATSAPP");
    assert.deepEqual(m.parseWebhook({ id: "e1", type: "message.delivered", createdAt: "2026-01-01T00:00:00Z", data: { id: "m1" } }), [{ eventId: "e1", type: "message.delivered", providerRef: "m1", occurredAt: "2026-01-01T00:00:00Z", error: undefined, amount: undefined, currency: undefined, reference: undefined }]);
    assert.throws(() => m.parseWebhook({ id: "e1", type: "payment.succeeded", data: { id: "m1" } }));
    assert.throws(() => m.parseWebhook({ type: "message.sent" }));
  });
});

describe("real HTTP payment provider against a local fake server", () => {
  it("charge, pay-link and refund hit /charges /pay-links /refunds with idempotency keys and map statuses", async () => {
    const fake = await startFakeProvider();
    try {
      const p = paymentProvider(fast(fake.url, "PAYMENT"));
      assert.ok(p instanceof HttpPaymentProvider);
      assert.deepEqual(await p.charge({ amount: "10.00", currency: "EGP", method: "CARD", reference: "r1", idempotencyKey: "k1", cardToken: "tok_ok" }), { status: "CAPTURED", providerRef: "fake_ch_1", declineReason: undefined, payUrl: undefined });
      const d = await p.charge({ amount: "10.00", currency: "EGP", method: "CARD", reference: "r2", idempotencyKey: "k2", cardToken: "tok_decline" });
      assert.equal(d.status, "DECLINED");
      assert.equal(d.declineReason, "do_not_honor");
      const l = await p.createPayLink({ amount: "50.00", currency: "EGP", reference: "link1", description: "Invoice 1", idempotencyKey: "k3" });
      assert.deepEqual(l, { providerRef: "fake_pl_3", payUrl: "https://pay.fake.test/3", status: "PENDING" });
      const r = await p.refund({ providerRef: "fake_ch_1", amount: "5.00", currency: "EGP", idempotencyKey: "k4" });
      assert.deepEqual(r, { providerRef: "fake_rf_4", status: "PENDING" });
      assert.deepEqual(fake.requests.map((q) => [q.path, q.headers["idempotency-key"], q.headers.authorization]), [["/charges", "k1", "Bearer k_test"], ["/charges", "k2", "Bearer k_test"], ["/pay-links", "k3", "Bearer k_test"], ["/refunds", "k4", "Bearer k_test"]]);
      assert.equal(fake.requests[3]!.body.chargeId, "fake_ch_1");
    } finally { await fake.close(); }
  });
  it("payment webhooks normalise to canonical events; mock charge rules", async () => {
    const p = new MockPaymentProvider("http://x");
    const ev = p.parseWebhook({ events: [{ id: "e1", type: "payment.succeeded", data: { id: "pl_1", amount: "50.00", currency: "EGP" } }, { id: "e2", type: "refund.failed", data: { id: "rf_1", error: "insufficient" } }] });
    assert.deepEqual(ev.map((e) => [e.type, e.providerRef, e.amount ?? e.error]), [["payment.succeeded", "pl_1", "50.00"], ["refund.failed", "rf_1", "insufficient"]]);
    assert.equal((await p.charge({ amount: "1.13", currency: "EGP", method: "CARD", reference: "r", idempotencyKey: "a" })).status, "DECLINED");
    assert.equal((await p.charge({ amount: "1.00", currency: "EGP", method: "CARD", reference: "r", idempotencyKey: "a" })).status, "CAPTURED");
    assert.match((await p.createPayLink({ amount: "1.00", currency: "EGP", reference: "r", description: "d", idempotencyKey: "z" })).payUrl, /^http:\/\/x\/mock-pay\/mocklink_/);
  });
});

describe("push gateway and generic request helper", () => {
  it("push: mock accepts locally; real posts the message batch to PUSH_API_URL with the optional token", async () => {
    assert.deepEqual(await sendPush([{ to: "t", title: "a", body: "b" }], {}), { accepted: 1 });
    const fake = await startFakeProvider();
    try {
      const r = await sendPush([{ to: "ExponentPushToken[x]", title: "a", body: "b" }], { PUSH_MODE: "real", PUSH_API_URL: fake.url, PUSH_API_KEY: "expo_tok", PUSH_BACKOFF_MS: "5" });
      assert.equal(r.accepted, 1);
      assert.equal(fake.requests[0]!.headers.authorization, "Bearer expo_tok");
      assert.equal(fake.requests[0]!.body[0].to, "ExponentPushToken[x]");
      await assert.rejects(() => sendPush([{ to: "t", title: "a", body: "b" }], { PUSH_MODE: "real" }), (e: ProviderError) => e.code === "NOT_CONFIGURED");
    } finally { await fake.close(); }
  });
  it("storage-style raw PUT/GET round-trips bytes", async () => {
    const fake = await startFakeProvider();
    try {
      const cfg = providerConfig("STORAGE", { STORAGE_MODE: "real", STORAGE_API_URL: fake.url, STORAGE_API_KEY: "k" });
      await providerRequest(cfg, { method: "PUT", path: "/a/b.bin", rawBody: Buffer.from([1, 2, 3]), headers: { "content-type": "application/octet-stream" } }, { authorization: "Bearer k" });
      const got = await providerRequest(cfg, { method: "GET", path: "/a/b.bin", binary: true }, { authorization: "Bearer k" });
      assert.deepEqual([...got.raw], [1, 2, 3]);
    } finally { await fake.close(); }
  });
});
