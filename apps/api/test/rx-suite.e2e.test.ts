import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signWebhook } from "@kiorex/contracts";
import { randomUUID } from "node:crypto";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Prescription suite: manual entry, prescribers, verification, partial fills, refills, transfers, labels", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });
  const ph = () => auth(f.users.pharmacist.token);
  const cash = () => auth(f.users.cashier.token);
  const owner = () => auth(f.users.owner.token);

  async function rxDrug(opts: { ingredient?: string; qty?: number; price?: string; controlled?: boolean } = {}) {
    const d = await seedDrug(t, f, { rxOnly: true, activeIngredient: opts.ingredient ?? `ing-${randomUUID().slice(0, 5)}`, price: opts.price ?? "20.00", controlledSchedule: opts.controlled ? "SCHEDULE_4" : "NONE" });
    await receive(t, f, { drugId: d.id, quantity: opts.qty ?? 100 });
    return d;
  }
  async function manualRx(drugId: string, body: object = {}) {
    const r = await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patient: { displayName: "Walk In", phone: "01012340000" }, prescriberName: "Dr. Samir", prescriberLicenceNo: `LIC-${randomUUID().slice(0, 6)}`, lines: [{ drugId, quantity: 4, directions: "1 tablet twice daily" }], ...body });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    return r.body as { id: string; status: string; lines: Array<{ id: string }>; patientId: string; prescriberId: string };
  }
  async function dispenseAll(rxId: string, drugId: string, qty: number, partialReason?: string) {
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rxId}/validate`).set(ph())).body.validated, true);
    const d = await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rxId, partialReason, items: [{ drugId, quantity: qty }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    assert.equal((await t.http.post(`/api/v1/dispensings/${d.body.id}/signoff`).set(ph()).send({})).status, 201);
    const done = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(cash()).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "1000.00" }] });
    assert.equal(done.status, 201, JSON.stringify(done.body));
    return d.body.id as string;
  }

  it("manual entry creates the customer (with a number) and grows the prescriber directory; the same phone reuses the customer", async () => {
    const d = await rxDrug();
    const a = await manualRx(d.id, { prescriberLicenceNo: "LIC-SAMIR-1" });
    assert.equal(a.status, "RECEIVED");
    const cust = await t.http.get(`/api/v1/customers/${a.patientId}`).set(owner());
    assert.match(cust.body.customerNo, /^CUS-/);
    const b = await manualRx(d.id, { prescriberLicenceNo: "LIC-SAMIR-1" });
    assert.equal(b.patientId, a.patientId, "phone match reuses the customer");
    assert.equal(b.prescriberId, a.prescriberId, "licence match reuses the prescriber");
    const list = await t.http.get("/api/v1/prescribers?q=samir").set(ph());
    assert.equal(list.body.items.find((p: { id: string }) => p.id === a.prescriberId).prescriptions, 2);
    const rx = await t.http.get(`/api/v1/prescriptions/${a.id}`).set(ph());
    assert.equal(rx.body.source, "MANUAL_ENTRY");
    // validation of the request
    assert.equal((await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ prescriberName: "x", lines: [{ drugId: d.id, quantity: 1 }] })).status, 400);
    assert.equal((await t.http.post("/api/v1/prescriptions/manual").set(ph()).send({ patientId: a.patientId, prescriberName: "Dr", issuedAt: new Date(Date.now() + 10 * 86_400_000).toISOString(), lines: [{ drugId: d.id, quantity: 1 }] })).body.code, "ISSUED_IN_FUTURE");
  });

  it("prescriber directory: create/update/verify (pharmacist), duplicate licence refused, cashier cannot verify", async () => {
    const c = await t.http.post("/api/v1/prescribers").set(ph()).send({ name: "Dr. Layla", licenceNo: "SYN-77", specialty: "cardiology", clinicName: "Heart Clinic" });
    assert.equal(c.status, 201);
    assert.equal((await t.http.post("/api/v1/prescribers").set(ph()).send({ name: "Dr. L2", licenceNo: "SYN-77" })).status, 409);
    assert.equal((await t.http.post(`/api/v1/prescribers/${c.body.id}/verify`).set(cash()).send({ verified: true })).status, 403);
    const v = await t.http.post(`/api/v1/prescribers/${c.body.id}/verify`).set(ph()).send({ verified: true });
    assert.equal(v.body.verified, true); assert.ok(v.body.verifiedBy);
    assert.equal((await t.http.patch(`/api/v1/prescribers/${c.body.id}`).set(ph()).send({ phone: "0222" })).body.phone, "0222");
    const d = await rxDrug();
    const rx = await manualRx(d.id, { prescriberId: c.body.id });
    const got = await t.http.get(`/api/v1/prescriptions/${rx.id}`).set(ph());
    assert.equal(got.body.prescriberLicenceNo, "SYN-77"); assert.equal(got.body.prescriberVerifiedBadge, true);
  });

  it("verification queue orders urgent first then oldest, and validated Rx leave it", async () => {
    const d = await rxDrug();
    const a = await manualRx(d.id), b = await manualRx(d.id, { priority: "URGENT" });
    const q = await t.http.get("/api/v1/prescriptions/verification-queue").set(ph());
    const ids = q.body.items.map((i: { id: string }) => i.id);
    assert.ok(ids.indexOf(b.id) < ids.indexOf(a.id), "urgent first");
    assert.ok(q.body.urgent >= 1);
    await t.http.patch(`/api/v1/prescriptions/${a.id}`).set(ph()).send({ priority: "URGENT", verificationNotes: "call doctor re dose" });
    await t.http.post(`/api/v1/prescriptions/${a.id}/validate`).set(ph());
    const q2 = await t.http.get("/api/v1/prescriptions/verification-queue").set(ph());
    assert.ok(!q2.body.items.some((i: { id: string }) => i.id === a.id));
    assert.equal((await t.http.patch(`/api/v1/prescriptions/${a.id}`).set(cash()).send({ priority: "NORMAL" })).status, 403, "assistants/cashiers cannot verify");
  });

  it("partial fill: dispense less, balance shows what is owed, second fill completes it; cannot exceed the prescribed quantity", async () => {
    const d = await rxDrug();
    const rx = await manualRx(d.id, { lines: [{ drugId: d.id, quantity: 10, directions: "1 daily" }] });
    await dispenseAll(rx.id, d.id, 4, "Only 4 in stock at the time");
    const bal = await t.http.get(`/api/v1/prescriptions/${rx.id}/balance`).set(ph());
    assert.equal(bal.body.status, "PARTIALLY_DISPENSED"); assert.equal(bal.body.owed, 6);
    const partial = await t.http.get("/api/v1/prescriptions/partial").set(ph());
    assert.ok(partial.body.some((p: { id: string; owed: number }) => p.id === rx.id && p.owed === 6));
    const over = await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rx.id, items: [{ drugId: d.id, quantity: 7 }] });
    assert.equal(over.body.code, "EXCEEDS_PRESCRIBED");
    await dispenseAll(rx.id, d.id, 6);
    assert.equal((await t.http.get(`/api/v1/prescriptions/${rx.id}/balance`).set(ph())).body.complete, true);
    const disp = await t.prisma.dispensing.findFirst({ where: { prescriptionId: rx.id }, orderBy: { createdAt: "asc" } });
    assert.equal(disp?.partialReason, "Only 4 in stock at the time");
  });

  it("refills: due date set on completion, too-early needs a reason, lines reset, limits and expiry enforced, controlled never refillable", async () => {
    const d = await rxDrug();
    const rx = await manualRx(d.id, { refillsAllowed: 2, refillIntervalDays: 28 });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(ph()).send({})).body.code, "REFILL_NOT_READY");
    await dispenseAll(rx.id, d.id, 4);
    const after1 = await t.prisma.prescription.findUniqueOrThrow({ where: { id: rx.id } });
    assert.equal(after1.status, "DISPENSED");
    assert.ok(after1.nextRefillDueAt && Math.abs(after1.nextRefillDueAt.getTime() - (Date.now() + 28 * 86_400_000)) < 120_000);
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(ph()).send({})).body.code, "REFILL_TOO_EARLY");
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(cash()).send({ earlyReason: "travelling" })).status, 403, "refill is a pharmacist action");
    const r1 = await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(ph()).send({ earlyReason: "Patient travelling abroad" });
    assert.equal(r1.status, 201, JSON.stringify(r1.body)); assert.equal(r1.body.remaining, 1);
    assert.equal((await t.prisma.prescriptionLine.findFirstOrThrow({ where: { prescriptionId: rx.id } })).qtyDispensed, 0);
    await dispenseAll(rx.id, d.id, 4); // refill #1 dispensed (status VALIDATED -> DISPENSED)
    await t.prisma.prescription.update({ where: { id: rx.id }, data: { nextRefillDueAt: new Date(Date.now() - 86_400_000) } });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(ph()).send({})).status, 201);
    await dispenseAll(rx.id, d.id, 4);
    await t.prisma.prescription.update({ where: { id: rx.id }, data: { nextRefillDueAt: new Date(Date.now() - 86_400_000) } });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/refill`).set(ph()).send({})).body.code, "NO_REFILLS_LEFT");
    assert.equal((await t.http.get(`/api/v1/prescriptions/${rx.id}/refills`).set(ph())).body.length, 2);
    // expiry of refill authority
    const old = await manualRx(d.id, { refillsAllowed: 1, issuedAt: new Date(Date.now() - 200 * 86_400_000).toISOString(), validDays: 365 });
    await dispenseAll(old.id, d.id, 4);
    await t.prisma.prescription.update({ where: { id: old.id }, data: { nextRefillDueAt: new Date(Date.now() - 86_400_000) } });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${old.id}/refill`).set(ph()).send({})).body.code, "REFILL_EXPIRED");
    // controlled
    const cd = await rxDrug({ controlled: true, qty: 20 });
    const crx = await manualRx(cd.id, { refillsAllowed: 1, lines: [{ drugId: cd.id, quantity: 1, directions: "1 at night" }], patient: { displayName: "Ctl Patient", phone: "01099990001" } });
    await t.prisma.prescription.update({ where: { id: crx.id }, data: { status: "DISPENSED" } });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${crx.id}/refill`).set(ph()).send({})).body.code, "REFILL_NOT_ALLOWED_CONTROLLED");
  });

  it("refill worklist + reminders: only customers who consented and have a phone, once per refill number, via the mock inbox", async () => {
    const d = await rxDrug();
    const a = await manualRx(d.id, { refillsAllowed: 1, patient: { displayName: "Consenting", phone: "01077770001" } });
    const b = await manualRx(d.id, { refillsAllowed: 1, patient: { displayName: "No Consent", phone: "01077770002" } });
    await dispenseAll(a.id, d.id, 4); await dispenseAll(b.id, d.id, 4);
    await t.prisma.prescription.updateMany({ where: { id: { in: [a.id, b.id] } }, data: { nextRefillDueAt: new Date(Date.now() + 2 * 86_400_000) } });
    await t.http.put(`/api/v1/customers/${a.patientId}/consent`).set(owner()).send({ dataProcessing: true, marketing: true });
    const due = await t.http.get("/api/v1/prescriptions/refills/due?days=7").set(ph());
    const mine = due.body.filter((x: { id: string }) => [a.id, b.id].includes(x.id));
    assert.equal(mine.length, 2);
    assert.equal(mine.find((x: { id: string }) => x.id === a.id).canRemind, true);
    assert.equal(mine.find((x: { id: string }) => x.id === b.id).canRemind, false);
    const run = await t.http.post("/api/v1/prescriptions/refills/reminders/run?days=7").set(ph());
    assert.equal(run.status, 201); assert.ok(run.body.sent >= 1);
    const inbox = await t.prisma.notification.findMany({ where: { orgId: f.orgId, template: "rx.refill_reminder" } });
    assert.equal(inbox.length, 1); assert.equal(inbox[0]!.recipient, "01077770001"); assert.match(inbox[0]!.body, /\d{4}-\d{2}-\d{2}/);
    assert.equal((await t.http.post("/api/v1/prescriptions/refills/reminders/run?days=7").set(ph())).body.sent, 0, "idempotent per refill number");
  });

  it("transfer out closes the Rx and prints a note; transfer in creates a TRANSFER_IN Rx for verification; controlled is refused both ways", async () => {
    const d = await rxDrug();
    const rx = await manualRx(d.id, { lines: [{ drugId: d.id, quantity: 6, directions: "daily" }] });
    await t.http.post(`/api/v1/prescriptions/${rx.id}/validate`).set(ph());
    assert.equal((await t.http.post(`/api/v1/prescriptions/${rx.id}/transfer-out`).set(cash()).send({ counterparty: { name: "Al Nour Pharmacy" } })).status, 403);
    const out = await t.http.post(`/api/v1/prescriptions/${rx.id}/transfer-out`).set(ph()).send({ counterparty: { name: "Al Nour Pharmacy", phone: "0233", pharmacist: "Ph. Amal" }, reason: "Out of stock" });
    assert.equal(out.status, 201, JSON.stringify(out.body));
    assert.equal((await t.prisma.prescription.findUniqueOrThrow({ where: { id: rx.id } })).status, "TRANSFERRED_OUT");
    assert.equal((await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rx.id, items: [{ drugId: d.id, quantity: 1 }] })).body.code, "RX_NOT_VALIDATED");
    const note = await t.http.get(`/api/v1/prescriptions/transfers/${out.body.id}/note.html?lang=en`).set(ph());
    assert.match(note.text, /Al Nour Pharmacy/); assert.match(note.text, /Prescription transfer note/);
    const inn = await t.http.post("/api/v1/prescriptions/transfer-in").set(ph()).send({ counterparty: { name: "City Pharmacy" }, originalRef: "CP-991", patient: { displayName: "Transfer Patient", phone: "01055551111" }, prescriberName: "Dr. Far", prescriberLicenceNo: "LIC-FAR", issuedAt: new Date(Date.now() - 3 * 86_400_000).toISOString(), lines: [{ drugId: d.id, quantity: 2, directions: "bid" }] });
    assert.equal(inn.status, 201, JSON.stringify(inn.body));
    assert.equal(inn.body.prescription.source, "TRANSFER_IN"); assert.equal(inn.body.prescription.status, "RECEIVED");
    const list = await t.http.get("/api/v1/prescriptions/transfers?direction=OUT").set(ph());
    assert.ok(list.body.items.some((x: { id: string }) => x.id === out.body.id));
    const cd = await rxDrug({ controlled: true, qty: 5 });
    const crx = await manualRx(cd.id, { lines: [{ drugId: cd.id, quantity: 1 }], patient: { displayName: "Ctl C", phone: "01011110000" } });
    assert.equal((await t.http.post(`/api/v1/prescriptions/${crx.id}/transfer-out`).set(ph()).send({ counterparty: { name: "X Pharmacy" } })).body.code, "TRANSFER_NOT_ALLOWED_CONTROLLED");
    assert.equal((await t.http.post("/api/v1/prescriptions/transfer-in").set(ph()).send({ counterparty: { name: "X Pharm" }, patient: { displayName: "Qq Patient" }, prescriberName: "Dr D", issuedAt: new Date().toISOString(), lines: [{ drugId: cd.id, quantity: 1 }] })).body.code, "TRANSFER_NOT_ALLOWED_CONTROLLED");
  });

  it("line substitutes list same-ingredient products with stock/price/saving; labels print after sign-off; counselling is recorded", async () => {
    const ing = `subst-${randomUUID().slice(0, 5)}`;
    const brand = await seedDrug(t, f, { rxOnly: true, activeIngredient: ing, price: "50.00", brandName: "Brand X" });
    const generic = await seedDrug(t, f, { rxOnly: true, activeIngredient: ing, price: "30.00", brandName: "Generic X" });
    await receive(t, f, { drugId: brand.id, quantity: 10 }); await receive(t, f, { drugId: generic.id, quantity: 10 });
    const rx = await manualRx(brand.id, { lines: [{ drugId: brand.id, quantity: 2, directions: "1 tab every 8 hours" }] });
    const subs = await t.http.get(`/api/v1/prescriptions/${rx.id}/lines/${rx.lines[0]!.id}/substitutes`).set(ph());
    assert.equal(subs.status, 200, JSON.stringify(subs.body));
    const g = subs.body.find((s: { drugId: string }) => s.drugId === generic.id);
    assert.equal(g.saving, "20.00"); assert.equal(g.available, 10);
    assert.ok(subs.body.find((s: { drugId: string }) => s.drugId === brand.id).isPrescribed);
    // labels: not before sign-off
    await t.http.post(`/api/v1/prescriptions/${rx.id}/validate`).set(ph());
    const disp = await t.http.post("/api/v1/dispensings").set(ph()).send({ prescriptionId: rx.id, items: [{ drugId: brand.id, quantity: 2 }] });
    const early = await t.http.get(`/api/v1/dispensings/${disp.body.id}/labels.html`).set(ph());
    assert.equal(early.status, 409); assert.match(early.text, /LABELS_NOT_READY/);
    assert.equal((await t.http.put(`/api/v1/dispensings/${disp.body.id}/counselling`).set(cash()).send({ notes: "take with food" })).status, 403);
    const co = await t.http.put(`/api/v1/dispensings/${disp.body.id}/counselling`).set(ph()).send({ notes: "Take with food; avoid alcohol", topics: ["food", "alcohol"] });
    assert.equal(co.body.counsellingNotes, "Take with food; avoid alcohol");
    await t.http.post(`/api/v1/dispensings/${disp.body.id}/signoff`).set(ph()).send({});
    const html = await t.http.get(`/api/v1/dispensings/${disp.body.id}/labels.html?lang=en`).set(ph());
    assert.equal(html.status, 200);
    assert.match(html.text, /Brand X/); assert.match(html.text, /1 tab every 8 hours/); assert.match(html.text, /<svg/); assert.match(html.text, /Take with food/);
    const ar = await t.http.get(`/api/v1/dispensings/${disp.body.id}/labels.html`).set(ph());
    assert.match(ar.text, /dir="rtl"/);
    const notes = await t.http.get(`/api/v1/customers/${rx.patientId}/notes`).set(owner());
    assert.ok(notes.body.some((n: { kind: string }) => n.kind === "COUNSELLING"));
  });

  it("standalone tenants get 403 STANDALONE_MODE on the Kiorex inbox and e-Rx webhook; integrated tenants keep working", async () => {
    const standalone = await seedTenant(t, { settings: { mode: "STANDALONE" } });
    const inbox = await t.http.get("/api/v1/kiorex-orders").set(auth(standalone.users.owner.token));
    assert.equal(inbox.status, 403); assert.equal(inbox.body.code, "STANDALONE_MODE");
    const me = await t.http.get("/api/v1/auth/me").set(auth(standalone.users.owner.token));
    assert.equal(me.body.tenant.mode, "STANDALONE"); assert.equal(me.body.flags["pharmacy.kiorex_orders"], false);
    const body = JSON.stringify({ eventId: `ev_${randomUUID()}`, type: "PrescriptionIssued" });
    const signed = signWebhook({ secret: standalone.client.webhookSecret, body, eventType: "PrescriptionIssued", eventId: "x", clientKey: standalone.client.key });
    assert.equal((await t.http.post("/api/v1/webhooks/kiorex").set(signed.headers).send(body)).body.code, "STANDALONE_MODE");
    assert.equal((await t.http.get("/api/v1/kiorex-orders").set(auth(f.users.owner.token))).status, 200);
    // everything else works with no integration at all
    assert.equal((await t.http.get("/api/v1/customers").set(auth(standalone.users.owner.token))).status, 200);
  });
});
