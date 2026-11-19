import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("tenant isolation + RBAC (safety.pharmacy.tenant_isolation, never a flag)", () => {
  let t: TestApp, a: Fixture, b: Fixture;
  const ids: Record<string, string> = {};
  before(async () => {
    t = await bootApp(); a = await seedTenant(t); b = await seedTenant(t);
    await openShift(t, a);
    const drug = await seedDrug(t, a, { rxOnly: true, price: "10.00" });
    const otc = await seedDrug(t, a, { price: "10.00" });
    const lot = await receive(t, a, { drugId: drug.id });
    await receive(t, a, { drugId: otc.id });
    const sup = (await t.http.post("/api/v1/suppliers").set(auth(a.users.owner.token)).send({ name: "A-Supplier", phone: "010" })).body;
    const rx = (await t.http.post("/api/v1/prescriptions/paper").set(auth(a.users.pharmacist.token)).send({ patient: { displayName: "A Patient" }, prescriberName: "Dr A", prescriberLicenceNo: "L", lines: [{ drugId: drug.id, quantity: 1, directions: "x" }] })).body;
    await t.http.post(`/api/v1/prescriptions/${rx.id}/validate`).set(auth(a.users.pharmacist.token));
    const disp = (await t.http.post("/api/v1/dispensings").set(auth(a.users.pharmacist.token)).send({ prescriptionId: rx.id, items: [{ drugId: drug.id, quantity: 1 }] })).body;
    const sale = (await t.http.post("/api/v1/pos/sales").set(auth(a.users.cashier.token)).send({ idempotencyKey: key(), lines: [{ drugId: otc.id, quantity: 1 }], payments: [{ method: "CASH", amount: "10" }] })).body.sale;
    const cust = (await t.http.post("/api/v1/pos/customers").set(auth(a.users.cashier.token)).send({ displayName: "Cust A", creditLimit: "50" })).body;
    const po = (await t.http.post("/api/v1/purchase-orders").set(auth(a.users.owner.token)).send({ branchId: a.branchId, supplierId: sup.id, lines: [{ drugId: drug.id, qtyOrdered: 1, unitCost: "1.00" }] })).body;
    Object.assign(ids, { drug: drug.id, lot: lot.id, sup: sup.id, rx: rx.id, disp: disp.id, sale: sale.id, cust: cust.id, po: po.id, shift: (await t.prisma.shift.findFirstOrThrow({ where: { orgId: a.orgId } })).id, branch: a.branchId });
  });
  after(async () => { await t.close(); });

  it("tenant B cannot read or mutate tenant A's records through any id-addressed route", async () => {
    const bt = b.users.owner.token;
    const reads = [`/api/v1/suppliers/${ids.sup}`, `/api/v1/suppliers/${ids.sup}/ledger`, `/api/v1/prescriptions/${ids.rx}`, `/api/v1/dispensings/${ids.disp}`, `/api/v1/pos/sales/${ids.sale}`, `/api/v1/pos/sales/${ids.sale}/receipt`, `/api/v1/pos/customers/${ids.cust}`, `/api/v1/purchase-orders/${ids.po}`, `/api/v1/pos/shifts/${ids.shift}/z-report`, `/api/v1/inventory/cold-chain/${ids.lot}/readings`];
    for (const path of reads) {
      const r = await t.http.get(path).set(auth(bt));
      assert.ok([404, 200].includes(r.status), `${path} -> ${r.status}`);
      if (r.status === 200) assert.ok(Array.isArray(r.body) ? r.body.length === 0 : false, `${path} leaked data`);
    }
    const writes: Array<[string, string, object]> = [
      ["post", `/api/v1/dispensings/${ids.disp}/signoff`, {}], ["post", `/api/v1/inventory/lots/${ids.lot}/quarantine`, { reason: "attack attack" }], ["post", `/api/v1/purchase-orders/${ids.po}/cancel`, {}],
      ["post", `/api/v1/prescriptions/${ids.rx}/reject`, { reason: "attack attack" }], ["post", `/api/v1/pos/sales/${ids.sale}/void`, { reason: "attack" }], ["post", `/api/v1/pos/customers/${ids.cust}/payments`, { amount: "1.00" }],
      ["post", `/api/v1/suppliers/${ids.sup}/payments`, { amount: "1.00" }], ["post", `/api/v1/inventory/adjustments`, { lotId: ids.lot, quantity: 5, reason: "attack" }],
    ];
    for (const [m, path, body] of writes) {
      const r = await (t.http as never as Record<string, (p: string) => import("supertest").Test>)[m]!(path).set(auth(bt)).send(body);
      assert.ok(r.status >= 400 && r.status < 500, `${path} -> ${r.status} ${JSON.stringify(r.body)}`);
    }
    const lot = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: ids.lot! } });
    assert.equal(lot.status, "AVAILABLE");
    assert.equal(lot.qtyOnHand, 100, "A stock untouched by tenant B");
  });

  it("list endpoints are tenant-scoped; orgId/branch headers and query params cannot widen access", async () => {
    const hdr = { ...auth(b.users.owner.token), "x-org-id": a.orgId };
    for (const path of ["/api/v1/suppliers", "/api/v1/prescriptions", "/api/v1/dispensings", "/api/v1/pos/sales", "/api/v1/inventory/lots", "/api/v1/audit", "/api/v1/recalls", "/api/v1/pos/customers", "/api/v1/purchase-orders"]) {
      const r = await t.http.get(`${path}?orgId=${a.orgId}&branchId=${a.branchId}`).set(hdr);
      const items = Array.isArray(r.body) ? r.body : r.body.items ?? [];
      assert.ok(r.status === 200 || r.status === 403 || r.status === 400 || r.status === 402, `${path} ${r.status}`);
      assert.equal(items.filter((x: { orgId?: string }) => x.orgId === a.orgId).length, 0, `${path} leaked tenant A rows`);
    }
    const branchAttack = await t.http.get(`/api/v1/inventory/stock?branchId=${a.branchId}`).set(auth(b.users.owner.token));
    assert.equal(branchAttack.status, 403);
    assert.equal(branchAttack.body.code, "BRANCH_FORBIDDEN");
    const drugs = await t.http.get("/api/v1/catalogue/drugs?q=Drug-").set(auth(b.users.owner.token));
    assert.equal(drugs.body.items.filter((d: { orgId: string | null }) => d.orgId === a.orgId).length, 0, "A's local drugs are invisible to B");
  });

  it("branch-bound staff cannot act on another branch", async () => {
    const r = await t.http.get(`/api/v1/inventory/stock?branchId=${a.branch2Id}`).set(auth(a.users.pharmacist.token));
    assert.equal(r.status, 403);
    assert.equal(r.body.code, "BRANCH_FORBIDDEN");
  });

  it("authentication: missing/invalid/forged tokens are 401; health is public", async () => {
    assert.equal((await t.http.get("/api/v1/suppliers")).status, 401);
    assert.equal((await t.http.get("/api/v1/suppliers").set({ Authorization: "Bearer nope" })).status, 401);
    const forged = Buffer.from(JSON.stringify({ alg: "none" })).toString("base64url") + "." + Buffer.from(JSON.stringify({ sub: a.users.owner.id })).toString("base64url") + ".";
    assert.equal((await t.http.get("/api/v1/suppliers").set({ Authorization: `Bearer ${forged}` })).status, 401);
    assert.equal((await t.http.get("/api/v1/health/live")).status, 200);
    const bad = await t.http.post("/api/v1/auth/login").send({ email: a.users.owner.email, password: "wrong-password" });
    assert.equal(bad.status, 401);
    await t.prisma.staffUser.update({ where: { id: b.users.cashier.id }, data: { active: false } });
    assert.equal((await t.http.get("/api/v1/dashboard").set(auth(b.users.cashier.token))).status, 401, "deactivated staff lose access immediately");
  });

  it("RBAC: roles are enforced by permission, not by UI", async () => {
    const c = auth(a.users.cashier.token);
    const denied: Array<[string, string, object?]> = [
      ["post", "/api/v1/catalogue/drugs", { brandName: "X", activeIngredient: "x", strength: "1", dosageForm: "tab", packSize: "1" }], ["post", "/api/v1/inventory/receipts", { branchId: a.branchId, lines: [] }],
      ["post", "/api/v1/recalls", { drugId: ids.drug, lotNumbers: ["1"], reason: "no right" }], ["get", "/api/v1/staff"], ["patch", "/api/v1/settings", { vatRate: "0.05" }], ["get", "/api/v1/audit"],
      ["post", `/api/v1/catalogue/prices/bulk`, { effectiveFrom: new Date().toISOString(), items: [] }], ["get", "/api/v1/reports/sales-daily"], ["get", "/api/v1/controlled-register"], ["post", "/api/v1/suppliers", { name: "nope" }],
    ];
    for (const [m, path, body] of denied) {
      const r = await (t.http as never as Record<string, (p: string) => import("supertest").Test>)[m]!(path).set(c).send(body ?? {});
      assert.equal(r.status, 403, `${m} ${path} -> ${r.status}`);
      assert.equal(r.body.code, "PERMISSION_DENIED");
    }
    const chain = auth(a.users.chainOps.token);
    assert.equal((await t.http.post("/api/v1/dispensings").set(chain).send({ items: [{ drugId: ids.drug, quantity: 1 }] })).status, 403, "chain ops cannot dispense");
    assert.equal((await t.http.get("/api/v1/staff").set(auth(a.users.manager.token))).status, 403);
    assert.equal((await t.http.get("/api/v1/staff").set(auth(a.users.owner.token))).status, 200);
  });

  it("every state-changing operation is audited, and the audit log is append-only and PHI-free", async () => {
    const rows = await t.prisma.auditLog.findMany({ where: { orgId: a.orgId } });
    const actions = new Set(rows.map((r) => r.action));
    for (const x of ["inventory.receive", "rx.intake", "rx.validate", "dispense.create", "sale.complete", "shift.open", "catalogue.import", "auth.login"]) assert.ok(actions.has(x), `missing audit action ${x}`);
    const json = JSON.stringify(rows);
    assert.equal(json.includes("A Patient"), false);
    assert.equal(json.includes("Cust A"), false);
    await assert.rejects(t.prisma.auditLog.delete({ where: { id: rows[0]!.id } }), /append-only/);
    await assert.rejects(t.prisma.auditLog.update({ where: { id: rows[0]!.id }, data: { action: "x" } }), /append-only/);
  });

  it("staff + plan limits: Lite allows 2 users / 1 branch (402 PLAN_LIMIT)", async () => {
    const lite = await seedTenant(t, { edition: "LITE" });
    const extra = await t.http.post("/api/v1/staff").set(auth(lite.users.owner.token)).send({ displayName: "Extra", email: `x.${Date.now()}@t.local`, password: "Passw0rd!x", role: "CASHIER" });
    assert.equal(extra.status, 402);
    assert.equal(extra.body.code, "PLAN_LIMIT");
    const br = await t.http.post("/api/v1/branches").set(auth(lite.users.owner.token)).send({ name: "Another" });
    assert.equal(br.status, 402);
  });
});
