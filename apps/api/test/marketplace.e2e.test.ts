import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signKiorlyRequest, validateEvent, verifyWebhook, signWebhook } from "@kiorex/contracts";
import { auth, bootApp, ledgerOnHand, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { randomUUID } from "node:crypto";
import { createServer, type Server } from "node:http";


describe("Kiorex orders (KPMKT01-05, KPINV07)", () => {
  let t: TestApp, f: Fixture;
  before(async () => {
    t = await bootApp(); f = await seedTenant(t);
    const r = await t.http.put(`/api/v1/kiorex-orders/settings/${f.branchId}`).set(auth(f.users.owner.token)).send({ optedIn: true, deliveryRadiusKm: "7.5", prepMinutes: 25, slaMinutes: 10 });
    assert.equal(r.status, 200, JSON.stringify(r.body));
  });
  after(async () => { await t.close(); });

  const machine = (method: "GET" | "POST", path: string, body?: object, over: { key?: string; nonce?: string; secret?: string; timestamp?: number } = {}) => {
    const raw = body ? JSON.stringify(body) : "";
    const s = signKiorlyRequest({ clientKey: over.key ?? f.client.key, clientSecret: over.secret ?? f.client.secret, method, path, body: raw, nonce: over.nonce, timestamp: over.timestamp });
    const req = (method === "GET" ? t.http.get(path) : t.http.post(path)).set({ ...s.headers, "content-type": "application/json" });
    return body ? req.send(raw) : req;
  };
  const pharm = () => auth(f.users.pharmacist.token);

  it("HMAC: rejects bad signature, replayed nonce, stale timestamp and unknown client key (the key addresses the tenant)", async () => {
    assert.equal((await machine("GET", "/marketplace/v1/availability", undefined, { secret: "nope" })).status, 401);
    const n = `n-${randomUUID()}`;
    assert.equal((await machine("GET", "/marketplace/v1/availability", undefined, { nonce: n })).status, 200);
    const replay = await machine("GET", "/marketplace/v1/availability", undefined, { nonce: n });
    assert.equal(replay.status, 401);
    assert.match(replay.body.message, /replay/);
    assert.equal((await machine("GET", "/marketplace/v1/availability", undefined, { timestamp: Date.now() - 3_600_000 })).status, 401);
    assert.equal((await machine("GET", "/marketplace/v1/availability", undefined, { key: "kc_unknown" })).status, 401);
    assert.equal((await t.http.get("/marketplace/v1/availability")).status, 401);
  });

  it("stock exposure: only opted-in branches, sellable ATP, NEVER controlled medicines, never blocked lots", async () => {
    const otc = await seedDrug(t, f, { price: "10.00" });
    const ctrl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_2", price: "10.00" });
    const blocked = await seedDrug(t, f, { price: "10.00" });
    await receive(t, f, { drugId: otc.id, quantity: 12 });
    await receive(t, f, { drugId: ctrl.id, quantity: 12 });
    const bl = await receive(t, f, { drugId: blocked.id, quantity: 12 });
    await t.http.post(`/api/v1/inventory/lots/${bl.id}/quarantine`).set(pharm()).send({ reason: "hold for check" });
    const res = await machine("GET", "/marketplace/v1/availability");
    assert.equal(res.status, 200);
    const items = res.body.branches.find((b: { branchId: string }) => b.branchId === f.branchId).items;
    assert.equal(items.find((i: { sku: string }) => i.sku === otc.id).availableQty, 12);
    assert.equal(items.find((i: { sku: string }) => i.sku === ctrl.id), undefined, "controlled never exposed");
    assert.equal(items.find((i: { sku: string }) => i.sku === blocked.id), undefined, "quarantined stock is not promised");
    assert.equal(res.body.branches.some((b: { branchId: string }) => b.branchId === f.branch2Id), false, "branch 2 not opted in");
  });

  it("controlled medicines can never be ordered (422) and Rx items need prescription details", async () => {
    const ctrl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_3", price: "10.00" });
    const rx = await seedDrug(t, f, { rxOnly: true, price: "10.00" });
    const c = await machine("POST", "/marketplace/v1/orders", { orderId: `o-${randomUUID()}`, branchId: f.branchId, lines: [{ sku: ctrl.id, quantity: 1, unitPrice: "10.00" }] });
    assert.equal(c.status, 422);
    assert.equal(c.body.code, "CONTROLLED_NOT_ORDERABLE");
    const r = await machine("POST", "/marketplace/v1/orders", { orderId: `o-${randomUUID()}`, branchId: f.branchId, lines: [{ sku: rx.id, quantity: 1, unitPrice: "10.00" }] });
    assert.equal(r.body.code, "PRESCRIPTION_REQUIRED");
    const unopted = await machine("POST", "/marketplace/v1/orders", { orderId: `o-${randomUUID()}`, branchId: f.branch2Id, lines: [{ sku: rx.id, quantity: 1, unitPrice: "10.00" }] });
    assert.equal(unopted.body.code, "BRANCH_NOT_OPTED_IN");
  });

  it("OTC order: ingest (idempotent) -> inbox SLA -> accept (reserve) -> sign-off -> OrderReady -> dispense -> DispenseCompleted + settlement", async () => {
    const drug = await seedDrug(t, f, { price: "100.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 10 });
    const orderId = `ord-${randomUUID()}`;
    const body = { orderId, branchId: f.branchId, customer: { name: "Mona", phone: "01012345678", address: "Maadi" }, prepaid: true, lines: [{ sku: drug.id, quantity: 3, unitPrice: "100.00" }] };
    const a = await machine("POST", "/marketplace/v1/orders", body);
    assert.equal(a.status, 201, JSON.stringify(a.body));
    const again = await machine("POST", "/marketplace/v1/orders", body);
    assert.equal(again.body.replayed, true);
    const inbox = await t.http.get("/api/v1/kiorex-orders?status=RECEIVED").set(pharm());
    const o = inbox.body.find((x: { externalOrderId: string }) => x.externalOrderId === orderId);
    assert.ok(o.slaRemainingSeconds > 0 && o.slaRemainingSeconds <= 600);
    assert.ok((await t.prisma.notification.count({ where: { orgId: f.orgId, template: "order.inbox", refId: o.id } })) === 1);

    const early = await t.http.post(`/api/v1/kiorex-orders/${o.id}/ready`).set(pharm());
    assert.equal(early.status, 409, "cannot be ready before acceptance");
    const acc = await t.http.post(`/api/v1/kiorex-orders/${o.id}/accept`).set(pharm()).send({});
    assert.equal(acc.status, 201, JSON.stringify(acc.body));
    assert.equal(acc.body.order.status, "ACCEPTED");
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).qtyReserved, 3, "KPMKT03 lots reserved on accept");
    assert.equal((await t.prisma.branchMarketplaceSetting.findUniqueOrThrow({ where: { branchId: f.branchId } })).optedIn, true);
    const noSign = await t.http.post(`/api/v1/kiorex-orders/${o.id}/ready`).set(pharm());
    assert.equal(noSign.body.code, "SIGNOFF_REQUIRED");
    await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/signoff`).set(pharm()).send({});
    const ready = await t.http.post(`/api/v1/kiorex-orders/${o.id}/ready`).set(pharm());
    assert.equal(ready.body.status, "READY");
    const done = await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/complete`).set(pharm()).send({ idempotencyKey: `idem-${randomUUID()}` });
    assert.equal(done.status, 201, JSON.stringify(done.body));
    assert.equal(done.body.sale.payments[0].method, "KIOREX_PREPAID");
    assert.equal(done.body.sale.channel, "KIOREX_ORDER");
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 7);
    assert.equal((await t.prisma.kiorexOrder.findUniqueOrThrow({ where: { id: o.id } })).status, "DISPENSED");

    const events = await t.prisma.outboxEvent.findMany({ where: { orgId: f.orgId, aggregateId: orderId }, orderBy: { occurredAt: "asc" } });
    assert.deepEqual(events.map((e) => e.type), ["OrderReady", "DispenseCompleted"]);
    for (const e of events) {
      const v = validateEvent(e.type, e.payload);
      assert.equal(v.valid, true, JSON.stringify(v));
      const p = (e.payload as { data: { pharmacistSignoff: { userId: string; signedAt: string }; orderId: string } }).data;
      assert.equal(p.pharmacistSignoff.userId, f.users.pharmacist.id, "pharmacist sign-off present on the event");
      assert.equal(p.orderId, orderId);
    }
    // delivery: signed with the Kiorly webhook scheme and verified by the (mock) receiver; at-least-once => status SENT
    const r = await t.outbox.deliverDue();
    assert.ok(r.sent >= 2);
    assert.ok((await t.prisma.outboxEvent.findMany({ where: { orgId: f.orgId, aggregateId: orderId } })).every((e) => e.status === "SENT"));
    const inboxEv = t.outbox.mockInbox.filter((m) => events.some((e) => e.id === m.eventId));
    assert.equal(inboxEv.length, 2);
    // money path: idempotency (order ref) + ledger entry + reconciliation
    const st = await t.prisma.settlementEntry.findMany({ where: { orgId: f.orgId, orderRef: orderId } });
    assert.equal(st.length, 1);
    assert.equal(st[0]!.feeAmount.toString(), "12", "4% of 300 (NEEDS_HUMAN default)");
    const sale = await t.prisma.sale.findFirstOrThrow({ where: { dispensingId: acc.body.dispensing.id } });
    assert.equal(st[0]!.orderValue.toString(), sale.total.toString(), "reconciles to the sale");
  });

  it("Rx order (KPMKT04): cannot be accepted before pharmacist validation; works after", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true, price: "50.00", activeIngredient: "azithromycin", strength: "500 mg" });
    await receive(t, f, { drugId: drug.id, quantity: 10 });
    const orderId = `ord-${randomUUID()}`;
    const r = await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "50.00" }], prescription: { prescriberName: "Dr Upload", prescriberLicenceNo: "MD-55", issuedAt: new Date().toISOString(), scanRef: "scan_1" }, customer: { name: "Hassan" } });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    const order = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
    assert.equal(order.hasRx, true);
    const early = await t.http.post(`/api/v1/kiorex-orders/${order.id}/accept`).set(pharm()).send({});
    assert.equal(early.body.code, "RX_VALIDATION_REQUIRED");
    const rx = await t.prisma.prescription.findUniqueOrThrow({ where: { id: order.prescriptionId! } });
    assert.equal(rx.source, "KIOREX_UPLOAD");
    // a cashier cannot validate; the pharmacist can
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/validate`).set(auth(f.users.cashier.token))).status, 403);
    const v = await t.http.post(`/api/v1/prescriptions/${rx.id}/validate`).set(pharm());
    assert.equal(v.body.validated, true, JSON.stringify(v.body));
    const ok = await t.http.post(`/api/v1/kiorex-orders/${order.id}/accept`).set(pharm()).send({});
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal(ok.body.dispensing.safetyChecks.length, 9, "Rx safety checks run on marketplace orders too");
  });

  it("partial accept reduces quantities; reject releases reservations and emits OrderRejected", async () => {
    const drug = await seedDrug(t, f, { price: "20.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 2 });
    const orderId = `ord-${randomUUID()}`;
    await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 5, unitPrice: "20.00" }] });
    const order = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId }, include: { lines: true } });
    const acc = await t.http.post(`/api/v1/kiorex-orders/${order.id}/accept`).set(pharm()).send({});
    assert.equal(acc.body.order.status, "PARTIALLY_ACCEPTED");
    assert.equal(acc.body.order.lines[0].qtyAccepted, 2);
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).qtyReserved, 2);
    const rej = await t.http.post(`/api/v1/kiorex-orders/${order.id}/reject`).set(pharm()).send({ reason: "Customer unreachable", reasonCode: "CUSTOMER_UNREACHABLE" });
    assert.equal(rej.body.status, "REJECTED");
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).qtyReserved, 0, "reservation released");
    const ev = await t.prisma.outboxEvent.findFirstOrThrow({ where: { orgId: f.orgId, type: "OrderRejected", aggregateId: orderId } });
    assert.equal(validateEvent("OrderRejected", ev.payload).valid, true);
    assert.equal((ev.payload as { data: { reasonCode: string } }).data.reasonCode, "CUSTOMER_UNREACHABLE");
  });

  it("SLA sweep expires unanswered orders with OrderRejected(SLA_EXPIRED); Kiorex can cancel", async () => {
    const drug = await seedDrug(t, f, { price: "20.00" });
    await receive(t, f, { drugId: drug.id, quantity: 5 });
    const orderId = `ord-${randomUUID()}`;
    await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "20.00" }] });
    await t.prisma.kiorexOrder.updateMany({ where: { orgId: f.orgId, externalOrderId: orderId }, data: { slaDueAt: new Date(Date.now() - 1000) } });
    const r = await t.http.post("/api/v1/kiorex-orders/jobs/expire-overdue").set(pharm());
    assert.equal(r.body.expired >= 1, true);
    assert.equal((await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } })).status, "EXPIRED");
    const ev = await t.prisma.outboxEvent.findFirstOrThrow({ where: { orgId: f.orgId, aggregateId: orderId } });
    assert.equal((ev.payload as { data: { reasonCode: string } }).data.reasonCode, "SLA_EXPIRED");

    const orderId2 = `ord-${randomUUID()}`;
    await machine("POST", "/marketplace/v1/orders", { orderId: orderId2, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "20.00" }] });
    const c = await machine("POST", `/marketplace/v1/orders/${orderId2}/cancel`, {});
    assert.equal(c.status, 201, JSON.stringify(c.body));
    assert.equal((await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId2 } })).status, "CANCELLED");
  });

  it("1.4.0 contract: pharmacies, catalogue (priced, never controlled) and authoritative quote in minor units", async () => {
    const otc = await seedDrug(t, f, { price: "12.50", brandName: "Quotex" });
    const ctrl = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_2", price: "10.00", brandName: "Quotectrl" });
    await receive(t, f, { drugId: otc.id, quantity: 4 });
    await receive(t, f, { drugId: ctrl.id, quantity: 4 });
    const ph = await machine("GET", "/marketplace/v1/pharmacies");
    assert.equal(ph.status, 200, JSON.stringify(ph.body));
    const row = ph.body.items.find((x: { id: string }) => x.id === f.branchId);
    assert.deepEqual({ pickup: row.pickup, delivery: row.delivery.enabled, fee: row.delivery.feeMinor, prep: row.prepMinutes }, { pickup: true, delivery: true, fee: 0, prep: 25 });
    assert.equal(ph.body.items.some((x: { id: string }) => x.id === f.branch2Id), false);
    const cat = await machine("GET", `/marketplace/v1/catalogue?q=Quote&pharmacyId=${f.branchId}`);
    const item = cat.body.items.find((x: { sku: string }) => x.sku === otc.id);
    assert.deepEqual({ price: item.priceMinor, rx: item.rxRequired, avail: item.available, ctl: item.controlled }, { price: 1250, rx: false, avail: true, ctl: false });
    assert.equal(cat.body.items.some((x: { sku: string }) => x.sku === ctrl.id), false, "controlled never listed");
    const q = await machine("POST", "/marketplace/v1/catalogue/quote", { pharmacyId: f.branchId, items: [{ sku: otc.id, qty: 3 }, { sku: ctrl.id, qty: 1 }], delivery: { method: "DELIVERY" } });
    assert.equal(q.status, 200, JSON.stringify(q.body));
    assert.deepEqual(q.body.items.map((i: { unitPriceMinor: number; available: boolean; controlled: boolean }) => [i.unitPriceMinor, i.available, i.controlled]), [[1250, true, false], [1000, false, true]]);
    assert.equal(q.body.delivery.feeMinor, 0);
    assert.equal((await machine("POST", "/marketplace/v1/catalogue/quote", { pharmacyId: f.branch2Id, items: [{ sku: otc.id, qty: 1 }] })).body.code, "BRANCH_NOT_OPTED_IN");
    assert.equal((await machine("POST", "/marketplace/v1/catalogue/quote", { pharmacyId: f.branchId, items: [{ sku: otc.id, qty: 50 }] })).body.items[0].available, false, "qty above ATP is not promised");
  });

  it("order intent carries Kiorex context, is idempotent, and a stale price is refused (409 PRICE_CHANGED), never re-priced", async () => {
    const drug = await seedDrug(t, f, { price: "30.00" });
    await receive(t, f, { drugId: drug.id, quantity: 5 });
    const orderId = `kx_ph_${randomUUID()}`;
    const body = { orderId, branchId: f.branchId, patientRef: "sub_amira", customer: { name: "Amira" }, prepaid: true, lines: [{ sku: drug.id, quantity: 2, unitPrice: "30.00" }], delivery: { method: "DELIVERY", address: { line1: "12 Nile St" } }, payment: { reference: "pay_1", totalMinor: 6000, currency: "EGP" } };
    const a = await machine("POST", "/marketplace/v1/orders", body);
    assert.equal(a.status, 201, JSON.stringify(a.body));
    assert.equal(a.body.status, "RECEIVED");
    const row = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
    assert.deepEqual({ p: row.patientRef, d: row.deliveryMethod, pay: row.paymentRef }, { p: "sub_amira", d: "DELIVERY", pay: "pay_1" });
    assert.equal((await machine("POST", "/marketplace/v1/orders", body)).body.replayed, true);
    const stale = await machine("POST", "/marketplace/v1/orders", { ...body, orderId: `kx_ph_${randomUUID()}`, lines: [{ sku: drug.id, quantity: 1, unitPrice: "1.00" }] });
    assert.equal(stale.status, 409);
    assert.equal(stale.body.code, "PRICE_CHANGED");
  });

  describe("Rx validation request (KPMKT04) against Kiorex /rx/verify", () => {
    let kiorex: Server, verdict: object = { valid: true, status: "ACTIVE", clinicId: "clinic_9", signedAt: new Date().toISOString() }, base = "";
    before(async () => {
      kiorex = createServer((req, res) => { if (req.url?.startsWith("/api/v1/rx/verify")) { res.setHeader("content-type", "application/json"); res.end(JSON.stringify(verdict)); } else { res.statusCode = 404; res.end(); } });
      await new Promise<void>((r) => kiorex.listen(0, "127.0.0.1", r));
      base = `http://127.0.0.1:${(kiorex.address() as { port: number }).port}`;
      await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: base } });
    });
    after(async () => { await new Promise((r) => kiorex.close(r)); });
    const rxOrder = async () => {
      const drug = await seedDrug(t, f, { rxOnly: true, price: "50.00", activeIngredient: "azithromycin", strength: "500 mg" });
      await receive(t, f, { drugId: drug.id, quantity: 10 });
      const orderId = `kx_ph_${randomUUID()}`;
      const r = await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, patientRef: "sub_hassan", lines: [{ sku: drug.id, quantity: 1, unitPrice: "50.00" }], prescription: { recordRef: "kx_rec_1", verificationToken: "kxrx1.abc.def" } });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      return orderId;
    };
    const validate = (orderId: string) => machine("POST", "/marketplace/v1/prescriptions/validate", { orderId, prescriptionRef: "kx_rec_1", verificationToken: "kxrx1.abc.def", patientRef: "sub_hassan" });

    it("Kiorex-verified token is PENDING until a pharmacist validates, then VALID; accept is blocked meanwhile", async () => {
      verdict = { valid: true, status: "ACTIVE", clinicId: "clinic_9", signedAt: new Date().toISOString() };
      const orderId = await rxOrder();
      const o = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
      const v1 = await validate(orderId);
      assert.deepEqual(v1.body, { status: "PENDING", reason: "PHARMACIST_VALIDATION_REQUIRED" });
      assert.equal((await t.prisma.prescription.findUniqueOrThrow({ where: { id: o.prescriptionId! } })).clinicRef, "clinic_9");
      assert.equal((await t.http.post(`/api/v1/kiorex-orders/${o.id}/accept`).set(pharm()).send({})).body.code, "RX_VALIDATION_REQUIRED");
      const val = await t.http.post(`/api/v1/prescriptions/${o.prescriptionId}/validate`).set(pharm());
      assert.equal(val.body.validated, true, JSON.stringify(val.body));
      assert.deepEqual((await validate(orderId)).body, { status: "VALID" });
      assert.equal((await t.http.post(`/api/v1/kiorex-orders/${o.id}/accept`).set(pharm()).send({})).status, 201);
    });

    it("an invalid/revoked token => INVALID, order REJECTED(RX_INVALID) and OrderRejected emitted (Kiorex then refunds in full)", async () => {
      verdict = { valid: false, status: "REVOKED" };
      const orderId = await rxOrder();
      const r = await validate(orderId);
      assert.deepEqual(r.body, { status: "INVALID", reason: "RX_REVOKED" });
      const o = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
      assert.equal(o.status, "REJECTED");
      assert.equal(o.rejectionCode, "RX_INVALID");
      const ev = await t.prisma.outboxEvent.findFirstOrThrow({ where: { orgId: f.orgId, aggregateId: orderId, type: "OrderRejected" } });
      assert.equal(validateEvent("OrderRejected", ev.payload).valid, true);
      assert.equal((await validate(orderId)).body.status, "INVALID", "idempotent");
      const cancel = await machine("POST", `/marketplace/v1/orders/${orderId}/cancel`, { reason: "RX_INVALID" });
      assert.equal(cancel.body.status, "REJECTED", "Kiorex follow-up cancel does not overwrite the rejection");
      assert.equal((await t.prisma.outboxEvent.count({ where: { orgId: f.orgId, aggregateId: orderId, type: "OrderRejected" } })), 1);
    });

    it("Kiorex unreachable => PENDING (manual pharmacist verification), never a silent VALID", async () => {
      const orderId = await rxOrder();
      await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: "http://127.0.0.1:1" } });
      assert.deepEqual((await validate(orderId)).body, { status: "PENDING", reason: "KIOREX_UNREACHABLE" });
      await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: base } });
    });
  });

  it("outbox delivery uses the per-tenant webhook secret and sends X-Kiorly-Client-Key (real mode posts to Kiorex /webhooks/pharmacy)", async () => {
    const seen: Array<{ url: string; headers: Record<string, string>; body: string }> = [];
    const srv = createServer((req, res) => { let b = ""; req.on("data", (c) => (b += c)); req.on("end", () => { seen.push({ url: req.url!, headers: req.headers as Record<string, string>, body: b }); res.end("{}"); }); });
    await new Promise<void>((r) => srv.listen(0, "127.0.0.1", r));
    const prev = process.env.KIOREX_MODE;
    try {
      process.env.KIOREX_MODE = "real";
      await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: `http://127.0.0.1:${(srv.address() as { port: number }).port}` } });
      await t.prisma.outboxEvent.deleteMany({ where: { orgId: f.orgId } });
      const drug = await seedDrug(t, f, { price: "10.00" });
      await receive(t, f, { drugId: drug.id, quantity: 3 });
      const orderId = `kx_ph_${randomUUID()}`;
      await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 1, unitPrice: "10.00" }] });
      const o = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId } });
      await t.http.post(`/api/v1/kiorex-orders/${o.id}/reject`).set(pharm()).send({ reason: "Out of stock today", reasonCode: "OUT_OF_STOCK" });
      assert.deepEqual(await t.outbox.deliverDue(), { sent: 1, failed: 0 });
      assert.equal(seen[0]!.url, "/api/v1/webhooks/pharmacy");
      assert.equal(seen[0]!.headers["content-type"], "application/json", "REGRESSION: a duplicated content-type header made Kiorex skip body parsing (RAW_BODY_REQUIRED)");
      assert.equal(seen[0]!.headers["x-kiorly-client-key"], f.client.key);
      assert.equal(verifyWebhook({ secret: f.client.webhookSecret, body: seen[0]!.body, timestamp: seen[0]!.headers["x-kiorly-timestamp"], signature: seen[0]!.headers["x-kiorly-signature"] }).ok, true);
      assert.equal(JSON.parse(seen[0]!.body).type, "OrderRejected");
    } finally {
      if (prev === undefined) delete process.env.KIOREX_MODE; else process.env.KIOREX_MODE = prev;
      await new Promise((r) => srv.close(r));
      await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { kiorexBaseUrl: null } });
    }
  });

  it("REGRESSION: a partially accepted order still completes as DispenseCompleted{partial:true} after OrderReady (status is READY by then)", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    await receive(t, f, { drugId: drug.id, quantity: 10 });
    const orderId = `kx_ph_${randomUUID()}`;
    await machine("POST", "/marketplace/v1/orders", { orderId, branchId: f.branchId, lines: [{ sku: drug.id, quantity: 3, unitPrice: "10.00" }] });
    const o = await t.prisma.kiorexOrder.findFirstOrThrow({ where: { orgId: f.orgId, externalOrderId: orderId }, include: { lines: true } });
    const acc = await t.http.post(`/api/v1/kiorex-orders/${o.id}/accept`).set(pharm()).send({ lines: [{ lineId: o.lines[0]!.id, qtyAccepted: 1 }] });
    assert.equal(acc.body.order.status, "PARTIALLY_ACCEPTED");
    await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/signoff`).set(pharm()).send({});
    assert.equal((await t.http.post(`/api/v1/kiorex-orders/${o.id}/ready`).set(pharm())).body.status, "READY");
    assert.equal((await t.http.post(`/api/v1/dispensings/${acc.body.dispensing.id}/complete`).set(pharm()).send({ idempotencyKey: `idem-${randomUUID()}` })).status, 201);
    const ev = await t.prisma.outboxEvent.findFirstOrThrow({ where: { orgId: f.orgId, aggregateId: orderId, type: "DispenseCompleted" } });
    assert.equal((ev.payload as { data: { partial: boolean } }).data.partial, true);
  });

  it("outbox signing round-trips with the contracts HMAC scheme and rejects tampering", () => {
    const body = JSON.stringify({ eventId: "e1", type: "OrderReady" });
    const s = signWebhook({ secret: "s", body, eventType: "OrderReady", eventId: "e1" });
    assert.equal(verifyWebhook({ secret: "s", body, timestamp: s.timestamp, signature: s.signature }).ok, true);
    assert.equal(verifyWebhook({ secret: "s", body: body + " ", timestamp: s.timestamp, signature: s.signature }).ok, false);
  });
});
