import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

const CLIENT = { "X-Kiorly-Client": "kiorly/1.0.0" };

/** Blocked stock on the Kiorly expiry screen and the recalled-lot safety alert (found while proving the staff app end to end). */
describe("mobile: quarantined / recalled stock and recalled-lot alerts", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t, { edition: "PRO" }); });
  after(async () => { await t.close(); });
  const H = (who: keyof Fixture["users"]) => ({ ...auth(f.users[who].token), ...CLIENT });

  it("expiry-lowstock lists quarantined and recalled lots (any expiry date) in a `blocked` section, next to the expiry buckets", async () => {
    const d = await seedDrug(t, f);
    const near = await receive(t, f, { drugId: d.id, quantity: 8, lotNumber: "NEAR-1", expiryDays: 12 });
    const qLot = await receive(t, f, { drugId: d.id, quantity: 5, lotNumber: "QUAR-1", expiryDays: 400 });
    const rLot = await receive(t, f, { drugId: d.id, quantity: 3, lotNumber: "RECL-1", expiryDays: 500 });
    assert.equal((await t.http.post(`/api/v1/inventory/lots/${qLot.id}/quarantine`).set(auth(f.users.pharmacist.token)).send({ reason: "Cold chain doubt" })).status, 201);
    await t.prisma.stockLot.update({ where: { id: rLot.id }, data: { status: "RECALLED", blockedReason: "Recalled (SUPPLIER-9)", blockedAt: new Date() } });
    const r = await t.http.get("/api/v1/mobile/pharmacy/expiry-lowstock").set(H("cashier"));
    assert.equal(r.status, 200, JSON.stringify(r.body));
    assert.deepEqual([r.body.expiry.within30.lots, r.body.expiry.within30.units], [1, 8]);
    assert.deepEqual(r.body.expiry.items.map((i: { lotId: string }) => i.lotId), [near.id], "far-dated quarantined/recalled lots are not expiry-bucket rows");
    assert.deepEqual([r.body.blocked.quarantined, r.body.blocked.recalled], [{ lots: 1, units: 5 }, { lots: 1, units: 3 }]);
    const byLot = new Map(r.body.blocked.items.map((i: { lotId: string; status: string; blockedReason: string | null }) => [i.lotId, i]));
    assert.equal((byLot.get(qLot.id) as { status: string }).status, "QUARANTINE");
    assert.equal((byLot.get(rLot.id) as { status: string; blockedReason: string }).blockedReason, "Recalled (SUPPLIER-9)");
  });

  it("a RECALLED lot with stock raises RECALLED_LOT_IN_STOCK even without a RecallNotice row, once; ack is idempotent; the alert clears when the stock is gone", async () => {
    const f2 = await seedTenant(t, { edition: "PRO" });
    const d = await seedDrug(t, f2);
    const lot = await receive(t, f2, { drugId: d.id, quantity: 4, lotNumber: "STAT-RC", expiryDays: 200 });
    await t.prisma.stockLot.update({ where: { id: lot.id }, data: { status: "RECALLED", blockedReason: "Recalled (DEMO)", blockedAt: new Date() } });
    const get = async () => (await t.http.get("/api/v1/mobile/alerts?status=all").set({ ...auth(f2.users.pharmacist.token), ...CLIENT })).body.items.filter((a: { kind: string }) => a.kind === "RECALLED_LOT_IN_STOCK");
    const al = await get();
    assert.equal(al.length, 1);
    assert.deepEqual([al[0].severity, al[0].subject.type, al[0].subject.id, al[0].ackedAt], ["CRITICAL", "StockLot", lot.id, null]);
    const ack = await t.http.post(`/api/v1/mobile/alerts/${encodeURIComponent(al[0].id)}/ack`).set({ ...auth(f2.users.pharmacist.token), ...CLIENT }).send({ note: "quarantined on shelf" });
    assert.equal(ack.status, 200, JSON.stringify(ack.body));
    // a notice that covers the same lot must not double-count it
    await t.http.post("/api/v1/recalls").set(auth(f2.users.pharmacist.token)).send({ drugId: d.id, lotNumbers: ["STAT-RC"], reason: "supplier recall" });
    const after_ = await get();
    assert.equal(after_.length, 1, "notice + status flag = one alert for the lot");
    await t.prisma.stockLot.update({ where: { id: lot.id }, data: { qtyOnHand: 0 } });
    assert.equal((await get()).length, 0);
  });

  it("GET /inventory/lots rejects an unknown status with 400 (was a 500)", async () => {
    const bad = await t.http.get("/api/v1/inventory/lots?status=QUARANTINED").set(auth(f.users.pharmacist.token));
    assert.equal(bad.status, 400);
    assert.equal(bad.body.code, "INVALID_LOT_STATUS");
    assert.equal((await t.http.get("/api/v1/inventory/lots?status=QUARANTINE").set(auth(f.users.pharmacist.token))).status, 200);
  });
});
