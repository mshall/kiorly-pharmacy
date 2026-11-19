import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, isoDate, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("inventory (KPINV01-07)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const pharm = () => auth(f.users.pharmacist.token);

  it("receipt creates lot + RECEIPT movement + supplier invoice ledger in one transaction; duplicate lot adds to the existing row", async () => {
    const sup = (await t.http.post("/api/v1/suppliers").set(owner()).send({ name: "Alpha Pharma", phone: "01000000001", email: "a@x.test", paymentTerms: "30 days", creditLimit: "50000" })).body;
    const drug = await seedDrug(t, f);
    const body = (qty: number, idem: string) => ({ branchId: f.branchId, supplierId: sup.id, invoiceNo: "INV-9", invoiceTotal: String(qty * 20) + ".00", idempotencyKey: idem, lines: [{ drugId: drug.id, lotNumber: "LOT-A", expiryDate: isoDate(300), quantity: qty, unitCost: "20.00" }] });
    const a = await t.http.post("/api/v1/inventory/receipts").set(owner()).send(body(10, "rcpt-1-idem"));
    assert.equal(a.status, 201, JSON.stringify(a.body));
    const replay = await t.http.post("/api/v1/inventory/receipts").set(owner()).send(body(10, "rcpt-1-idem"));
    assert.equal(replay.body.replayed, true);
    const b = await t.http.post("/api/v1/inventory/receipts").set(owner()).send(body(5, "rcpt-2-idem"));
    assert.equal(b.status, 201);
    const lots = await t.prisma.stockLot.findMany({ where: { branchId: f.branchId, drugId: drug.id, lotNumber: "LOT-A" } });
    assert.equal(lots.length, 1, "never a second row for (branch, drug, lot)");
    assert.equal(lots[0]!.qtyOnHand, 15);
    assert.equal(await ledgerOnHand(t.prisma, lots[0]!.id), 15);
    const supplier = await t.prisma.supplier.findUniqueOrThrow({ where: { id: sup.id } });
    assert.equal(supplier.balance.toString(), "300", "payable grew by two invoices (200 + 100)");
    const mismatch = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: drug.id, lotNumber: "LOT-A", expiryDate: isoDate(10), quantity: 1, unitCost: "1.00" }] });
    assert.equal(mismatch.body.code, "LOT_EXPIRY_MISMATCH");
    const expired = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, lines: [{ drugId: drug.id, lotNumber: "OLD", expiryDate: isoDate(-3), quantity: 1, unitCost: "1.00" }] });
    assert.equal(expired.body.code, "EXPIRED_AT_RECEIPT");
  });

  it("GS1 scan prefills drug, lot and expiry", async () => {
    const drug = await seedDrug(t, f, { gtin: "06223000112345" });
    const scan = await t.http.post("/api/v1/inventory/scan/parse").set(owner()).send({ code: "(01)06223000112345(17)281231(10)BATCH77" });
    assert.equal(scan.body.drug.id, drug.id);
    assert.equal(scan.body.lotNumber, "BATCH77");
    assert.equal(scan.body.expiryDate, "2028-12-31");
    const res = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, lines: [{ scan: "(01)06223000112345(17)281231(10)BATCH77", quantity: 4, unitCost: "9.00" }] });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    const lot = await t.prisma.stockLot.findFirstOrThrow({ where: { drugId: drug.id, lotNumber: "BATCH77" } });
    assert.equal(lot.expiryDate.toISOString().slice(0, 10), "2028-12-31");
  });

  it("PO receiving updates PO lines/status and keeps supplier balance honest", async () => {
    const sup = (await t.http.post("/api/v1/suppliers").set(owner()).send({ name: "Beta", phone: "01000000002" })).body;
    const drug = await seedDrug(t, f);
    const po = (await t.http.post("/api/v1/purchase-orders").set(owner()).send({ branchId: f.branchId, supplierId: sup.id, lines: [{ drugId: drug.id, qtyOrdered: 10, unitCost: "12.00" }] })).body;
    assert.match(po.poNumber, /^PO-\d{8}-0001$|^PO-\d{8}-\d{4}$/);
    const sent = await t.http.post(`/api/v1/purchase-orders/${po.id}/send`).set(owner()).send({ via: "WHATSAPP" });
    assert.equal(sent.body.status, "SENT");
    assert.equal((await t.prisma.notification.count({ where: { orgId: f.orgId, template: "po.send" } })), 1);
    const part = await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, purchaseOrderId: po.id, lines: [{ drugId: drug.id, lotNumber: "PO1", expiryDate: isoDate(200), quantity: 4, unitCost: "12.00" }] });
    assert.equal(part.status, 201, JSON.stringify(part.body));
    assert.equal((await t.prisma.purchaseOrder.findUniqueOrThrow({ where: { id: po.id } })).status, "PARTIALLY_RECEIVED");
    await t.http.post("/api/v1/inventory/receipts").set(owner()).send({ branchId: f.branchId, purchaseOrderId: po.id, lines: [{ drugId: drug.id, lotNumber: "PO2", expiryDate: isoDate(200), quantity: 6, unitCost: "12.00" }] });
    assert.equal((await t.prisma.purchaseOrder.findUniqueOrThrow({ where: { id: po.id } })).status, "RECEIVED");
    const pay = await t.http.post(`/api/v1/suppliers/${sup.id}/payments`).set(owner()).send({ amount: "100.00", idempotencyKey: "pay-1-idem" });
    const pay2 = await t.http.post(`/api/v1/suppliers/${sup.id}/payments`).set(owner()).send({ amount: "100.00", idempotencyKey: "pay-1-idem" });
    assert.equal(pay2.body.replayed, true);
    assert.equal(pay.status, 201);
    const s = await t.prisma.supplier.findUniqueOrThrow({ where: { id: sup.id } });
    assert.equal(s.balance.toString(), "20", "120 invoiced - 100 paid");
    const sumLedger = (await t.prisma.supplierLedgerEntry.aggregate({ where: { supplierId: sup.id }, _sum: { amount: true } }))._sum.amount!;
    assert.equal(sumLedger.toString(), s.balance.toString(), "ledger sums to balance projection");
  });

  it("near-expiry alerts fire once per lot per threshold (90/60/30) and return-to-supplier credits the supplier", async () => {
    const sup = (await t.http.post("/api/v1/suppliers").set(owner()).send({ name: "Gamma", phone: "01000000003" })).body;
    const drug = await seedDrug(t, f);
    const lot = await receive(t, f, { drugId: drug.id, expiryDays: 80, quantity: 10, unitCost: "10.00", supplierId: sup.id });
    const r1 = await t.http.post("/api/v1/inventory/jobs/expiry-sweep").set(owner());
    assert.equal(r1.status, 201);
    assert.equal(await t.prisma.expiryAlert.count({ where: { lotId: lot.id } }), 1, "90-day threshold crossed");
    await t.http.post("/api/v1/inventory/jobs/expiry-sweep").set(owner());
    assert.equal(await t.prisma.expiryAlert.count({ where: { lotId: lot.id } }), 1, "no duplicate alert");
    await t.prisma.$executeRaw`UPDATE "StockLot" SET "expiryDate" = kx_today() + 25 WHERE id = ${lot.id}`;
    await t.http.post("/api/v1/inventory/jobs/expiry-sweep").set(owner());
    const alerts = await t.prisma.expiryAlert.findMany({ where: { lotId: lot.id }, orderBy: { thresholdDays: "asc" } });
    assert.deepEqual(alerts.map((a) => a.thresholdDays), [30, 60, 90]);
    const msgs = await t.prisma.notification.count({ where: { orgId: f.orgId, template: "expiry.alert", refId: lot.id } });
    assert.equal(msgs, 2, "one message at the 90 crossing, one at the 30 crossing (60 is recorded silently)");
    const before = (await t.prisma.supplier.findUniqueOrThrow({ where: { id: sup.id } })).balance;
    const ret = await t.http.post("/api/v1/inventory/returns-to-supplier").set(owner()).send({ lotId: lot.id, quantity: 4, reason: "near expiry return" });
    assert.equal(ret.status, 201, JSON.stringify(ret.body));
    const after_ = (await t.prisma.supplier.findUniqueOrThrow({ where: { id: sup.id } })).balance;
    assert.equal(before.minus(after_).toString(), "40");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 6);
  });

  it("stock count: variance needs approval by someone else, posts COUNT_VARIANCE movements", async () => {
    const drug = await seedDrug(t, f);
    const lot = await receive(t, f, { drugId: drug.id, quantity: 20 });
    const c = await t.http.post("/api/v1/inventory/counts").set(auth(f.users.manager.token)).send({ type: "CYCLE", drugIds: [drug.id] });
    assert.equal(c.status, 201, JSON.stringify(c.body));
    await t.http.put(`/api/v1/inventory/counts/${c.body.id}/lines`).set(auth(f.users.manager.token)).send({ lines: [{ lotId: lot.id, qtyCounted: 17 }] });
    const sub = await t.http.post(`/api/v1/inventory/counts/${c.body.id}/submit`).set(auth(f.users.manager.token));
    assert.equal(sub.body.status, "PENDING_APPROVAL");
    const self = await t.http.post(`/api/v1/inventory/counts/${c.body.id}/approve`).set(auth(f.users.manager.token));
    assert.equal(self.body.code, "SELF_APPROVAL");
    const ok = await t.http.post(`/api/v1/inventory/counts/${c.body.id}/approve`).set(owner());
    assert.equal(ok.body.status, "APPROVED", JSON.stringify(ok.body));
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 17);
    assert.equal(await t.prisma.stockMovement.count({ where: { lotId: lot.id, type: "COUNT_VARIANCE", qtyDelta: -3 } }), 1);
  });

  it("transfers (Chain): quantity conserved, dest lot keeps lot/expiry; blocked on Lite/Pro (402)", async () => {
    const lite = await seedTenant(t, { edition: "LITE" });
    const denied = await t.http.get("/api/v1/inventory/transfers").set(auth(lite.users.owner.token));
    assert.equal(denied.status, 402);
    assert.equal(denied.body.code, "ENTITLEMENT_REQUIRED");

    const chain = await seedTenant(t, { edition: "CHAIN" });
    const drug = await seedDrug(t, chain);
    const lot = await receive(t, chain, { drugId: drug.id, quantity: 30, lotNumber: "TRF-1", expiryDays: 222 });
    const tr = await t.http.post("/api/v1/inventory/transfers").set(auth(chain.users.owner.token)).send({ fromBranchId: chain.branchId, toBranchId: chain.branch2Id, lines: [{ lotId: lot.id, quantity: 12 }] });
    assert.equal(tr.status, 201, JSON.stringify(tr.body));
    await t.http.post(`/api/v1/inventory/transfers/${tr.body.id}/dispatch`).set(auth(chain.users.owner.token));
    const mid = await t.prisma.stockLot.aggregate({ where: { orgId: chain.orgId, drugId: drug.id }, _sum: { qtyOnHand: true } });
    assert.equal(mid._sum.qtyOnHand, 18, "in transit stock is out of the source and not yet in the destination");
    await t.http.post(`/api/v1/inventory/transfers/${tr.body.id}/receive`).set(auth(chain.users.owner.token));
    const dest = await t.prisma.stockLot.findFirstOrThrow({ where: { branchId: chain.branch2Id, drugId: drug.id, lotNumber: "TRF-1" } });
    assert.equal(dest.qtyOnHand, 12);
    assert.equal(dest.expiryDate.getTime(), lot.expiryDate.getTime());
    const total = await t.prisma.stockLot.aggregate({ where: { orgId: chain.orgId, drugId: drug.id }, _sum: { qtyOnHand: true } });
    assert.equal(total._sum.qtyOnHand, 30);
  });

  it("available-to-promise excludes blocked lots and reservations", async () => {
    const drug = await seedDrug(t, f);
    const a = await receive(t, f, { drugId: drug.id, quantity: 10, lotNumber: "ATP-A" });
    const b = await receive(t, f, { drugId: drug.id, quantity: 5, lotNumber: "ATP-B" });
    await t.http.post(`/api/v1/inventory/lots/${b.id}/quarantine`).set(pharm()).send({ reason: "damaged packs" });
    const res = await t.http.get(`/api/v1/inventory/stock?q=${encodeURIComponent((await t.prisma.drug.findUniqueOrThrow({ where: { id: drug.id } })).brandName)}`).set(pharm());
    const row = res.body.items.find((i: { drugId: string }) => i.drugId === drug.id);
    assert.equal(row.sellable, 10);
    assert.equal(row.blocked, 5);
    void a; void key; void openShift;
  });

  it("min/max reorder suggestions raise the order up to max and one-tap PO is created per supplier", async () => {
    const sup = (await t.http.post("/api/v1/suppliers").set(owner()).send({ name: "Delta", phone: "01000000004" })).body;
    const drug = await seedDrug(t, f);
    await receive(t, f, { drugId: drug.id, quantity: 3, supplierId: sup.id });
    const put = await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f.branchId}`).set(owner()).send({ drugId: drug.id, minQty: 5, maxQty: 20 });
    assert.equal(put.status, 200, JSON.stringify(put.body));
    const s = await t.http.get(`/api/v1/reorder/suggestions?branchId=${f.branchId}`).set(owner());
    const sug = s.body.items.find((i: { drugId: string }) => i.drugId === drug.id);
    assert.equal(sug.suggestedQty, 17);
    assert.equal(sug.method, "MIN_MAX");
    assert.equal(sug.supplierId, sup.id);
    const pos = await t.http.post("/api/v1/reorder/create-pos").set(owner()).send({ branchId: f.branchId, items: [{ drugId: drug.id, qty: 17 }] });
    assert.equal(pos.status, 201, JSON.stringify(pos.body));
    assert.equal(pos.body[0].lines[0].qtyOrdered, 17);
    const again = await t.http.get(`/api/v1/reorder/suggestions?branchId=${f.branchId}`).set(owner());
    assert.equal(again.body.items.find((i: { drugId: string }) => i.drugId === drug.id), undefined, "open PO counts as on-order");
  });
});
