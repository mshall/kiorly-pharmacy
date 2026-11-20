import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Clinical safety (dose range, pregnancy/lactation, renal/hepatic, KB adapter) + controlled register", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });
  const ph = () => auth(f.users.pharmacist.token);
  const owner = () => auth(f.users.owner.token);

  async function scenario(o: { ingredient: string; strength?: string; directions: string; qty?: number; patient?: Record<string, unknown>; controlled?: boolean }) {
    const drug = await seedDrug(t, f, { rxOnly: true, activeIngredient: o.ingredient, strength: o.strength ?? "500 mg", price: "10.00", controlledSchedule: o.controlled ? "SCHEDULE_4" : "NONE" });
    await receive(t, f, { drugId: drug.id, quantity: 200 });
    const cust = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: `Pt ${randomUUID().slice(0, 5)}`, phone: `010${Math.floor(Math.random() * 1e8)}`, ...o.patient });
    assert.equal(cust.status, 201, JSON.stringify(cust.body));
    const rx = await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patientId: cust.body.id, prescriberName: "Dr Z", prescriberLicenceNo: `L-${randomUUID().slice(0, 6)}`, lines: [{ drugId: drug.id, quantity: o.qty ?? 10, directions: o.directions }] });
    assert.equal(rx.status, 201, JSON.stringify(rx.body));
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.body.id}/validate`).set(ph())).body.validated, true);
    const d = await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rx.body.id, items: [{ drugId: drug.id, quantity: o.qty ?? 10 }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    const chk = (k: string) => d.body.safetyChecks.find((c: { kind: string }) => c.kind === k) as { id: string; outcome: string; detail: string | null; overridable: boolean };
    return { d: d.body, chk, drug, rxId: rx.body.id as string };
  }

  it("every dispensing carries all 9 safety checks", async () => {
    const s = await scenario({ ingredient: "zz-clean", directions: "1 tablet twice daily" });
    assert.deepEqual(s.d.safetyChecks.map((c: { kind: string }) => c.kind).sort(), ["ALLERGY", "CONTROLLED_LIMIT", "DOSE_QUANTITY", "DOSE_RANGE", "DUPLICATE_THERAPY", "INTERACTION", "PREGNANCY_LACTATION", "PRESCRIBER", "RENAL_HEPATIC"]);
  });

  it("dose range: within range passes; over the daily maximum blocks but a pharmacist can override with a reason; far beyond is a hard stop", async () => {
    assert.equal((await scenario({ ingredient: "paracetamol", directions: "1 tablet three times daily" })).chk("DOSE_RANGE").outcome, "PASS");
    const over = await scenario({ ingredient: "paracetamol", directions: "2 tablets every 4 hours" }); // 2*500*6 = 6000 mg/day > 4000
    assert.equal(over.chk("DOSE_RANGE").outcome, "BLOCK"); assert.match(over.chk("DOSE_RANGE").detail!, /6000 mg\/day/); assert.equal(over.chk("DOSE_RANGE").overridable, true);
    const ov = await t.http.post(`/api/v1/dispensings/${over.d.id}/override/${over.chk("DOSE_RANGE").id}`).set(ph()).send({ reason: "Prescriber confirmed high dose for severe pain" });
    assert.equal(ov.status, 201, JSON.stringify(ov.body));
    const hard = await scenario({ ingredient: "paracetamol", directions: "5 tablets every 4 hours" }); // 15000 mg > 2x
    assert.equal(hard.chk("DOSE_RANGE").overridable, false);
    const r = await t.http.post(`/api/v1/dispensings/${hard.d.id}/override/${hard.chk("DOSE_RANGE").id}`).set(ph()).send({ reason: "no way" });
    assert.equal(r.body.code, "NOT_OVERRIDABLE");
    // unparseable sig: the check cannot guess, it passes without a verdict
    assert.equal((await scenario({ ingredient: "paracetamol", directions: "as the doctor said" })).chk("DOSE_RANGE").outcome, "PASS");
    // single-dose warning
    const single = await scenario({ ingredient: "paracetamol", directions: "3 tablets twice daily" }); // 1500 mg per dose, 3000/day
    assert.equal(single.chk("DOSE_RANGE").outcome, "WARN");
  });

  it("paediatric dose uses mg/kg (needs weight); missing weight warns", async () => {
    const dob = new Date(Date.now() - 5 * 365 * 86_400_000).toISOString().slice(0, 10);
    const over = await scenario({ ingredient: "amoxicillin", directions: "1 capsule three times daily", patient: { dateOfBirth: dob, weightKg: "10" } }); // 1500/10 = 150 > 90
    assert.equal(over.chk("DOSE_RANGE").outcome, "BLOCK"); assert.match(over.chk("DOSE_RANGE").detail!, /mg\/kg\/day/);
    assert.equal((await scenario({ ingredient: "amoxicillin", directions: "1 capsule three times daily", patient: { dateOfBirth: dob, weightKg: "30" } })).chk("DOSE_RANGE").outcome, "PASS"); // 50 mg/kg
    assert.equal((await scenario({ ingredient: "amoxicillin", directions: "1 capsule three times daily", patient: { dateOfBirth: dob } })).chk("DOSE_RANGE").outcome, "WARN");
  });

  it("pregnancy: category X is a hard stop, D blocks (overridable), C warns; lactation maps severity", async () => {
    const x = await scenario({ ingredient: "atorvastatin", strength: "20 mg", directions: "1 tablet at night", patient: { pregnant: true } });
    assert.equal(x.chk("PREGNANCY_LACTATION").outcome, "BLOCK"); assert.equal(x.chk("PREGNANCY_LACTATION").overridable, false);
    assert.equal((await t.http.post(`/api/v1/dispensings/${x.d.id}/override/${x.chk("PREGNANCY_LACTATION").id}`).set(ph()).send({ reason: "please let me" })).body.code, "NOT_OVERRIDABLE");
    const dd = await scenario({ ingredient: "doxycycline", strength: "100 mg", directions: "1 capsule twice daily", patient: { pregnant: true } });
    assert.equal(dd.chk("PREGNANCY_LACTATION").outcome, "BLOCK"); assert.equal(dd.chk("PREGNANCY_LACTATION").overridable, true);
    assert.equal((await scenario({ ingredient: "ibuprofen", strength: "400 mg", directions: "1 tablet twice daily", patient: { pregnant: true } })).chk("PREGNANCY_LACTATION").outcome, "WARN");
    assert.equal((await scenario({ ingredient: "amoxicillin", directions: "1 capsule three times daily", patient: { pregnant: true } })).chk("PREGNANCY_LACTATION").outcome, "PASS");
    assert.equal((await scenario({ ingredient: "methotrexate", strength: "2.5 mg", directions: "weekly", patient: { lactating: true } })).chk("PREGNANCY_LACTATION").overridable, false);
    assert.equal((await scenario({ ingredient: "diazepam", strength: "5 mg", directions: "1 tablet at night", patient: { lactating: true } })).chk("PREGNANCY_LACTATION").outcome, "WARN");
    assert.equal((await scenario({ ingredient: "atorvastatin", strength: "20 mg", directions: "1 tablet at night" })).chk("PREGNANCY_LACTATION").outcome, "PASS", "no pregnancy flag, no finding");
  });

  it("renal / hepatic impairment flags drive the check", async () => {
    const r = await scenario({ ingredient: "ibuprofen", strength: "400 mg", directions: "1 tablet twice daily", patient: { renalImpairment: true } });
    assert.equal(r.chk("RENAL_HEPATIC").outcome, "BLOCK"); assert.match(r.chk("RENAL_HEPATIC").detail!, /kidney/);
    assert.equal((await scenario({ ingredient: "enalapril", strength: "10 mg", directions: "1 tablet daily", patient: { renalImpairment: true } })).chk("RENAL_HEPATIC").outcome, "WARN");
    assert.equal((await scenario({ ingredient: "paracetamol", directions: "1 tablet three times daily", patient: { hepaticImpairment: true } })).chk("RENAL_HEPATIC").outcome, "WARN");
    assert.equal((await scenario({ ingredient: "atorvastatin", strength: "20 mg", directions: "1 tablet at night", patient: { hepaticImpairment: true } })).chk("RENAL_HEPATIC").outcome, "BLOCK");
    assert.equal((await scenario({ ingredient: "ibuprofen", strength: "400 mg", directions: "1 tablet twice daily" })).chk("RENAL_HEPATIC").outcome, "PASS");
  });

  it("pluggable KB: a tenant rule changes the verdict for that tenant only; only the owner (safety.kb.manage) edits; global/built-in rows are listed", async () => {
    const ing = `zz-${randomUUID().slice(0, 5)}`;
    assert.equal((await t.http.post("/api/v1/clinical/kb").set(ph()).send({ kind: "DOSE_RANGE", ingredient: ing, maxDailyMg: "100", note: "tenant limit" })).status, 403);
    const add = await t.http.post("/api/v1/clinical/kb").set(owner()).send({ kind: "DOSE_RANGE", ingredient: ing, maxDailyMg: "100", note: "tenant limit" });
    assert.equal(add.status, 201, JSON.stringify(add.body));
    const s = await scenario({ ingredient: ing, strength: "50 mg", directions: "1 tablet three times daily" }); // 150 > 100
    assert.equal(s.chk("DOSE_RANGE").outcome, "BLOCK");
    await t.http.delete(`/api/v1/clinical/kb/${add.body.id}`).set(owner());
    assert.equal((await scenario({ ingredient: ing, strength: "50 mg", directions: "1 tablet three times daily" })).chk("DOSE_RANGE").outcome, "PASS");
    const other = await seedTenant(t);
    await t.http.post("/api/v1/clinical/kb").set(auth(other.users.owner.token)).send({ kind: "INTERACTION", ingredient: "zz-a", ingredientB: "zz-b", severity: "MAJOR", note: "other tenant only" });
    const kb = await t.http.get("/api/v1/clinical/kb?kind=INTERACTION").set(ph());
    assert.equal(kb.body.mode, "local"); assert.ok(kb.body.rules.some((r: { scope: string }) => r.scope === "BUILT_IN"));
    assert.ok(!kb.body.rules.some((r: { note: string }) => r.note === "other tenant only"), "tenant rules never leak");
    assert.equal((await t.http.post("/api/v1/clinical/kb").set(owner()).send({ kind: "INTERACTION", ingredient: "a", note: "x1x" })).status, 400);
  });

  it("override review lists who overrode what and why", async () => {
    const o = await scenario({ ingredient: "paracetamol", directions: "2 tablets every 4 hours" });
    await t.http.post(`/api/v1/dispensings/${o.d.id}/override/${o.chk("DOSE_RANGE").id}`).set(ph()).send({ reason: "Documented palliative dose" });
    const list = await t.http.get("/api/v1/clinical/overrides").set(owner());
    const mine = list.body.items.find((i: { dispensingId: string }) => i.dispensingId === o.d.id);
    assert.equal(mine.reason, "Documented palliative dose"); assert.equal(mine.kind, "DOSE_RANGE"); assert.ok(mine.pharmacist.displayName);
    assert.equal((await t.http.get("/api/v1/clinical/overrides").set(auth(f.users.cashier.token))).status, 403);
  });

  it("controlled register: receipts and dispensing carry a running balance; witness required for adjustments; audits create discrepancies; resolution corrects the register", async () => {
    const drug = await seedDrug(t, f, { rxOnly: true, controlledSchedule: "SCHEDULE_3", activeIngredient: "zz-ctl", price: "30.00" });
    const lot = await receive(t, f, { drugId: drug.id, quantity: 40, lotNumber: "CTL-1" });
    // dispense 3
    const cust = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Control Patient", phone: "01022223333" });
    const rx = await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patientId: cust.body.id, prescriberName: "Dr C", prescriberLicenceNo: "LIC-C1", lines: [{ drugId: drug.id, quantity: 3, directions: "1 at night" }] });
    await t.http.post(`/api/v1/prescriptions/${rx.body.id}/validate`).set(ph());
    const d = await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rx.body.id, items: [{ drugId: drug.id, quantity: 3 }] });
    await t.http.post(`/api/v1/dispensings/${d.body.id}/controlled-id`).set(ph()).send({ nationalId: "29801011234567", patientName: "Control Patient" });
    await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(ph()).send({});
    assert.equal((await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(ph()).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "90.00" }] })).status, 201);

    const reg = await t.http.get(`/api/v1/controlled/register?drugId=${drug.id}`).set(ph());
    assert.equal(reg.status, 200, JSON.stringify(reg.body));
    const rows = [...reg.body.items].reverse(); // oldest first
    assert.deepEqual(rows.map((r: { kind: string; qtyDelta: number; balanceAfter: number }) => [r.kind, r.qtyDelta, r.balanceAfter]), [["RECEIPT", 40, 40], ["DISPENSE", -3, 37]]);
    assert.equal(rows[1].patientIdLast4, "4567"); assert.equal(rows[1].patientName, "Control Patient"); assert.equal(rows[1].prescriberLicenceNo, "LIC-C1");
    assert.equal((await t.http.get("/api/v1/controlled/register").set(auth(f.users.cashier.token))).status, 403);

    // adjustments of controlled stock need a witness (a different person with valid credentials)
    const noW = await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: -2, reason: "Broken ampoule" });
    assert.equal(noW.status, 409); assert.equal(noW.body.code, "WITNESS_REQUIRED");
    const self = await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: -2, reason: "Broken ampoule", witness: { email: f.users.pharmacist.email, password: "Passw0rd!x" } });
    assert.equal(self.body.code, "WITNESS_SAME_PERSON");
    const bad = await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: -2, reason: "Broken ampoule", witness: { email: f.users.manager.email, password: "wrong-pass" } });
    assert.equal(bad.body.code, "WITNESS_DENIED");
    const ok = await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: lot.id, quantity: -2, reason: "Broken ampoule", reasonCode: "DAMAGE", witness: { email: f.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(ok.status, 201, JSON.stringify(ok.body));
    const reg2 = await t.http.get(`/api/v1/controlled/register?drugId=${drug.id}&pageSize=1`).set(ph());
    assert.equal(reg2.body.items[0].kind, "ADJUSTMENT"); assert.equal(reg2.body.items[0].balanceAfter, 35); assert.ok(reg2.body.items[0].witnessName);
    // non-controlled adjustments never need a witness
    const plain = await seedDrug(t, f, {}); const pl = await receive(t, f, { drugId: plain.id, quantity: 10 });
    assert.equal((await t.http.post("/api/v1/inventory/adjustments").set(ph()).send({ lotId: pl.id, quantity: -1, reason: "sample" })).status, 201);

    const bal = await t.http.get("/api/v1/controlled/balances").set(ph());
    const b = bal.body.find((x: { drugId: string }) => x.drugId === drug.id);
    assert.equal(b.onHand, 35); assert.equal(b.registerBalance, 35); assert.equal(b.inSync, true);

    // physical audit: counted 33 vs register 35 -> discrepancy; counted 35 -> match
    const w = { email: f.users.manager.email, password: "Passw0rd!x" };
    assert.equal((await t.http.post("/api/v1/controlled/audits").set(ph()).send({ drugId: drug.id, countedQty: 35, witness: w })).body.match, true);
    const au = await t.http.post("/api/v1/controlled/audits").set(ph()).send({ drugId: drug.id, countedQty: 33, notes: "1 blister missing", witness: w });
    assert.equal(au.body.match, false); assert.equal(au.body.difference, -2); assert.equal(au.body.discrepancy.status, "OPEN");
    assert.equal((await t.http.post("/api/v1/controlled/audits").set(auth(f.users.cashier.token)).send({ drugId: drug.id, countedQty: 1, witness: w })).status, 403);
    const open = await t.http.get("/api/v1/controlled/discrepancies?status=OPEN").set(ph());
    assert.ok(open.body.some((x: { id: string }) => x.id === au.body.discrepancy.id));
    const res = await t.http.post(`/api/v1/controlled/discrepancies/${au.body.discrepancy.id}/resolve`).set(ph()).send({ resolution: "Recount confirmed 2 units lost; incident filed", adjustLotId: lot.id, witness: w });
    assert.equal(res.status, 201, JSON.stringify(res.body)); assert.equal(res.body.status, "RESOLVED");
    assert.equal((await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } })).qtyOnHand, 33);
    assert.equal((await t.http.post(`/api/v1/controlled/discrepancies/${au.body.discrepancy.id}/resolve`).set(ph()).send({ resolution: "again again" })).body.code, "ALREADY_RESOLVED");
    assert.equal((await t.http.post("/api/v1/controlled/audits").set(ph()).send({ drugId: plain.id, countedQty: 9, witness: w })).body.code, "NOT_CONTROLLED");
  });
});
