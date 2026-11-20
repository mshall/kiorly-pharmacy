import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signWebhook } from "@kiorex/contracts";
import { auth, bootApp, key, ledgerOnHand, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { randomUUID } from "node:crypto";

function eRx(overrides: { eventId?: string; consentToken?: string; items?: object[]; patientRef?: string } = {}) {
  const eventId = overrides.eventId ?? `ev_${randomUUID()}`;
  return {
    eventId, type: "PrescriptionIssued", aggregateType: "Prescription", aggregateId: `rx_${eventId}`, target: "KIOREX", occurredAt: new Date().toISOString(),
    data: {
      prescriptionId: `rx_${eventId}`, encounterId: "enc_1", clinicId: "clinic_1", patientRef: overrides.patientRef ?? "sub_patient_0001", prescriberId: "clin_01JF3Z7AAA",
      consentToken: overrides.consentToken ?? "ct_01JF3ZC111", issuedAt: new Date().toISOString(), items: overrides.items ?? [{ activeIngredient: "amoxicillin", strength: "500 mg", quantity: 1 }],
    },
  };
}

describe("e-Rx intake (KPRX01) and golden flow Rx -> dispense -> stock -> event", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });

  const post = (body: object, clientKey = f.client.key, secret = f.client.webhookSecret, tamper = false) => {
    const raw = JSON.stringify(body);
    const signed = signWebhook({ secret, body: raw, eventType: "PrescriptionIssued", eventId: (body as { eventId: string }).eventId, clientKey });
    return t.http.post("/api/v1/webhooks/kiorex").set({ ...signed.headers, "x-kiorex-branch-id": f.branchId }).send(tamper ? raw.replace("amoxicillin", "warfarin") : raw);
  };

  it("rejects bad signatures, unknown orgs; ignores unknown event types; requires consent (safety.pharmacy.consent_enforcement)", async () => {
    assert.equal((await post(eRx(), f.client.key, "wrong-secret")).status, 401);
    assert.equal((await post(eRx(), f.client.key, f.client.webhookSecret, true)).status, 401, "tampered body");
    assert.equal((await post(eRx(), "kc_unknown")).status, 401, "unknown client key (the key addresses the tenant)");
    const unknown = await post({ ...eRx(), type: "SomethingElse" });
    assert.equal(unknown.status, 200);
    assert.equal(unknown.body.ignored, true);
    const revoked = await post(eRx({ consentToken: "ct_revoked_1234" }));
    assert.equal(revoked.status, 422);
    assert.equal(revoked.body.code, "CONSENT_INVALID");
    const missing = await post(eRx({ consentToken: "" }));
    assert.ok([400, 422].includes(missing.status));
    assert.equal(await t.prisma.prescription.count({ where: { orgId: f.orgId } }), 0, "nothing stored without valid consent");
  });

  it("stores a consented e-Rx once (de-duplicated on eventId), consent token only as a hash", async () => {
    const body = eRx({ eventId: `ev_dup_${randomUUID()}` });
    const a = await post(body);
    assert.equal(a.status, 200, JSON.stringify(a.body));
    assert.equal(a.body.status, "created");
    const b = await post(body);
    assert.equal(b.body.duplicate, true);
    const rx = await t.prisma.prescription.findMany({ where: { orgId: f.orgId, sourceEventId: body.eventId }, include: { lines: true, patient: true } });
    assert.equal(rx.length, 1);
    assert.equal(rx[0]!.source, "KIORLY_E_RX");
    assert.equal(rx[0]!.consentTokenHash?.length, 64);
    assert.notEqual(rx[0]!.consentTokenHash, "ct_01JF3ZC111");
    assert.equal(rx[0]!.lines[0]!.activeIngredient, "amoxicillin");
    assert.equal(rx[0]!.prescriberVerifiedBadge, true);
  });

  it("golden flow: e-Rx -> validate -> dispense (FEFO reserve + 6 safety checks) -> pharmacist sign-off -> pay -> stock decrement -> sale", async () => {
    const drug = await seedDrug(t, f, { brandName: "Amoxil 500", activeIngredient: "amoxicillin", strength: "500 mg", dosageForm: "capsule", rxOnly: true, price: "80.00" });
    const early = await receive(t, f, { drugId: drug.id, quantity: 5, expiryDays: 90, lotNumber: "AMX-E" });
    const later = await receive(t, f, { drugId: drug.id, quantity: 50, expiryDays: 400, lotNumber: "AMX-L" });
    const ev = eRx({ eventId: `ev_golden_${randomUUID()}`, items: [{ activeIngredient: "amoxicillin", strength: "500 mg", quantity: 7, dose: "1 cap 3x daily" }], patientRef: "sub_golden" });
    const intake = await post(ev);
    const rxId = intake.body.prescriptionId as string;
    const v = await t.http.post(`/api/v1/prescriptions/${rxId}/validate`).set(auth(f.users.pharmacist.token));
    assert.equal(v.body.validated, true, JSON.stringify(v.body));
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: rxId, items: [{ drugId: drug.id, quantity: 7 }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    assert.deepEqual(d.body.lines.map((l: { lotId: string; quantity: number }) => [l.lotId, l.quantity]), [[early.id, 5], [later.id, 2]], "FEFO reservation across lots");
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: early.id } })).qtyReserved, 5);
    assert.equal(d.body.safetyChecks.length, 9);
    assert.ok(d.body.safetyChecks.every((c: { outcome: string }) => c.outcome === "PASS" || c.outcome === "WARN"));
    const so = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(auth(f.users.pharmacist.token)).send({ counsellingNotes: "Finish the course" });
    assert.equal(so.status, 201, JSON.stringify(so.body));
    const done = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "560.00" }] });
    assert.equal(done.status, 201, JSON.stringify(done.body));
    assert.equal(done.body.dispensing.status, "DISPENSED");
    assert.equal(done.body.sale.total, "560.00");
    assert.equal(done.body.sale.dispensingId, d.body.id);
    assert.equal(await ledgerOnHand(t.prisma, early.id), 0);
    assert.equal(await ledgerOnHand(t.prisma, later.id), 48);
    const lots = await t.prisma.stockLot.findMany({ where: { id: { in: [early.id, later.id] } } });
    assert.ok(lots.every((l) => l.qtyReserved === 0), "reservations released");
    assert.equal((await t.prisma.prescription.findUniqueOrThrow({ where: { id: rxId } })).status, "DISPENSED");
    const replay = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "560.00" }] });
    assert.equal(replay.body.replayed, true);
    assert.equal(await ledgerOnHand(t.prisma, later.id), 48, "no double decrement");
    const audit = await t.prisma.auditLog.findMany({ where: { orgId: f.orgId, entityId: d.body.id } });
    assert.deepEqual(audit.map((a) => a.action).sort(), ["dispense.complete", "dispense.create", "dispense.signoff"]);
    assert.equal(JSON.stringify(audit).includes("sub_golden"), false, "no patient identifiers in audit meta");
    // a non-Kiorex dispense does not emit a Kiorex event
    assert.equal(await t.prisma.outboxEvent.count({ where: { orgId: f.orgId } }), 0);
  });

  it("validation flags a paper Rx without prescriber licence; expired Rx cannot be validated", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true });
    const bad = await t.http.post("/api/v1/prescriptions/paper").set(auth(f.users.pharmacist.token)).send({ patient: { displayName: "A B" }, prescriberName: "Dr X", lines: [{ drugId: drug.id, quantity: 1 }] });
    const v = await t.http.post(`/api/v1/prescriptions/${bad.body.id}/validate`).set(auth(f.users.pharmacist.token));
    assert.equal(v.body.validated, false);
    assert.ok(v.body.issues.some((i: { code: string }) => i.code === "PRESCRIBER_MISSING"));
    const old = await t.http.post("/api/v1/prescriptions/paper").set(auth(f.users.pharmacist.token)).send({ patient: { displayName: "A B" }, prescriberName: "Dr X", prescriberLicenceNo: "L1", issuedAt: new Date(Date.now() - 90 * 86_400_000).toISOString(), lines: [{ drugId: drug.id, quantity: 1, directions: "x" }] });
    const v2 = await t.http.post(`/api/v1/prescriptions/${old.body.id}/validate`).set(auth(f.users.pharmacist.token));
    assert.ok(v2.body.issues.some((i: { code: string }) => i.code === "RX_EXPIRED"));
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: old.body.id, items: [{ drugId: drug.id, quantity: 1 }] });
    assert.equal(d.body.code, "RX_NOT_VALIDATED");
  });
});

