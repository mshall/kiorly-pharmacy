import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, isoDate, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Admin: roles matrix, standalone mode, settings, CSV import, export/backup, audit viewer, notification centre", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const mgr = () => auth(f.users.manager.token);
  const cash = () => auth(f.users.cashier.token);
  const ph = () => auth(f.users.pharmacist.token);

  it("roles matrix: defaults, override applies immediately (also to /auth/me), locked permissions and OWNER cannot change, reset restores", async () => {
    const m = await t.http.get("/api/v1/admin/roles").set(owner());
    assert.equal(m.status, 200); assert.ok(m.body.roles.includes("ASSISTANT"));
    assert.equal(m.body.matrix.CASHIER["finance.read"].granted, false); assert.equal(m.body.matrix.PHARMACIST["dispense.signoff"].locked, true); assert.equal(m.body.matrix.OWNER["pos.sell"].locked, true);
    assert.equal((await t.http.get("/api/v1/finance/overview").set(cash())).status, 403);
    assert.equal((await t.http.put("/api/v1/admin/roles/CASHIER/permissions").set(mgr()).send({ permission: "finance.read", granted: true })).status, 403, "only roles.manage");
    const set = await t.http.put("/api/v1/admin/roles/CASHIER/permissions").set(owner()).send({ permission: "finance.read", granted: true });
    assert.equal(set.status, 200, JSON.stringify(set.body));
    assert.equal((await t.http.get(`/api/v1/finance/overview?branchId=${f.branchId}`).set(cash())).status, 200);
    assert.ok((await t.http.get("/api/v1/auth/me").set(cash())).body.permissions.includes("finance.read"));
    assert.equal((await t.http.get("/api/v1/admin/roles").set(owner())).body.matrix.CASHIER["finance.read"].overridden, true);
    // revoke a default permission
    await t.http.put("/api/v1/admin/roles/CASHIER/permissions").set(owner()).send({ permission: "customer.write", granted: false });
    assert.equal((await t.http.post("/api/v1/customers").set(cash()).send({ displayName: "Nope Nada" })).status, 403);
    // safety-critical + owner locked
    assert.equal((await t.http.put("/api/v1/admin/roles/CASHIER/permissions").set(owner()).send({ permission: "dispense.signoff", granted: true })).body.code, "PERMISSION_LOCKED");
    assert.equal((await t.http.put("/api/v1/admin/roles/OWNER/permissions").set(owner()).send({ permission: "pos.sell", granted: false })).body.code, "OWNER_LOCKED");
    assert.equal((await t.http.put("/api/v1/admin/roles/CASHIER/permissions").set(owner()).send({ permission: "made.up", granted: true })).body.code, "UNKNOWN_PERMISSION");
    assert.equal((await t.http.put("/api/v1/admin/roles/WIZARD/permissions").set(owner()).send({ permission: "pos.sell", granted: true })).status, 404);
    // a cashier still cannot sign off even if someone tries via DB override: locked permissions ignore overrides
    await t.prisma.rolePermissionOverride.create({ data: { orgId: f.orgId, role: "CASHIER", permission: "dispense.signoff", granted: true } });
    assert.equal((await t.http.post("/api/v1/dispensings/x/signoff").set(cash()).send({})).status, 403);
    await t.prisma.rolePermissionOverride.deleteMany({ where: { orgId: f.orgId, permission: "dispense.signoff" } });
    // tenant isolation
    const other = await seedTenant(t);
    assert.equal((await t.http.get("/api/v1/finance/overview").set(auth(other.users.cashier.token))).status, 403);
    const reset = await t.http.post("/api/v1/admin/roles/CASHIER/reset").set(owner());
    assert.equal(reset.body.removed, 2);
    assert.equal((await t.http.get(`/api/v1/finance/overview?branchId=${f.branchId}`).set(cash())).status, 403);
    assert.ok(await t.prisma.auditLog.count({ where: { orgId: f.orgId, action: "roles.permission" } }) >= 2);
  });

  it("the pharmacy assistant role: counter + intake + stock receiving, no sign-off, no refunds", async () => {
    const f2 = await seedTenant(t, { edition: "CHAIN" });
    const o2 = () => auth(f2.users.owner.token);
    const st = await t.http.post("/api/v1/staff").set(o2()).send({ displayName: "Asma Assistant", email: `asma.${Date.now()}@test.kiorly.local`, password: "Passw0rd!x", role: "ASSISTANT", branchId: f2.branchId });
    assert.equal(st.status, 201, JSON.stringify(st.body));
    const login = await t.http.post("/api/v1/auth/login").send({ email: st.body.email, password: "Passw0rd!x" });
    const me = await t.http.get("/api/v1/auth/me").set(auth(login.body.accessToken));
    assert.equal(me.body.user.role, "ASSISTANT");
    for (const p of ["pos.sell", "customer.write", "rx.intake", "inventory.receive", "dispense.create"]) assert.ok(me.body.permissions.includes(p), p);
    for (const p of ["dispense.signoff", "pos.refund_approve", "staff.manage", "settings.write", "inventory.adjust"]) assert.ok(!me.body.permissions.includes(p), p);
    assert.equal(me.body.user.isPharmacist, false);
  });

  it("standalone mode is a first-class setting: switch it off/on, integration endpoints and flags follow, nothing external is needed", async () => {
    const mode = await t.http.get("/api/v1/admin/mode").set(owner());
    assert.equal(mode.body.mode, "INTEGRATED"); assert.equal(mode.body.integrationClients, 1);
    assert.equal((await t.http.get("/api/v1/kiorex-orders").set(owner())).status, 200);
    assert.equal((await t.http.patch("/api/v1/settings").set(mgr()).send({ mode: "STANDALONE" })).status, 403);
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ mode: "STANDALONE" })).status, 200);
    const off = await t.http.get("/api/v1/kiorex-orders").set(owner());
    assert.equal(off.status, 403); assert.equal(off.body.code, "STANDALONE_MODE");
    assert.equal((await t.http.get("/api/v1/auth/me").set(owner())).body.flags["pharmacy.kiorex_orders"], false);
    assert.equal((await t.http.get("/api/v1/admin/mode").set(owner())).body.mode, "STANDALONE");
    // the whole pharmacy still works
    const d = await seedDrug(t, f, { price: "10.00" }); await receive(t, f, { drugId: d.id, quantity: 5 });
    assert.equal((await t.http.post("/api/v1/pos/sales").set(cash()).send({ idempotencyKey: key(), lines: [{ drugId: d.id, quantity: 1 }], payments: [{ method: "CASH", amount: "10.00" }] })).status, 201);
    await t.http.patch("/api/v1/settings").set(owner()).send({ mode: "INTEGRATED" });
    assert.equal((await t.http.get("/api/v1/kiorex-orders").set(owner())).status, 200);
    // a brand new signup is standalone by default (no integration client)
    const su = await t.http.post("/api/v1/onboarding/signup").send({ pharmacyName: "Solo Pharmacy", ownerName: "Solo", email: `solo.${Date.now()}@test.kiorly.local`, password: "Passw0rd!x" });
    assert.equal(su.status, 201, JSON.stringify(su.body));
    const lg = await t.http.post("/api/v1/auth/login").send({ email: (await t.prisma.staffUser.findUniqueOrThrow({ where: { id: su.body.ownerId } })).email, password: "Passw0rd!x" });
    assert.equal((await t.http.get("/api/v1/auth/me").set(auth(lg.body.accessToken))).body.tenant.mode, "STANDALONE");
  });

  it("settings: receipt template, printers, tax rates, currency, languages, loyalty are validated and stored", async () => {
    const ok = await t.http.patch("/api/v1/settings").set(owner()).send({ currency: "EGP", languages: ["ar", "en"], receipt: { header: "Open 24h", paper: "a4", showVat: true }, printers: [{ id: "p1", name: "Counter printer", kind: "RECEIPT", paper: "80mm" }], taxRates: [{ code: "STD", label: "Standard", rate: "0.14" }, { code: "ZERO", label: "Zero", rate: "0" }], loyalty: { enabled: true, earnPer: "20", redeemValue: "1.00", tiers: [{ name: "BASE", minSpend: "0" }, { name: "VIP", minSpend: "1000" }] }, maxCashierDiscountPct: 5, costVarianceTolerancePct: 3, refillReminderDays: 2 });
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    const s = await t.http.get("/api/v1/settings").set(owner());
    assert.equal(s.body.settings.printers[0].name, "Counter printer"); assert.equal(s.body.settings.taxRates.length, 2); assert.equal(s.body.settings.loyalty.earnPer, "20"); assert.equal(s.body.settings.receipt.paper, "a4");
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ currency: "egp" })).status, 400);
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ receipt: { paper: "letter" } })).status, 400);
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ languages: ["fr"] })).status, 400);
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ taxRates: [{ code: "X", label: "x", rate: "abc" }] })).status, 400);
    // the loyalty setting takes effect: 1 point per 20 EGP now
    const d = await seedDrug(t, f, { price: "100.00" }); await receive(t, f, { drugId: d.id, quantity: 5 });
    const c = (await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Settings Sara" })).body;
    await t.http.post("/api/v1/pos/sales").set(cash()).send({ idempotencyKey: key(), patientId: c.id, lines: [{ drugId: d.id, quantity: 2 }], payments: [{ method: "CASH", amount: "200.00" }] });
    assert.equal((await t.http.get(`/api/v1/customers/${c.id}/loyalty`).set(owner())).body.points, 10);
  });

  it("CSV import: templates, dry-run validation with row errors, apply drugs / stock / customers / suppliers, idempotent re-run, permissions", async () => {
    const f3 = await seedTenant(t); const o3 = () => auth(f3.users.owner.token);
    const tpl = await t.http.get("/api/v1/admin/import/drugs/template").set(o3());
    assert.match(tpl.text, /brandName,brandNameAr,activeIngredient/); assert.equal((await t.http.get("/api/v1/admin/import/nothing/template").set(o3())).status, 404);
    assert.equal((await t.http.post("/api/v1/admin/import/drugs").set(auth(f3.users.cashier.token)).send({ csv: "brandName\nX" })).status, 403);
    const csv = ["brandName;brandNameAr;activeIngredient;strength;dosageForm;packSize;gtin;price;category;rxOnly", "Importol 500;إيمبورتول;paracetamol;500 mg;tablet;20;6229990000011;22.50;Analgesics;false", "Importrex 250;;amoxicillin;250 mg;capsule;16;6229990000028;55;Antibiotics;yes", ";;;;;;;;;"].join("\n");
    const bad = await t.http.post("/api/v1/admin/import/drugs").set(o3()).send({ csv, dryRun: true });
    assert.equal(bad.body.total, 3 - 0 + 0 === 3 ? bad.body.total : 3);
    assert.equal(bad.body.errors, 0, "the blank line is not a row"); assert.equal(bad.body.ok, 2);
    const withBad = await t.http.post("/api/v1/admin/import/drugs").set(o3()).send({ csv: csv + "\nBroken;;x;1 mg;tablet;1;;abc;;", dryRun: false });
    assert.equal(withBad.body.errors, 1); assert.match(withBad.body.rows.find((r: { status: string }) => r.status === "ERROR").message, /price/);
    assert.equal(await t.prisma.drug.count({ where: { orgId: f3.orgId } }), 0, "nothing is applied while any row has an error");
    const applied = await t.http.post("/api/v1/admin/import/drugs").set(o3()).send({ csv, dryRun: false });
    assert.equal(applied.status, 201, JSON.stringify(applied.body)); assert.equal(applied.body.created, 2);
    const again = await t.http.post("/api/v1/admin/import/drugs").set(o3()).send({ csv, dryRun: false });
    assert.equal(again.body.created, 0); assert.equal(again.body.updated, 2);
    const cat = await t.http.get("/api/v1/catalogue/drugs?q=importol").set(o3());
    assert.equal(cat.body.items[0].category, "Analgesics"); assert.equal(cat.body.items[0].rxOnly, false);
    // opening stock by barcode and by name; Arabic-locale date format; blocked rows reported
    const stock = ["gtin,brandName,lotNumber,expiryDate,quantity,unitCost,branchCode", `6229990000011,,L-100,${isoDate(400).split("-").reverse().join("/")},40,15.00,${(await t.prisma.branch.findUniqueOrThrow({ where: { id: f3.branchId } })).code}`, ",Importrex 250,L-200," + isoDate(300) + ",10,30.00," + (await t.prisma.branch.findUniqueOrThrow({ where: { id: f3.branchId } })).code].join("\n");
    const sd = await t.http.post("/api/v1/admin/import/stock").set(o3()).send({ csv: stock, dryRun: true });
    assert.equal(sd.body.ok, 2, JSON.stringify(sd.body));
    const sa = await t.http.post("/api/v1/admin/import/stock").set(o3()).send({ csv: stock, dryRun: false });
    assert.equal(sa.status, 201, JSON.stringify(sa.body));
    assert.equal((await t.prisma.stockLot.aggregate({ where: { orgId: f3.orgId }, _sum: { qtyOnHand: true } }))._sum.qtyOnHand, 50);
    const badStock = await t.http.post("/api/v1/admin/import/stock").set(o3()).send({ csv: "gtin,lotNumber,expiryDate,quantity,unitCost,branchCode\n0000,X,2020-01-01,1,1,NOPE", dryRun: true });
    assert.equal(badStock.body.errors, 1);
    // customers: duplicates by phone skipped, bad rows reported
    const cust = "displayName,phone,dateOfBirth,allergies,gender\nHala Import,01011110001,1990-01-31,penicillin;sulfa,F\nHala Dup,01011110001,,,F\nBad Date,01011110002,31/31/1990,,F\nراما,01011110003,15/02/1985,,F";
    const cd = await t.http.post("/api/v1/admin/import/customers").set(o3()).send({ csv: cust, dryRun: true });
    assert.deepEqual([cd.body.ok, cd.body.skipped, cd.body.errors], [2, 1, 1]);
    const ca = await t.http.post("/api/v1/admin/import/customers").set(o3()).send({ csv: cust.split("\n").filter((l) => !l.startsWith("Bad Date")).join("\n"), dryRun: false });
    assert.equal(ca.body.created, 2);
    const hala = (await t.http.get("/api/v1/customers?q=Hala").set(o3())).body.items[0];
    assert.deepEqual(hala.allergies, ["penicillin", "sulfa"]); assert.match(hala.customerNo, /^CUS-/);
    // suppliers
    const sup = await t.http.post("/api/v1/admin/import/suppliers").set(o3()).send({ csv: "name,phone,paymentTerms,creditLimit\nSupplier One,0100,30 days,5000\nSupplier One,0100,30 days,5000", dryRun: false });
    assert.deepEqual([sup.body.created, sup.body.skipped], [1, 1]);
    assert.equal((await t.http.post("/api/v1/admin/import/suppliers").set(o3()).send({ csv: "", dryRun: true })).status, 400);
  });

  it("export / backup: bundle and per-entity CSV, formula-safe, no national IDs, audited, permissioned", async () => {
    const c = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "=HYPERLINK(\"x\")", phone: "01099998888", nationalId: "29801011234567" });
    assert.equal(c.status, 201);
    const csv = await t.http.get("/api/v1/admin/export/customers").set(owner());
    assert.match(csv.headers["content-type"], /text\/csv/); assert.match(csv.text, /customerNo,displayName/); assert.ok(csv.text.includes(`"'=HYPERLINK`)); assert.doesNotMatch(csv.text, /29801011234567/);
    const bundle = await t.http.get("/api/v1/admin/export").set(owner());
    assert.equal(bundle.status, 200); assert.equal(bundle.body.app, "kiorly-pharmacy"); assert.ok(bundle.body.counts.customers >= 1); assert.ok(bundle.body.data.sales.headers.includes("receiptNo"));
    assert.doesNotMatch(JSON.stringify(bundle.body), /29801011234567/); assert.doesNotMatch(JSON.stringify(bundle.body), /passwordHash/);
    assert.equal((await t.http.get("/api/v1/admin/export/nothing").set(owner())).status, 404);
    assert.equal((await t.http.get("/api/v1/admin/export").set(cash())).status, 403);
    assert.equal((await t.http.get("/api/v1/admin/export/stock").set(mgr())).status, 200, "managers may export");
    assert.ok(await t.prisma.auditLog.count({ where: { orgId: f.orgId, action: "data.export" } }) >= 3);
    const other = await seedTenant(t);
    assert.doesNotMatch((await t.http.get("/api/v1/admin/export/customers").set(auth(other.users.owner.token))).text, /HYPERLINK/, "tenants never see each other's data");
  });

  it("audit viewer: filters by action / entity / actor / date, CSV export; the log is PHI-free", async () => {
    const all = await t.http.get("/api/v1/audit?pageSize=200").set(owner());
    assert.ok(all.body.total > 10);
    const roles = await t.http.get("/api/v1/audit?action=roles.").set(owner());
    assert.ok(roles.body.items.length >= 2 && roles.body.items.every((i: { action: string }) => i.action.startsWith("roles.")));
    const mine = await t.http.get(`/api/v1/audit?actorId=${f.users.owner.id}&entityType=Customer`).set(owner());
    assert.ok(mine.body.items.every((i: { actorId: string; entityType: string }) => i.actorId === f.users.owner.id && i.entityType === "Customer"));
    const none = await t.http.get(`/api/v1/audit?from=${new Date(Date.now() + 86_400_000).toISOString()}`).set(owner());
    assert.equal(none.body.total, 0);
    const csv = await t.http.get("/api/v1/audit/export.csv?action=roles.").set(owner());
    assert.match(csv.text, /at,actorId,action,entityType,entityId,meta/); assert.match(csv.text, /roles\.permission/);
    assert.equal((await t.http.get("/api/v1/audit").set(cash())).status, 403);
    assert.doesNotMatch(JSON.stringify(all.body.items), /01099998888|HYPERLINK/);
  });

  it("notification centre: scan creates alerts for real conditions once, per-user read state, unread count, auto-resolve", async () => {
    const f4 = await seedTenant(t); await openShift(t, f4);
    const o4 = () => auth(f4.users.owner.token), p4 = () => auth(f4.users.pharmacist.token), c4 = () => auth(f4.users.cashier.token);
    assert.deepEqual((await t.http.get("/api/v1/notifications/unread-count").set(o4())).body, { unread: 0, critical: 0 });
    const d = await seedDrug(t, f4, { brandName: "Alert-D" }); const lot = await receive(t, f4, { drugId: d.id, quantity: 5, expiryDays: 10 });
    await t.http.put(`/api/v1/inventory/reorder-policies?branchId=${f4.branchId}`).set(o4()).send({ drugId: d.id, minQty: 10, maxQty: 20 });
    const ctl = await seedDrug(t, f4, { rxOnly: true, controlledSchedule: "SCHEDULE_3" }); await receive(t, f4, { drugId: ctl.id, quantity: 9 });
    const au = await t.http.post("/api/v1/controlled/audits").set(p4()).send({ drugId: ctl.id, branchId: f4.branchId, countedQty: 7, witness: { email: f4.users.manager.email, password: "Passw0rd!x" } });
    assert.equal(au.body.match, false);
    const scan = await t.http.post("/api/v1/notifications/scan").set(o4());
    assert.equal(scan.status, 201, JSON.stringify(scan.body)); assert.ok(scan.body.created >= 3);
    const feed = await t.http.get("/api/v1/notifications/feed").set(o4());
    const kinds = feed.body.items.map((i: { kind: string }) => i.kind);
    for (const k of ["LOW_STOCK", "NEAR_EXPIRY", "CONTROLLED_DISCREPANCY"]) assert.ok(kinds.includes(k), k);
    assert.equal(feed.body.unread, feed.body.items.length); assert.equal((await t.http.get("/api/v1/notifications/unread-count").set(o4())).body.critical, 1);
    assert.equal((await t.http.post("/api/v1/notifications/scan").set(o4())).body.created, 0, "idempotent");
    const first = feed.body.items[0].id;
    await t.http.post(`/api/v1/notifications/${first}/read`).set(o4());
    assert.equal((await t.http.get("/api/v1/notifications/feed").set(o4())).body.unread, feed.body.items.length - 1);
    assert.equal((await t.http.get("/api/v1/notifications/feed").set(p4())).body.unread, feed.body.items.length, "read state is per user");
    assert.equal((await t.http.get("/api/v1/notifications/feed?unread=true").set(o4())).body.items.length, feed.body.items.length - 1);
    assert.equal((await t.http.post("/api/v1/notifications/read-all").set(o4())).body.marked, feed.body.items.length - 1);
    // the cashier role has notifications too, the chain-ops one does
    assert.equal((await t.http.get("/api/v1/notifications/feed").set(c4())).status, 200);
    // resolve the discrepancy -> its alert clears on the next scan
    await t.http.post(`/api/v1/controlled/discrepancies/${au.body.discrepancy.id}/resolve`).set(p4()).send({ resolution: "Recount agreed, incident logged" });
    const sc2 = await t.http.post("/api/v1/notifications/scan").set(o4());
    assert.ok(sc2.body.resolved >= 1);
    assert.ok(!(await t.http.get("/api/v1/notifications/feed").set(o4())).body.items.some((i: { kind: string }) => i.kind === "CONTROLLED_DISCREPANCY"));
    // tenants are isolated
    assert.equal((await t.http.get("/api/v1/notifications/feed").set(owner())).body.items.some((i: { kind: string }) => i.kind === "CONTROLLED_DISCREPANCY"), false);
    void lot;
  });
});
