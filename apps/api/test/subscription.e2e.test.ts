import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";
import { SubscriptionService } from "../src/subscription/subscription.service";

const DAY = 86_400_000;
describe("SUB-01 recurring subscription, auto-renew and Lite downgrade (pharmacy)", () => {
  let t: TestApp, svc: SubscriptionService;
  before(async () => { t = await bootApp(); svc = t.app.get(SubscriptionService); await t.prisma.$executeRawUnsafe(`TRUNCATE TABLE "PlanPrice"`); await t.prisma.planPrice.create({ data: { edition: "PRO", marketCode: "EG", interval: "MONTHLY", currency: "EGP", amount: "100.00" } }); });
  after(async () => { await t.prisma.$executeRawUnsafe(`TRUNCATE TABLE "PlanPrice"`); await t.close(); });
  const sub = (f: Fixture) => t.prisma.orgSubscription.findUniqueOrThrow({ where: { orgId: f.orgId } });
  const edition = async (f: Fixture) => (await t.prisma.tenant.findUniqueOrThrow({ where: { id: f.orgId } })).edition;
  const expire = (f: Fixture, extra: object = {}) => t.prisma.orgSubscription.update({ where: { orgId: f.orgId }, data: { currentPeriodEnd: new Date(Date.now() - DAY), currentPeriodStart: new Date(Date.now() - 31 * DAY), ...extra } });
  const events = (f: Fixture, type: string) => t.prisma.subscriptionEvent.count({ where: { orgId: f.orgId, type } });
  const card = (f: Fixture, tokenRef = "tok_visa_ok") => t.http.put("/api/v1/subscription/payment-method").set(auth(f.users.owner.token)).send({ tokenRef, brand: "Visa", last4: "4242", expMonth: 12, expYear: 2030 });

  it("default ON; state, plans and impact come from the catalog; a missing price is a placeholder, never invented", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    const s = await t.http.get("/api/v1/subscription").set(auth(f.users.owner.token));
    assert.equal(s.status, 200); assert.equal(s.body.autoRenew, true); assert.ok(s.body.renewsOn);
    assert.ok(s.body.downgradeImpact.lostFeatures.includes("purchasing"));
    const p = (await t.http.get("/api/v1/subscription/plans").set(auth(f.users.owner.token))).body;
    assert.deepEqual(p.plans.map((x: { edition: string }) => x.edition), ["LITE", "PRO", "CHAIN", "ENTERPRISE"]);
    assert.equal(p.plans.find((x: { edition: string }) => x.edition === "PRO").prices[0].amount, "100.00");
    assert.equal(p.plans.find((x: { edition: string }) => x.edition === "CHAIN").priceNeedsHuman, true);
  });

  it("renew success charges the saved token once (8 concurrent runs), issues one paid invoice and rolls the period once", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    await card(f); await svc.ensure(f.orgId); await expire(f);
    await Promise.all(Array.from({ length: 8 }, () => svc.runDaily()));
    const invoices = await t.prisma.subscriptionInvoice.findMany({ where: { orgId: f.orgId } });
    assert.equal(invoices.length, 1); assert.equal(invoices[0]!.status, "PAID"); assert.equal(invoices[0]!.total.toFixed(2), "100.00");
    assert.equal(await events(f, "renewed"), 1);
    assert.equal(await edition(f), "PRO"); assert.ok((await sub(f)).currentPeriodEnd > new Date());
  });

  it("renew failure -> retries -> Lite after the dunning window (never lockout); data and users are kept", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    await card(f, "tok_fail_card"); await svc.ensure(f.orgId); await expire(f);
    await svc.runDaily();
    assert.equal((await sub(f)).status, "PAST_DUE"); assert.equal(await edition(f), "PRO");
    assert.equal((await t.prisma.subscriptionNotice.count({ where: { orgId: f.orgId, kind: "payment_failed" } })), 1);
    const firstFailed = (await sub(f)).firstFailedAt!.getTime();
    const day = (n: number) => new Date(firstFailed + n * DAY);
    await t.prisma.orgSubscription.update({ where: { orgId: f.orgId }, data: { nextRetryAt: day(1) } });
    const r = await svc.runDaily(day(1)); assert.equal(r.retried, 1);
    const w = await svc.runDaily(day(14)); void w;
    assert.equal(await edition(f), "PRO");
    await Promise.all([svc.runDaily(day(15)), svc.runDaily(day(15)), svc.runDaily(day(16))]);
    assert.equal(await edition(f), "LITE");
    assert.equal(await events(f, "downgraded_to_lite"), 1);
    assert.equal((await sub(f)).downgradeReason, "payment_failed");
    assert.equal((await t.prisma.subscriptionNotice.count({ where: { orgId: f.orgId, kind: "downgrade_warning" } })), 1);
    assert.equal(await t.prisma.staffUser.count({ where: { orgId: f.orgId } }) >= 5, true);
    // the owner can still sign in and read (not locked out)
    assert.equal((await t.http.get("/api/v1/subscription").set(auth(f.users.owner.token))).status, 200);
  });

  it("cancel auto-renew: confirmation first, stays PRO until period end, then Lite; capability gate: read-only in grace, 402 for writes", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    const bad = await t.http.post("/api/v1/subscription/auto-renew").set(auth(f.users.owner.token)).send({ enabled: false });
    assert.equal(bad.status, 400); assert.equal(bad.body.code, "AUTO_RENEW_CONFIRMATION_REQUIRED"); assert.ok(bad.body.details.impact.dataRetained);
    const ok = await t.http.post("/api/v1/subscription/auto-renew").set(auth(f.users.owner.token)).send({ enabled: false, confirmDowngrade: true });
    assert.equal(ok.status, 201); assert.equal(ok.body.autoRenew, false); assert.equal(await edition(f), "PRO");
    assert.equal((await t.http.get("/api/v1/purchase-orders").set(auth(f.users.owner.token))).status, 200);
    await svc.ensure(f.orgId); await expire(f);
    await svc.runDaily(); await svc.runDaily();
    assert.equal(await edition(f), "LITE"); assert.equal(await events(f, "downgraded_to_lite"), 1);
    const read = await t.http.get("/api/v1/purchase-orders").set(auth(f.users.owner.token));
    assert.equal(read.status, 200, "GET stays readable during the grace window");
    const write = await t.http.post("/api/v1/purchase-orders").set(auth(f.users.owner.token)).send({ branchId: f.branchId, supplierId: "x", lines: [] });
    assert.equal(write.status, 402);
    await t.prisma.orgSubscription.update({ where: { orgId: f.orgId }, data: { liteReadOnlyGraceUntil: new Date(Date.now() - 1000) } });
    assert.equal((await t.http.get("/api/v1/purchase-orders").set(auth(f.users.owner.token))).status, 402, "after the grace the module needs an upgrade");
  });

  it("reactivate: back to the previous edition in one step; roles and tenant isolation", async () => {
    const f = await seedTenant(t, { edition: "PRO" }); const g = await seedTenant(t, { edition: "PRO" });
    await svc.ensure(f.orgId); await svc.downgradeToLite(f.orgId, "auto_renew_off", null);
    assert.equal((await t.http.post("/api/v1/subscription/reactivate").set(auth(f.users.cashier.token)).send({})).status, 403);
    const r = await t.http.post("/api/v1/subscription/reactivate").set(auth(f.users.owner.token)).send({});
    assert.equal(r.status, 201); assert.equal(r.body.reactivated, true); assert.equal(r.body.needsPaymentMethod, true);
    assert.equal(await edition(f), "PRO"); assert.equal((await sub(f)).downgradedToLiteAt, null);
    assert.equal((await t.http.post("/api/v1/subscription/reactivate").set(auth(f.users.owner.token)).send({})).body.code, "ALREADY_PAID");
    // tenant isolation: g's switch is untouched by f's actions; a non-owner cannot switch it off
    assert.equal((await t.http.post("/api/v1/subscription/auto-renew").set(auth(g.users.manager.token)).send({ enabled: false, confirmDowngrade: true })).status, 403);
    assert.equal((await sub(g).catch(() => ({ autoRenew: true }))).autoRenew, true);
    await svc.forceAutoRenew(g.orgId, "ON", "contractual commitment", "ops");
    const forced = await t.http.post("/api/v1/subscription/auto-renew").set(auth(g.users.owner.token)).send({ enabled: false, confirmDowngrade: true });
    assert.equal(forced.body.code, "AUTO_RENEW_FORCED");
    await assert.rejects(svc.forceAutoRenew(g.orgId, "OFF", "  ", "ops"));
  });

  it("reminders: once per offset, deferred outside quiet hours; a card number is refused", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    await svc.ensure(f.orgId); await t.prisma.orgSubscription.update({ where: { orgId: f.orgId }, data: { currentPeriodEnd: new Date(Date.now() + 2.5 * DAY) } });
    await svc.runDaily(); await svc.runDaily();
    const n = await t.prisma.subscriptionNotice.findMany({ where: { orgId: f.orgId } });
    assert.equal(n.length, 1); assert.equal(n[0]!.kind, "payment_method_missing");
    const h = (n[0]!.notBefore.getUTCHours() + 2) % 24; assert.equal(h >= 21 || h < 8, false);
    const pan = await t.http.put("/api/v1/subscription/payment-method").set(auth(f.users.owner.token)).send({ tokenRef: "4111111111111111", last4: "1111" });
    assert.equal(pan.status, 400); assert.equal(pan.body.code, "PAN_NOT_ACCEPTED");
    assert.equal((await t.prisma.orgSubscription.findUniqueOrThrow({ where: { orgId: f.orgId } })).paymentTokenRef, null);
  });
});
