import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, isoDate, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

const day = 86_400_000;
describe("Purchasing & finance suite: RFQ, cost variance, aging, statements, expenses, margin, receivables, claims", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f, "100.00"); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const ph = () => auth(f.users.pharmacist.token);
  const cash = () => auth(f.users.cashier.token);
  const supplier = async (name: string, extra: object = {}) => (await t.http.post("/api/v1/suppliers").set(owner()).send({ name, phone: "+20100000001", email: `${name.replace(/\s/g, "")}@t.test`, paymentTerms: "30 days", ...extra })).body as { id: string };
  const range = `from=${new Date(Date.now() - 5 * day).toISOString()}&to=${new Date(Date.now() + day).toISOString()}`;

  it("RFQ: create, send, record quotes, compare, award cheapest per line (POs per supplier), single-supplier award needs a complete quote", async () => {
    const [a, b, c] = [await supplier("Nile RFQ"), await supplier("Delta RFQ"), await supplier("Cairo RFQ")];
    const d1 = await seedDrug(t, f, { brandName: "RFQ-1" }), d2 = await seedDrug(t, f, { brandName: "RFQ-2" });
    assert.equal((await t.http.post("/api/v1/purchasing/rfqs").set(cash()).send({ branchId: f.branchId, lines: [{ drugId: d1.id, qty: 5 }], supplierIds: [a.id] })).status, 403);
    assert.equal((await t.http.post("/api/v1/purchasing/rfqs").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: d1.id, qty: 5 }], supplierIds: ["nope"] })).status, 404);
    const rfq = await t.http.post("/api/v1/purchasing/rfqs").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: d1.id, qty: 10 }, { drugId: d2.id, qty: 4 }], supplierIds: [a.id, b.id, c.id], notes: "monthly" });
    assert.equal(rfq.status, 201, JSON.stringify(rfq.body)); assert.match(rfq.body.number, /^RFQ-\d{8}-0001$/); assert.equal(rfq.body.status, "DRAFT");
    const id = rfq.body.id as string, [l1, l2] = rfq.body.lines.map((l: { id: string }) => l.id) as string[];
    assert.equal((await t.http.post(`/api/v1/purchasing/rfqs/${id}/quotes/${a.id}`).set(owner()).send({ lines: [{ rfqLineId: l1, unitPrice: "9" }] })).body.code, "RFQ_NOT_OPEN", "not sent yet");
    const sent = await t.http.post(`/api/v1/purchasing/rfqs/${id}/send`).set(owner());
    assert.equal(sent.body.status, "SENT"); assert.equal(sent.body.notified, 3);
    assert.equal(await t.prisma.notification.count({ where: { orgId: f.orgId, template: "rfq.send" } }), 3);
    await t.http.post(`/api/v1/purchasing/rfqs/${id}/quotes/${a.id}`).set(owner()).send({ lines: [{ rfqLineId: l1, unitPrice: "9.50" }, { rfqLineId: l2, unitPrice: "20" }], leadTimeDays: 3 });
    await t.http.post(`/api/v1/purchasing/rfqs/${id}/quotes/${b.id}`).set(owner()).send({ lines: [{ rfqLineId: l1, unitPrice: "9.00" }, { rfqLineId: l2, unitPrice: "22" }], leadTimeDays: 2 });
    await t.http.post(`/api/v1/purchasing/rfqs/${id}/quotes/${c.id}/decline`).set(owner());
    const cmp = await t.http.get(`/api/v1/purchasing/rfqs/${id}`).set(owner());
    assert.equal(cmp.body.status, "QUOTED");
    assert.equal(cmp.body.lines[0].bestSupplierId, b.id); assert.equal(cmp.body.lines[0].bestPrice, "9.00"); assert.equal(cmp.body.lines[1].bestSupplierId, a.id);
    assert.equal(cmp.body.quotes.find((q: { supplierId: string }) => q.supplierId === a.id).total, "175.00"); // 10*9.5 + 4*20
    assert.equal(cmp.body.quotes.find((q: { supplierId: string }) => q.supplierId === c.id).status, "DECLINED");
    // single supplier award must have quoted everything and not be a decliner
    assert.equal((await t.http.post(`/api/v1/purchasing/rfqs/${id}/award`).set(owner()).send({ mode: "SUPPLIER", supplierId: c.id })).body.code, "SUPPLIER_NOT_QUOTED");
    const award = await t.http.post(`/api/v1/purchasing/rfqs/${id}/award`).set(owner()).send({ mode: "CHEAPEST_PER_LINE" });
    assert.equal(award.status, 201, JSON.stringify(award.body)); assert.equal(award.body.purchaseOrders.length, 2);
    const poB = award.body.purchaseOrders.find((p: { supplierId: string }) => p.supplierId === b.id), poA = award.body.purchaseOrders.find((p: { supplierId: string }) => p.supplierId === a.id);
    assert.equal(poB.lines[0].unitCost, "9.00"); assert.equal(poB.totalCost, "90.00"); assert.equal(poA.totalCost, "80.00"); assert.equal(poA.origin, "RFQ"); assert.equal(poA.status, "DRAFT");
    assert.equal(award.body.rfq.status, "AWARDED");
    assert.equal((await t.http.post(`/api/v1/purchasing/rfqs/${id}/cancel`).set(owner())).body.code, "RFQ_AWARDED");
    assert.equal((await t.http.post(`/api/v1/purchasing/rfqs/${id}/award`).set(owner()).send({ mode: "CHEAPEST_PER_LINE" })).body.code, "RFQ_NOT_OPEN");
    // single-supplier award on a fresh RFQ
    const r2 = await t.http.post("/api/v1/purchasing/rfqs").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: d1.id, qty: 2 }, { drugId: d2.id, qty: 2 }], supplierIds: [a.id] });
    await t.http.post(`/api/v1/purchasing/rfqs/${r2.body.id}/send`).set(owner());
    await t.http.post(`/api/v1/purchasing/rfqs/${r2.body.id}/quotes/${a.id}`).set(owner()).send({ lines: [{ rfqLineId: r2.body.lines[0].id, unitPrice: "9" }] });
    assert.equal((await t.http.post(`/api/v1/purchasing/rfqs/${r2.body.id}/award`).set(owner()).send({ mode: "SUPPLIER", supplierId: a.id })).body.code, "QUOTE_INCOMPLETE");
    assert.equal((await t.http.get("/api/v1/purchasing/rfqs?status=AWARDED").set(owner())).body.length, 1);
  });

  it("PO: draft edit, short-close, printable A4; RFQ from reorder suggestions", async () => {
    const s = await supplier("PO Supplier"); const d = await seedDrug(t, f, { brandName: "PO-D" });
    const po = await t.http.post("/api/v1/purchase-orders").set(owner()).send({ branchId: f.branchId, supplierId: s.id, lines: [{ drugId: d.id, qtyOrdered: 10, unitCost: "5.00" }] });
    assert.equal(po.status, 201, JSON.stringify(po.body));
    const ed = await t.http.patch(`/api/v1/purchasing/purchase-orders/${po.body.id}`).set(owner()).send({ lines: [{ drugId: d.id, qtyOrdered: 20, unitCost: "4.50" }], notes: "revised" });
    assert.equal(ed.body.totalCost, "90.00"); assert.equal(ed.body.lines.length, 1);
    const html = await t.http.get(`/api/v1/purchasing/purchase-orders/${po.body.id}/print.html?lang=en`).set(owner());
    assert.match(html.text, /Purchase order/); assert.match(html.text, /PO Supplier/); assert.match(html.text, /90\.00/);
    assert.equal((await t.http.post(`/api/v1/purchasing/purchase-orders/${po.body.id}/close`).set(owner()).send({ reason: "supplier short" })).body.code, "PO_NOT_PARTIAL");
    await t.http.post(`/api/v1/purchase-orders/${po.body.id}/send`).set(owner()).send({ via: "EMAIL" });
    assert.equal((await t.http.patch(`/api/v1/purchasing/purchase-orders/${po.body.id}`).set(owner()).send({ notes: "x" })).body.code, "PO_NOT_DRAFT");
    const rc = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, purchaseOrderId: po.body.id, supplierId: s.id, lines: [{ drugId: d.id, lotNumber: "PO-1", expiryDate: isoDate(300), quantity: 8, unitCost: "4.50" }] });
    assert.equal(rc.status, 201, JSON.stringify(rc.body));
    const closed = await t.http.post(`/api/v1/purchasing/purchase-orders/${po.body.id}/close`).set(owner()).send({ reason: "supplier short-shipped" });
    assert.equal(closed.body.status, "RECEIVED"); assert.match(closed.body.notes, /Short-closed/);
    // RFQ from suggestions: needs a reorder policy below minimum
    await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f.branchId}`).set(owner()).send({ drugId: d.id, minQty: 50, maxQty: 100 });
    const fs = await t.http.post("/api/v1/purchasing/rfqs/from-suggestions").set(owner()).send({ branchId: f.branchId, supplierIds: [s.id] });
    assert.equal(fs.status, 201, JSON.stringify(fs.body)); assert.ok(fs.body.lines.some((l: { drugId: string; qty: number }) => l.drugId === d.id && l.qty === 92));
  });

  it("cost price variance: receiving flags lines vs the PO cost and the previous cost; the report lists them with the extra cost", async () => {
    const s = await supplier("Variance Supplier"); const d = await seedDrug(t, f, { brandName: "Var-D" });
    await receive(t, f, { drugId: d.id, quantity: 5, unitCost: "10.00", supplierId: s.id });
    const po = (await t.http.post("/api/v1/purchase-orders").set(owner()).send({ branchId: f.branchId, supplierId: s.id, lines: [{ drugId: d.id, qtyOrdered: 10, unitCost: "10.00" }] })).body;
    await t.http.post(`/api/v1/purchase-orders/${po.id}/send`).set(owner()).send({ via: "EMAIL" });
    const rc = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, purchaseOrderId: po.id, supplierId: s.id, lines: [{ drugId: d.id, lotNumber: "VAR-2", expiryDate: isoDate(300), quantity: 10, unitCost: "12.00" }] });
    assert.equal(rc.status, 201, JSON.stringify(rc.body));
    assert.equal(rc.body.variances.length, 1); assert.equal(rc.body.variances[0].pctVsPo, 20); assert.equal(rc.body.variances[0].pctVsPrev, 20); assert.equal(rc.body.variances[0].poUnitCost, "10.00");
    const rep = await t.http.get(`/api/v1/purchasing/cost-variance?minPct=5&${range}`).set(owner());
    const row = rep.body.items.find((i: { brandName: string }) => i.brandName === "Var-D");
    assert.equal(row.pctVsPo, 20); assert.equal(row.extraCost, "20.00"); assert.equal(row.supplier, "Variance Supplier");
    assert.equal(rep.body.items.filter((i: { brandName: string }) => i.brandName === "Var-D").length, 1, "the first receipt had nothing to compare with");
    assert.equal((await t.http.get(`/api/v1/purchasing/cost-variance?minPct=50&${range}`).set(owner())).body.items.filter((i: { brandName: string }) => i.brandName === "Var-D").length, 0);
    // within tolerance: not flagged at receipt
    const rc2 = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, supplierId: s.id, lines: [{ drugId: d.id, lotNumber: "VAR-3", expiryDate: isoDate(300), quantity: 1, unitCost: "12.30" }] });
    assert.equal(rc2.body.variances.length, 0);
  });

  it("AP aging clears payments against the oldest invoices; statements carry a running balance; returns are listed", async () => {
    const s = await supplier("Aging Supplier", { paymentTerms: "30 days", creditLimit: "400.00" });
    const mk = (amount: string, daysAgo: number, type: "INVOICE" | "PAYMENT") => t.prisma.supplierLedgerEntry.create({ data: { orgId: f.orgId, supplierId: s.id, type, amount, createdBy: "t", createdAt: new Date(Date.now() - daysAgo * day) } });
    await mk("100.00", 120, "INVOICE"); await mk("200.00", 70, "INVOICE"); await mk("300.00", 10, "INVOICE"); await mk("-150.00", 5, "PAYMENT");
    await t.prisma.supplier.update({ where: { id: s.id }, data: { balance: 450 } });
    const ag = await t.http.get("/api/v1/purchasing/aging").set(owner());
    const row = ag.body.suppliers.find((x: { supplierId: string }) => x.supplierId === s.id);
    assert.equal(row.outstanding, "450.00"); assert.equal(row.buckets.d1_30, "0.00"); assert.equal(row.buckets.d31_60, "150.00"); assert.equal(row.buckets.current, "300.00"); assert.equal(row.overLimit, true);
    assert.ok(Number(ag.body.totals.d31_60) >= 150);
    const st = await t.http.get(`/api/v1/purchasing/suppliers/${s.id}/statement`).set(owner());
    assert.deepEqual(st.body.entries.map((e: { balance: string }) => e.balance), ["100.00", "300.00", "600.00", "450.00"]); assert.equal(st.body.closingBalance, "450.00"); assert.equal(st.body.openingBalance, "0.00");
    // pay through the API: aging shrinks
    await t.http.post(`/api/v1/suppliers/${s.id}/payments`).set(owner()).send({ amount: "150.00" });
    const ag2 = await t.http.get("/api/v1/purchasing/aging").set(owner());
    assert.equal(ag2.body.suppliers.find((x: { supplierId: string }) => x.supplierId === s.id).buckets.d31_60, "0.00");
    // returns to supplier are listed
    const d = await seedDrug(t, f, { brandName: "Ret-D" }); const lot = await receive(t, f, { drugId: d.id, quantity: 6, supplierId: s.id, unitCost: "7.00" });
    await t.http.post("/api/v1/inventory/returns-to-supplier").set(owner()).send({ lotId: lot.id, quantity: 2, reason: "Near expiry" });
    const rs = await t.http.get(`/api/v1/purchasing/supplier-returns?supplierId=${s.id}`).set(owner());
    assert.equal(rs.body[0].creditAmount, "14.00"); assert.equal(rs.body[0].brandName, "Ret-D");
    assert.equal((await t.http.get("/api/v1/purchasing/aging").set(cash())).status, 403);
  });

  it("expenses: categories validated, drawer expenses feed the X-report, void rules, list + totals", async () => {
    const f2 = await seedTenant(t); const sh = await openShift(t, f2, "300.00"); const o2 = () => auth(f2.users.owner.token), c2 = () => auth(f2.users.cashier.token);
    assert.equal((await t.http.post("/api/v1/finance/expenses").set(o2()).send({ branchId: f2.branchId, category: "NOPE", amount: "10", description: "bad cat" })).body.code ?? "VALIDATION_FAILED", "VALIDATION_FAILED");
    assert.equal((await t.http.post("/api/v1/finance/expenses").set(c2()).send({ branchId: f2.branchId, category: "RENT", amount: "10", description: "no perm" })).status, 403);
    const rent = await t.http.post("/api/v1/finance/expenses").set(o2()).send({ branchId: f2.branchId, category: "RENT", amount: "5000.00", vatAmount: "0", method: "BANK", description: "November rent", expenseDate: new Date().toISOString().slice(0, 10) });
    assert.equal(rent.status, 201, JSON.stringify(rent.body));
    const drawer = await t.http.post("/api/v1/finance/expenses").set(o2()).send({ branchId: f2.branchId, category: "SUPPLIES", amount: "80.00", vatAmount: "9.82", description: "Paper rolls", fromDrawer: true });
    assert.equal(drawer.status, 201, JSON.stringify(drawer.body)); assert.ok(drawer.body.cashMovementId);
    assert.equal((await t.http.post("/api/v1/finance/expenses").set(o2()).send({ branchId: f2.branchId, category: "SUPPLIES", amount: "5", method: "CARD", description: "card from drawer", fromDrawer: true })).body.code, "DRAWER_CASH_ONLY");
    assert.equal((await t.http.get(`/api/v1/pos/shifts/${sh.id}/x-report`).set(c2())).body.expectedCash, "220.00"); // 300 - 80
    assert.equal((await t.http.post(`/api/v1/finance/expenses/${drawer.body.id}/void`).set(o2())).body.code, "DRAWER_EXPENSE");
    const rent2 = await t.http.post(`/api/v1/finance/expenses/${rent.body.id}/void`).set(o2());
    assert.ok(rent2.body.voidedAt);
    assert.equal((await t.http.post(`/api/v1/finance/expenses/${rent.body.id}/void`).set(o2())).body.code, "ALREADY_VOID");
    const list = await t.http.get("/api/v1/finance/expenses").set(o2());
    assert.equal(list.body.total, 2); assert.equal(list.body.sum, "80.00", "voided expenses are excluded from the sum");
    assert.equal((await t.http.get("/api/v1/finance/expenses?category=RENT").set(o2())).body.total, 1);
  });

  it("finance overview: revenue ex VAT, COGS from lot cost, gross margin, expenses, net profit, payments by method; margin per product / category", async () => {
    const f3 = await seedTenant(t); await openShift(t, f3); const o3 = () => auth(f3.users.owner.token), c3 = () => auth(f3.users.cashier.token);
    const a = await seedDrug(t, f3, { price: "100.00", brandName: "Fin-A" }), b = await seedDrug(t, f3, { price: "50.00", brandName: "Fin-B" });
    await t.http.patch(`/api/v1/catalogue/drugs/${a.id}`).set(o3()).send({ category: "Analgesics" }); await t.http.patch(`/api/v1/catalogue/drugs/${b.id}`).set(o3()).send({ category: "Vitamins" });
    await receive(t, f3, { drugId: a.id, quantity: 20, unitCost: "30.00" }); await receive(t, f3, { drugId: b.id, quantity: 20, unitCost: "40.00" });
    await t.http.post("/api/v1/pos/sales").set(c3()).send({ idempotencyKey: key(), lines: [{ drugId: a.id, quantity: 2 }], payments: [{ method: "CASH", amount: "200.00" }] });
    await t.http.post("/api/v1/pos/sales").set(c3()).send({ idempotencyKey: key(), lines: [{ drugId: b.id, quantity: 2 }], payments: [{ method: "CARD", amount: "100.00" }] });
    await t.http.post("/api/v1/finance/expenses").set(o3()).send({ branchId: f3.branchId, category: "UTILITIES", amount: "50.00", description: "Electricity" });
    const ov = await t.http.get(`/api/v1/finance/overview?branchId=${f3.branchId}&${range}`).set(o3());
    assert.equal(ov.status, 200, JSON.stringify(ov.body));
    // revenue ex VAT: 300 total - VAT (200*0.14/1.14 = 24.56, 100*0.14/1.14 = 12.28) = 263.16; COGS 2*30 + 2*40 = 140
    assert.equal(ov.body.sales.gross, "300.00"); assert.equal(ov.body.sales.vatIncluded, "36.84"); assert.equal(ov.body.sales.revenueNet, "263.16");
    assert.equal(ov.body.cogs, "140.00"); assert.equal(ov.body.grossMargin, "123.16"); assert.equal(ov.body.grossMarginPct, 46.8);
    assert.equal(ov.body.expenses.total, "50.00"); assert.equal(ov.body.netOperatingProfit, "73.16");
    assert.deepEqual(ov.body.paymentsByMethod.map((p: { method: string; net: string }) => [p.method, p.net]).sort(), [["CARD", "100.00"], ["CASH", "200.00"]]);
    assert.equal(ov.body.daily.length, 1); assert.equal(ov.body.daily[0].margin, "123.16");
    const byProduct = await t.http.get(`/api/v1/finance/margin?by=product&branchId=${f3.branchId}&${range}`).set(o3());
    assert.deepEqual(byProduct.body.map((r: { label: string; margin: string }) => [r.label, r.margin]), [["Fin-A", "115.44"], ["Fin-B", "7.72"]]); // A: 175.44-60; B: 87.72-80
    const byCat = await t.http.get(`/api/v1/finance/margin?by=category&branchId=${f3.branchId}&${range}`).set(o3());
    assert.deepEqual(byCat.body.map((r: { label: string }) => r.label), ["Analgesics", "Vitamins"]);
    // a return reduces revenue and COGS
    const sale = (await t.http.get(`/api/v1/pos/sales?branchId=${f3.branchId}`).set(o3())).body.items[0];
    const full = (await t.http.get(`/api/v1/pos/sales/${sale.id}`).set(o3())).body;
    await t.http.post(`/api/v1/pos/sales/${sale.id}/returns`).set(o3()).send({ lines: [{ saleLineId: full.lines[0].id, quantity: 1 }], reason: "customer changed mind", refundMethod: "CASH" });
    const ov2 = await t.http.get(`/api/v1/finance/overview?branchId=${f3.branchId}&${range}`).set(o3());
    assert.ok(Number(ov2.body.sales.revenueNet) < Number(ov.body.sales.revenueNet)); assert.ok(Number(ov2.body.sales.refunds) > 0);
    assert.equal((await t.http.get("/api/v1/finance/overview").set(c3())).status, 403);
  });

  it("receivables aging from customer credit charges and payments", async () => {
    const f4 = await seedTenant(t); await openShift(t, f4); const o4 = () => auth(f4.users.owner.token), c4 = () => auth(f4.users.cashier.token);
    const cust = (await t.http.post("/api/v1/customers").set(o4()).send({ displayName: "Credit Customer" })).body;
    const acct = (await t.http.post(`/api/v1/customers/${cust.id}/credit-account`).set(o4()).send({ creditLimit: "1000.00" })).body;
    const d = await seedDrug(t, f4, { price: "100.00" }); await receive(t, f4, { drugId: d.id, quantity: 10 });
    await t.http.post("/api/v1/pos/sales").set(c4()).send({ idempotencyKey: key(), customerAccountId: acct.id, lines: [{ drugId: d.id, quantity: 3 }], payments: [{ method: "CUSTOMER_CREDIT", amount: "300.00" }] });
    await t.prisma.customerCreditEntry.updateMany({ where: { accountId: acct.id }, data: { createdAt: new Date(Date.now() - 50 * day) } });
    await t.http.post(`/api/v1/pos/customers/${acct.id}/payments`).set(c4()).send({ amount: "100.00" });
    const r = await t.http.get("/api/v1/finance/receivables").set(o4());
    assert.equal(r.body.outstanding, "200.00"); assert.equal(r.body.customers[0].buckets.d1_30, "200.00"); assert.equal(r.body.customers[0].customer.displayName, "Credit Customer"); assert.equal(r.body.creditDays, 30);
  });

  it("insurer claims: batch submit, partial approval, partial and final payments, rejection with reason, reconciliation per insurer", async () => {
    const f5 = await seedTenant(t, { edition: "CHAIN" }); const o5 = () => auth(f5.users.owner.token);
    const mk = async (insurer: string, amount: string) => (await t.http.post("/api/v1/claims").set(o5()).send({ branchId: f5.branchId, insurerName: insurer, memberRef: "M-1", amountClaimed: amount })).body as { id: string; status: string };
    const c1 = await mk("MedCare", "1000.00"), c2 = await mk("MedCare", "400.00"), c3 = await mk("HealthPlus", "250.00");
    assert.equal(c1.status, "DRAFT");
    const b = await t.http.post("/api/v1/claims/batch-submit").set(o5()).send({ ids: [c1.id, c2.id, c3.id], submissionRef: "BATCH-NOV-01" });
    assert.equal(b.body.submitted, 3);
    assert.equal((await t.http.post("/api/v1/claims/batch-submit").set(o5()).send({ ids: [c1.id], submissionRef: "again" })).body.code, "BAD_TRANSITION");
    assert.equal((await t.http.post(`/api/v1/claims/${c1.id}/approve`).set(o5()).send({ approvedAmount: "1500.00" })).body.code, "INVALID_AMOUNT");
    const ap = await t.http.post(`/api/v1/claims/${c1.id}/approve`).set(o5()).send({ approvedAmount: "900.00", note: "10% disallowed" });
    assert.equal(ap.body.status, "APPROVED"); assert.equal(ap.body.approvedAmount, "900.00");
    assert.equal((await t.http.post(`/api/v1/claims/${c1.id}/payments`).set(o5()).send({ amount: "1000.00" })).body.code, "INVALID_AMOUNT");
    const p1 = await t.http.post(`/api/v1/claims/${c1.id}/payments`).set(o5()).send({ amount: "500.00", reference: "BANK-111" });
    assert.equal(p1.body.outstanding, "400.00"); assert.equal(p1.body.claim.status, "APPROVED");
    const p2 = await t.http.post(`/api/v1/claims/${c1.id}/payments`).set(o5()).send({ amount: "400.00", reference: "BANK-222" });
    assert.equal(p2.body.claim.status, "PAID"); assert.equal(p2.body.outstanding, "0.00");
    assert.equal((await t.http.get(`/api/v1/claims/${c1.id}/payments`).set(o5())).body.length, 2);
    assert.equal((await t.http.post(`/api/v1/claims/${c2.id}/reject`).set(o5()).send({ reason: "x" })).status, 400);
    const rj = await t.http.post(`/api/v1/claims/${c2.id}/reject`).set(o5()).send({ reason: "Member not covered for this drug" });
    assert.equal(rj.body.status, "REJECTED"); assert.equal(rj.body.rejectionReason, "Member not covered for this drug");
    const rec = await t.http.get("/api/v1/claims/reconciliation").set(o5());
    const med = rec.body.insurers.find((i: { insurer: string }) => i.insurer === "MedCare"), hp = rec.body.insurers.find((i: { insurer: string }) => i.insurer === "HealthPlus");
    assert.deepEqual([med.claimed, med.approved, med.rejected, med.paid, med.outstanding, med.shortfall], ["1400.00", "900.00", "400.00", "900.00", "0.00", "100.00"]);
    assert.equal(hp.outstanding, "250.00");
    assert.equal(rec.body.totals.outstanding, "250.00");
    // legacy transition path still works and keeps approved/paid consistent
    const legacy = await t.http.post(`/api/v1/claims/${c3.id}/transition`).set(o5()).send({ status: "APPROVED" });
    assert.equal(legacy.body.approvedAmount, "250.00");
    const paid = await t.http.post(`/api/v1/claims/${c3.id}/transition`).set(o5()).send({ status: "PAID" });
    assert.equal(paid.body.paidAmount, "250.00"); assert.equal((await t.http.get(`/api/v1/claims/${c3.id}/payments`).set(o5())).body.length, 1);
    assert.equal((await t.http.get("/api/v1/claims/reconciliation").set(cash())).status, 403);
    void ph;
  });
});
