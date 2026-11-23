import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/** ADR-038 amendment: per-organisation default sign-in method (setting, audit, permission, public non-enumerating config). */
describe("default sign-in method per organisation", () => {
  let t: TestApp, f: Fixture, server: http.Server;
  const saved = { ...process.env };
  before(async () => {
    let issuer = "";
    server = http.createServer((req, res) => {
      res.setHeader("content-type", "application/json");
      if (req.url === "/.well-known/openid-configuration") return void res.end(JSON.stringify({ issuer, authorization_endpoint: `${issuer}/auth`, token_endpoint: `${issuer}/token`, jwks_uri: `${issuer}/jwks` }));
      res.statusCode = 404; res.end("{}");
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    issuer = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    process.env.AUTH_MODE = "local"; process.env.AUTH_ACCEPT_PASSPORT = "true"; process.env.OIDC_ISSUER = issuer;
    delete process.env.SIGNIN_DEFAULT_METHOD;
    t = await bootApp(); f = await seedTenant(t);
    // a standalone pharmacy: no Kiorex org id, no integration client, no Passport-linked staff
    await t.prisma.tenant.update({ where: { id: f.orgId }, data: { externalOrgId: null } });
    await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { active: false } });
    await t.prisma.staffUser.updateMany({ where: { orgId: f.orgId }, data: { subject: null } });
  });
  after(async () => { process.env = { ...saved }; await t.close(); server.close(); });
  const cfg = async (q = "") => (await t.http.get(`/api/v1/auth/config${q}`)).body;
  const owner = () => auth(f.users.owner.token);

  it("standalone org with no choice: PASSWORD; unknown org and no org: the deployment default, same shape", async () => {
    const known = await cfg(`?org=${f.orgId}`);
    assert.equal(known.passportAvailable, true);
    assert.equal(known.defaultMethod, "PASSWORD");
    const unknown = await cfg("?org=does-not-exist");
    assert.deepEqual(Object.keys(unknown).sort(), Object.keys(known).sort());
    assert.equal(unknown.defaultMethod, "PASSWORD");
    process.env.SIGNIN_DEFAULT_METHOD = "PASSPORT";
    assert.equal((await cfg()).defaultMethod, "PASSPORT");
    assert.equal((await cfg("?org=does-not-exist")).defaultMethod, "PASSPORT");
    assert.equal((await cfg(`?org=${f.orgId}`)).defaultMethod, "PASSWORD", "an org answers for itself, not the deployment");
    delete process.env.SIGNIN_DEFAULT_METHOD;
  });

  it("an org linked to Kiorex is PASSPORT automatically; the owner can override it, with an audit entry", async () => {
    const s0 = await t.http.get("/api/v1/settings").set(owner());
    assert.equal(s0.body.defaultSignInMethod, null);
    assert.equal(s0.body.linkedToKiorex, false);
    await t.prisma.integrationClient.updateMany({ where: { orgId: f.orgId }, data: { active: true } });
    assert.equal((await cfg(`?org=${f.orgId}`)).defaultMethod, "PASSPORT");
    assert.equal((await t.http.get("/api/v1/settings").set(owner())).body.effectiveSignInMethod, "PASSPORT");
    const set = await t.http.patch("/api/v1/settings").set(owner()).send({ defaultSignInMethod: "PASSWORD" });
    assert.equal(set.status, 200, JSON.stringify(set.body));
    assert.equal((await cfg(`?org=${f.orgId}`)).defaultMethod, "PASSWORD");
    assert.equal((await t.http.get("/api/v1/settings").set(owner())).body.defaultSignInMethod, "PASSWORD");
    const audit = await t.prisma.auditLog.findFirst({ where: { orgId: f.orgId, action: "settings.default_signin_method" } });
    assert.equal((audit?.meta as { to?: string } | null)?.to, "PASSWORD");
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ defaultSignInMethod: null })).status, 200);
    assert.equal((await t.http.get("/api/v1/settings").set(owner())).body.defaultSignInMethod, null);
  });

  it("only roles with settings.write may change it; invalid values are refused", async () => {
    for (const who of ["cashier", "manager"] as const) assert.equal((await t.http.patch("/api/v1/settings").set(auth(f.users[who].token)).send({ defaultSignInMethod: "PASSPORT" })).status, 403, who);
    assert.equal((await t.http.patch("/api/v1/settings").set(owner()).send({ defaultSignInMethod: "TELEPATHY" })).status, 400);
  });
});
