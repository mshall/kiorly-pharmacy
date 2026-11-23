import { after, afterEach, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { SignJWT, createLocalJWKSet, exportJWK, generateKeyPair, type JWK } from "jose";
import { passportConfig, sessionMaxAge } from "./passport";
import { PassportSessions } from "./passport-sessions.service";
import { BACKCHANNEL_LOGOUT_EVENT, KX_EVENT_SUBJECT_DELETED } from "./backchannel";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });

const ISSUER = "http://passport.test";
let priv: CryptoKey; let other: CryptoKey; let jwk: JWK;
before(async () => {
  const kp = await generateKeyPair("RS256", { extractable: true });
  priv = kp.privateKey as CryptoKey; jwk = { ...(await exportJWK(kp.publicKey)), kid: "k1", alg: "RS256", use: "sig" };
  other = (await generateKeyPair("RS256")).privateKey as CryptoKey;
});
after(() => undefined);

let n = 0;
interface Over { iss?: string; aud?: string; typ?: string; key?: CryptoKey; sub?: string | null; sid?: string | null; events?: Record<string, unknown> | null; nonce?: string; jti?: string | null; exp?: number; alg?: string }
async function logoutToken(o: Over = {}): Promise<string> {
  const payload: Record<string, unknown> = {};
  if (o.sub !== null) payload.sub = o.sub ?? "SUB-1";
  if (o.sid !== null && o.sid !== undefined) payload.sid = o.sid; else if (o.sid === undefined) payload.sid = "SID-1";
  if (o.events !== null) payload.events = o.events ?? { [BACKCHANNEL_LOGOUT_EVENT]: {} };
  if (o.nonce) payload.nonce = o.nonce;
  const jwt = new SignJWT(payload).setProtectedHeader({ alg: o.alg ?? "RS256", typ: o.typ ?? "logout+jwt", kid: "k1" }).setIssuer(o.iss ?? ISSUER).setAudience(o.aud ?? "kiorly-pharmacy-web").setIssuedAt().setExpirationTime(o.exp ?? Math.floor(Date.now() / 1000) + 120);
  if (o.jti !== null) jwt.setJti(o.jti ?? `jti-${++n}`);
  return jwt.sign(o.alg === "HS256" ? new TextEncoder().encode("x".repeat(32)) : (o.key ?? priv));
}

/** In-memory stand-in for the four Prisma models the service touches. */
function fake() {
  const sessions: Array<Record<string, any>> = [];
  const revocations: Array<Record<string, any>> = [];
  const seen = new Map<string, Date>();
  const staff: Array<Record<string, any>> = [];
  const audits: Array<Record<string, any>> = [];
  const match = (row: Record<string, any>, where: Record<string, any>) => Object.entries(where).every(([k, v]) => (v && typeof v === "object" && "in" in v ? v.in.includes(row[k]) : v === null ? row[k] == null : row[k] === v));
  const prisma = {
    passportSession: {
      create: async ({ data }: any) => { const r = { id: `ps${sessions.length + 1}`, revokedAt: null, revokedReason: null, ...data }; sessions.push(r); return r; },
      findUnique: async ({ where }: any) => sessions.find((s) => s.id === where.id) ?? null,
      findMany: async ({ where }: any) => sessions.filter((s) => match(s, where)),
      updateMany: async ({ where, data }: any) => { const rows = sessions.filter((s) => match(s, where)); rows.forEach((r) => Object.assign(r, data)); return { count: rows.length }; },
    },
    passportRevocation: {
      upsert: async ({ where, create, update }: any) => { const k = where.kind_value; const r = revocations.find((x) => x.kind === k.kind && x.value === k.value); if (r) Object.assign(r, update); else revocations.push({ revokedAt: new Date(), ...create }); },
      findMany: async ({ where }: any) => revocations.filter((r) => where.OR.some((c: any) => c.kind === r.kind && c.value === r.value) && r.expiresAt > where.expiresAt.gt),
    },
    logoutTokenSeen: {
      create: async ({ data }: any) => { if (seen.has(data.jti)) throw Object.assign(new Error("unique"), { code: "P2002" }); seen.set(data.jti, data.expiresAt); },
      deleteMany: async () => ({ count: 0 }),
    },
    staffUser: {
      findMany: async ({ where }: any) => staff.filter((s) => s.subject === where.subject),
      update: async ({ where, data }: any) => Object.assign(staff.find((s) => s.id === where.id)!, data),
    },
  };
  const svc = new PassportSessions(prisma as never, { record: async (e: any) => { audits.push(e); } } as never);
  svc.keyResolver = () => createLocalJWKSet({ keys: [jwk] });
  return { svc, sessions, revocations, seen, staff, audits };
}
const web = () => { process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "local"; process.env.AUTH_ACCEPT_PASSPORT = "true"; process.env.OIDC_ISSUER = ISSUER; };
const code = (e: unknown) => (e as { code?: string }).code;

