import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("POS suite: promotions, coupons, bundles, discount control, held carts, exchange, cash drawer, X/Z, receipts", () => {
  let t: TestApp, f: Fixture, shiftId: string;
  before(async () => { t = await bootApp(); f = await seedTenant(t); shiftId = (await openShift(t, f, "100.00")).id; });
  after(async () => { await t.close(); });
  const cash = () => auth(f.users.cashier.token);
  const owner = () => auth(f.users.owner.token);
  const mgr = () => auth(f.users.manager.token);
  const sell = (body: object, who = cash()) => t.http.post("/api/v1/pos/sales").set(who).send({ idempotencyKey: key(), ...body });
  async function stocked(price: string, qty = 100) { const d = await seedDrug(t, f, { price }); const lot = await receive(t, f, { drugId: d.id, quantity: qty }); return { d, lot }; }

  it("promotions are managed by those with promo.manage only; validation rejects nonsense", async () => {
    const { d } = await stocked("10.00");
    assert.equal((await t.http.post("/api/v1/pos/promotions").set(cash()).send({ name: "X", kind: "PERCENT_OFF", params: { percent: 10 } })).status, 403);
    assert.equal((await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Bad", kind: "PERCENT_OFF", params: { percent: 150 } })).body.code, "INVALID_PROMOTION");
    assert.equal((await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Bad2", kind: "BUY_X_GET_Y", params: { buy: 2, get: 1 } })).body.code, "INVALID_PROMOTION", "needs products");
    assert.equal((await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Bad3", kind: "BUNDLE_PRICE", params: { items: [], price: 5 } })).body.code, "INVALID_PROMOTION");
    const ok = await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Ok", kind: "AMOUNT_OFF", drugIds: [d.id], params: { amount: 1 }, active: false });
    assert.equal(ok.status, 201);
    const list = await t.http.get("/api/v1/pos/promotions").set(cash());
    assert.equal(list.body.find((p: { id: string }) => p.id === ok.body.id).state, "OFF");
  });

  it("an automatic percent promotion discounts the cart in quote and checkout, VAT lines follow the discounted amount, redemption is recorded", async () => {
    const { d } = await stocked("100.00");
    const p = await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Weekend 10%", kind: "PERCENT_OFF", drugIds: [d.id], params: { percent: 10 } });
    const q = await t.http.post("/api/v1/pos/cart/quote").set(cash()).send({ lines: [{ drugId: d.id, quantity: 2 }] });
    assert.equal(q.body.discountTotal, "20.00"); assert.equal(q.body.total, "180.00"); assert.equal(q.body.promotions[0].name, "Weekend 10%");
    assert.equal(q.body.vatTotal, "22.11"); // 180 * 0.14 / 1.14
    const r = await sell({ lines: [{ drugId: d.id, quantity: 2 }], payments: [{ method: "CASH", amount: "180.00" }] });
    assert.equal(r.status, 201, JSON.stringify(r.body)); assert.equal(r.body.sale.total, "180.00"); assert.equal(r.body.sale.discountTotal, "20.00");
    const red = await t.prisma.promotionRedemption.findMany({ where: { saleId: r.body.sale.id } });
    assert.equal(red.length, 1); assert.equal(red[0]!.discountAmount.toFixed(2), "20.00");
    assert.equal((await t.prisma.promotion.findUniqueOrThrow({ where: { id: p.body.id } })).usedCount, 1);
    await t.http.patch(`/api/v1/pos/promotions/${p.body.id}`).set(owner()).send({ active: false });
    assert.equal((await t.http.post("/api/v1/pos/cart/quote").set(cash()).send({ lines: [{ drugId: d.id, quantity: 2 }] })).body.discountTotal, "0.00", "switched off");
  });

  it("coupons: only with the code, invalid codes are refused, max uses is enforced atomically", async () => {
    const { d } = await stocked("50.00");
    await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Coupon", kind: "PERCENT_OFF", couponCode: "WELCOME", params: { percent: 20 }, maxUses: 1 });
    const none = await t.http.post("/api/v1/pos/cart/quote").set(cash()).send({ lines: [{ drugId: d.id, quantity: 1 }] });
    assert.equal(none.body.discountTotal, "0.00");
    const bad = await sell({ lines: [{ drugId: d.id, quantity: 1 }], couponCodes: ["NOPE"], payments: [{ method: "CASH", amount: "50.00" }] });
    assert.equal(bad.body.code, "INVALID_COUPON");
    const ok = await sell({ lines: [{ drugId: d.id, quantity: 1 }], couponCodes: ["welcome"], payments: [{ method: "CASH", amount: "40.00" }] });
    assert.equal(ok.status, 201, JSON.stringify(ok.body)); assert.equal(ok.body.sale.total, "40.00");
    const again = await sell({ lines: [{ drugId: d.id, quantity: 1 }], couponCodes: ["WELCOME"], payments: [{ method: "CASH", amount: "50.00" }] });
    assert.equal(again.body.code, "INVALID_COUPON", "exhausted coupon no longer applies");
    assert.equal((await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Dup", kind: "PERCENT_OFF", couponCode: "WELCOME", params: { percent: 5 } })).status, 409);
  });

  it("buy-X-get-Y and bundle deals", async () => {
    const a = await stocked("30.00"), b = await stocked("20.00");
    await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "2+1", kind: "BUY_X_GET_Y", drugIds: [a.d.id], params: { buy: 2, get: 1 } });
    const q1 = await t.http.post("/api/v1/pos/cart/quote").set(cash()).send({ lines: [{ drugId: a.d.id, quantity: 3 }] });
    assert.equal(q1.body.total, "60.00");
    await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Combo", kind: "BUNDLE_PRICE", params: { items: [{ drugId: b.d.id, qty: 1 }, { drugId: a.d.id, qty: 1 }], price: 40 }, priority: 5 });
    const q2 = await t.http.post("/api/v1/pos/cart/quote").set(cash()).send({ lines: [{ drugId: a.d.id, quantity: 1 }, { drugId: b.d.id, quantity: 1 }] });
    assert.equal(q2.body.total, "40.00"); assert.equal(q2.body.discountTotal, "10.00");
    const r = await sell({ lines: [{ drugId: a.d.id, quantity: 1 }, { drugId: b.d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "40.00" }] });
    assert.equal(r.status, 201, JSON.stringify(r.body)); assert.equal(await ledgerOnHand(t.prisma, a.lot.id), 99);
  });

  it("manual discounts above the limit need pos.discount_override (own permission or an approver)", async () => {
    const { d } = await stocked("100.00");
    const small = await sell({ lines: [{ drugId: d.id, quantity: 1, discount: "10.00" }], payments: [{ method: "CASH", amount: "90.00" }] });
    assert.equal(small.status, 201, "10% is within the cashier limit");
    const big = await sell({ lines: [{ drugId: d.id, quantity: 1, discount: "30.00" }], payments: [{ method: "CASH", amount: "70.00" }] });
    assert.equal(big.status, 403); assert.equal(big.body.code, "APPROVAL_REQUIRED");
    const approved = await sell({ lines: [{ drugId: d.id, quantity: 1, discount: "30.00" }], payments: [{ method: "CASH", amount: "70.00" }], approval: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(approved.status, 201, JSON.stringify(approved.body));
    assert.equal((await sell({ lines: [{ drugId: d.id, quantity: 1, discount: "30.00" }], payments: [{ method: "CASH", amount: "70.00" }] }, mgr())).status, 201, "a manager discounts without a second approver");
  });

  it("held carts: hold, list, resume once, discard; limits", async () => {
    const { d } = await stocked("10.00");
    const h = await t.http.post("/api/v1/pos/held").set(cash()).send({ label: "Mrs Aya", payload: { lines: [{ drugId: d.id, quantity: 3 }] } });
    assert.equal(h.status, 201, JSON.stringify(h.body));
    assert.equal((await t.http.post("/api/v1/pos/held").set(cash()).send({ payload: { lines: [] } })).body.code, "EMPTY_CART");
    assert.ok((await t.http.get("/api/v1/pos/held").set(cash())).body.some((x: { id: string }) => x.id === h.body.id));
    const r = await t.http.post(`/api/v1/pos/held/${h.body.id}/resume`).set(auth(f.users.pharmacist.token));
    assert.equal(r.status, 201); assert.equal(r.body.payload.lines[0].quantity, 3);
    assert.equal((await t.http.post(`/api/v1/pos/held/${h.body.id}/resume`).set(cash())).body.code, "NOT_HELD");
    const h2 = await t.http.post("/api/v1/pos/held").set(cash()).send({ payload: { lines: [{ drugId: d.id, quantity: 1 }] } });
    assert.equal((await t.http.delete(`/api/v1/pos/held/${h2.body.id}`).set(cash())).status, 200);
    assert.equal((await t.http.get("/api/v1/pos/held").set(cash())).body.some((x: { id: string }) => x.id === h2.body.id), false);
    const other = await seedTenant(t);
    assert.equal((await t.http.post(`/api/v1/pos/held/${h.body.id}/resume`).set(auth(other.users.cashier.token))).status, 404);
  });

  it("returns reverse the loyalty points; exchange = return + replacement sale, atomic validation first", async () => {
    const a = await stocked("100.00"), b = await stocked("60.00");
    const cust = (await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Exchange Eman", phone: "01044440000" })).body;
    const s = await sell({ patientId: cust.id, lines: [{ drugId: a.d.id, quantity: 2 }], payments: [{ method: "CASH", amount: "200.00" }] });
    assert.equal((await t.http.get(`/api/v1/customers/${cust.id}/loyalty`).set(owner())).body.points, 20);
    const lineId = s.body.sale.lines[0].id as string;
    // exchange 1 unit of A for 1 unit of B (refund 100, pay 60)
    const ex = await t.http.post(`/api/v1/pos/sales/${s.body.sale.id}/exchange`).set(mgr()).send({ returnLines: [{ saleLineId: lineId, quantity: 1 }], reason: "wrong product", refundMethod: "CASH", newLines: [{ drugId: b.d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "60.00" }], idempotencyKey: key() });
    assert.equal(ex.status, 201, JSON.stringify(ex.body));
    assert.equal(ex.body.refund, "100.00"); assert.equal(ex.body.replacement.total, "60.00");
    assert.equal((await t.prisma.sale.findUniqueOrThrow({ where: { id: ex.body.replacement.id } })).exchangeOfSaleId, s.body.sale.id);
    assert.equal(await ledgerOnHand(t.prisma, a.lot.id), 99); assert.equal(await ledgerOnHand(t.prisma, b.lot.id), 99);
    // points: +20 earned, -10 for the returned 100, +6 for the new 60 = 16
    assert.equal((await t.http.get(`/api/v1/customers/${cust.id}/loyalty`).set(owner())).body.points, 16);
    // replacement that cannot be sold fails BEFORE anything is returned
    const rx = await seedDrug(t, f, { rxOnly: true, price: "10.00" });
    const bad = await t.http.post(`/api/v1/pos/sales/${s.body.sale.id}/exchange`).set(mgr()).send({ returnLines: [{ saleLineId: lineId, quantity: 1 }], reason: "x y z", refundMethod: "CASH", newLines: [{ drugId: rx.id, quantity: 1 }], payments: [{ method: "CASH", amount: "10.00" }], idempotencyKey: key() });
    assert.equal(bad.body.code, "RX_REQUIRED");
    assert.equal((await t.prisma.saleReturn.count({ where: { saleId: s.body.sale.id } })), 1, "no second return was posted");
    assert.equal((await t.http.post(`/api/v1/pos/sales/${s.body.sale.id}/exchange`).set(cash()).send({ returnLines: [{ saleLineId: lineId, quantity: 1 }], reason: "x y z", refundMethod: "CASH", newLines: [{ drugId: b.d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "60.00" }], idempotencyKey: key() })).status, 403, "cashier needs manager approval");
  });

  it("cash drawer in/out feeds X-report (live), Z-report and shift close; categories and shift are validated", async () => {
    const f2 = await seedTenant(t); const sh = await openShift(t, f2, "200.00");
    const c2 = () => auth(f2.users.cashier.token);
    const d = await seedDrug(t, f2, { price: "100.00" }); await receive(t, f2, { drugId: d.id, quantity: 10 });
    await t.http.post("/api/v1/pos/sales").set(c2()).send({ idempotencyKey: key(), lines: [{ drugId: d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "100.00" }] });
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(c2()).send({ kind: "OUT", category: "PETTY_CASH", amount: "30.00", reason: "Cleaning supplies" })).status, 201);
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(c2()).send({ kind: "IN", category: "FLOAT_TOP_UP", amount: "50.00", reason: "Change float" })).status, 201);
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(c2()).send({ kind: "OUT", category: "FLOAT_TOP_UP", amount: "5", reason: "wrong cat" })).body.code, "INVALID_CATEGORY");
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(c2()).send({ kind: "OUT", category: "PETTY_CASH", amount: "-5", reason: "negative" })).status, 400);
    const x = await t.http.get(`/api/v1/pos/shifts/${sh.id}/x-report`).set(c2());
    assert.equal(x.body.report, "X"); assert.equal(x.body.cashIn, "50.00"); assert.equal(x.body.cashOut, "30.00"); assert.equal(x.body.expectedCash, "320.00"); // 200 + 100 - 30 + 50
    const list = await t.http.get(`/api/v1/pos/cash-movements?shiftId=${sh.id}`).set(c2());
    assert.equal(list.body.length, 2);
    const close = await t.http.post(`/api/v1/pos/shifts/${sh.id}/close`).set(c2()).send({ countedCash: "320.00" });
    assert.equal(close.body.zReport.expectedCash, "320.00"); assert.equal(close.body.zReport.report, "Z"); assert.equal(close.body.zReport.variance, "0.00");
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(c2()).send({ kind: "IN", category: "FLOAT_TOP_UP", amount: "5", reason: "after close" })).body.code, "SHIFT_REQUIRED");
    assert.equal((await t.http.post("/api/v1/pos/cash-movements").set(auth(f2.users.chainOps.token)).send({ kind: "IN", category: "FLOAT_TOP_UP", amount: "5", reason: "no perm" })).status, 403);
  });

  it("receipts: thermal 80 mm and A4 invoice, AR/EN, customer + loyalty + promotions, VAT lines only", async () => {
    const { d } = await stocked("100.00");
    await t.http.post("/api/v1/pos/promotions").set(owner()).send({ name: "Receipt promo", kind: "PERCENT_OFF", drugIds: [d.id], params: { percent: 10 } });
    await t.http.patch("/api/v1/settings").set(owner()).send({ receipt: { header: "Open 24h", footer: "Thank you!", logoText: "Nile Pharmacy", paper: "a4" } });
    const cust = (await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Receipt Rana" })).body;
    const s = await sell({ patientId: cust.id, lines: [{ drugId: d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "90.00" }] });
    const id = s.body.sale.id;
    const th = await t.http.get(`/api/v1/pos/sales/${id}/receipt.html?format=thermal&lang=en`).set(cash());
    assert.match(th.text, /80mm/); assert.match(th.text, /Nile Pharmacy/); assert.match(th.text, /Receipt Rana/); assert.match(th.text, /Receipt promo/); assert.match(th.text, /Loyalty points: \+9/); assert.match(th.text, /<svg/); assert.match(th.text, /Open 24h/);
    const a4 = await t.http.get(`/api/v1/pos/sales/${id}/receipt.html?lang=ar`).set(cash()); // default follows the tenant setting (a4)
    assert.match(a4.text, /size:A4/); assert.match(a4.text, /dir="rtl"/); assert.match(a4.text, /فاتورة مبيعات/); assert.match(a4.text, /14%/);
    for (const html of [th.text, a4.text]) assert.doesNotMatch(html, /\bETA\b|e-?invoice|UUID|\bQR\b/i);
    assert.match((await t.http.get(`/api/v1/pos/sales/${id}/receipt`).set(cash())).body.notice.en, /Not a tax invoice/);
  });
});
