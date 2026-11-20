import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, key, openShift, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";

describe("Customer registry, loyalty, merge (standalone: no Kiorly needed)", () => {
  let t: TestApp, f: Fixture;
  before(async () => { t = await bootApp(); f = await seedTenant(t); await openShift(t, f, "100.00"); });
  after(async () => { await t.close(); });
  const owner = () => auth(f.users.owner.token);
  const cashier = () => auth(f.users.cashier.token);
  const mk = async (body: object) => { const r = await t.http.post("/api/v1/customers").set(owner()).send(body); assert.equal(r.status, 201, JSON.stringify(r.body)); return r.body as { id: string; customerNo: string }; };

  it("creates customers with numbers, allergies, conditions, consent; never exposes the national-ID hash", async () => {
    const c = await mk({ displayName: "Mona Hassan", phone: "+20 100 111 2222", allergies: ["Penicillin ", "penicillin"], chronicConditions: ["Diabetes"], nationalId: "29801011234567", consentDataProcessing: true, dateOfBirth: "1990-05-01" });
    assert.match(c.customerNo, /^CUS-\d{6}$/);
    const g = await t.http.get(`/api/v1/customers/${c.id}`).set(owner());
    assert.deepEqual(g.body.allergies, ["penicillin"]);
    assert.equal(g.body.nationalIdLast4, "4567");
    assert.equal(g.body.nationalIdHash, undefined);
    assert.equal(g.body.consentDataProcessing, true);
    assert.equal(g.body.birthYear, 1990);
    const c2 = await mk({ displayName: "Second", phone: "+201001119999" });
    assert.notEqual(c2.customerNo, c.customerNo);
  });

  it("refuses a duplicate phone unless forced; search by name, phone, number, id-last4", async () => {
    await mk({ displayName: "Ali Samir", phone: "01012345678" });
    const dup = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Ali S.", phone: "01012345678" });
    assert.equal(dup.status, 409); assert.equal(dup.body.code, "DUPLICATE_CUSTOMER");
    const forced = await t.http.post("/api/v1/customers").set(owner()).send({ displayName: "Ali S.", phone: "01012345678", force: true, nationalId: "30001010000777" });
    assert.equal(forced.status, 201);
    assert.equal((await t.http.get("/api/v1/customers?q=samir").set(owner())).body.total, 1);
    assert.equal((await t.http.get("/api/v1/customers?q=0101234").set(owner())).body.total, 2);
    assert.equal((await t.http.get(`/api/v1/customers?q=${forced.body.customerNo}`).set(owner())).body.total, 1);
    assert.equal((await t.http.get("/api/v1/customers?q=0777").set(owner())).body.total, 1);
  });

  it("notes, family links (both directions, no duplicates), consent", async () => {
    const a = await mk({ displayName: "Parent P" }), b = await mk({ displayName: "Child C" });
    const n = await t.http.post(`/api/v1/customers/${a.id}/notes`).set(cashier()).send({ body: "Prefers generics", kind: "NOTE" });
    assert.equal(n.status, 201);
    assert.equal((await t.http.get(`/api/v1/customers/${a.id}/notes`).set(owner())).body.length, 1);
    const l = await t.http.post(`/api/v1/customers/${a.id}/family`).set(owner()).send({ relatedPatientId: b.id, relation: "parent" });
    assert.equal(l.status, 201);
    assert.equal((await t.http.post(`/api/v1/customers/${b.id}/family`).set(owner()).send({ relatedPatientId: a.id, relation: "child" })).status, 409);
    assert.equal((await t.http.get(`/api/v1/customers/${b.id}/family`).set(owner())).body[0].person.displayName, "Parent P");
    assert.equal((await t.http.put(`/api/v1/customers/${a.id}/consent`).set(owner()).send({ dataProcessing: true, marketing: true })).body.consentMarketing, true);
    assert.equal((await t.http.delete(`/api/v1/customers/${a.id}/family/${l.body.id}`).set(owner())).status, 200);
  });

  it("loyalty accrues on a sale without any credit account, tiers up, redeems as a tender, and is auditable", async () => {
    const c = await mk({ displayName: "Loyal Lina", phone: "01099990000" });
    const drug = await seedDrug(t, f, { price: "100.00" });
    await receive(t, f, { drugId: drug.id, quantity: 50 });
    const sale = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), patientId: c.id, lines: [{ drugId: drug.id, quantity: 3 }], payments: [{ method: "CASH", amount: "300.00" }] });
    assert.equal(sale.status, 201, JSON.stringify(sale.body));
    let loy = (await t.http.get(`/api/v1/customers/${c.id}/loyalty`).set(owner())).body;
    assert.equal(loy.points, 30); // 300 / 10 EGP = 30 pts at BRONZE
    assert.equal(loy.entries[0].kind, "EARN");
    // redeem 20 points = 10.00 EGP as a LOYALTY_POINTS tender
    const r = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), patientId: c.id, lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "LOYALTY_POINTS", amount: "10.00" }, { method: "CASH", amount: "90.00" }] });
    assert.equal(r.status, 201, JSON.stringify(r.body));
    loy = (await t.http.get(`/api/v1/customers/${c.id}/loyalty`).set(owner())).body;
    assert.equal(loy.points, 30 - 20 + 9); // earn on the 90 EGP paid in money
    // cannot redeem more than the balance
    const over = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), patientId: c.id, lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "LOYALTY_POINTS", amount: "100.00" }] });
    assert.equal(over.status, 409); assert.equal(over.body.code, "INSUFFICIENT_POINTS");
    // redemption needs a customer
    const anon = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), lines: [{ drugId: drug.id, quantity: 1 }], payments: [{ method: "LOYALTY_POINTS", amount: "10.00" }, { method: "CASH", amount: "90.00" }] });
    assert.equal(anon.status, 400);
    // manager-only adjustments; cashier refused
    assert.equal((await t.http.post(`/api/v1/customers/${c.id}/loyalty/adjust`).set(cashier()).send({ points: 5, note: "goodwill" })).status, 403);
    assert.equal((await t.http.post(`/api/v1/customers/${c.id}/loyalty/adjust`).set(owner()).send({ points: 5, note: "goodwill" })).body.balance, 24);
    assert.equal((await t.http.post(`/api/v1/customers/${c.id}/loyalty/adjust`).set(owner()).send({ points: -500, note: "too much" })).status, 409);
  });

  it("merges duplicates: references move, allergies unioned, credit + loyalty combined, source hidden", async () => {
    const keep = await mk({ displayName: "Heba Nabil", phone: "01055550001", allergies: ["sulfa"] });
    const dupe = await mk({ displayName: "Heba Nabil", phone: "01055550002", allergies: ["latex"], chronicConditions: ["asthma"] });
    const dups = await t.http.get("/api/v1/customers/duplicates").set(owner());
    assert.ok(dups.body.groups.some((g: { customers: Array<{ id: string }> }) => g.customers.some((x) => x.id === keep.id) && g.customers.some((x) => x.id === dupe.id)));
    await t.http.post(`/api/v1/customers/${dupe.id}/credit-account`).set(owner()).send({ creditLimit: "300.00" });
    const drug = await seedDrug(t, f, { price: "50.00" });
    await receive(t, f, { drugId: drug.id, quantity: 20 });
    const acct = (await t.http.get(`/api/v1/customers/${dupe.id}`).set(owner())).body.customerAccount;
    const s = await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), customerAccountId: acct.id, lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CUSTOMER_CREDIT", amount: "100.00" }] });
    assert.equal(s.status, 201, JSON.stringify(s.body));
    await t.http.post(`/api/v1/customers/${dupe.id}/notes`).set(owner()).send({ body: "old note" });
    const m = await t.http.post(`/api/v1/customers/${keep.id}/merge`).set(owner()).send({ sourceId: dupe.id });
    assert.equal(m.status, 201, JSON.stringify(m.body));
    assert.deepEqual([...m.body.customer.allergies].sort(), ["latex", "sulfa"]);
    assert.deepEqual(m.body.customer.chronicConditions, ["asthma"]);
    assert.equal(m.body.customer.customerAccount.balance, "100.00");
    assert.equal(m.body.moved.notes, 1);
    assert.equal(m.body.customer.loyalty.points, 10, "points earned on the 100 EGP credit sale moved over");
    assert.equal((await t.http.get(`/api/v1/customers?q=01055550002`).set(owner())).body.total, 0, "source hidden from search");
    assert.equal((await t.http.post(`/api/v1/customers/${keep.id}/merge`).set(owner()).send({ sourceId: dupe.id })).status, 409);
    assert.equal((await t.http.post(`/api/v1/customers/${keep.id}/merge`).set(cashier()).send({ sourceId: dupe.id })).status, 403);
    assert.ok((await t.prisma.auditLog.count({ where: { orgId: f.orgId, action: "customer.merge" } })) >= 1);
  });

  it("history shows Rx and OTC purchases; tenants are isolated", async () => {
    const c = await mk({ displayName: "History Hana" });
    const drug = await seedDrug(t, f, { price: "20.00", brandName: "Hist-OTC" });
    await receive(t, f, { drugId: drug.id, quantity: 20 });
    await t.http.post("/api/v1/pos/sales").set(cashier()).send({ idempotencyKey: key(), patientId: c.id, lines: [{ drugId: drug.id, quantity: 2 }], payments: [{ method: "CASH", amount: "40.00" }] });
    const h = await t.http.get(`/api/v1/customers/${c.id}/history`).set(owner());
    assert.equal(h.body.items[0].kind, "OTC"); assert.equal(h.body.items[0].drug.brandName, "Hist-OTC");
    const other = await seedTenant(t);
    assert.equal((await t.http.get(`/api/v1/customers/${c.id}`).set(auth(other.users.owner.token))).status, 404);
    assert.equal((await t.http.get("/api/v1/customers").set(auth(other.users.owner.token))).body.total, 0);
  });
});