describe("back-channel logout receiver", () => {
  it("ends the web session bound to the sid, leaves other sessions alone, audits without PII", async () => {
    web();
    const f = fake();
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "SUB-1", sid: "SID-1" }, 3600);
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "SUB-1", sid: "SID-2" }, 3600);
    assert.deepEqual(await f.svc.backchannelLogout(await logoutToken()), { revoked: 1 });
    assert.ok(f.sessions[0]!.revokedAt); assert.equal(f.sessions[1]!.revokedAt, null);
    await assert.rejects(f.svc.assertActive("ps1"), (e) => code(e) === "SESSION_REVOKED");
    await f.svc.assertActive("ps2");
    assert.equal(f.audits.length, 1); assert.equal(f.audits[0]!.action, "auth.session_revoked");
    assert.doesNotMatch(JSON.stringify(f.audits), /\+20|SUB-1|SID-1/);
  });
  it("is idempotent for a new token of the same sid and replay-protected for the same jti", async () => {
    web();
    const f = fake();
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "SUB-1", sid: "SID-1" }, 3600);
    const t = await logoutToken({ jti: "once" });
    assert.deepEqual(await f.svc.backchannelLogout(t), { revoked: 1 });
    assert.deepEqual(await f.svc.backchannelLogout(await logoutToken()), { revoked: 0 });
    await assert.rejects(f.svc.backchannelLogout(t), (e) => code(e) === "INVALID_LOGOUT_TOKEN" && /replayed/.test((e as Error).message));
  });
  it("refuses wrong issuer, audience, typ, signature, algorithm, expired, missing jti/events/sub+sid, and nonce", async () => {
    web();
    const f = fake();
    const bad: Over[] = [
      { iss: "http://evil" }, { aud: "kiorly-lab-web" }, { typ: "JWT" }, { key: other }, { alg: "HS256" },
      { exp: Math.floor(Date.now() / 1000) - 600 }, { jti: null }, { events: null }, { events: { "http://x": {} } },
      { sub: null, sid: null }, { nonce: "abc" },
    ];
    for (const o of bad) await assert.rejects(f.svc.backchannelLogout(await logoutToken(o)), (e) => code(e) === "INVALID_LOGOUT_TOKEN", JSON.stringify(Object.keys(o)));
    for (const garbage of [undefined, "", "a.b.c", 42, "x".repeat(9000)]) await assert.rejects(f.svc.backchannelLogout(garbage), (e) => code(e) === "INVALID_LOGOUT_TOKEN");
    assert.equal(f.seen.size, 0, "nothing is recorded for invalid tokens");
  });
  it("is disabled (404) when Passport sign-in is not configured", async () => {
    process.env.NODE_ENV = "test"; process.env.AUTH_MODE = "local"; delete process.env.OIDC_ISSUER; delete process.env.AUTH_ACCEPT_PASSPORT;
    await assert.rejects(fake().svc.backchannelLogout(await logoutToken()), (e) => code(e) === "PASSPORT_DISABLED");
  });
  it("sub-only token ends every session of the subject; subject.deleted also unlinks the staff row (kept, never deleted)", async () => {
    web();
    const f = fake();
    f.staff.push({ id: "st1", orgId: "o1", subject: "SUB-1" });
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "SUB-1", sid: "SID-1" }, 3600);
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "SUB-1", sid: "SID-2" }, 3600);
    await f.svc.open({ id: "st2", orgId: "o1" }, { sub: "SUB-2", sid: "SID-3" }, 3600);
    assert.deepEqual(await f.svc.backchannelLogout(await logoutToken({ sid: null, events: { [BACKCHANNEL_LOGOUT_EVENT]: {}, [KX_EVENT_SUBJECT_DELETED]: {} } })), { revoked: 2 });
    assert.equal(f.sessions.filter((s) => s.revokedAt).length, 2); assert.equal(f.sessions[2]!.revokedAt, null);
    assert.equal(f.staff[0]!.subject, null);
    assert.ok(f.audits.some((a) => a.action === "auth.passport_unlinked"));
  });
});

