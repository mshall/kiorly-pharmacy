import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Reports: 30+ report types over a realistic day, JSON / CSV / PDF", () => {
  let t: TestApp, f: Fixture; const ctx: Record<string, string> = {};
  before(async () => {
    t = await bootApp(); f = await seedTenant(t, { edition: "CHAIN" }); const sh = await openShift(t, f, "100.00"); ctx.shiftId = sh.id;
    const o = auth(f.users.owner.token), ph = auth(f.users.pharmacist.token), c = auth(f.users.cashier.token);
    const a = await seedDrug(t, f, { price: "100.00", brandName: "Rep-A" }), b = await seedDrug(t, f, { price: "40.00", brandName: "Rep-B" }), dead = await seedDrug(t, f, { price: "10.00", brandName: "Rep-Dead" });
    await t.http.patch(`/api/v1/catalogue/drugs/${a.id}`).set(o).send({ category: "Analgesics" });
    await receive(t, f, { drugId: a.id, quantity: 30, unitCost: "60.00" }); await receive(t, f, { drugId: b.id, quantity: 30, unitCost: "25.00", expiryDays: 20 }); await receive(t, f, { drugId: dead.id, quantity: 5, unitCost: "4.00" });
    await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f.branchId}`).set(o).send({ drugId: b.id, minQty: 40, maxQty: 60 });
    await t.http.post("/api/v1/pos/promotions").set(o).send({ name: "Rep promo", kind: "PERCENT_OFF", drugIds: [b.id], params: { percent: 10 } });
    const cust = (await t.http.post("/api/v1/customers").set(o).send({ displayName: "Rep Customer", phone: "01066667777" })).body;
    const s1 = await t.http.post("/api/v1/pos/sales").set(c).send({ idempotencyKey: key(), patientId: cust.id, lines: [{ drugId: a.id, quantity: 3 }, { drugId: b.id, quantity: 5 }], payments: [{ method: "CASH", amount: "300.00" }, { method: "CARD", amount: "180.00" }] });
    assert.equal(s1.status, 201, JSON.stringify(s1.body));
    const full = (await t.http.get(`/api/v1/pos/sales/${s1.body.sale.id}`).set(o)).body;
    await t.http.post(`/api/v1/pos/sales/${s1.body.sale.id}/returns`).set(o).send({ lines: [{ saleLineId: full.lines[0].id, quantity: 1 }], reason: "damaged box", refundMethod: "CASH" });
    await t.http.post("/api/v1/finance/expenses").set(o).send({ branchId: f.branchId, category: "UTILITIES", amount: "75.00", description: "Water bill" });
    await t.http.post("/api/v1/pos/cash-movements").set(c).send({ kind: "OUT", category: "PETTY_CASH", amount: "10.00", reason: "Tea and sugar" });
    await t.http.post(`/api/v1/pos/shifts/${sh.id}/close`).set(c).send({ countedCash: "350.00" });
    await t.http.post("/api/v1/catalogue/prices/bulk").set(o).send({ effectiveFrom: new Date(Date.now() + 60_000).toISOString(), items: [{ drugId: a.id, price: "110.00" }] });
    // an Rx with a refill, dispensed, with a safety override
    const rxd = await seedDrug(t, f, { rxOnly: true, activeIngredient: "paracetamol", strength: "500 mg", price: "20.00", brandName: "Rep-Rx" }); await receive(t, f, { drugId: rxd.id, quantity: 50 });
    const rx = await t.http.post("/api/v1/prescriptions/manual").set(ph).send({ patientId: cust.id, prescriberName: "Dr Rep", prescriberLicenceNo: "LIC-REP", refillsAllowed: 2, lines: [{ drugId: rxd.id, quantity: 4, directions: "2 tablets every 4 hours" }] });
    await t.http.post(`/api/v1/prescriptions/${rx.body.id}/validate`).set(ph);
    const d = await t.http.post("/api/v1/dispensings").set(ph).send({ prescriptionId: rx.body.id, items: [{ drugId: rxd.id, quantity: 4 }] });
    const chk = d.body.safetyChecks.find((x: { kind: string }) => x.kind === "DOSE_RANGE");
    await t.http.post(`/api/v1/dispensings/${d.body.id}/override/${chk.id}`).set(ph).send({ reason: "Palliative dose confirmed" });
    await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(ph).send({});
    await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(c).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "80.00" }] });
    // controlled movement, supplier ledger, claim
    const ctl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_3", brandName: "Rep-Ctl" }); await receive(t, f, { drugId: ctl.id, quantity: 10 });
    const sup = (await t.http.post("/api/v1/suppliers").set(o).send({ name: "Rep Supplier", paymentTerms: "30 days" })).body;
    await receive(t, f, { drugId: dead.id, quantity: 1, supplierId: sup.id, unitCost: "5.00" });
    await t.http.post("/api/v1/claims").set(o).send({ branchId: f.branchId, insurerName: "Rep Insurer", memberRef: "R-1", amountClaimed: "500.00" });
    await t.http.post(`/api/v1/inventory/lots/${(await t.prisma.stockLot.findFirstOrThrow({ where: { drugId: dead.id } })).id}/damage`).set(ph).send({ quantity: 1, reason: "Dropped", reasonCode: "DAMAGE" });
  });
  after(async () => { await t.close(); });
  const o = () => auth(f.users.owner.token);
  const range = () => `from=${new Date(Date.now() - 2 * 86_400_000).toISOString()}&to=${new Date(Date.now() + 86_400_000).toISOString()}&branchId=${f.branchId}`;
  const run = async (name: string) => { const r = await t.http.get(`/api/v1/reports/${name}?${range()}`).set(o()); assert.equal(r.status, 200, `${name}: ${JSON.stringify(r.body).slice(0, 300)}`); return r.body as { name: string; title: string; columns: Array<{ key: string; label: string }>; rows: Array<Record<string, unknown>> }; };

  it("the catalogue lists at least 30 report types in 6 groups", async () => {
    const l = await t.http.get("/api/v1/reports").set(o());
    assert.ok(l.body.reports.length >= 30, `got ${l.body.reports.length}`);
    assert.deepEqual([...new Set(l.body.catalogue.map((r: { group: string }) => r.group))].sort(), ["CLINICAL", "PROFIT", "PURCHASING", "RECEIVABLES", "SALES", "STOCK"]);
    for (const required of ["sales-daily", "margin-by-product", "top-sellers", "expiry", "near-expiry", "low-stock", "controlled-register", "supplier-aging", "rx-volume", "pharmacist-performance", "discount-usage", "returns", "insurer-claims", "stock-valuation", "cash-close"]) assert.ok(l.body.reports.includes(required), required);
  });

  it("every report runs and has consistent columns/rows; every one exports to CSV", async () => {
    const names: string[] = (await t.http.get("/api/v1/reports").set(o())).body.reports;
    for (const n of names) {
      const r = await run(n);
      assert.equal(r.name, n); assert.ok(r.title && r.columns.length >= 2, n);
      for (const row of r.rows.slice(0, 5)) for (const c of r.columns) assert.ok(c.key in row, `${n}: row misses column ${c.key}`);
      const csv = await t.http.get(`/api/v1/reports/${n}?${range()}&format=csv`).set(o());
      assert.equal(csv.status, 200, n); assert.match(csv.headers["content-type"], /text\/csv/); assert.ok(csv.text.startsWith("﻿"));
    }
    const pdf = await t.http.get(`/api/v1/reports/margin-by-product?${range()}&format=pdf`).set(o()).buffer(true).parse((res, cb) => { const ch: Buffer[] = []; res.on("data", (x: Buffer) => ch.push(x)); res.on("end", () => cb(null, Buffer.concat(ch))); });
    assert.equal(pdf.body.subarray(0, 4).toString(), "%PDF");
  });

  it("numbers are right: margin, payments, returns, discounts, cash close, expiry, low stock, dead stock, claims, rx volume", async () => {
    const mp = await run("margin-by-product");
    const a = mp.rows.find((r) => r.label === "Rep-A")!;
    assert.equal(a.units, 3); assert.equal(a.revenue, "263.16"); assert.equal(a.cogs, "180.00"); // 300 incl VAT -> 263.16 net ... before return
    assert.equal((await run("margin-by-category")).rows[0]!.category, "Analgesics");
    const pay = await run("payments-by-method");
    assert.equal(pay.rows.find((r) => r.method === "CARD")!.amount, "180.00"); assert.equal(pay.rows.find((r) => r.method === "CASH")!.amount, "380.00");
    const ret = await run("returns");
    assert.equal(ret.rows.length, 1); assert.equal(ret.rows[0]!.refund, "100.00"); assert.equal(ret.rows[0]!.brandName, "Rep-A"); assert.equal(ret.rows[0]!.reason, "damaged box");
    const disc = await run("discount-usage");
    assert.equal(disc.rows.find((r) => r.type === "PROMOTION")!.name, "Rep promo"); assert.equal(disc.rows.find((r) => r.type === "PROMOTION")!.amount, "20.00");
    const cc = await run("cash-close");
    assert.equal(cc.rows[0]!.expected, "290.00"); assert.equal(cc.rows[0]!.counted, "350.00"); assert.equal(cc.rows[0]!.variance, "60.00"); // 100 float + 300 cash - 100 refund - 10 petty cash
    const ne = await run("near-expiry");
    const nb = ne.rows.find((r) => r.brandName === "Rep-B")!; assert.equal(nb.bucket, "30"); assert.equal(nb.qtyOnHand, 25); assert.equal(nb.value, "625.00");
    const ls = await run("low-stock"); const lb = ls.rows.find((r) => r.brandName === "Rep-B")!; assert.deepEqual([lb.sellable, lb.minQty, lb.suggested], [25, 40, 35]);
    assert.ok((await run("dead-stock")).rows.some((r) => r.brandName === "Rep-Dead" && r.class === "DEAD"));
    assert.ok((await run("fast-slow-movers")).rows.some((r) => r.brandName === "Rep-B"));
    const adj = await run("stock-adjustments"); assert.ok(adj.rows.some((r) => r.reasonCode === "DAMAGE" && r.brandName === "Rep-Dead" && r.qtyDelta === -1));
    const ins = await run("insurer-claims"); assert.equal(ins.rows[0]!.insurer, "Rep Insurer"); assert.equal(ins.rows[0]!.claimed, "500.00"); assert.equal(ins.rows[0]!.status, "DRAFT");
    const rv = await run("rx-volume"); assert.equal(rv.rows[0]!.received, 1); assert.equal(rv.rows[0]!.manual, 1); assert.equal(rv.rows[0]!.dispensed, 1);
    const pp = await run("pharmacist-performance"); assert.equal(pp.rows[0]!.signedOff, 1); assert.equal(pp.rows[0]!.overrides, 1); assert.equal(pp.rows[0]!.validated, 1);
    const so = await run("safety-overrides"); assert.equal(so.rows[0]!.kind, "DOSE_RANGE"); assert.equal(so.rows[0]!.reason, "Palliative dose confirmed");
    const cr = await run("controlled-register"); const ctl = cr.rows.find((r) => r.drug === "Rep-Ctl")!; assert.deepEqual([ctl.kind, ctl.quantity, ctl.balance], ["RECEIPT", 10, 10]);
    const sa = await run("supplier-aging"); assert.equal(sa.rows.find((r) => r.name === "Rep Supplier")!.outstanding, "5.00");
    const pc = await run("price-changes"); const ch = pc.rows.find((r) => r.brandName === "Rep-A")!; assert.deepEqual([ch.oldPrice, ch.price, ch.changePct], ["100.00", "110.00", 10]);
    const lo = await run("loyalty"); assert.ok(Number(lo.rows.find((r) => r.customer === "Rep Customer")!.earned) > 0);
    const ex = await run("expenses"); assert.equal(ex.rows[0]!.amount, "75.00");
    const sc = await run("sales-by-cashier"); assert.ok(sc.rows.length >= 1 && Number(sc.rows[0]!.sales) >= 1);
    assert.equal((await run("sales-by-hour")).rows.length >= 1, true);
    assert.equal((await t.http.get(`/api/v1/reports/controlled-register?${range()}`).set(auth(f.users.cashier.token))).status, 403);
    assert.equal((await t.http.get("/api/v1/reports/margin-by-product").set(auth(f.users.cashier.token))).status, 403);
    assert.equal((await t.http.get("/api/v1/reports/no-such-report").set(o())).status, 404);
  });
});
