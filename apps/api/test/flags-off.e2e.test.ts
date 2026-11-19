import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { signKiorlyRequest, signWebhook } from "@kiorex/contracts";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { FLAG_DEFINITIONS } from "../src/feature-flags/feature-flag-keys";
import { SafetyControlNotAFlagError, SAFETY_CONTROL_IDS } from "../src/feature-flags/safety-controls";
import type { FlagSnapshot } from "../src/feature-flags/flag-snapshot";

const snap = (flags: Array<{ key: string; values: object }>): FlagSnapshot => ({ product: "kiorly-pharmacy", version: Date.now(), generatedAt: new Date().toISOString(), flags: flags.map((f) => ({ class: "Module", scopes: ["global", "market", "org"], dependsOn: [], launchLocked: false, gateSatisfied: false, ...f })) as never });

describe("per-flag OFF contract (PH-OFF01..04): 403 FEATURE_DISABLED {key, scope}, data never hidden", () => {
  let t: TestApp, f: Fixture, other: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); other = await seedTenant(t); });
  after(async () => { t.flags.setSnapshot(null); await t.close(); });
  const off = (...flags: Array<{ key: string; values: object }>) => t.flags.setSnapshot(snap(flags));
  const reset = () => t.flags.setSnapshot(null);

  const machine = (path: string, orgId: string, method: "GET" | "POST" = "GET") => {
    const s = signKiorlyRequest({ clientKey: "kx_dev_client", clientSecret: "kx_dev_secret_change_me", method, path, body: "" });
    return (method === "GET" ? t.http.get(path) : t.http.post(path)).set({ ...s.headers, "x-kiorex-org-id": orgId });
  };

  it("PH-OFF01 pharmacy.module OFF: no new sign-ups, no new e-Rx intake; dependents report scope=dependency; existing data stays readable", async () => {
    const drug = await seedDrug(t, f);
    off({ key: "pharmacy.module", values: { global: "OFF" } });
    const signup = await t.http.post("/api/v1/onboarding/signup").send({ pharmacyName: "New Pharmacy", ownerName: "Owner", email: `new.${Date.now()}@test.local`, password: "Passw0rd!x" });
    assert.equal(signup.status, 403);
    assert.deepEqual({ code: signup.body.code, key: signup.body.key, scope: signup.body.scope }, { code: "FEATURE_DISABLED", key: "pharmacy.module", scope: "global" });
    const body = JSON.stringify({ eventId: "e1", type: "PrescriptionIssued" });
    const signed = signWebhook({ secret: "kx_dev_webhook_secret", body });
    const wh = await t.http.post("/api/v1/webhooks/kiorex").set({ ...signed.headers, "x-kiorex-org-id": f.externalOrgId }).send(body);
    assert.equal(wh.body.code, "FEATURE_DISABLED");
    const dep = await t.http.get("/api/v1/kiorex-orders").set(auth(f.users.pharmacist.token));
    assert.equal(dep.status, 403);
    assert.equal(dep.body.scope, "dependency");
    // OFF never hides data
    assert.equal((await t.http.get(`/api/v1/catalogue/drugs/${drug.id}`).set(auth(f.users.pharmacist.token))).status, 200);
    assert.equal((await t.http.get("/api/v1/dashboard").set(auth(f.users.manager.token))).status, 200);
    const eff = await t.http.get("/api/v1/feature-flags/effective").set(auth(f.users.owner.token));
    assert.equal(eff.body["pharmacy.module"].enabled, false);
    reset();
    assert.equal((await t.http.post("/api/v1/onboarding/signup").send({ pharmacyName: "New Pharmacy", ownerName: "Owner", email: `new2.${Date.now()}@test.local`, password: "Passw0rd!x" })).status, 201);
  });

  it("PH-OFF02 pharmacy.kiorex_orders OFF at org scope: inbox + machine API 403 for that org only; stock not exposed; settings readable data intact", async () => {
    await t.http.put(`/api/v1/kiorex-orders/settings/${f.branchId}`).set(auth(f.users.owner.token)).send({ optedIn: true });
    await t.http.put(`/api/v1/kiorex-orders/settings/${other.branchId}`).set(auth(other.users.owner.token)).send({ optedIn: true });
    off({ key: "pharmacy.kiorex_orders", values: { orgs: { [f.orgId]: "OFF" } } });
    const inbox = await t.http.get("/api/v1/kiorex-orders").set(auth(f.users.pharmacist.token));
    assert.deepEqual({ s: inbox.status, code: inbox.body.code, key: inbox.body.key, scope: inbox.body.scope }, { s: 403, code: "FEATURE_DISABLED", key: "pharmacy.kiorex_orders", scope: "org" });
    const av = await machine("/marketplace/v1/availability", f.externalOrgId);
    assert.equal(av.status, 403);
    assert.equal(av.body.scope, "org");
    assert.equal((await machine("/marketplace/v1/availability", other.externalOrgId)).status, 200, "other tenants unaffected");
    assert.equal(await t.prisma.branchMarketplaceSetting.count({ where: { orgId: f.orgId } }), 1, "data not deleted");
    off({ key: "pharmacy.kiorex_orders", values: { markets: { EG: "OFF" } } });
    assert.equal((await t.http.get("/api/v1/kiorex-orders").set(auth(other.users.pharmacist.token))).body.scope, "market");
    // the dispensing safety path is not affected by the flag
    const dash = await t.http.get("/api/v1/dashboard").set(auth(f.users.pharmacist.token));
    assert.equal(dash.body.kiorexOrdersPending, null, "dashboard hides the inbox tile, not data");
    reset();
  });

  it("PH-OFF03 pharmacy.forecasting OFF: 403 on forecast endpoints; reorder falls back to min/max; ON switches suggestions to FORECAST", async () => {
    const drug = await seedDrug(t, f);
    await receive(t, f, { drugId: drug.id, quantity: 2 });
    await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f.branchId}`).set(auth(f.users.owner.token)).send({ drugId: drug.id, minQty: 5, maxQty: 10 });
    off({ key: "pharmacy.forecasting", values: { global: "OFF" } });
    const fc = await t.http.get(`/api/v1/forecasting/demand?branchId=${f.branchId}`).set(auth(f.users.owner.token));
    assert.deepEqual({ s: fc.status, code: fc.body.code, key: fc.body.key, scope: fc.body.scope }, { s: 403, code: "FEATURE_DISABLED", key: "pharmacy.forecasting", scope: "global" });
    const sug = await t.http.get(`/api/v1/reorder/suggestions?branchId=${f.branchId}`).set(auth(f.users.owner.token));
    assert.equal(sug.body.method, "MIN_MAX");
    assert.equal(sug.body.items.find((i: { drugId: string }) => i.drugId === drug.id).suggestedQty, 8);
    reset();
    const on = await t.http.get(`/api/v1/forecasting/demand?branchId=${f.branchId}`).set(auth(f.users.owner.token));
    assert.equal(on.status, 200);
    const sug2 = await t.http.get(`/api/v1/reorder/suggestions?branchId=${f.branchId}`).set(auth(f.users.owner.token));
    assert.equal(sug2.body.method, "FORECAST");
    assert.ok(sug2.body.items.find((i: { drugId: string }) => i.drugId === drug.id).suggestedQty >= 8, "forecast never lowers the min/max floor");
  });

  it("PH-OFF04 pharmacy.insurer_claims OFF: claims 403, cash/self-pay sales unaffected", async () => {
    const drug = await seedDrug(t, f, { price: "10.00" });
    await receive(t, f, { drugId: drug.id });
    await openShift(t, f);
    const noAddOn = await t.http.post("/api/v1/claims").set(auth(f.users.owner.token)).send({ branchId: f.branchId, insurerName: "X Ins", memberRef: "M-0", amountClaimed: "1.00" });
    assert.equal(noAddOn.status, 402, "Pro needs the insurer-claims add-on");
    await t.prisma.tenant.update({ where: { id: f.orgId }, data: { settings: { ownerPhone: "+201000000000", addOns: ["insurer_claims"] } } });
    const claim = await t.http.post("/api/v1/claims").set(auth(f.users.owner.token)).send({ branchId: f.branchId, insurerName: "Misr Insurance", memberRef: "M-1", amountClaimed: "100.00" });
    assert.equal(claim.status, 201, JSON.stringify(claim.body));
    off({ key: "pharmacy.insurer_claims", values: { global: "OFF" } });
    const list = await t.http.get("/api/v1/claims").set(auth(f.users.owner.token));
    assert.deepEqual({ s: list.status, code: list.body.code, key: list.body.key }, { s: 403, code: "FEATURE_DISABLED", key: "pharmacy.insurer_claims" });
    const sale = await t.http.post("/api/v1/pos/sales").set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "CASH", amount: "10.00" }] });
    assert.equal(sale.status, 201);
    assert.equal(await t.prisma.insurerClaim.count({ where: { orgId: f.orgId } }), 1, "claims data kept");
    reset();
    const ok = await t.http.get("/api/v1/claims").set(auth(f.users.owner.token));
    assert.equal(ok.status, 200);
    const tr = await t.http.post(`/api/v1/claims/${claim.body.id}/transition`).set(auth(f.users.owner.token)).send({ status: "APPROVED" });
    assert.equal(tr.body.code, "BAD_TRANSITION");
    assert.equal((await t.http.post(`/api/v1/claims/${claim.body.id}/transition`).set(auth(f.users.owner.token)).send({ status: "SUBMITTED" })).status, 201);
  });

  it("plan entitlement (402) is separate from flags (403): Lite has no purchasing/forecasting/claims", async () => {
    const lite = await seedTenant(t, { edition: "LITE" });
    for (const path of [`/api/v1/purchase-orders`, `/api/v1/forecasting/demand`, `/api/v1/claims`]) {
      const r = await t.http.get(path).set(auth(lite.users.owner.token));
      assert.equal(r.status, 402, path);
      assert.equal(r.body.code, "ENTITLEMENT_REQUIRED");
    }
    // ... but every safety control works on Lite (P5)
    const drug = await seedDrug(t, lite, { rxOnly: true });
    await receive(t, lite, { drugId: drug.id });
    assert.equal((await t.http.post("/api/v1/recalls").set(auth(lite.users.pharmacist.token)).send({ drugId: drug.id, lotNumbers: ["X1"], reason: "lite recall" })).status, 201);
    assert.equal((await t.http.get("/api/v1/claims").set(auth(f.users.owner.token))).status, 200, "Pro + add-on");
  });
});

describe("safety controls are never flags (PH-SS04 / ADR-025)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { t.flags.setSnapshot(null); await t.close(); });

  it("a snapshot that tries to switch a safety control OFF has no effect; evaluating a safety key throws", async () => {
    for (const id of SAFETY_CONTROL_IDS) assert.throws(() => t.flags.evaluate(id), SafetyControlNotAFlagError);
    t.flags.setSnapshot(snap([...SAFETY_CONTROL_IDS.map((k) => ({ key: k, values: { global: "OFF" } })), ...FLAG_DEFINITIONS.map((d) => ({ key: d.key, values: { global: "OFF" } }))]));
    // ALL four product flags AND every safety control "OFF": stop-ship behaviour is unchanged
    const drug = await seedDrug(t, f, { rxOnly: true });
    const lot = await receive(t, f, { drugId: drug.id, expiryDays: 20 });
    await t.prisma.$executeRaw`UPDATE "StockLot" SET "expiryDate" = kx_today() - 1 WHERE id = ${lot.id}`;
    const otc = await seedDrug(t, f);
    const otcLot = await receive(t, f, { drugId: otc.id, expiryDays: 20 });
    await t.prisma.$executeRaw`UPDATE "StockLot" SET "expiryDate" = kx_today() - 1 WHERE id = ${otcLot.id}`;
    const sale = await t.http.post("/api/v1/pos/sales").set(auth(f.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: otc.id, quantity: 1, lotId: otcLot.id }], payments: [{ method: "CASH", amount: "100.00" }] });
    assert.equal(sale.body.code, "LOT_BLOCKED");
    const rx = await t.http.post("/api/v1/prescriptions/paper").set(auth(f.users.pharmacist.token)).send({ patient: { displayName: "Pat" }, prescriberName: "Dr", prescriberLicenceNo: "L", lines: [{ drugId: drug.id, quantity: 1, directions: "x" }] });
    await t.http.post(`/api/v1/prescriptions/${rx.body.id}/validate`).set(auth(f.users.pharmacist.token));
    const fresh = await receive(t, f, { drugId: drug.id, lotNumber: "FRESH", expiryDays: 200 });
    const d = await t.http.post("/api/v1/dispensings").set(auth(f.users.pharmacist.token)).send({ prescriptionId: rx.body.id, items: [{ drugId: drug.id, quantity: 1 }] });
    assert.equal(d.status, 201, JSON.stringify(d.body));
    assert.equal(d.body.lines[0].lotId, fresh.id, "expired lot skipped by FEFO");
    assert.equal(d.body.safetyChecks.length, 6, "safety checks still run");
    const early = await t.http.post(`/api/v1/dispensings/${d.body.id}/complete`).set(auth(f.users.pharmacist.token)).send({ idempotencyKey: key(), payments: [{ method: "CASH", amount: "100.00" }] });
    assert.equal(early.body.code, "SIGNOFF_REQUIRED", "sign-off cannot be skipped");
  });
});
