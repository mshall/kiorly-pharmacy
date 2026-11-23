import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/** Staff management: phone (E.164) for Kiorex Passport linking, unique inside the tenant, audited without the number, permission-guarded. */
describe("staff phone (Passport linking input)", () => {
  let t: TestApp, a: Fixture, b: Fixture;
  before(async () => { t = await bootApp(); a = await seedTenant(t, { edition: "ENTERPRISE" }); b = await seedTenant(t, { edition: "ENTERPRISE" }); });
  after(async () => { await t.close(); });

  const RUN = Math.random().toString(36).slice(2, 8);
  const body = (email: string, over: object = {}) => ({ displayName: "New Cashier", email: email.replace("@", `.${RUN}@`), password: "Passw0rd!x", role: "CASHIER", ...over });

  it("owner creates staff with a phone (formatting tolerated, stored as E.164), lists it, and the audit log holds no number", async () => {
    const r = await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body("ph1@x.test", { phone: "+20 100 000-3001" }));
    assert.equal(r.status, 201, JSON.stringify(r.body));
    assert.equal(r.body.phone, "+201000003001"); assert.equal(r.body.passportLinked, false); assert.equal(r.body.subject, undefined); assert.equal(r.body.passwordHash, undefined);
    const list = await t.http.get("/api/v1/staff").set(auth(a.users.owner.token));
    assert.equal(list.body.find((s: { id: string }) => s.id === r.body.id).phone, "+201000003001");
    const audits = await t.prisma.auditLog.findMany({ where: { orgId: a.orgId, entityId: r.body.id } });
    assert.ok(audits.length >= 1);
    assert.doesNotMatch(JSON.stringify(audits), /\+?201000003001/);
  });

  it("rejects non-E.164 numbers (400 INVALID_PHONE) and duplicates inside the tenant (409 PHONE_TAKEN); another tenant may reuse the number", async () => {
    for (const bad of ["01000003002", "+1", "abc", "+20 (0)1", "+201000003002999999"]) {
      const r = await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body(`bad${Math.random()}@x.test`, { phone: bad }));
      assert.equal(r.status, 400, bad); assert.equal(r.body.code, "INVALID_PHONE", bad);
    }
    const ok = await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body("ph2@x.test", { phone: "+201000003003" }));
    assert.equal(ok.status, 201);
    const dup = await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body("ph3@x.test", { phone: "+201000003003" }));
    assert.equal(dup.status, 409); assert.equal(dup.body.code, "PHONE_TAKEN");
    const other = await t.http.post("/api/v1/staff").set(auth(b.users.owner.token)).send(body("ph4@x.test", { phone: "+201000003003" }));
    assert.equal(other.status, 201, "uniqueness is per tenant");
  });

  it("PATCH sets, changes and clears the phone, edits role/active, and refuses duplicates", async () => {
    const mk = async (email: string, phone?: string) => (await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body(email, phone ? { phone } : {}))).body;
    const s1 = await mk("p1@x.test"), s2 = await mk("p2@x.test", "+201000003010");
    const set = await t.http.patch(`/api/v1/staff/${s1.id}`).set(auth(a.users.owner.token)).send({ phone: "+201000003011", role: "ASSISTANT" });
    assert.equal(set.status, 200, JSON.stringify(set.body)); assert.equal(set.body.phone, "+201000003011"); assert.equal(set.body.role, "ASSISTANT");
    assert.equal((await t.http.patch(`/api/v1/staff/${s1.id}`).set(auth(a.users.owner.token)).send({ phone: "+201000003010" })).body.code, "PHONE_TAKEN");
    assert.equal((await t.http.patch(`/api/v1/staff/${s1.id}`).set(auth(a.users.owner.token)).send({ phone: "+201000003011" })).status, 200, "own number is not a duplicate");
    assert.equal((await t.http.patch(`/api/v1/staff/${s1.id}`).set(auth(a.users.owner.token)).send({ phone: "nope" })).body.code, "INVALID_PHONE");
    const cleared = await t.http.patch(`/api/v1/staff/${s2.id}`).set(auth(a.users.owner.token)).send({ phone: null });
    assert.equal(cleared.status, 200); assert.equal(cleared.body.phone, null);
    const off = await t.http.patch(`/api/v1/staff/${s2.id}`).set(auth(a.users.owner.token)).send({ active: false });
    assert.equal(off.body.active, false);
    const upd = await t.prisma.auditLog.findMany({ where: { orgId: a.orgId, entityId: s1.id, action: "staff.update" } });
    assert.ok(upd.every((x) => !/\+?2010000030/.test(JSON.stringify(x))));
    assert.ok(upd.some((x) => (x.meta as { linkKeyChanged?: boolean }).linkKeyChanged === true));
  });

  it("is permission-guarded and tenant-scoped; owners cannot deactivate or re-role themselves", async () => {
    const created = (await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body("p9@x.test", { phone: "+201000003020" }))).body;
    for (const role of ["cashier", "pharmacist", "manager"] as const) {
      assert.equal((await t.http.get("/api/v1/staff").set(auth(a.users[role].token))).status, 403, role);
      assert.equal((await t.http.patch(`/api/v1/staff/${created.id}`).set(auth(a.users[role].token)).send({ phone: "+201000003021" })).status, 403, role);
    }
    assert.equal((await t.http.patch(`/api/v1/staff/${created.id}`).set(auth(b.users.owner.token)).send({ phone: "+201000003022" })).status, 404, "other tenant");
    assert.equal((await t.http.get("/api/v1/staff").set(auth(b.users.owner.token))).body.some((s: { id: string }) => s.id === created.id), false);
    const self = await t.http.patch(`/api/v1/staff/${a.users.owner.id}`).set(auth(a.users.owner.token)).send({ active: false });
    assert.equal(self.status, 409); assert.equal(self.body.code, "CANNOT_CHANGE_SELF");
    assert.equal((await t.http.patch(`/api/v1/staff/${a.users.owner.id}`).set(auth(a.users.owner.token)).send({ role: "CASHIER" })).status, 409);
  });

  it("a pharmacist role still needs a licence number when editing", async () => {
    const s = (await t.http.post("/api/v1/staff").set(auth(a.users.owner.token)).send(body("p10@x.test"))).body;
    const r = await t.http.patch(`/api/v1/staff/${s.id}`).set(auth(a.users.owner.token)).send({ role: "PHARMACIST" });
    assert.equal(r.status, 400); assert.equal(r.body.code, "LICENCE_REQUIRED");
    assert.equal((await t.http.patch(`/api/v1/staff/${s.id}`).set(auth(a.users.owner.token)).send({ role: "PHARMACIST", pharmacistLicenceNo: "SYN-1" })).status, 200);
  });
});
