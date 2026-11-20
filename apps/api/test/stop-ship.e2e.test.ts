import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

/**
 * KX-06 §06 stop-ship tests (PH-SS01 / PH-SS02 / PH-SS04): these must stay green on every pilot build.
 * Each rule is asserted through the HTTP API AND against the database (the trigger is the independent last line).
 */
describe("stop-ship: lot blocks (PH-SS01)", () => {
  let t: TestApp, f: Fixture, shiftId: string;
  before(async () => { t = await bootApp(); f = await seedTenant(t); shiftId = (await openShift(t, f)).id; });
  after(async () => { await t.close(); });

  const sell = (drugId: string, lotId?: string) => t.http.post("/api/v1/pos/sales").set(auth(f.users.cashier.token)).send({
    idempotencyKey: key(), shiftId, lines: [{ drugId, quantity: 1, lotId }], payments: [{ method: "CASH", amount: "500.00" }],
  });

  it("an expired lot can never be sold (API 409 LOT_BLOCKED, DB trigger rejects too)", async () => {
    const drug = await seedDrug(t, f);
    const lot = await receive(t, f, { drugId: drug.id, expiryDays: 30 });
    // time passes: expiry moves into the past (direct SQL stands in for the calendar)
    await t.prisma.$executeRaw`UPDATE "StockLot" SET "expiryDate" = kx_today() - 1 WHERE id = ${lot.id}`;
    const res = await sell(drug.id, lot.id);
    assert.equal(res.status, 409);
    assert.equal(res.body.code, "LOT_BLOCKED");
    assert.equal(res.body.details.reason, "EXPIRED");
    await assert.rejects(t.prisma.stockMovement.create({ data: { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: "SALE", qtyDelta: -1, performedBy: "x" } }), /expired/);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 100, "no stock moved");
  });

  it("FEFO never suggests an expired lot even when it expires earliest", async () => {
    const drug = await seedDrug(t, f);
    const bad = await receive(t, f, { drugId: drug.id, expiryDays: 10, lotNumber: "BAD" });
    const good = await receive(t, f, { drugId: drug.id, expiryDays: 200, lotNumber: "GOOD" });
    await t.prisma.$executeRaw`UPDATE "StockLot" SET "expiryDate" = kx_today() - 5 WHERE id = ${bad.id}`;
    const res = await t.http.get(`/api/v1/inventory/fefo?drugId=${drug.id}&qty=3`).set(auth(f.users.cashier.token));
    assert.equal(res.status, 200);
    assert.deepEqual(res.body.picks.map((p: { lotId: string }) => p.lotId), [good.id]);
  });

  it("a recalled lot is blocked in EVERY branch immediately (KPSUP03)", async () => {
    const drug = await seedDrug(t, f);
    const l1 = await receive(t, f, { drugId: drug.id, lotNumber: "RECALL-1", branchId: f.branchId });
    const l2 = await receive(t, f, { drugId: drug.id, lotNumber: "RECALL-1", branchId: f.branch2Id });
    const res = await t.http.post("/api/v1/recalls").set(auth(f.users.pharmacist.token)).send({ drugId: drug.id, lotNumbers: ["RECALL-1"], reason: "EDA notice 123", source: "EDA" });
    assert.equal(res.status, 201);
    assert.equal(res.body.affectedLots, 2);
    assert.ok(res.body.blockedWithinMs < 5 * 60_000, "within 5 minutes");
    for (const lot of [l1, l2]) assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).status, "RECALLED");
    const sale = await sell(drug.id, l1.id);
    assert.equal(sale.status, 409);
    assert.equal(sale.body.details.reason, "RECALLED");
    await assert.rejects(t.prisma.stockMovement.create({ data: { orgId: f.orgId, branchId: f.branch2Id, lotId: l2.id, type: "SALE", qtyDelta: -1, performedBy: "x" } }), /RECALLED/);
    // new stock of a recalled lot number arrives RECALLED
    const again = await receive(t, f, { drugId: drug.id, lotNumber: "RECALL-1", branchId: f.branchId, quantity: 5 });
    assert.equal(again.status, "RECALLED");
  });

  it("a quarantined lot (cold-chain excursion) is blocked; release restores it", async () => {
    const drug = await seedDrug(t, f, { coldChain: true });
    const missing = await t.http.post("/api/v1/inventory/receipts").set(auth(f.users.owner.token)).send({ lines: [{ drugId: drug.id, lotNumber: "C1", expiryDate: "2099-01-01", quantity: 5, unitCost: "10.00" }], branchId: f.branchId });
    assert.equal(missing.body.code, "TEMPERATURE_REQUIRED");
    const lot = await receive(t, f, { drugId: drug.id, temperatureC: 5 });
    assert.equal(lot.status, "AVAILABLE");
    const ex = await t.http.post(`/api/v1/inventory/cold-chain/${lot.id}/readings`).set(auth(f.users.pharmacist.token)).send({ temperatureC: 14.5 });
    assert.equal(ex.status, 201);
    assert.equal(ex.body.excursion, true);
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).status, "QUARANTINE");
    const res = await sell(drug.id, lot.id);
    assert.equal(res.status, 409);
    assert.equal(res.body.details.reason, "QUARANTINE");
    await assert.rejects(t.prisma.stockMovement.create({ data: { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: "DISPENSE", qtyDelta: -1, performedBy: "x" } }), /QUARANTINE/);
    const rel = await t.http.post(`/api/v1/inventory/lots/${lot.id}/release`).set(auth(f.users.pharmacist.token)).send({ reason: "Temperature verified OK" });
    assert.equal(rel.status, 201);
    assert.equal(rel.body.status, "AVAILABLE");
  });

  it("a recalled lot can only be released by lifting the recall", async () => {
    const drug = await seedDrug(t, f);
    const lot = await receive(t, f, { drugId: drug.id, lotNumber: "R2" });
    const r = await t.http.post("/api/v1/recalls").set(auth(f.users.pharmacist.token)).send({ drugId: drug.id, lotNumbers: ["R2"], reason: "supplier letter" });
    const rel = await t.http.post(`/api/v1/inventory/lots/${lot.id}/release`).set(auth(f.users.pharmacist.token)).send({ reason: "nope nope" });
    assert.equal(rel.body.code, "LOT_RECALLED");
    const lift = await t.http.post(`/api/v1/recalls/${r.body.id}/lift`).set(auth(f.users.pharmacist.token));
    assert.equal(lift.status, 201);
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).status, "AVAILABLE");
  });
});

