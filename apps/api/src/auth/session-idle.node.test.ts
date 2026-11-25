import { afterEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { sessionIdleMinutes } from "./passport";
import { PassportSessions } from "./passport-sessions.service";

const env = { ...process.env };
afterEach(() => { process.env = { ...env }; });

/** G-24 idle limit of web sessions. */
describe("session idle limit", () => {
  it("parses OIDC_SESSION_IDLE_MINUTES: default 30, 0 switches it off, clamped to 5..480, junk falls back", () => {
    assert.equal(sessionIdleMinutes(undefined), 30); assert.equal(sessionIdleMinutes(""), 30); assert.equal(sessionIdleMinutes("abc"), 30);
    assert.equal(sessionIdleMinutes("0"), 0); assert.equal(sessionIdleMinutes("-4"), 0);
    assert.equal(sessionIdleMinutes("1"), 5); assert.equal(sessionIdleMinutes("60"), 60); assert.equal(sessionIdleMinutes("99999"), 480);
  });
  const fake = (lastSeenMinutesAgo: number) => {
    const row: Record<string, any> = { id: "s1", revokedAt: null, revokedReason: null, expiresAt: new Date(Date.now() + 3600_000), lastSeenAt: new Date(Date.now() - lastSeenMinutesAgo * 60_000) };
    const prisma = { passportSession: {
      findUnique: async () => ({ ...row }),
      updateMany: async ({ where, data }: any) => { if (where.revokedAt === null && row.revokedAt) return { count: 0 }; Object.assign(row, data); return { count: 1 }; },
    } };
    return { row, svc: new PassportSessions(prisma as never, { record: async () => undefined } as never) };
  };
  it("a session idle past the limit is ended with reason idle_timeout and answers 401 SESSION_REVOKED", async () => {
    process.env.OIDC_SESSION_IDLE_MINUTES = "30"; const f = fake(31);
    await assert.rejects(() => f.svc.assertActive("s1"), (e: any) => { const b = typeof e.getResponse === "function" ? e.getResponse() : e; return (b.code ?? e.code) === "SESSION_REVOKED" && /inactivity/.test(b.message ?? e.message); });
    assert.equal(f.row.revokedReason, "idle_timeout"); assert.ok(f.row.revokedAt instanceof Date);
    await assert.rejects(() => f.svc.assertActive("s1")); // stays ended
  });
  it("an active session passes and its last-seen time moves forward at most once a minute", async () => {
    process.env.OIDC_SESSION_IDLE_MINUTES = "30"; const f = fake(5); const before = f.row.lastSeenAt.getTime();
    await f.svc.assertActive("s1"); assert.ok(f.row.lastSeenAt.getTime() > before);
    const g = fake(0.2); const b2 = g.row.lastSeenAt.getTime(); await g.svc.assertActive("s1"); assert.equal(g.row.lastSeenAt.getTime(), b2);
  });
  it("the limit off (0) never ends a session however long it was quiet", async () => {
    process.env.OIDC_SESSION_IDLE_MINUTES = "0"; const f = fake(600); await f.svc.assertActive("s1"); assert.equal(f.row.revokedAt, null);
  });
  it("a different partner can run a different limit through its own env", async () => {
    process.env.OIDC_SESSION_IDLE_MINUTES = "10"; await assert.rejects(() => fake(11).svc.assertActive("s1"));
    process.env.OIDC_SESSION_IDLE_MINUTES = "60"; await fake(11).svc.assertActive("s1");
  });
});
