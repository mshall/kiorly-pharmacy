import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { signKiorlyRequest } from "@kiorex/contracts";
import { auth, bootApp, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

/** GRW-P4-B2 partner half: the optional Kiorex acquisition block is stored, credits the organisation's own link once, and is ignored when absent, malformed or foreign. */
describe("Product acquisition block (pharmacy)", () => {
  let t: TestApp, f: Fixture, other: Fixture;
  const hash = "a".repeat(64);
  before(async () => {
    t = await bootApp(); f = await seedTenant(t); other = await seedTenant(t);
    for (const fx of [f, other]) assert.equal((await t.http.put(`/api/v1/kiorex-orders/settings/${fx.branchId}`).set(auth(fx.users.owner.token)).send({ optedIn: true, prepMinutes: 25, slaMinutes: 10 })).status, 200);
  });
  after(async () => { await t.close(); });
  const post = (fx: Fixture, body: object) => {
    const raw = JSON.stringify(body);
    const s = signKiorlyRequest({ clientKey: fx.client.key, clientSecret: fx.client.secret, method: "POST", path: "/marketplace/v1/orders", body: raw });
    return t.http.post("/marketplace/v1/orders").set({ ...s.headers, "content-type": "application/json" }).send(raw);
  };
  const link = async (fx: Fixture) => { const r = await t.http.post("/api/v1/growth/links").set(auth(fx.users.owner.token)).send({ label: "Counter link", ownerScope: "ORG" }); assert.equal(r.status, 201); return r.body as { id: string; code: string }; };
  const block = (code: string | undefined, extra: object = {}) => ({ origin: "PROVIDER_LED", decisionId: `dec-${randomUUID()}`, policyVersion: "pv1", reason: "PRIOR_PROVIDER_TOUCH", evidenceHash: hash, product: "PHARMACY", ...(code ? { linkCode: code } : {}), ...extra });
  const daily = async (linkId: string) => (await t.prisma.providerReferralLinkDaily.findMany({ where: { linkId } })).reduce((a, d) => ({ orders: a.orders + d.orders, completed: a.completed + d.completed }), { orders: 0, completed: 0 });

  it("stores the block, credits the own link once (replay safe), and counts completion once on dispense", async () => {
    const l = await link(f);
    const drug = await seedDrug(t, f, { price: "100.00" }); await receive(t, f, { drugId: drug.id, quantity: 10 });
    const orderId = `ord-${randomUUID()}`;
    const body = { orderId, branchId: f.branchId, prepaid: true, lines: [{ sku: drug.id, quantity: 2, unitPrice: "100.00" }], acquisition: block(l.code) };
    const a = await post(f, body); assert.equal(a.status, 201, JSON.stringify(a.body));
    assert.equal((await post(f, body)).body.replayed, true);
    const row = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
    assert.deepEqual([row.acquisitionOrigin, row.acquisitionLinkId, row.acquisitionReason], ["PROVIDER_LED", l.id, "PRIOR_PROVIDER_TOUCH"]);
    assert.deepEqual(await daily(l.id), { orders: 1, completed: 0 });
    const ph = auth(f.users.pharmacist.token);
    const acc = await t.http.post(`/api/v1/kiorex-orders/${row.id}/accept`).set(ph).send({});
    await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/signoff`).set(ph).send({});
    await t.http.post(`/api/v1/kiorex-orders/${row.id}/ready`).set(ph);
    const done = await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/complete`).set(ph).send({ idempotencyKey: `idem-${randomUUID()}` });
    assert.equal(done.status, 201, JSON.stringify(done.body));
    assert.deepEqual(await daily(l.id), { orders: 1, completed: 1 });
  });

  it("MARKETPLACE blocks, absent blocks, malformed blocks and another product's block change no counter and never fail the order", async () => {
    const l = await link(f); const drug = await seedDrug(t, f, { price: "10.00" }); await receive(t, f, { drugId: drug.id, quantity: 50 });
    const lines = [{ sku: drug.id, quantity: 1, unitPrice: "10.00" }];
    for (const acquisition of [block(l.code, { origin: "MARKETPLACE" }), undefined, { origin: "PROVIDER_LED" }, block(l.code, { evidenceHash: "xyz" }), block(l.code, { product: "LAB" }), block("ILLEGAL1")]) {
      const r = await post(f, { orderId: `ord-${randomUUID()}`, branchId: f.branchId, lines, ...(acquisition ? { acquisition } : {}) });
      assert.equal(r.status, 201, JSON.stringify(acquisition));
    }
    assert.deepEqual(await daily(l.id), { orders: 0, completed: 0 });
  });

  it("another organisation's link code is never credited, and no patient data is stored from the block", async () => {
    const mine = await link(f); const theirs = await link(other);
    const drug = await seedDrug(t, f, { price: "10.00" }); await receive(t, f, { drugId: drug.id, quantity: 5 });
    const orderId = `ord-${randomUUID()}`;
    assert.equal((await post(f, { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "10.00" }], acquisition: block(theirs.code) })).status, 201);
    const row = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
    assert.equal(row.acquisitionLinkId, null); assert.equal(row.acquisitionOrigin, "PROVIDER_LED");
    assert.deepEqual(await daily(theirs.id), { orders: 0, completed: 0 }); assert.deepEqual(await daily(mine.id), { orders: 0, completed: 0 });
    assert.equal(await t.prisma.$queryRaw`SELECT 1 FROM "KiorexOrder" WHERE "acquisitionOrigin" = 'BOGUS'`.then((r) => (r as unknown[]).length), 0);
    await assert.rejects(t.prisma.$executeRaw`UPDATE "KiorexOrder" SET "acquisitionOrigin" = 'BOGUS' WHERE id = ${row.id}`);
  });
});
