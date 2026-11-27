import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { SignJWT, exportJWK, generateKeyPair, type JWK } from "jose";
import { randomUUID } from "node:crypto";
import { auth, bootApp, seedTenant, PASSWORD, type Fixture, type TestApp } from "./helpers";

/**
 * AUTH_MODE=both (founder decision 28 Nov 2026): e-mail + password AND Kiorex Passport side by side, also in a production-like process.
 * Passport identities exist by their verified phone only; an organisation owner created by self sign-up is bound to Passport by the sign-up claim, a staff member added by the
 * owner (phone typed by an authorised person) is bound by the verified phone when OIDC_PHONE_LINK=true. Privileged roles must use Passport (MFA).
 */
describe("AUTH_MODE=both", () => {
  let t: TestApp, f: Fixture, server: http.Server, issuer = "", priv: CryptoKey, jwk: JWK;
  const saved = { ...process.env };
  let SUB = "", PHONE = "", VERIFIED = true;
  const sign = (claims: Record<string, unknown>, aud: string) => new SignJWT(claims).setProtectedHeader({ alg: "RS256", kid: "k1" }).setIssuer(issuer).setAudience(aud).setSubject(SUB).setIssuedAt().setExpirationTime("10m").sign(priv);
  const fresh = () => { SUB = `SUB-${Math.random().toString(36).slice(2, 12)}`; PHONE = `+2011${String(Math.floor(Math.random() * 1e8)).padStart(8, "0")}`; VERIFIED = true; };

  before(async () => {
    const kp = await generateKeyPair("RS256", { extractable: true });
    priv = kp.privateKey as CryptoKey; jwk = { ...(await exportJWK(kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
    server = http.createServer(async (req, res) => {
      const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
      res.setHeader("content-type", "application/json");
      if (req.url === "/.well-known/openid-configuration") return void res.end(JSON.stringify({ issuer, authorization_endpoint: `${issuer}/auth`, token_endpoint: `${issuer}/token`, jwks_uri: `${issuer}/jwks` }));
      if (req.url === "/jwks") return void res.end(JSON.stringify({ keys: [jwk] }));
      if (req.url === "/token") {
        const p = new URLSearchParams(Buffer.concat(chunks).toString());
        const claims = { phone_number: PHONE, phone_number_verified: VERIFIED, client_id: "kiorly-pharmacy-web" };
        return void res.end(JSON.stringify({ access_token: await sign(claims, "kiorex-api"), id_token: await sign({ ...claims, nonce: p.get("code_verifier")!.slice(0, 8) }, "kiorly-pharmacy-web"), token_type: "Bearer" }));
      }
      res.statusCode = 404; res.end("{}");
    });
    await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
    issuer = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
    process.env.AUTH_MODE = "both"; process.env.OIDC_ISSUER = issuer; process.env.OIDC_PHONE_LINK = "true"; process.env.AUTH_JWT_SECRET = "test-secret-test-secret-test-secret-1";
    t = await bootApp(); f = await seedTenant(t);
    await t.prisma.staffUser.update({ where: { id: f.users.chainOps.id }, data: { active: false } }); // room under the plan's user limit
  });
  after(async () => { process.env = { ...saved }; await t.close(); server.close(); });

  const exchange = (claim?: string) => {
    const verifier = `${randomUUID()}${randomUUID()}`.slice(0, 50);
    return t.http.post("/api/v1/auth/oidc/exchange").send({ code: "c", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: verifier.slice(0, 8), ...(claim ? { claim } : {}) });
  };
  const prod = async <T>(fn: () => Promise<T>) => { process.env.NODE_ENV = "production"; try { return await fn(); } finally { process.env.NODE_ENV = "test"; } };

  it("the login page config offers both: password and Passport", async () => {
    const r = await t.http.get("/api/v1/auth/config");
    assert.equal(r.body.localLogin, true); assert.ok(r.body.passport?.authorizationEndpoint);
  });

  it("production-like: a cashier signs in with e-mail and password; the owner is told to use Passport; the Home handoff follows the same rule", async () => {
    await prod(async () => {
      const cashier = await t.http.post("/api/v1/auth/login").send({ email: f.users.cashier.email, password: PASSWORD });
      assert.equal(cashier.status, 200);
      assert.equal((await t.http.get("/api/v1/auth/me").set(auth(cashier.body.accessToken))).status, 200);
      const owner = await t.http.post("/api/v1/auth/login").send({ email: f.users.owner.email, password: PASSWORD });
      assert.equal(owner.status, 403); assert.equal(owner.body.code, "PASSPORT_REQUIRED_FOR_ROLE");
      assert.equal((await t.http.post("/api/v1/auth/login").send({ email: f.users.cashier.email, password: "wrong-password" })).status, 401);
    });
  });

  it("a staff member added by the owner with a phone is bound by the verified Passport phone on the first sign-in (no manual step)", async () => {
    fresh();
    const add = await t.http.post("/api/v1/staff").set(auth(f.users.owner.token)).send({ displayName: "New Cashier", email: `nc.${randomUUID().slice(0, 6)}@test.kiorly.local`, password: "a-long-password-1", role: "CASHIER", phone: PHONE });
    assert.equal(add.status, 201, JSON.stringify(add.body));
    const r = await prod(() => exchange());
    assert.equal(r.status, 200, JSON.stringify(r.body));
    const row = await t.prisma.staffUser.findUniqueOrThrow({ where: { id: add.body.id } });
    assert.equal(row.subject, SUB);
  });

  it("an unverified Passport phone never binds anything", async () => {
    fresh(); VERIFIED = false;
    await t.http.post("/api/v1/staff").set(auth(f.users.owner.token)).send({ displayName: "Unv", email: `unv.${randomUUID().slice(0, 6)}@test.kiorly.local`, password: "a-long-password-1", role: "CASHIER", phone: PHONE });
    const r = await prod(() => exchange());
    assert.equal(r.status, 403); assert.equal(r.body.code, "PASSPORT_NOT_LINKED");
  });

  it("self sign-up returns a claim; the same browser's Passport sign-in binds the owner with the verified phone; the claim is single use", async () => {
    fresh();
    const email = `own.${randomUUID().slice(0, 6)}@test.kiorly.local`;
    const su = await t.http.post("/api/v1/onboarding/signup").send({ pharmacyName: "Claim Pharmacy", ownerName: "Claim Owner", email, password: "a-long-password-1" });
    assert.equal(su.status, 201, JSON.stringify(su.body)); assert.ok(su.body.ownerClaim);
    // a claim with an unverified phone is refused and does not consume the claim
    VERIFIED = false;
    assert.equal((await prod(() => exchange(su.body.ownerClaim))).body.code, "PHONE_NOT_VERIFIED");
    VERIFIED = true;
    const ok = await prod(() => exchange(su.body.ownerClaim));
    assert.equal(ok.status, 200, JSON.stringify(ok.body));
    const owner = await t.prisma.staffUser.findUniqueOrThrow({ where: { id: su.body.ownerId } });
    assert.equal(owner.subject, SUB); assert.equal(owner.phone, PHONE);
    // replay of the claim by another identity: refused
    fresh();
    assert.equal((await prod(() => exchange(su.body.ownerClaim))).body.code, "CLAIM_INVALID");
    // a forged claim is refused
    assert.equal((await prod(() => exchange("not.a.claim"))).body.code, "CLAIM_INVALID");
    // organisation isolation: the bound session sees only its own organisation
    const again = await (async () => { SUB = owner.subject!; PHONE = owner.phone!; return prod(() => exchange()); })();
    assert.equal(again.status, 200);
  });
});