describe("stop-ship: pharmacist sign-off + Rx-only + controlled log (PH-SS02)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });

  async function rxFor(drugId: string, opts: { qty?: number; allergies?: string[]; ingredient?: string } = {}) {
    const res = await t.http.post("/api/v1/prescriptions/paper").set(auth(f.users.pharmacist.token)).send({
      patient: { displayName: "Test Patient", allergies: opts.allergies ?? [] }, prescriberName: "Dr Test", prescriberLicenceNo: "MD-1",
      lines: [{ drugId, quantity: opts.qty ?? 1, directions: "1 tab twice daily" }],
    });
    assert.equal(res.status, 201, JSON.stringify(res.body));
    const v = await t.http.post(`/api/v1/prescriptions/${res.body.id}/validate`).set(auth(f.users.pharmacist.token));
    assert.equal(v.body.validated, true, JSON.stringify(v.body));
    return res.body.id as string;
  }

  it("an Rx-only item cannot be sold at the POS (API) nor via a raw sale line (DB trigger)", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true });
    const lot = await receive(t, f, { drugId: drug.id });
    const res = await t.http.post("/api/v1/pos/sales").set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CASH", amount: "100.00" }] });
    assert.equal(res.status, 409);
    assert.equal(res.body.code, "RX_REQUIRED");
    const sale = await t.prisma.sale.create({ data: { orgId: f.orgId, branchId: f.branchId, idempotencyKey: key(), soldBy: "x" } });
    await assert.rejects(t.prisma.saleLine.create({ data: { saleId: sale.id, drugId: drug.id, lotId: lot.id, quantity: 1, unitPrice: 50 } }), /sign-off/);
  });

  it("dispensing without a validated Rx is refused; DISPENSE movement without sign-off is refused by the DB", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true });
    const lot = await receive(t, f, { drugId: drug.id });
    const noRx = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ items: [{ drugId: drug.id, quantity: 1 }] });
    assert.equal(noRx.body.code, "RX_REQUIRED");
    const rxId = await rxFor(drug.id);
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: rxId, items: [{ drugId: drug.id, quantity: 1 }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    assert.equal(d.body.status, "RESERVED");
    assert.equal(d.body.safetyChecks.length, 9, "all nine safety checks ran");
    // complete before sign-off => refused by the service ...
    const early = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(auth(f.users.pharmacist.token)).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "100.00" }] });
    assert.equal(early.body.code, "SIGNOFF_REQUIRED");
    // ... and by the database even if the service were bypassed
    await assert.rejects(t.prisma.stockMovement.create({ data: { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: "DISPENSE", qtyDelta: -1, performedBy: "x", refType: "Dispensing", refId: d.body.id } }), /sign-off/);
    await assert.rejects(t.prisma.dispensing.update({ where: { id: d.body.id }, data: { status: "SIGNED_OFF" } }), /dispensing_requires_signoff/);
  });

  it("only a licensed pharmacist can sign off; cashier and unlicensed manager are refused", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true });
    await receive(t, f, { drugId: drug.id });
    const rxId = await rxFor(drug.id);
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.cashier.token)).send({ prescriptionId: rxId, items: [{ drugId: drug.id, quantity: 1 }] });
    assert.equal(d.status, 201);
    for (const who of [f.users.cashier, f.users.manager]) {
      const r = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(who.token)).send({});
      assert.equal(r.status, 403);
    }
    const ok = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(f.users.pharmacist.token)).send({ counsellingNotes: "Take with food" });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal(ok.body.status, "SIGNED_OFF");
    assert.equal(ok.body.pharmacistId, f.users.pharmacist.id);
    assert.ok(ok.body.signedOffAt);
  });

  it("controlled medicine: needs ID capture, quantity limit is a hard stop, log entry is written and append-only", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_2", activeIngredient: "morphine" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 50 });
    const rxBig = await rxFor(drug.id, { qty: 10 });
    const big = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: rxBig, items: [{ drugId: drug.id, quantity: 10 }] });
    const lim = big.body.safetyChecks.find((c: { kind: string }) => c.kind === "CONTROLLED_LIMIT");
    assert.equal(lim.outcome, "BLOCK");
    const ov = await t.http.post(`/api/v1/dispensings/${big.body.id}/override/${lim.id}`).set(auth(f.users.pharmacist.token)).send({ reason: "I really want to" });
    assert.equal(ov.body.code, "NOT_OVERRIDABLE");
    await t.http.post(`/api/v1/dispensings/${big.body.id}/cancel`).set(auth(f.users.pharmacist.token)).send({ reason: "too many" });

    const rx = await rxFor(drug.id, { qty: 2 });
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: rx, items: [{ drugId: drug.id, quantity: 2 }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    const noId = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(f.users.pharmacist.token)).send({});
    assert.equal(noId.body.code, "CONTROLLED_ID_REQUIRED");
    const cap = await t.http.post(`/api/v1/dispensings/${d.body.id}/controlled-id`).set(auth(f.users.pharmacist.token)).send({ nationalId: "29801011234567", patientName: "Sara Test" });
    assert.equal(cap.status, 201, JSON.stringify(cap.body));
    const so = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(f.users.pharmacist.token)).send({});
    assert.equal(so.status, 201, JSON.stringify(so.body));
    const done = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(auth(f.users.pharmacist.token)).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "200.00" }] });
    assert.equal(done.status, 201, JSON.stringify(done.body));
    const log = await t.prisma.controlledSubstanceLogEntry.findMany({ where: { dispensingId: d.body.id } });
    assert.equal(log.length, 1);
    assert.equal(log[0]!.patientNationalIdLast4, "4567");
    assert.equal(log[0]!.quantity, 2);
    assert.equal(JSON.stringify(log).includes("29801011234567"), false, "full national ID is never stored in clear");
    await assert.rejects(t.prisma.controlledSubstanceLogEntry.update({ where: { id: log[0]!.id }, data: { quantity: 1 } }), /append-only/);
    await assert.rejects(t.prisma.controlledSubstanceLogEntry.delete({ where: { id: log[0]!.id } }), /append-only/);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 48);
    const reg = await t.http.get("/api/v1/controlled-register").set(auth(f.users.pharmacist.token));
    assert.equal(reg.body.total >= 1, true);
  });

  it("DB refuses DISPENSED for a controlled dispensing with no log entry (deferred trigger)", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_3" });
    const lot = await receive(t, f, { drugId: drug.id });
    await assert.rejects(
      t.prisma.$transaction(async (tx) => {
        const d = await tx.dispensing.create({ data: { orgId: f.orgId, branchId: f.branchId, status: "DISPENSED", pharmacistId: "p", signedOffAt: new Date(), safetyChecksRunAt: new Date(), createdBy: "x" } });
        await tx.dispensingLine.create({ data: { dispensingId: d.id, drugId: drug.id, lotId: lot.id, quantity: 1 } });
      }),
      /controlled-substance log/,
    );
  });

  it("owner without a pharmacist licence cannot sign off (licence is required, not just the role)", async () => {
    await t.prisma.staffUser.update({ where: { id: f.users.owner.id }, data: { pharmacistLicenceNo: null } });
    const drug = await seedDrug(t, f, { rxOnly: true });
    await receive(t, f, { drugId: drug.id });
    const rxId = await rxFor(drug.id);
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.owner.token)).send({ prescriptionId: rxId, items: [{ drugId: drug.id, quantity: 1 }] });
    const r = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(f.users.owner.token)).send({});
    assert.equal(r.body.code, "PHARMACIST_REQUIRED");
  });
});
