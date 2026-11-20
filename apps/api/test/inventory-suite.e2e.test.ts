import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { auth, bootApp, isoDate, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Inventory suite: locations, pack units, movers, auto reorder, cold chain, movements, damage, labels, price book", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const ph = () => auth(f.users.pharmacist.token);
  const cash = () => auth(f.users.cashier.token);

  it("shelf locations: unique per branch, cold-chain only in fridges, controlled only in safes, contents list, not-empty guard", async () => {
    const a = await t.http.post("/api/v1/inventory/locations").set(owner()).send({ branchId: f.branchId, code: "a3", label: "Shelf A3" });
    assert.equal(a.status, 201); assert.equal(a.body.code, "A3");
    assert.equal((await t.http.post("/api/v1/inventory/locations").set(owner()).send({ branchId: f.branchId, code: "A3" })).status, 409);
    const fridge = (await t.http.post("/api/v1/inventory/locations").set(owner()).send({ branchId: f.branchId, code: "FR1", kind: "FRIDGE" })).body;
    const safe = (await t.http.post("/api/v1/inventory/locations").set(owner()).send({ branchId: f.branchId, code: "SAFE1", kind: "SAFE" })).body;
    const plain = await seedDrug(t, f, {}); const lp = await receive(t, f, { drugId: plain.id, quantity: 7 });
    const cold = await seedDrug(t, f, { coldChain: true, rxOnly: true }); const lc = await receive(t, f, { drugId: cold.id, quantity: 3, temperatureC: 5 });
    const ctl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_3" }); const lk = await receive(t, f, { drugId: ctl.id, quantity: 2 });
    assert.equal((await t.http.post(`/api/v1/inventory/locations/${a.body.id}/assign`).set(owner()).send({ lotIds: [lc.id] })).body.code, "COLD_CHAIN_LOCATION");
    assert.equal((await t.http.post(`/api/v1/inventory/locations/${a.body.id}/assign`).set(owner()).send({ lotIds: [lk.id] })).body.code, "CONTROLLED_LOCATION");
    assert.equal((await t.http.post(`/api/v1/inventory/locations/${a.body.id}/assign`).set(owner()).send({ lotIds: [lp.id] })).body.assigned, 1);
    assert.equal((await t.http.post(`/api/v1/inventory/locations/${fridge.id}/assign`).set(owner()).send({ lotIds: [lc.id] })).status, 201);
    assert.equal((await t.http.post(`/api/v1/inventory/locations/${safe.id}/assign`).set(owner()).send({ lotIds: [lk.id] })).status, 201);
    const contents = await t.http.get(`/api/v1/inventory/locations/${a.body.id}/contents`).set(cash());
    assert.equal(contents.body.lots[0].qtyOnHand, 7);
    const list = await t.http.get("/api/v1/inventory/locations").set(cash());
    assert.equal(list.body.find((l: { code: string }) => l.code === "A3").units, 7);
    assert.equal((await t.http.patch(`/api/v1/inventory/locations/${a.body.id}`).set(owner()).send({ active: false })).body.code, "LOCATION_NOT_EMPTY");
    assert.equal((await t.http.post("/api/v1/inventory/locations").set(cash()).send({ code: "X9" })).status, 403);
  });

  it("pack units: receive in boxes (cost per base unit derived) and sell in boxes; bad units and factors are refused", async () => {
    const d = await seedDrug(t, f, { price: "10.00" });
    assert.equal((await t.http.post(`/api/v1/inventory/uoms/${d.id}`).set(owner()).send({ name: "box", factor: 1 })).status, 400);
    const u = await t.http.post(`/api/v1/inventory/uoms/${d.id}`).set(owner()).send({ name: "Box", factor: 12 });
    assert.equal(u.status, 201); assert.equal(u.body.name, "box");
    assert.equal((await t.http.post(`/api/v1/inventory/uoms/${d.id}`).set(owner()).send({ name: "box", factor: 6 })).status, 409);
    const rc = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: d.id, lotNumber: "BX1", expiryDate: isoDate(300), quantity: 3, unitCost: "60.00", uom: "box" }] });
    assert.equal(rc.status, 201, JSON.stringify(rc.body));
    const lot = await t.prisma.stockLot.findFirstOrThrow({ where: { id: rc.body.lines[0].lotId } });
    assert.equal(lot.qtyOnHand, 36); assert.equal(lot.unitCost.toFixed(2), "5.00");
    const bad = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: d.id, lotNumber: "BX2", expiryDate: isoDate(300), quantity: 1, unitCost: "60.00", uom: "pallet" }] });
    assert.equal(bad.body.code, "UNKNOWN_UOM");
    const sale = await t.http.post("/api/v1/pos/sales").set(cash()).send({ idempotencyKey: key(), lines: [{ drugId: d.id, quantity: 2, uom: "box" }], payments: [{ method: "CASH", amount: "240.00" }] });
    assert.equal(sale.status, 201, JSON.stringify(sale.body)); assert.equal(sale.body.sale.total, "240.00"); assert.equal(await ledgerOnHand(t.prisma, lot.id), 12);
    assert.equal((await t.http.get(`/api/v1/inventory/uoms/${d.id}`).set(cash())).body.length, 1);
    assert.equal((await t.http.delete(`/api/v1/inventory/uoms/item/${u.body.id}`).set(owner())).status, 200);
  });

  it("movers: dead stock, fast and slow classes, days of cover; auto reorder derives min/max and keeps existing policies", async () => {
    const f2 = await seedTenant(t); await openShift(t, f2);
    const o2 = () => auth(f2.users.owner.token), c2 = () => auth(f2.users.cashier.token);
    const drugs = [];
    for (let i = 1; i <= 6; i++) { const d = await seedDrug(t, f2, { price: "10.00", brandName: `Mover-${i}` }); await receive(t, f2, { drugId: d.id, quantity: 500 }); drugs.push(d); }
    const dead = await seedDrug(t, f2, { price: "10.00", brandName: "Dusty" }); await receive(t, f2, { drugId: dead.id, quantity: 25, unitCost: "4.00" });
    for (const [i, d] of drugs.entries()) await t.http.post("/api/v1/pos/sales").set(c2()).send({ idempotencyKey: key(), lines: [{ drugId: d.id, quantity: (i + 1) * 5 }], payments: [{ method: "CASH", amount: String((i + 1) * 50) }] });
    const m = await t.http.get(`/api/v1/inventory/analytics/movers?days=30&branchId=${f2.branchId}`).set(o2());
    assert.equal(m.status, 200, JSON.stringify(m.body));
    const by = (n: string) => m.body.items.find((x: { brandName: string }) => x.brandName === n);
    assert.equal(by("Dusty").class, "DEAD"); assert.equal(by("Mover-6").class, "FAST"); assert.equal(by("Mover-1").class, "SLOW");
    assert.equal(by("Mover-6").units, 30); assert.equal(by("Mover-6").perDay, 1); assert.equal(by("Mover-6").daysOfCover, 470);
    assert.equal(m.body.deadStockValue, "100.00"); assert.equal(m.body.counts.DEAD, 1);
    const pre = await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f2.branchId}`).set(o2()).send({ drugId: drugs[0]!.id, minQty: 1, maxQty: 2 });
    assert.equal(pre.status, 200);
    const auto = await t.http.post("/api/v1/inventory/analytics/auto-reorder").set(o2()).send({ branchId: f2.branchId, days: 30, safetyDays: 3, reviewDays: 14 });
    assert.equal(auto.status, 201, JSON.stringify(auto.body)); assert.equal(auto.body.created, 5); assert.equal(auto.body.skipped, 1);
    const pol = await t.http.get(`/api/v1/inventory/reorder-policies?branchId=${f2.branchId}`).set(o2());
    const p6 = pol.body.find((p: { drugId: string }) => p.drugId === drugs[5]!.id);
    assert.equal(p6.minQty, 5); assert.equal(p6.maxQty, 19); // 1/day * (2 lead + 3 safety); + 14 review
    assert.equal(pol.body.find((p: { drugId: string }) => p.drugId === drugs[0]!.id).minQty, 1, "existing policy untouched");
    assert.equal((await t.http.post("/api/v1/inventory/analytics/auto-reorder").set(o2()).send({ branchId: f2.branchId, days: 30, overwrite: true })).body.updated, 6);
    assert.equal((await t.http.post("/api/v1/inventory/analytics/auto-reorder").set(c2()).send({})).status, 403);
  });

  it("cold-chain overview lists fridge lots with the last reading; an excursion shows and quarantines", async () => {
    const d = await seedDrug(t, f, { coldChain: true, rxOnly: true, brandName: "Insu-Cold" });
    const lot = await receive(t, f, { drugId: d.id, quantity: 4, temperatureC: 4 });
    await t.http.post(`/api/v1/inventory/cold-chain/${lot.id}/readings`).set(ph()).send({ temperatureC: 6.5 });
    let list = await t.http.get("/api/v1/inventory/cold-chain/lots").set(cash());
    let mine = list.body.find((x: { lotId: string }) => x.lotId === lot.id);
    assert.equal(mine.lastReading.temperatureC, "6.5"); assert.equal(mine.lastReading.excursion, false); assert.equal(mine.readings24h, 2);
    await t.http.post(`/api/v1/inventory/cold-chain/${lot.id}/readings`).set(ph()).send({ temperatureC: 12 });
    list = await t.http.get("/api/v1/inventory/cold-chain/lots").set(cash());
    mine = list.body.find((x: { lotId: string }) => x.lotId === lot.id);
    assert.equal(mine.lastReading.excursion, true); assert.equal(mine.status, "QUARANTINE");
  });

  it("damage write-off records a reason code; the movement journal filters by type and reason; controlled needs a witness", async () => {
    const d = await seedDrug(t, f, { brandName: "Breakable" }); const lot = await receive(t, f, { drugId: d.id, quantity: 10 });
    const r = await t.http.post(`/api/v1/inventory/lots/${lot.id}/damage`).set(ph()).send({ quantity: 3, reason: "Dropped carton" });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 7);
    await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: 1, reason: "Found on shelf", reasonCode: "FOUND" });
    const j = await t.http.get("/api/v1/inventory/movements?reasonCode=DAMAGE&q=Breakable").set(ph());
    assert.equal(j.body.total, 1); assert.equal(j.body.items[0].qtyDelta, -3); assert.equal(j.body.items[0].reason, "Dropped carton"); assert.ok(j.body.items[0].performedBy);
    assert.equal((await t.http.get("/api/v1/inventory/movements?type=ADJUSTMENT&q=Breakable").set(ph())).body.total, 2);
    assert.equal((await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: 1, reason: "x", reasonCode: "NOPE" })).status, 400);
    assert.equal((await t.http.post(`/api/v1/inventory/lots/${lot.id}/damage`).set(ph()).send({ quantity: 50, reason: "too many" })).body.code, "APPROVAL_REQUIRED");
    const ctl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_4" }); const cl = await receive(t, f, { drugId: ctl.id, quantity: 5 });
    assert.equal((await t.http.post(`/api/v1/inventory/lots/${cl.id}/damage`).set(ph()).send({ quantity: 1, reason: "Broken blister" })).body.code, "WITNESS_REQUIRED");
    assert.equal((await t.http.post(`/api/v1/inventory/lots/${cl.id}/damage`).set(ph()).send({ quantity: 1, reason: "Broken blister", witness: { email: f.users.manager.email, password: "Passw0rd!x" } })).status, 201);
  });

  it("lot labels and shelf labels carry scannable barcodes", async () => {
    const d = await seedDrug(t, f, { gtin: "4006381333931", brandName: "Labelled" }); const lot = await receive(t, f, { drugId: d.id, quantity: 5, lotNumber: "LBL-1" });
    const lab = await t.http.get(`/api/v1/inventory/lots/labels.html?ids=${lot.id}&lang=en`).set(cash());
    assert.equal(lab.status, 200); assert.match(lab.text, /Labelled/); assert.match(lab.text, /LBL-1/); assert.match(lab.text, /<svg/); assert.match(lab.text, /LOT-/);
    const shelf = await t.http.get(`/api/v1/catalogue/labels/print?drugIds=${d.id}&lang=en`).set(cash());
    assert.match(shelf.text, /<svg/); assert.match(shelf.text, /4006381333931/);
  });

  it("price book overview: price, latest cost, margin, low-margin filter and category", async () => {
    const d = await seedDrug(t, f, { price: "100.00", brandName: "Margin-A" }); await receive(t, f, { drugId: d.id, quantity: 5, unitCost: "95.00" });
    const e = await seedDrug(t, f, { price: "100.00", brandName: "Margin-B" }); await receive(t, f, { drugId: e.id, quantity: 5, unitCost: "60.00" });
    await t.http.patch(`/api/v1/catalogue/drugs/${e.id}`).set(owner()).send({ category: "Analgesics" });
    const pb = await t.http.get("/api/v1/catalogue/price-book?q=margin-").set(cash());
    assert.equal(pb.body.items.find((x: { brandName: string }) => x.brandName === "Margin-A").marginPct, 5);
    assert.equal(pb.body.items.find((x: { brandName: string }) => x.brandName === "Margin-B").marginPct, 40);
    assert.deepEqual((await t.http.get("/api/v1/catalogue/price-book?q=margin-&lowMargin=true").set(cash())).body.items.map((x: { brandName: string }) => x.brandName), ["Margin-A"]);
    assert.deepEqual((await t.http.get("/api/v1/catalogue/price-book?category=Analgesics").set(cash())).body.items.map((x: { brandName: string }) => x.brandName), ["Margin-B"]);
    assert.ok((await t.http.get("/api/v1/catalogue/categories").set(cash())).body.includes("Analgesics"));
    assert.equal((await t.http.get(`/api/v1/catalogue/drugs?category=Analgesics`).set(cash())).body.total, 1);
    void randomUUID;
  });
});
