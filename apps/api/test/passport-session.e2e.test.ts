import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { SignJWT, exportJWK, generateKeyPair, type JWK } from "jose";
import { randomUUID } from "node:crypto";
import { auth, bootApp, seedTenant, type Fixture, type TestApp } from "./helpers";

/**
 * Passport web session end to end inside the real app (fake Passport over HTTP): code exchange -> product session -> Passport revokes it
 * (back-channel logout, form-encoded exactly as the IdP sends it) -> the next request is refused. Also: deactivation and the max age.
 */
describe("Passport web session + back-channel logout", () => {
  let t: TestApp, f: Fixture, server: http.Server, issuer = "", priv: CryptoKey, jwk: JWK;
  const saved = { ...process.env };
  const sign = (claims: Record<string, unknown>, aud: string, header: Record<string, string> = {}) =>
    new SignJWT(claims).setProtectedHeader({ alg: "RS256", kid: "k1", ...header }).setIssuer(issuer).setAudience(aud).setSubject(SUB).setIssuedAt().setExpirationTime("10m").sign(priv);
  let nextSid = "";
  const SUB = `SUB-${Math.random().toString(36).slice(2, 10)}`; // unique per run: the staff row is linked by subject
  const S = (sid: string) => `${SUB}:${sid}`; // session ids are unique per run too
  const PHONE = `+2010${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`; // unique per run: phone linking matches across tenants

  before(async () => {
    const kp = await generateKeyPair("RS256", { extractable: true });
    priv = kp.privateKey as CryptoKey; jwk = { ...(await exportJWK(kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
    server = http.createServer(async (req, res) => {
      const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
      res.setHeader("content-type", "application/json");
      if (req.url === "/.well-known/openid-configuration") return void res.end(JSON.stringify({ issuer, authorization_endpoint: `${issuer}/auth`, token_endpoint: `${issuer}/token`, end_session_endpoint: `${issuer}/session/end`, jwks_uri: `${issuer}/jwks` }));
      if (req.url === "/jwks") return void res.end(JSON.stringify({ keys: [jwk] }));
      if (req.url === "/token") {
        const p = new URLSearchParams(Buffer.concat(chunks).toString());
        const claims = { phone_number: PHONE, phone_number_verified: true, client_id: "kiorly-pharmacy-web", sid: nextSid };
        return void res.end(JSON.stringify({ access_token: await sign(claims, "kiorex-api"), id_token: await sign({ ...claims, nonce: p.get("code_verifier")!.slice(0, 8) }, "kiorly-pharmacy-web"), token_type: "Bearer" }));
      }
      res.statusCode = 404; res.end("{}");
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    issuer = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    process.env.AUTH_MODE = "local"; process.env.AUTH_ACCEPT_PASSPORT = "true"; process.env.OIDC_ISSUER = issuer;
    t = await bootApp(); f = await seedTenant(t);
    await t.prisma.staffUser.update({ where: { id: f.users.cashier.id }, data: { phone: PHONE } });
  });
  after(async () => { process.env = { ...saved }; await t.close(); server.close(); });

  const signIn = async (sid: string) => {
    nextSid = sid;
    const verifier = `${randomUUID()}${randomUUID()}`.slice(0, 50);
    const r = await t.http.post("/api/v1/auth/oidc/exchange").send({ code: "c", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: verifier.slice(0, 8) });
    assert.equal(r.status, 200, JSON.stringify(r.body));
    return r.body as { accessToken: string; expiresIn: number };
  };
  const logout = (token: string | object) => t.http.post("/api/v1/auth/oidc/backchannel-logout").type("form").send(typeof token === "string" ? { logout_token: token } : token);
  const logoutToken = (sid: string, over: { aud?: string; jti?: string } = {}) =>
    new SignJWT({ sid, sub: SUB, events: { "http://schemas.openid.net/event/backchannel-logout": {} } }).setProtectedHeader({ alg: "RS256", typ: "logout+jwt", kid: "k1" })
      .setIssuer(issuer).setAudience(over.aud ?? "kiorly-pharmacy-web").setIssuedAt().setExpirationTime("2m").setJti(over.jti ?? randomUUID()).sign(priv);

  it("a session lasts the configured max age (default 1 h, not 8 h) and works until Passport revokes it", async () => {
    const s = await signIn(S("sid-a"));
    assert.equal(s.expiresIn, 3600);
    const me = await t.http.get("/api/v1/auth/me").set(auth(s.accessToken));
    assert.equal(me.status, 200); assert.equal(me.body.user.id, f.users.cashier.id);
    const row = await t.prisma.passportSession.findFirstOrThrow({ where: { sid: S("sid-a") } });
    assert.ok(row.expiresAt.getTime() - Date.now() <= 3600_000 && row.expiresAt.getTime() - Date.now() > 3500_000);
  });

  it("back-channel logout for the sid ends exactly that session; a replay and an invalid token change nothing", async () => {
    const keep = await signIn(S("sid-keep"));
    const gone = await signIn(S("sid-gone"));
    const tok = await logoutToken(S("sid-gone"));
    assert.equal((await logout(tok)).status, 200);
    const after = await t.http.get("/api/v1/auth/me").set(auth(gone.accessToken));
    assert.equal(after.status, 401); assert.equal(after.body.code, "SESSION_REVOKED");
    assert.equal((await t.http.get("/api/v1/auth/me").set(auth(keep.accessToken))).status, 200);
    assert.equal((await logout(tok)).status, 400, "replayed jti");
    assert.equal((await logout(await logoutToken(S("sid-keep"), { aud: "kiorly-lab-web" }))).status, 400, "wrong audience");
    assert.equal((await logout({ logout_token: "a.b.c" })).status, 400);
    assert.equal((await logout({})).status, 400);
    assert.equal((await t.http.get("/api/v1/auth/me").set(auth(keep.accessToken))).status, 200);
    assert.equal((await logout(await logoutToken(S("sid-gone")))).status, 200, "a second logout of an already ended session is accepted (idempotent)");
    const audit = await t.prisma.auditLog.findMany({ where: { orgId: f.orgId, action: "auth.session_revoked" } });
    assert.equal(audit.length, 1);
  });

  it("deactivating the staff member ends the session, and it stays ended after reactivation", async () => {
    const s = await signIn(S("sid-d"));
    const patch = await t.http.patch(`/api/v1/staff/${f.users.cashier.id}`).set(auth(f.users.owner.token)).send({ active: false });
    assert.equal(patch.status, 200);
    assert.equal((await t.http.get("/api/v1/auth/me").set(auth(s.accessToken))).status, 401);
    const rows = await t.prisma.passportSession.findMany({ where: { sid: S("sid-d") } });
    assert.ok(rows.every((r) => r.revokedAt && r.revokedReason === "staff_deactivated"));
    await t.prisma.staffUser.update({ where: { id: f.users.cashier.id }, data: { active: true } });
    assert.equal((await t.http.get("/api/v1/auth/me").set(auth(s.accessToken))).status, 401, "revoked stays revoked after reactivation");
  });
});