describe("session checks", () => {
  it("a missing or expired web session is refused", async () => {
    web();
    const f = fake();
    await assert.rejects(f.svc.assertActive("nope"), (e) => code(e) === "SESSION_REVOKED");
    const row = await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "S" }, 3600);
    row.expiresAt = new Date(Date.now() - 1000);
    await assert.rejects(f.svc.assertActive(row.id), (e) => code(e) === "SESSION_REVOKED");
  });
  it("raw Passport access tokens: a logged-out sid is refused; a logged-out sub only for tokens issued before the logout", async () => {
    web();
    const f = fake();
    const now = Math.floor(Date.now() / 1000);
    await f.svc.assertBearerActive({ sub: "SUB-1", sid: "SID-1", iat: now });
    await f.svc.backchannelLogout(await logoutToken({ sid: "SID-1" }));
    await assert.rejects(f.svc.assertBearerActive({ sub: "SUB-1", sid: "SID-1", iat: now }), (e) => code(e) === "SESSION_REVOKED");
    await f.svc.assertBearerActive({ sub: "SUB-1", sid: "SID-OTHER", iat: now });
    await f.svc.backchannelLogout(await logoutToken({ sid: null }));
    await assert.rejects(f.svc.assertBearerActive({ sub: "SUB-1", sid: "SID-OTHER", iat: now - 60 }), (e) => code(e) === "SESSION_REVOKED");
    await f.svc.assertBearerActive({ sub: "SUB-1", sid: "SID-NEW", iat: now + 60 }); // signed in again afterwards
  });
  it("deactivating a staff member ends their web sessions", async () => {
    web();
    const f = fake();
    await f.svc.open({ id: "st1", orgId: "o1" }, { sub: "S", sid: "A" }, 3600);
    assert.equal(await f.svc.revokeForStaff("st1", "staff_deactivated"), 1);
    await assert.rejects(f.svc.assertActive("ps1"), (e) => code(e) === "SESSION_REVOKED");
  });
  it("max session age is configurable, 1 h by default, clamped to 60 s .. 8 h", () => {
    assert.equal(sessionMaxAge(undefined), 3600);
    assert.equal(sessionMaxAge("900"), 900);
    assert.equal(sessionMaxAge("5"), 60);
    assert.equal(sessionMaxAge("999999"), 8 * 3600);
    assert.equal(sessionMaxAge("abc"), 3600);
    web();
    assert.equal(passportConfig()!.sessionMaxAgeSeconds, 3600);
    process.env.OIDC_SESSION_MAX_AGE_SECONDS = "600";
    assert.equal(passportConfig()!.sessionMaxAgeSeconds, 600);
  });
});
