import { after, afterEach, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { SignJWT, exportJWK, generateKeyPair, type JWK } from "jose";
import { createHash } from "node:crypto";
import { resetDiscoveryCache, passportConfig, normalizePhone } from "./passport";
import { PassportService } from "./passport.service";
import { TokenVerifier } from "./token-verifier";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; resetDiscoveryCache(); });

let server: http.Server; let issuer = ""; let priv: CryptoKey; let jwk: JWK; let lastTokenBody = "";
const claimsFor = (over: Record<string, unknown> = {}) => ({ phone_number: "+201000002004", phone_number_verified: true, client_id: "kiorly-pharmacy-web", sid: "sid-1", acr: "urn:kiorex:acr:basic", ...over });
const sign = (claims: Record<string, unknown>, aud: string, over: { iss?: string; sub?: string } = {}) =>
  new SignJWT(claims).setProtectedHeader({ alg: "RS256", kid: "k1" }).setIssuer(over.iss ?? issuer).setAudience(aud).setSubject(over.sub ?? "SUB-1").setIssuedAt().setExpirationTime("10m").sign(priv);

before(async () => {
  const kp = await generateKeyPair("RS256", { extractable: true });
  priv = kp.privateKey as CryptoKey; jwk = { ...(await exportJWK(kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
  server = http.createServer(async (req, res) => {
    const chunks: Buffer[] = []; for await (const c of req) chunks.push(c as Buffer);
    res.setHeader("content-type", "application/json");
    if (req.url === "/.well-known/openid-configuration") return void res.end(JSON.stringify({ issuer, authorization_endpoint: `${issuer}/auth`, token_endpoint: `${issuer}/token`, end_session_endpoint: `${issuer}/session/end`, jwks_uri: `${issuer}/jwks` }));
    if (req.url === "/jwks") return void res.end(JSON.stringify({ keys: [jwk] }));
    if (req.url === "/token") {
      lastTokenBody = Buffer.concat(chunks).toString();
      const p = new URLSearchParams(lastTokenBody);
      if (p.get("code") !== "good-code") { res.statusCode = 400; return void res.end(JSON.stringify({ error: "invalid_grant" })); }
      // the nonce is bound to the code verifier in this fake only so the test can control it
      const nonce = createHash("sha256").update(p.get("code_verifier") ?? "").digest("base64url").slice(0, 8);
      return void res.end(JSON.stringify({ access_token: await sign(claimsFor(), "kiorex-api"), id_token: await sign({ nonce, ...claimsFor() }, "kiorly-pharmacy-web"), token_type: "Bearer" }));
    }
    res.statusCode = 404; res.end("{}");
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", r));
  issuer = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
});
after(() => server.close());

const dual = () => { process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "local"; process.env.AUTH_ACCEPT_PASSPORT = "true"; process.env.OIDC_ISSUER = issuer; };

describe("Passport config", () => {
  it("is off by default, on for AUTH_MODE=oidc, and never dual in production", () => {
    assert.equal(passportConfig({ OIDC_ISSUER: "http://i" } as never), null);
    assert.ok(passportConfig({ AUTH_MODE: "oidc", OIDC_ISSUER: "http://i/" } as never));
    assert.ok(passportConfig({ AUTH_ACCEPT_PASSPORT: "true", OIDC_ISSUER: "http://i" } as never));
    assert.equal(passportConfig({ AUTH_ACCEPT_PASSPORT: "true", NODE_ENV: "production", OIDC_ISSUER: "http://i" } as never), null);
    assert.equal(passportConfig({ AUTH_MODE: "oidc", NODE_ENV: "production", OIDC_ISSUER: "http://i" } as never)!.phoneLink, false);
  });
  it("normalizes phones strictly", () => {
    assert.equal(normalizePhone("+20 100 000-2004"), "+201000002004");
    assert.equal(normalizePhone("01000002004"), null);
  });
});

describe("TokenVerifier with Passport", () => {
  it("accepts a Passport access token from an allowed client and refuses other clients, audiences and issuers", async () => {
    dual();
    const v = new TokenVerifier();
    const ok = await v.verify(await sign(claimsFor({ client_id: "kiorly-team" }), "kiorex-api"));
    assert.equal(ok.passport, true); assert.equal(ok.sub, "SUB-1"); assert.equal(ok.mfa, false);
    assert.equal((await v.verify(await sign(claimsFor({ acr: "urn:kiorex:acr:mfa" }), "kiorex-api"))).mfa, true);
    await assert.rejects(v.verify(await sign(claimsFor({ client_id: "kiorex-web" }), "kiorex-api")));
    await assert.rejects(v.verify(await sign(claimsFor(), "someone-else")));
    await assert.rejects(v.verify(await sign(claimsFor(), "kiorex-api", { iss: "http://evil" })));
  });
  it("without Passport configured only product tokens verify", async () => {
    process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "local"; delete process.env.OIDC_ISSUER;
    const v = new TokenVerifier();
    assert.equal((await v.verify(await v.issueLocal("staff-1"))).staffId, "staff-1");
    await assert.rejects(v.verify(await sign(claimsFor(), "kiorex-api")));
  });
  it("AUTH_MODE=oidc: password-login tokens are refused, the Passport web session is accepted", async () => {
    process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "oidc"; process.env.OIDC_ISSUER = issuer;
    const v = new TokenVerifier();
    await assert.rejects(v.verify(await v.issueLocal("staff-1")));
    const s = await v.verify(await v.issueSession("staff-1", true));
    assert.equal(s.staffId, "staff-1"); assert.equal(s.mfa, true);
  });
});

function fakePrisma(staff: Array<Record<string, unknown>>) {
  const audits: unknown[] = [];
  const prisma = {
    staffUser: {
      findFirst: async ({ where }: { where: { subject?: string } }) => staff.find((s) => s.active && s.subject === where.subject) ?? null,
      findMany: async ({ where }: { where: { phone: string } }) => staff.filter((s) => s.active && s.phone === where.phone && s.subject == null),
      update: async ({ where, data }: { where: { id: string }; data: Record<string, unknown> }) => Object.assign(staff.find((s) => s.id === where.id)!, data),
    },
  };
  return { prisma, audits, audit: { record: async (e: unknown) => { audits.push(e); } } };
}
const row = (over: Record<string, unknown> = {}) => ({ id: "st1", orgId: "o1", active: true, phone: "+201000002004", subject: null, role: "PHARMACIST", tenant: { id: "o1" }, ...over });

describe("Passport staff mapping", () => {
  it("first login links the unique staff row by verified phone, audited; later logins match by subject", async () => {
    dual();
    const f = fakePrisma([row()]);
    const svc = new PassportService(f.prisma as never, f.audit as never, new TokenVerifier());
    const cfg = passportConfig()!;
    const a = await svc.resolveStaff({ sub: "SUB-1", phone_number: "+201000002004", phone_number_verified: true }, cfg);
    assert.equal(a.id, "st1"); assert.equal(f.audits.length, 1);
    const b = await svc.resolveStaff({ sub: "SUB-1" }, cfg);
    assert.equal(b.id, "st1"); assert.equal(f.audits.length, 1);
  });
  it("refuses unverified phones, ambiguous matches, other subjects and disabled phone linking", async () => {
    dual();
    const cfg = passportConfig()!;
    const mk = (rows: Array<Record<string, unknown>>) => { const f = fakePrisma(rows); return new PassportService(f.prisma as never, f.audit as never, new TokenVerifier()); };
    const code = (e: unknown) => (e as { code?: string }).code;
    await assert.rejects(mk([row()]).resolveStaff({ sub: "S", phone_number: "+201000002004", phone_number_verified: false }, cfg), (e) => code(e) === "PASSPORT_NOT_LINKED");
    await assert.rejects(mk([row(), row({ id: "st2" })]).resolveStaff({ sub: "S", phone_number: "+201000002004", phone_number_verified: true }, cfg), (e) => code(e) === "PASSPORT_NOT_LINKED");
    await assert.rejects(mk([row({ subject: "OTHER" })]).resolveStaff({ sub: "S", phone_number: "+201000002004", phone_number_verified: true }, cfg), (e) => code(e) === "PASSPORT_NOT_LINKED");
    await assert.rejects(mk([row()]).resolveStaff({ sub: "S", phone_number: "+201000002004", phone_number_verified: true }, { ...cfg, phoneLink: false }), (e) => code(e) === "PASSPORT_NOT_LINKED");
  });
});

describe("Passport web exchange", () => {
  const nonceFor = (verifier: string) => createHash("sha256").update(verifier).digest("base64url").slice(0, 8);
  it("redeems the code server-side, maps the staff, issues a session and the RP-initiated logout URL with id_token_hint", async () => {
    dual();
    const f = fakePrisma([row({ subject: "SUB-1" })]);
    const svc = new PassportService(f.prisma as never, f.audit as never, new TokenVerifier());
    const verifier = "v".repeat(50);
    const out = await svc.exchange({ code: "good-code", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: nonceFor(verifier) });
    assert.ok(out.accessToken);
    assert.match(lastTokenBody, /client_id=kiorly-pharmacy-web/); assert.match(lastTokenBody, /code_verifier=v+/);
    const u = new URL(out.endSessionUrl!);
    assert.equal(u.origin + u.pathname, `${issuer}/session/end`);
    assert.ok(u.searchParams.get("id_token_hint")); assert.equal(u.searchParams.get("post_logout_redirect_uri"), "http://localhost:5192/");
    assert.equal((await new TokenVerifier().verify(out.accessToken)).staffId, "st1");
  });
  it("rejects a bad code, a wrong nonce, and unlinked identities", async () => {
    dual();
    const f = fakePrisma([row({ subject: "SUB-1" })]);
    const svc = new PassportService(f.prisma as never, f.audit as never, new TokenVerifier());
    const verifier = "v".repeat(50);
    const code = (e: unknown) => (e as { code?: string }).code;
    await assert.rejects(svc.exchange({ code: "bad", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: nonceFor(verifier) }), (e) => code(e) === "PASSPORT_EXCHANGE_FAILED");
    await assert.rejects(svc.exchange({ code: "good-code", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: "wrong" }), (e) => code(e) === "PASSPORT_EXCHANGE_FAILED");
    const f2 = fakePrisma([]);
    const svc2 = new PassportService(f2.prisma as never, f2.audit as never, new TokenVerifier());
    await assert.rejects(svc2.exchange({ code: "good-code", codeVerifier: verifier, redirectUri: "http://localhost:5192/auth/callback", nonce: nonceFor(verifier) }), (e) => code(e) === "PASSPORT_NOT_LINKED");
  });
});
