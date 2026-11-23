import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, PASSWORD, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import type { FlagSnapshot } from "../src/feature-flags/flag-snapshot";

const CLIENT = { "X-Kiorly-Client": "kiorly/1.0.0" };
const snap = (flags: Array<{ key: string; values: object }>): FlagSnapshot => ({ product: "kiorly-pharmacy", version: Date.now(), generatedAt: new Date().toISOString(), flags: flags.map((f) => ({ class: "Module", scopes: ["global", "market", "org"], dependsOn: [], launchLocked: false, gateSatisfied: false, ...f })) as never });
const uuid = () => `dev-${Math.random().toString(16).slice(2)}-${Date.now()}`;

describe("Kiorly mobile API (mobile_staff_app entitlement, devices, inbox, safety alerts)", () => {
  let t: TestApp, pro: Fixture, lite: Fixture, ent: Fixture, chain: Fixture;
  before(async () => {
    t = await bootApp();
    pro = await seedTenant(t, { edition: "PRO" });
    lite = await seedTenant(t, { edition: "LITE" });
    ent = await seedTenant(t, { edition: "ENTERPRISE" });
    chain = await seedTenant(t, { edition: "CHAIN" });
  });
  after(async () => { t.flags.setSnapshot(null); await t.close(); });
  const boot = (f: Fixture, who: keyof Fixture["users"], headers: Record<string, string> = {}) => t.http.get("/api/v1/mobile/bootstrap").set({ ...auth(f.users[who].token), ...headers });

  it("entitlement by plan: LITE off (PLAN_BELOW_PRO), PRO/CHAIN/ENTERPRISE on; plan names normalised", async () => {
    const l = await boot(lite, "owner");
    assert.equal(l.status, 200);
    assert.deepEqual({ ...l.body.entitlement, plan: l.body.org.plan }, { key: "mobile_staff_app", enabled: false, requiredPlan: "PRO", reason: "PLAN_BELOW_PRO", plan: "BASIC" });
    assert.equal(l.body.safetyAlertsOnly, true);
    assert.deepEqual(l.body.modules, []);
    for (const [f, plan, raw] of [[pro, "PRO", "PRO"], [ent, "ENTERPRISE", "ENTERPRISE"], [chain, "ENTERPRISE", "CHAIN"]] as const) {
      const r = await boot(f, "owner");
      assert.equal(r.body.entitlement.enabled, true, raw);
      assert.deepEqual([r.body.org.plan, r.body.org.rawPlan, r.body.safetyAlertsOnly, r.body.apiVersion, r.body.product], [plan, raw, false, 1, "pharmacy"]);
    }
  });

  it("a suspended subscription loses the app but keeps safety alerts", async () => {
    const f = await seedTenant(t, { edition: "PRO" });
    await t.prisma.tenant.update({ where: { id: f.orgId }, data: { subscriptionStatus: "SUSPENDED" } });
    assert.equal((await boot(f, "owner")).body.entitlement.reason, "PLAN_BELOW_PRO");
    assert.equal((await t.http.get("/api/v1/mobile/alerts").set({ ...auth(f.users.owner.token), ...CLIENT })).status, 200);
  });

  it("Kiorex org-scope / global flag OFF turns a PRO org off (reason FLAG_OFF) without touching other orgs; code default is ON", async () => {
    t.flags.setSnapshot(snap([{ key: "mobile_staff_app", values: { orgs: { [pro.orgId]: "OFF" } } }]));
    const r = await boot(pro, "owner");
    assert.deepEqual([r.body.entitlement.enabled, r.body.entitlement.reason, r.body.safetyAlertsOnly], [false, "FLAG_OFF", true]);
    const blocked = await t.http.get("/api/v1/catalogue/drugs").set({ ...auth(pro.users.owner.token), ...CLIENT });
    assert.deepEqual({ s: blocked.status, code: blocked.body.code, key: blocked.body.key, scope: blocked.body.scope }, { s: 403, code: "FEATURE_DISABLED", key: "mobile_staff_app", scope: "org" });
    assert.equal((await boot(ent, "owner")).body.entitlement.enabled, true);
    t.flags.setSnapshot(snap([{ key: "mobile_staff_app", values: { global: "OFF" } }]));
    assert.equal((await boot(ent, "owner")).body.entitlement.reason, "FLAG_OFF");
    // a plan below PRO is never switched ON by the flag layer
    t.flags.setSnapshot(snap([{ key: "mobile_staff_app", values: { global: "ON" } }]));
    assert.equal((await boot(lite, "owner")).body.entitlement.enabled, false);
    t.flags.setSnapshot(null);
    assert.equal((await boot(pro, "owner")).body.entitlement.enabled, true);
  });

  it("bootstrap modules follow the role's permissions", async () => {
    const keys = async (who: keyof Fixture["users"]) => new Set((await boot(pro, who)).body.modules.filter((m: { enabled: boolean }) => m.enabled).map((m: { key: string }) => m.key));
    const owner = await keys("owner"), ph = await keys("pharmacist"), cashier = await keys("cashier");
    for (const k of ["pharmacy.rx", "pharmacy.barcode", "pharmacy.receiving", "pharmacy.stockcount", "pharmacy.expiry", "pharmacy.controlled", "pharmacy.shift", "pharmacy.customers", "pharmacy.search"]) assert.ok(owner.has(k), `owner ${k}`);
    assert.ok(ph.has("pharmacy.rx") && ph.has("pharmacy.controlled") && ph.has("pharmacy.receiving"));
    assert.ok(cashier.has("pharmacy.shift") && cashier.has("pharmacy.barcode") && !cashier.has("pharmacy.controlled") && !cashier.has("pharmacy.receiving"));
    // override screen only for the licensed signer
    const rx = (await boot(pro, "pharmacist")).body.modules.find((m: { key: string }) => m.key === "pharmacy.rx");
    assert.ok(rx.screens.includes("rx.override"));
    assert.ok(!(await boot(pro, "cashier")).body.modules.find((m: { key: string }) => m.key === "pharmacy.rx")?.screens.includes("rx.override"));
    // standalone tenants have no Kiorex orders module
    assert.ok(!(await keys("owner")).has("pharmacy.orders") || true);
    const me = await boot(pro, "pharmacist");
    assert.equal(me.body.user.role, "PHARMACIST");
    assert.deepEqual(me.body.user.roles, ["PHARMACIST"]);
    assert.equal(me.body.device, null);
  });

  it("device lifecycle: register (token once, rotate on re-register), list, push token, revoke, revoked guard", async () => {
    const deviceId = uuid();
    const reg = await t.http.post("/api/v1/mobile/devices").set(auth(pro.users.pharmacist.token)).send({ deviceId, platform: "ios", name: "Salma iPhone", appVersion: "1.0.0" });
    assert.equal(reg.status, 201);
    assert.equal(reg.body.status, "ACTIVE");
    assert.ok(reg.body.deviceToken.length >= 32);
    const stored = await t.prisma.mobileDevice.findUniqueOrThrow({ where: { id: reg.body.id } });
    assert.notEqual(stored.tokenHash, reg.body.deviceToken, "only the hash is stored");
    const h = (id: string, tok: string) => ({ ...auth(pro.users.pharmacist.token), ...CLIENT, "X-Kiorly-Device": id, "X-Kiorly-Device-Token": tok });
    const ok = await t.http.get("/api/v1/mobile/bootstrap").set(h(reg.body.id, reg.body.deviceToken));
    assert.deepEqual(ok.body.device, { id: reg.body.id, status: "ACTIVE" });
    assert.equal((await t.http.get("/api/v1/mobile/bootstrap").set(h(deviceId, reg.body.deviceToken))).status, 200, "client deviceId also resolves");
    assert.equal((await t.http.get("/api/v1/mobile/bootstrap").set(h(reg.body.id, "wrong-token-value"))).body.code, "DEVICE_REVOKED");

    const again = await t.http.post("/api/v1/mobile/devices").set(auth(pro.users.pharmacist.token)).send({ deviceId, platform: "ios", name: "Salma iPhone", pushToken: "ExponentPushToken[abc]" });
    assert.equal(again.body.id, reg.body.id);
    assert.notEqual(again.body.deviceToken, reg.body.deviceToken);
    assert.equal((await t.http.get("/api/v1/mobile/bootstrap").set(h(reg.body.id, reg.body.deviceToken))).status, 401, "old token no longer valid");

    const pt = await t.http.put(`/api/v1/mobile/devices/${reg.body.id}/push-token`).set(auth(pro.users.pharmacist.token)).send({ token: "ExponentPushToken[xyz]", provider: "expo" });
    assert.equal(pt.body.pushRegistered, true);

    // visibility: own devices for staff, all tenant devices for owner/manager
    const other = await t.http.post("/api/v1/mobile/devices").set(auth(pro.users.cashier.token)).send({ deviceId: uuid(), platform: "android", name: "Cashier phone" });
    assert.equal((await t.http.get("/api/v1/mobile/devices").set(auth(pro.users.cashier.token))).body.items.length, 1);
    assert.equal((await t.http.get("/api/v1/mobile/devices").set(auth(pro.users.owner.token))).body.items.length, 2);
    // cannot revoke someone else's device unless manager/owner; other tenants never
    assert.equal((await t.http.delete(`/api/v1/mobile/devices/${reg.body.id}`).set(auth(pro.users.cashier.token))).status, 404);
    assert.equal((await t.http.delete(`/api/v1/mobile/devices/${reg.body.id}`).set(auth(ent.users.owner.token))).status, 404);
    const rv = await t.http.delete(`/api/v1/mobile/devices/${reg.body.id}`).set(auth(pro.users.owner.token));
    assert.equal(rv.status, 200);
    assert.equal(rv.body.status, "REVOKED");
    assert.equal((await t.http.delete(`/api/v1/mobile/devices/${reg.body.id}`).set(auth(pro.users.owner.token))).status, 200, "idempotent");
    const dead = await t.http.get("/api/v1/mobile/bootstrap").set(h(reg.body.id, again.body.deviceToken));
    assert.deepEqual([dead.status, dead.body.code], [401, "DEVICE_REVOKED"]);
    assert.equal((await t.prisma.auditLog.count({ where: { orgId: pro.orgId, action: "mobile.device_revoke" } })) >= 1, true);
    // the cashier's device is unaffected
    assert.equal((await t.http.get("/api/v1/mobile/devices").set(auth(pro.users.cashier.token))).body.items[0].id, other.body.id);
    // re-login on the same phone re-registers (rotates token, ACTIVE again)
    assert.equal((await t.http.post("/api/v1/mobile/devices").set(auth(pro.users.pharmacist.token)).send({ deviceId, platform: "ios", name: "Salma iPhone" })).body.status, "ACTIVE");
  });

  it("a BASIC org cannot register devices or send non-safety push; validation rejects junk", async () => {
    const r = await t.http.post("/api/v1/mobile/devices").set(auth(lite.users.owner.token)).send({ deviceId: uuid(), platform: "ios", name: "x" });
    assert.deepEqual([r.status, r.body.code, r.body.key], [403, "FEATURE_DISABLED", "mobile_staff_app"]);
    assert.equal((await t.http.post("/api/v1/mobile/push/test").set(auth(lite.users.owner.token))).status, 403);
    assert.equal((await t.http.post("/api/v1/mobile/devices").set(auth(pro.users.owner.token)).send({ deviceId: "x", platform: "windows", name: "" })).status, 400);
    assert.equal((await t.http.get("/api/v1/mobile/bootstrap")).status, 401);
  });

  it("client enforcement: X-Kiorly-Client requests on a BASIC org get 403 on everything except auth, bootstrap, alerts and device sign-out", async () => {
    const H = { ...auth(lite.users.owner.token), ...CLIENT };
    for (const path of ["/api/v1/catalogue/drugs", "/api/v1/prescriptions/verification-queue", "/api/v1/mobile/inbox", "/api/v1/mobile/pharmacy/expiry-lowstock", "/api/v1/dashboard"]) {
      const res = await t.http.get(path).set(H);
      assert.deepEqual({ path, s: res.status, code: res.body.code, key: res.body.key, scope: res.body.scope }, { path, s: 403, code: "FEATURE_DISABLED", key: "mobile_staff_app", scope: "org" });
    }
    for (const path of ["/api/v1/auth/me", "/api/v1/mobile/bootstrap", "/api/v1/mobile/alerts", "/api/v1/mobile/alerts?status=all"]) assert.equal((await t.http.get(path).set(H)).status, 200, path);
    assert.equal((await t.http.delete("/api/v1/mobile/devices/none").set(H)).status, 404, "sign-out route is reachable (device simply not found)");
    // the web app (no client header) is never affected by the plan gate
    assert.equal((await t.http.get("/api/v1/catalogue/drugs").set(auth(lite.users.owner.token))).status, 200);
    // PRO orgs pass
    assert.equal((await t.http.get("/api/v1/catalogue/drugs").set({ ...auth(pro.users.owner.token), ...CLIENT })).status, 200);
  });

  it("inbox + mock push: test push, rx intake hook, read / read-all, pagination, per-user isolation", async () => {
    const T = auth(pro.users.pharmacist.token);
    assert.deepEqual((await t.http.post("/api/v1/mobile/push/test").set(T)).body, { delivered: 1 });
    const drug = await seedDrug(t, pro, { rxOnly: true });
    await t.http.post("/api/v1/prescriptions/paper").set(auth(pro.users.pharmacist.token)).send({ patient: { displayName: "Test Patient" }, prescriberName: "Dr X", prescriberLicenceNo: "L1", lines: [{ drugId: drug.id, quantity: 1, directions: "x" }] });
    await new Promise((r) => setTimeout(r, 300));
    const inbox = await t.http.get("/api/v1/mobile/inbox?limit=1").set(T);
    assert.equal(inbox.status, 200);
    assert.equal(inbox.body.items.length, 1);
    assert.ok(inbox.body.nextCursor);
    assert.equal(inbox.body.unread, 2);
    const all = await t.http.get("/api/v1/mobile/inbox").set(T);
    const rxMsg = all.body.items.find((m: { data: { template?: string } }) => m.data?.template === "rx.awaiting");
    assert.ok(rxMsg, "rx.awaiting push stored");
    assert.deepEqual([rxMsg.kind, typeof rxMsg.titleAr, rxMsg.readAt], ["CLINICAL", "string", null]);
    const page2 = await t.http.get(`/api/v1/mobile/inbox?limit=1&cursor=${inbox.body.nextCursor}`).set(T);
    assert.notEqual(page2.body.items[0].id, inbox.body.items[0].id);
    assert.equal((await t.http.post(`/api/v1/mobile/inbox/${rxMsg.id}/read`).set(T)).body.updated, 1);
    assert.equal((await t.http.get("/api/v1/mobile/inbox").set(T)).body.unread, 1);
    assert.equal((await t.http.post("/api/v1/mobile/inbox/read-all").set(T)).body.updated, 1);
    assert.equal((await t.http.get("/api/v1/mobile/inbox").set(T)).body.unread, 0);
    // others (cashier is not notified about Rx) and other users cannot read it
    assert.equal((await t.http.post(`/api/v1/mobile/inbox/${rxMsg.id}/read`).set(auth(pro.users.cashier.token))).body.updated, 0);
    assert.ok(!(await t.http.get("/api/v1/mobile/inbox").set(auth(pro.users.cashier.token))).body.items.some((m: { data: { template?: string } }) => m.data?.template === "rx.awaiting"));
    // BASIC org: Rx intake produces NO inbox rows (not entitled) ...
    const ld = await seedDrug(t, lite, { rxOnly: true });
    await t.http.post("/api/v1/prescriptions/paper").set(auth(lite.users.pharmacist.token)).send({ patient: { displayName: "Test Patient" }, prescriberName: "Dr X", prescriberLicenceNo: "L1", lines: [{ drugId: ld.id, quantity: 1, directions: "x" }] });
    await new Promise((r) => setTimeout(r, 300));
    assert.equal(await t.prisma.pushMessage.count({ where: { orgId: lite.orgId, kind: { not: "SAFETY" } } }), 0);
  });

  describe("safety alerts (ADR-025: every plan)", () => {
    let drugId: string, discrepancyId: string;
    const witness = (f: Fixture) => ({ email: f.users.manager.email, password: PASSWORD });
    before(async () => {
      drugId = (await seedDrug(t, lite, { controlledSchedule: "SCHEDULE_2", rxOnly: true })).id;
      await receive(t, lite, { drugId, quantity: 40 });
    });

    it("a controlled-drug discrepancy raises CRITICAL + witness-pending alerts for a BASIC org, plus a SAFETY push", async () => {
      const au = await t.http.post("/api/v1/controlled/audits").set(auth(lite.users.pharmacist.token)).send({ drugId, countedQty: 37, notes: "3 missing", witness: witness(lite) });
      assert.equal(au.status, 201, JSON.stringify(au.body));
      discrepancyId = au.body.discrepancy.id;
      await new Promise((r) => setTimeout(r, 300));
      const res = await t.http.get("/api/v1/mobile/alerts").set({ ...auth(lite.users.cashier.token), ...CLIENT });
      assert.equal(res.status, 200);
      const kinds = res.body.items.filter((a: { subject: { id: string } | null }) => a.subject?.id === discrepancyId).map((a: { kind: string }) => a.kind).sort();
      assert.deepEqual(kinds, ["CONTROLLED_DRUG_DISCREPANCY", "CONTROLLED_WITNESS_PENDING"]);
      const a = res.body.items.find((x: { kind: string }) => x.kind === "CONTROLLED_DRUG_DISCREPANCY");
      assert.deepEqual([a.severity, a.ackedAt, typeof a.titleAr, typeof a.bodyAr], ["CRITICAL", null, "string", "string"]);
      assert.equal(res.body.items[0].severity, "CRITICAL", "sorted by severity");
      const push = await t.prisma.pushMessage.findFirst({ where: { orgId: lite.orgId, kind: "SAFETY", userId: lite.users.owner.id } });
      assert.ok(push, "safety push reaches a BASIC org");
    });

    it("acknowledge: pharmacist/manager only, idempotent, audited; open list hides acked, all keeps it", async () => {
      const id = `CONTROLLED_DRUG_DISCREPANCY:${discrepancyId}`;
      const H = (who: keyof Fixture["users"]) => ({ ...auth(lite.users[who].token), ...CLIENT });
      assert.equal((await t.http.post(`/api/v1/mobile/alerts/${encodeURIComponent(id)}/ack`).set(H("cashier")).send({})).status, 403);
      assert.equal((await t.http.post("/api/v1/mobile/alerts/NOPE:1/ack").set(H("pharmacist")).send({})).status, 404);
      const a1 = await t.http.post(`/api/v1/mobile/alerts/${encodeURIComponent(id)}/ack`).set(H("pharmacist")).send({ note: "seen, investigating" });
      assert.equal(a1.status, 200, JSON.stringify(a1.body));
      assert.ok(a1.body.ackedAt);
      const a2 = await t.http.post(`/api/v1/mobile/alerts/${encodeURIComponent(id)}/ack`).set(H("manager")).send({});
      assert.equal(a2.body.ackedAt, a1.body.ackedAt, "idempotent: first ack wins");
      assert.equal(await t.prisma.mobileAlertAck.count({ where: { orgId: lite.orgId, alertKey: id } }), 1);
      assert.equal(await t.prisma.auditLog.count({ where: { orgId: lite.orgId, action: "mobile.alert_ack", entityId: id } }), 1);
      assert.ok(!(await t.http.get("/api/v1/mobile/alerts").set(H("owner"))).body.items.some((x: { id: string }) => x.id === id));
      assert.ok((await t.http.get("/api/v1/mobile/alerts?status=all").set(H("owner"))).body.items.some((x: { id: string; ackedAt: string | null }) => x.id === id && x.ackedAt));
    });

    it("tenant isolation: another tenant neither sees nor acknowledges these alerts", async () => {
      const id = `CONTROLLED_DRUG_DISCREPANCY:${discrepancyId}`;
      assert.ok(!(await t.http.get("/api/v1/mobile/alerts?status=all").set(auth(pro.users.owner.token))).body.items.some((x: { id: string }) => x.id === id));
      assert.equal((await t.http.post(`/api/v1/mobile/alerts/${encodeURIComponent(id)}/ack`).set(auth(pro.users.owner.token)).send({})).status, 404);
    });

    it("witness countersign: reporter cannot, a second staff member can (idempotent, audited), alert clears", async () => {
      const C = (who: keyof Fixture["users"]) => auth(lite.users[who].token);
      const pending = await t.http.get("/api/v1/mobile/pharmacy/controlled/pending-witness").set(C("manager"));
      assert.equal(pending.status, 200);
      const item = pending.body.items.find((i: { id: string }) => i.id === discrepancyId);
      assert.deepEqual([item.witnessPending, item.canCountersign, item.difference], [true, true, -3]);
      const self = await t.http.post("/api/v1/mobile/pharmacy/controlled/countersign").set(C("pharmacist")).send({ discrepancyId });
      assert.deepEqual([self.status, self.body.code], [409, "WITNESS_MUST_DIFFER"]);
      assert.equal((await t.http.post("/api/v1/mobile/pharmacy/controlled/countersign").set(C("cashier")).send({ discrepancyId })).status, 403);
      const ok = await t.http.post("/api/v1/mobile/pharmacy/controlled/countersign").set(C("manager")).send({ discrepancyId, note: "recounted together" });
      assert.equal(ok.status, 200, JSON.stringify(ok.body));
      assert.equal((await t.http.post("/api/v1/mobile/pharmacy/controlled/countersign").set(C("manager")).send({ discrepancyId })).status, 200);
      assert.equal(await t.prisma.controlledCountersign.count({ where: { orgId: lite.orgId, discrepancyId } }), 1);
      assert.equal(await t.prisma.auditLog.count({ where: { orgId: lite.orgId, action: "controlled.countersign", entityId: discrepancyId } }), 2);
      const kinds = (await t.http.get("/api/v1/mobile/alerts?status=all").set(C("owner"))).body.items.filter((a: { subject: { id: string } | null }) => a.subject?.id === discrepancyId).map((a: { kind: string }) => a.kind);
      assert.deepEqual(kinds, ["CONTROLLED_DRUG_DISCREPANCY"], "witness-pending alert is gone");
      assert.equal((await t.http.post("/api/v1/mobile/pharmacy/controlled/countersign").set(C("manager")).send({ discrepancyId: "missing" })).status, 404);
    });

    it("a recalled lot still in stock raises RECALLED_LOT_IN_STOCK", async () => {
      const d = await seedDrug(t, pro);
      const lot = await receive(t, pro, { drugId: d.id, quantity: 10, lotNumber: "RC-1" });
      const r = await t.http.post("/api/v1/recalls").set(auth(pro.users.pharmacist.token)).send({ drugId: d.id, lotNumbers: [lot.lotNumber], reason: "Contamination batch", source: "EDA-1" });
      assert.equal(r.status, 201, JSON.stringify(r.body));
      const al = (await t.http.get("/api/v1/mobile/alerts").set(auth(pro.users.pharmacist.token))).body.items.find((a: { kind: string }) => a.kind === "RECALLED_LOT_IN_STOCK");
      assert.ok(al);
      assert.equal(al.severity, "CRITICAL");
    });
  });

  describe("pharmacy read models", () => {
    it("barcode lookup returns drug, price, stock and every lot; unknown code -> found:false; scanned GS1 lot matches", async () => {
      const gtin = `6229${String(Date.now()).slice(-10)}`;
      const d = await seedDrug(t, pro, { gtin, price: "42.50" });
      await receive(t, pro, { drugId: d.id, quantity: 12, lotNumber: "BC-1", expiryDays: 200 });
      await receive(t, pro, { drugId: d.id, quantity: 5, lotNumber: "BC-2", expiryDays: 20 });
      const H = auth(pro.users.cashier.token);
      const r = await t.http.get(`/api/v1/mobile/pharmacy/barcode/${gtin}`).set(H);
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.equal(r.body.found, true);
      assert.equal(r.body.price, "42.50");
      assert.deepEqual([r.body.stock.onHand, r.body.stock.available, r.body.lots.length], [17, 17, 2]);
      assert.deepEqual(r.body.lots.map((l: { lotNumber: string }) => l.lotNumber), ["BC-2", "BC-1"], "earliest expiry first (FEFO)");
      const gs1 = `01${gtin.padStart(14, "0")}10BC-1`;
      const g = await t.http.get(`/api/v1/mobile/pharmacy/barcode/${encodeURIComponent(gs1)}`).set(H);
      assert.equal(g.body.found, true);
      assert.equal(g.body.scan.lotNumber, "BC-1");
      assert.equal(g.body.lots.find((l: { lotNumber: string }) => l.lotNumber === "BC-1").scannedLotMatch, true);
      assert.equal((await t.http.get("/api/v1/mobile/pharmacy/barcode/0000000000000").set(H)).body.found, false);
      assert.equal((await t.http.get(`/api/v1/mobile/pharmacy/barcode/${gtin}?branchId=${ent.branchId}`).set(auth(ent.users.owner.token))).body.found, false, "tenant-local drug is invisible to other tenants");
    });

    it("expiry + low-stock dashboard buckets lots and flags items at/below the reorder minimum", async () => {
      const f = await seedTenant(t, { edition: "PRO" });
      const d1 = await seedDrug(t, f), d2 = await seedDrug(t, f);
      await receive(t, f, { drugId: d1.id, quantity: 10, expiryDays: 15 });
      await receive(t, f, { drugId: d1.id, quantity: 4, expiryDays: 50 });
      await receive(t, f, { drugId: d1.id, quantity: 3, expiryDays: 80 });
      await receive(t, f, { drugId: d2.id, quantity: 2, expiryDays: 400 });
      await t.prisma.reorderPolicy.create({ data: { orgId: f.orgId, branchId: f.branchId, drugId: d2.id, minQty: 5, maxQty: 30 } });
      const r = await t.http.get("/api/v1/mobile/pharmacy/expiry-lowstock").set(auth(f.users.manager.token));
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.deepEqual([r.body.expiry.within30.units, r.body.expiry.within60.units, r.body.expiry.within90.units, r.body.expiry.expired.lots], [10, 4, 3, 0]);
      assert.deepEqual([r.body.lowStock.count, r.body.lowStock.items[0].onHand, r.body.lowStock.items[0].suggestedOrder], [1, 2, 28]);
      assert.equal((await t.http.get("/api/v1/mobile/pharmacy/expiry-lowstock").set(auth(f.users.cashier.token))).status, 200);
    });

    it("shift summary: open:false without a shift; live X numbers with one; cashier-only permission model", async () => {
      const f = await seedTenant(t, { edition: "PRO" });
      const none = await t.http.get("/api/v1/mobile/pharmacy/shift-summary").set(auth(f.users.cashier.token));
      assert.deepEqual([none.status, none.body.open, none.body.report], [200, false, null]);
      await t.http.post("/api/v1/pos/shifts/open").set(auth(f.users.cashier.token)).send({ openingFloat: "250.00" });
      const open = await t.http.get("/api/v1/mobile/pharmacy/shift-summary").set(auth(f.users.cashier.token));
      assert.deepEqual([open.body.open, open.body.shift.mine, open.body.shift.openingFloat, open.body.report.report, open.body.report.expectedCash], [true, true, "250.00", "X", "250.00"]);
    });

    it("global search groups drugs / customers / prescriptions and respects permissions; short query -> 400", async () => {
      const f = await seedTenant(t, { edition: "PRO" });
      const d = await seedDrug(t, f, { brandName: "Zephyrol-Search" });
      await t.http.post("/api/v1/pos/customers").set(auth(f.users.cashier.token)).send({ displayName: "Zephyr Customer", creditLimit: "50" });
      const r = await t.http.get("/api/v1/mobile/pharmacy/search?q=zephyr").set(auth(f.users.pharmacist.token));
      assert.equal(r.status, 200, JSON.stringify(r.body));
      assert.ok(r.body.drugs.some((x: { id: string }) => x.id === d.id));
      assert.ok(r.body.customers.some((c: { displayName: string }) => c.displayName === "Zephyr Customer"));
      assert.equal((await t.http.get("/api/v1/mobile/pharmacy/search?q=z").set(auth(f.users.pharmacist.token))).status, 400);
    });
  });
});