describe("safety checks at dispensing (KPRX03/04)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); });
  after(async () => { await t.close(); });
  const pharm = () => auth(f.users.pharmacist.token);

  async function paperRx(drugIds: string[], allergies: string[] = [], patientName = "Pat Ient") {
    const r = await t.http.post("/api/v1/prescriptions/paper").set(pharm()).send({ patient: { displayName: patientName, allergies }, prescriberName: "Dr T", prescriberLicenceNo: "MD-9", lines: drugIds.map((id) => ({ drugId: id, quantity: 1, directions: "daily" })) });
    await t.http.post(`/api/v1/prescriptions/${r.body.id}/validate`).set(pharm());
    return r.body.id as string;
  }

  it("a drug-drug interaction (warfarin + ibuprofen) BLOCKS until a pharmacist overrides with a reason; override is attributed", async () => {
    const w = await seedDrug(t, f, { activeIngredient: "warfarin", strength: "5 mg", rxOnly: true });
    const i = await seedDrug(t, f, { activeIngredient: "ibuprofen", strength: "400 mg", rxOnly: true });
    await receive(t, f, { drugId: w.id }); await receive(t, f, { drugId: i.id });
    const rx = await paperRx([w.id, i.id]);
    const d = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: w.id, quantity: 1 }, { drugId: i.id, quantity: 1 }] });
    assert.equal(d.status, 201);
    const chk = d.body.safetyChecks.find((c: { kind: string }) => c.kind === "INTERACTION");
    assert.equal(chk.outcome, "BLOCK");
    assert.match(chk.detail, /warfarin \+ ibuprofen/);
    const blocked = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(pharm()).send({});
    assert.equal(blocked.body.code, "SAFETY_BLOCK_UNRESOLVED");
    const cashierTry = await t.http.post(`/api/v1/dispensings/${d.body.id}/override/${chk.id}`).set(auth(f.users.cashier.token)).send({ reason: "because" });
    assert.equal(cashierTry.status, 403);
    const ov = await t.http.post(`/api/v1/dispensings/${d.body.id}/override/${chk.id}`).set(pharm()).send({ reason: "Prescriber confirmed, INR monitored" });
    assert.equal(ov.status, 201, JSON.stringify(ov.body));
    const after_ = ov.body.safetyChecks.find((c: { kind: string }) => c.kind === "INTERACTION");
    assert.equal(after_.outcome, "OVERRIDDEN_BY_PHARMACIST");
    assert.equal(after_.overriddenBy, f.users.pharmacist.id);
    const so = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(pharm()).send({});
    assert.equal(so.status, 201);
  });

  it("allergy to the prescribed ingredient or its class BLOCKS (penicillin class covers amoxicillin)", async () => {
    const a = await seedDrug(t, f, { activeIngredient: "amoxicillin", strength: "250 mg", rxOnly: true });
    await receive(t, f, { drugId: a.id });
    const rx = await paperRx([a.id], ["penicillin"]);
    const d = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: a.id, quantity: 1 }] });
    assert.equal(d.body.safetyChecks.find((c: { kind: string }) => c.kind === "ALLERGY").outcome, "BLOCK");
    assert.equal(d.body.unresolvedBlocks, 1);
  });

  it("OTC counter dispensing is still checked and recorded; recently dispensed same ingredient raises a duplicate-therapy WARN", async () => {
    const o = await seedDrug(t, f, { activeIngredient: "paracetamol", strength: "500 mg", rxOnly: false });
    await receive(t, f, { drugId: o.id });
    const patient = (await t.prisma.patientRef.create({ data: { orgId: f.orgId, displayName: "Counter Customer" } }));
    const mk = async () => {
      const d = await t.http.post("/api/v1/dispensings").set(pharm()).send({ patientId: patient.id, items: [{ drugId: o.id, quantity: 1 }] });
      assert.equal(d.status, 201, JSON.stringify(d.body));
      await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(pharm()).send({});
      const c = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(pharm()).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "100.00" }] });
      assert.equal(c.status, 201, JSON.stringify(c.body));
      return d.body;
    };
    const first = await mk();
    assert.equal(first.safetyChecks.length, 9);
    const second = await t.http.post("/api/v1/dispensings").set(pharm()).send({ patientId: patient.id, items: [{ drugId: o.id, quantity: 1 }] });
    assert.equal(second.body.safetyChecks.find((c: { kind: string }) => c.kind === "DUPLICATE_THERAPY").outcome, "WARN");
  });

  it("substitution: same ingredient+strength+form only, pharmacist decision + patient consent recorded (KPRX04)", async () => {
    const brandA = await seedDrug(t, f, { brandName: "BrandA", activeIngredient: "cefixime", strength: "400 mg", dosageForm: "capsule", rxOnly: true });
    const generic = await seedDrug(t, f, { brandName: "GenericB", activeIngredient: "Cefixime", strength: "400mg", dosageForm: "Capsules", rxOnly: true });
    const other = await seedDrug(t, f, { brandName: "OtherC", activeIngredient: "cefixime", strength: "200 mg", dosageForm: "capsule", rxOnly: true });
    for (const d of [brandA, generic, other]) await receive(t, f, { drugId: d.id });
    const sub = await t.http.get(`/api/v1/catalogue/drugs/${brandA.id}/substitutes?branchId=${f.branchId}`).set(pharm());
    assert.deepEqual(sub.body.map((s: { brandName: string }) => s.brandName), ["GenericB"], "400 mg 'capsule' and '400mg Capsules' normalise to the same group; 200 mg does not");
    const rx = await paperRx([brandA.id]);
    const wrong = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: other.id, quantity: 1, substitution: { fromDrugId: brandA.id, consent: true } }] });
    assert.ok(["SUBSTITUTION_NOT_EQUIVALENT", "DRUG_NOT_PRESCRIBED"].includes(wrong.body.code), JSON.stringify(wrong.body));
    const noConsent = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: generic.id, quantity: 1, substitution: { fromDrugId: brandA.id, consent: false } }] });
    assert.equal(noConsent.body.code, "SUBSTITUTION_CONSENT_REQUIRED");
    const cashier = await t.http.post("/api/v1/dispensings").set(auth(f.users.cashier.token)).send({ prescriptionId: rx, items: [{ drugId: generic.id, quantity: 1, substitution: { fromDrugId: brandA.id, consent: true } }] });
    assert.equal(cashier.body.code, "SUBSTITUTION_REQUIRES_PHARMACIST");
    const ok = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: generic.id, quantity: 1, substitution: { fromDrugId: brandA.id, consent: true } }] });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    assert.equal(ok.body.lines[0].substitutedFromDrugId, brandA.id);
    assert.equal(ok.body.lines[0].substitutionConsent, true);
    assert.equal(ok.body.lines[0].substitutionDecidedBy, f.users.pharmacist.id);
  });

  it("a recall after reservation forces a re-pick before sign-off", async () => {
    const d1 = await seedDrug(t, f, { rxOnly: true, activeIngredient: "cefuroxime", strength: "500 mg" });
    const l1 = await receive(t, f, { drugId: d1.id, lotNumber: "REPICK-1", expiryDays: 60, quantity: 5 });
    await receive(t, f, { drugId: d1.id, lotNumber: "REPICK-2", expiryDays: 300, quantity: 5 });
    const rx = await paperRx([d1.id]);
    const d = await t.http.post("/api/v1/dispensings").set(pharm()).send({ prescriptionId: rx, items: [{ drugId: d1.id, quantity: 1 }] });
    assert.equal(d.body.lines[0].lotId, l1.id);
    await t.http.post("/api/v1/recalls").set(pharm()).send({ drugId: d1.id, lotNumbers: ["REPICK-1"], reason: "batch recall" });
    const so = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(pharm()).send({});
    assert.equal(so.body.code, "LOT_BLOCKED");
    const rp = await t.http.post(`/api/v1/dispensings/${d.body.id}/repick`).set(pharm());
    assert.equal(rp.status, 201, JSON.stringify(rp.body));
    assert.notEqual(rp.body.lines[0].lotId, l1.id);
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: l1.id } })).qtyReserved, 0);
    const so2 = await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(pharm()).send({});
    assert.equal(so2.status, 201, JSON.stringify(so2.body));
  });
});
