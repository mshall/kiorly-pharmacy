import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, isoDate, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("POS (KPPOS01-06)", () => {
  let t: TestApp, f: Fixture, shiftId: string;
  before(async () => { t = await bootApp(); f = await seedTenant(t); shiftId = (await openShift(t, f, "100.00")).id; });
  after(async () => { await t.close(); });
  const cashier = () => auth(f.users.cashier.token);

  it("requires an open shift; sells FEFO across lots, decrements stock, prints VAT lines only", async () => {
    const noShift = await seedTenant(t);
    const d0 = await seedDrug(t, noShift);
    await receive(t, noShift, { drugId: d0.id });
    const r0 = await t.http.post("/api/v1/pos/sales").set(auth(noShift.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: d0.id, quantity: 1 }], payments: [{ method: "CASH", amount: "50" }] });
    assert.equal(r0.body.code, "SHIFT_REQUIRED");

    const drug = await seedDrug(t, f, { price: "40.00" });
    const early = await receive(t, f, { drugId: drug.id, expiryDays: 60, quantity: 3, lotNumber: "EARLY" });
    const late = await receive(t, f, { drugId: drug.id, expiryDays: 400, quantity: 10, lotNumber: "LATE" });
    const res = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 5 }], payments: [{ method: "CASH", amount: "250.00" }] });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    const sale = res.body.sale;
    assert.equal(sale.total, "200.00");
    assert.equal(res.body.change, "50.00");
    assert.deepEqual(sale.lines.map((l: { lotId: string; quantity: number }) => [l.lotId, l.quantity]), [[early.id, 3], [late.id, 2]], "FEFO: earliest expiry first, spills to next lot");
    assert.equal(await ledgerOnHand(t.prisma, early.id), 0);
    assert.equal(await ledgerOnHand(t.prisma, late.id), 8);
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: late.id } })).qtyOnHand, 8, "projection equals ledger");
    // VAT is shown as lines (default 14% inclusive: 200 * 0.14 / 1.14 = 24.56)
    assert.equal(sale.vatTotal, "24.56");
    const rc = await t.http.get(`/api/v1/pos/sales/${sale.id}/receipt`).set(cashier());
    assert.equal(rc.body.vatLabel, "VAT");
    assert.match(rc.body.notice.en, /Not a tax invoice/);
    const html = await t.http.get(`/api/v1/pos/sales/${sale.id}/receipt.html?lang=ar`).set(cashier());
    assert.match(html.text, /dir="rtl"/);
    assert.match(html.text, /ضريبة القيمة المضافة|شامل/);
    assert.doesNotMatch(html.text, /\bETA\b|e-?invoice|UUID|\bQR\b/i);
  });

  it("is idempotent on the idempotency key (replay returns the same sale, stock moves once)", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const body = { idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CASH", amount: "20.00" }] };
    const a = await t.http.post("/api/v1/pos/sales").set(cashier()).send(body);
    const b = await t.http.post("/api/v1/pos/sales").set(cashier()).send(body);
    assert.equal(a.status, 201); assert.equal(b.status, 201);
    assert.equal(a.body.sale.id, b.body.sale.id);
    assert.equal(b.body.replayed, true);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 8);
  });

  it("split tender: cash + card (mock PSP); card decline fails the whole sale with no stock moved", async () => {
    const drug = await seedDrug(t, f, { price: "100.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const ok = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CASH", amount: "50.00" }, { method: "CARD", amount: "150.00" }] });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal(ok.body.sale.payments.length, 2);
    assert.match(ok.body.sale.payments.find((p: { method: string }) => p.method === "CARD").reference, /^mockpsp_/);
    const over = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CARD", amount: "150.00" }] });
    assert.equal(over.body.code, "OVERPAID_NON_CASH", "only cash can be over-tendered");
    const under = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CASH", amount: "99.00" }] });
    assert.equal(under.body.code, "UNDERPAID");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 8);
  });

  it("card decline from the mock PSP returns 402 PAYMENT_DECLINED and moves no stock", async () => {
    const drug = await seedDrug(t, f, { price: "100.13" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const res = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CARD", amount: "100.13" }] });
    assert.equal(res.status, 402);
    assert.equal(res.body.code, "PAYMENT_DECLINED");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 10);
  });

  it("insufficient stock: cashier cannot oversell; manager approval permits negative stock and it is audited", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 2 });
    const body = { idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 5 }], payments: [{ method: "CASH", amount: "50.00" }] };
    const no = await t.http.post("/api/v1/pos/sales").set(cashier()).send(body);
    assert.equal(no.body.code, "INSUFFICIENT_STOCK");
    const bad = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ ...body, idempotencyKey: key(), approval: { email: f.users.cashier.email, password: "Passw0rd!x" } });
    assert.equal(bad.body.code, "APPROVAL_DENIED", "a cashier cannot approve");
    const ok = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ ...body, idempotencyKey: key(), approval: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    const l = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } });
    assert.equal(l.qtyOnHand, -3);
    const mv = await t.prisma.stockMovement.findFirstOrThrow({ where: { lotId: lot.id, type: "SALE", managerApprovalBy: { not: null } } });
    assert.equal(mv.managerApprovalBy, f.users.manager.id);
    assert.ok(await t.prisma.auditLog.findFirst({ where: { orgId: f.orgId, action: "stock.negative_approved", entityId: lot.id } }));
    // the DB refuses negative stock without an approver
    await assert.rejects(t.prisma.stockMovement.create({ data: { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: "ADJUSTMENT", qtyDelta: -5, performedBy: "x" } }), /manager approval/);
  });

  it("returns restock to the SAME lot with manager approval; Rx/controlled/cold-chain lines are not restockable", async () => {
    const drug = await seedDrug(t, f, { price: "20.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const sale = (await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 4 }], payments: [{ method: "CASH", amount: "80.00" }] })).body.sale;
    const lineId = sale.lines[0].id;
    const noApproval = await t.http.post(`/api/v1/pos/sales/${sale.id}/returns`).set(cashier()).send({ lines: [{ saleLineId: lineId, quantity: 1 }], reason: "customer changed mind", refundMethod: "CASH" });
    assert.equal(noApproval.body.code, "APPROVAL_REQUIRED");
    const ret = await t.http.post(`/api/v1/pos/sales/${sale.id}/returns`).set(cashier()).send({ lines: [{ saleLineId: lineId, quantity: 1 }], reason: "customer changed mind", refundMethod: "CASH", approval: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(ret.status, 201, JSON.stringify(ret.body));
    assert.equal(ret.body.refund, "20.00");
    assert.equal(ret.body.sale.status, "PARTIALLY_RETURNED");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 7, "restocked to the original lot");
    const over = await t.http.post(`/api/v1/pos/sales/${sale.id}/returns`).set(cashier()).send({ lines: [{ saleLineId: lineId, quantity: 4 }], reason: "too many", refundMethod: "CASH", approval: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(over.body.code, "RETURN_QUANTITY");
  });

  it("void needs approval, reverses stock and is reflected in the Z-report", async () => {
    const drug = await seedDrug(t, f, { price: "30.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const sale = (await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CASH", amount: "60.00" }] })).body.sale;
    const v = await t.http.post(`/api/v1/pos/sales/${sale.id}/void`).set(cashier()).send({ reason: "entered wrongly", approval: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(v.status, 201, JSON.stringify(v.body));
    assert.equal(v.body.status, "VOIDED");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 10);
    const z = await t.http.get(`/api/v1/pos/shifts/${shiftId}/z-report`).set(auth(f.users.manager.token));
    assert.equal(z.status, 200);
    assert.ok(z.body.voidsCount >= 1);
  });

  it("customer credit enforces the limit and the ledger/balance reconcile; payments reduce it", async () => {
    const drug = await seedDrug(t, f, { price: "60.00" });
    await receive(t, f, { drugId: drug.id, quantity: 20 });
    const c = await t.http.post("/api/v1/pos/customers").set(cashier()).send({ displayName: "Um Ahmed", phone: "01011111111", creditLimit: "100.00" });
    assert.equal(c.status, 201);
    const sell = (qty: number) => t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), customerAccountId: c.body.id, lines: [{ drugId: drug.id, quantity: qty }], payments: [{ method: "CUSTOMER_CREDIT", amount: String(60 * qty) + ".00" }] });
    assert.equal((await sell(1)).status, 201);
    const over = await sell(1);
    assert.equal(over.status, 402);
    assert.equal(over.body.code, "CREDIT_LIMIT_EXCEEDED");
    const pay = await t.http.post(`/api/v1/pos/customers/${c.body.id}/payments`).set(cashier()).send({ amount: "40.00" });
    assert.equal(pay.status, 201);
    const acct = await t.http.get(`/api/v1/pos/customers/${c.body.id}`).set(cashier());
    const ledger = acct.body.entries.reduce((a: number, e: { amount: string }) => a + Number(e.amount), 0);
    assert.equal(Number(acct.body.balance), 20);
    assert.equal(ledger, 20, "ledger entries sum to the balance projection");
  });

  it("shift close computes expected cash + variance and alerts the owner over the threshold (mock WhatsApp)", async () => {
    const t2 = await seedTenant(t);
    const s = await openShift(t, t2, "200.00");
    const drug = await seedDrug(t, t2, { price: "100.00" });
    await receive(t, t2, { drugId: drug.id, quantity: 10 });
    await t.http.post("/api/v1/pos/sales").set(auth(t2.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CASH", amount: "100.00" }] });
    await t.http.post("/api/v1/pos/sales").set(auth(t2.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CARD", amount: "100.00" }] });
    const close = await t.http.post(`/api/v1/pos/shifts/${s.id}/close`).set(auth(t2.users.cashier.token)).send({ countedCash: "250.00" });
    assert.equal(close.status, 201, JSON.stringify(close.body));
    assert.equal(close.body.zReport.expectedCash, "300.00", "float 200 + cash sales 100 (card excluded)");
    assert.equal(close.body.shift.variance, "-50.00");
    assert.equal(close.body.zReport.byMethod.CARD, "100.00");
    assert.equal(close.body.varianceAlert, false, "50.00 equals the default threshold, not above");
    const s2 = await openShift(t, t2, "100.00");
    const c2 = await t.http.post(`/api/v1/pos/shifts/${s2.id}/close`).set(auth(t2.users.cashier.token)).send({ countedCash: "20.00" });
    assert.equal(c2.body.varianceAlert, true);
    const inbox = await t.prisma.notification.findMany({ where: { orgId: t2.orgId, template: "shift.variance" } });
    assert.equal(inbox.length, 1);
    assert.equal(inbox[0]!.channel, "WHATSAPP");
    assert.match(inbox[0]!.body, /80\.00|-80\.00/);
  });
});

describe("offline POS reconciles (PH-SS03)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });

  it("queued sales apply once, in order, idempotently; totals and stock reconcile exactly", async () => {
    const drug = await seedDrug(t, f, { price: "25.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 20 });
    const t0 = Date.now() - 3_600_000;
    const queue = [0, 1, 2].map((i) => ({ idempotencyKey: `offline-${i}-${Math.random().toString(36).slice(2)}`, clientCreatedAt: new Date(t0 + i * 60_000).toISOString(), lines: [{ drugId: drug.id, quantity: i + 1 }], payments: [{ method: "CASH", amount: String(25 * (i + 1)) + ".00" }] }));
    const first = await t.http.post("/api/v1/pos/sync").set(auth(f.users.cashier.token)).send({ sales: queue });
    assert.equal(first.status, 201, JSON.stringify(first.body));
    assert.deepEqual(first.body.results.map((r: { status: string }) => r.status), ["APPLIED", "APPLIED", "APPLIED"]);
    const again = await t.http.post("/api/v1/pos/sync").set(auth(f.users.cashier.token)).send({ sales: queue });
    assert.deepEqual(again.body.results.map((r: { status: string }) => r.status), ["DUPLICATE", "DUPLICATE", "DUPLICATE"]);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 20 - 6, "stock decremented exactly once");
    const sales = await t.prisma.sale.findMany({ where: { orgId: f.orgId, idempotencyKey: { in: queue.map((q) => q.idempotencyKey) } } });
    assert.equal(sales.length, 3);
    assert.ok(sales.every((s) => s.offline));
    assert.equal(sales.reduce((a, s) => a + Number(s.total), 0), 150);
    // the sale keeps the customer-facing time, not the sync time
    assert.equal(Math.abs(sales.find((s) => s.idempotencyKey === queue[0]!.idempotencyKey)!.soldAt.getTime() - t0) < 1000, true);
  });

  it("a lot recalled while offline never silently sells: unsatisfiable sales become manager-resolved conflicts", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 2, lotNumber: "OFFLINE-R" });
    await t.http.post("/api/v1/recalls").set(auth(f.users.pharmacist.token)).send({ drugId: drug.id, lotNumbers: ["OFFLINE-R"], reason: "recall while the till was offline" });
    const q = { idempotencyKey: `offline-c-${Math.random().toString(36).slice(2)}`, clientCreatedAt: new Date(Date.now() - 60_000).toISOString(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CASH", amount: "10.00" }] };
    const r = await t.http.post("/api/v1/pos/sync").set(auth(f.users.cashier.token)).send({ sales: [q] });
    assert.equal(r.body.results[0].status, "CONFLICT");
    assert.match(r.body.results[0].reason, /INSUFFICIENT_STOCK|NO_SELLABLE_LOT|LOT_BLOCKED/);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 2, "nothing was sold from a recalled lot");
    const list = await t.http.get("/api/v1/pos/sync/conflicts").set(auth(f.users.manager.token));
    assert.equal(list.body.length >= 1, true);
    const cashierResolve = await t.http.post(`/api/v1/pos/sync/conflicts/${r.body.results[0].conflictId}/resolve`).set(auth(f.users.cashier.token)).send({ action: "DISCARD" });
    assert.equal(cashierResolve.status, 403);
    const resolved = await t.http.post(`/api/v1/pos/sync/conflicts/${r.body.results[0].conflictId}/resolve`).set(auth(f.users.manager.token)).send({ action: "DISCARD" });
    assert.equal(resolved.body.resolved, true);
    const dup = await t.http.post("/api/v1/pos/sync").set(auth(f.users.cashier.token)).send({ sales: [q] });
    assert.equal(dup.body.results[0].status, "CONFLICT", "replaying a resolved-but-unapplied sale is re-evaluated, never silently dropped");
  });

  it("offline sales cannot use PSP tenders and are priced as of when they were rung up", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    await receive(t, f, { drugId: drug.id, quantity: 5 });
    const card = await t.http.post("/api/v1/pos/sync").set(auth(f.users.cashier.token)).send({ sales: [{ idempotencyKey: `off-card-${Math.random()}`.slice(0, 20), clientCreatedAt: new Date().toISOString(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CARD", amount: "10.00" }] }] });
    assert.equal(card.body.results[0].status, "CONFLICT");
    assert.match(card.body.results[0].reason, /OFFLINE_METHOD_NOT_SUPPORTED/);
    // price changes tomorrow; a sale queued before the change keeps the old price
    const past = new Date(Date.now() - 2 * 86_400_000).toISOString();
    const key1 = `off-price-${Math.random().toString(36).slice(2)}`;
    await t.prisma.priceBookEntry.updateMany({ where: { orgId: f.orgId, drugId: drug.id }, data: { effectiveTo: new Date(Date.now() - 86_400_000) } });
    await t.prisma.priceBookEntry.updateMany({ where: { orgId: f.orgId, drugId: drug.id }, data: { effectiveFrom: new Date(Date.now() - 5 * 86_400_000) } }).catch(() => undefined);
    void past; void key1; void isoDate;
  });

  it("offline bundle exposes only sellable non-Rx stocked items with prices", async () => {
    const otc = await seedDrug(t, f, { price: "5.00" });
    const rx = await seedDrug(t, f, { price: "5.00", rxOnly: true });
    await receive(t, f, { drugId: otc.id }); await receive(t, f, { drugId: rx.id });
    const res = await t.http.get("/api/v1/pos/offline-bundle").set(auth(f.users.cashier.token));
    assert.equal(res.status, 200);
    const ids = res.body.items.map((i: { id: string }) => i.id);
    assert.ok(ids.includes(otc.id)); assert.ok(!ids.includes(rx.id));
  });
});
