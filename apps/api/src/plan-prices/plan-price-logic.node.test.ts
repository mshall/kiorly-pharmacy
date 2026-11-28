import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parsePriceRequest, planNextVersion, activeAt, type SegmentRow } from "./plan-price-logic";
import { readPlansAdminCredential } from "./platform-admin-hmac.guard";

const now = new Date("2026-12-01T10:00:00Z");
const base = { edition: "PRO", marketCode: "eg", interval: "monthly", currency: "egp", amount: "123.45", actor: { id: "checker-1" }, approval: { proposalId: "kpp_1", proposedBy: "maker-1" } };
const code = (fn: () => unknown) => { try { fn(); return null; } catch (e) { return (e as { code?: string }).code ?? "ERR"; } };
const row = (v: number, from: string, to: string | null = null): SegmentRow => ({ id: `r${v}`, priceVersion: v, validFrom: new Date(from), validTo: to ? new Date(to) : null, amount: "1.00", currency: "EGP" });

describe("plan price request (pure)", () => {
  it("normalises case and defaults the start to now", () => {
    const q = parsePriceRequest(base, now);
    assert.deepEqual([q.edition, q.marketCode, q.interval, q.currency, q.amount, q.preview], ["PRO", "EG", "MONTHLY", "EGP", "123.45", false]);
    assert.equal(q.validFrom.getTime(), now.getTime());
  });
  it("a start in the past moves to now, a future start is kept", () => {
    assert.equal(parsePriceRequest({ ...base, validFrom: "2026-01-01T00:00:00Z" }, now).validFrom.getTime(), now.getTime());
    assert.equal(parsePriceRequest({ ...base, validFrom: "2027-01-01T00:00:00Z" }, now).validFrom.toISOString(), "2027-01-01T00:00:00.000Z");
  });
  it("refuses malformed values with stable codes", () => {
    assert.equal(code(() => parsePriceRequest({ ...base, edition: "ENTERPRISE" }, now)), "INVALID_EDITION");
    assert.equal(code(() => parsePriceRequest({ ...base, marketCode: "EGY" }, now)), "INVALID_MARKET");
    assert.equal(code(() => parsePriceRequest({ ...base, interval: "WEEKLY" }, now)), "INVALID_INTERVAL");
    assert.equal(code(() => parsePriceRequest({ ...base, currency: "E" }, now)), "INVALID_CURRENCY");
    for (const a of ["-1", "1.234", "abc", "", "1e3", "1,5"]) assert.equal(code(() => parsePriceRequest({ ...base, amount: a }, now)), "INVALID_AMOUNT", a);
    assert.equal(code(() => parsePriceRequest({ ...base, validFrom: "nope" }, now)), "INVALID_VALID_FROM");
    assert.equal(code(() => parsePriceRequest({ ...base, actor: {} }, now)), "ACTOR_REQUIRED");
  });
  it("a publish needs the approval record and a different person; a preview needs neither", () => {
    assert.equal(code(() => parsePriceRequest({ ...base, approval: undefined }, now)), "APPROVAL_REQUIRED");
    assert.equal(code(() => parsePriceRequest({ ...base, actor: { id: "maker-1" } }, now)), "TWO_PERSON_RULE");
    assert.equal(parsePriceRequest({ ...base, approval: undefined, preview: true }, now).approval, null);
  });
  it("versions are ordered and append-only", () => {
    assert.deepEqual(planNextVersion([], new Date("2027-01-01")), { priceVersion: 1, supersedes: [] });
    const rows = [row(1, "2026-01-01", "2026-06-01"), row(2, "2026-06-01")];
    const n = planNextVersion(rows, new Date("2026-09-01"));
    assert.equal(n.priceVersion, 3); assert.deepEqual(n.supersedes.map((r) => r.id), ["r2"]);
    assert.equal(code(() => planNextVersion(rows, new Date("2026-06-01"))), "PRICE_NOT_AFTER_LATEST");
    assert.equal(code(() => planNextVersion(rows, new Date("2026-03-01"))), "PRICE_NOT_AFTER_LATEST");
  });
  it("a scheduled future version is never superseded by an earlier start", () => {
    const rows = [row(1, "2026-01-01"), row(2, "2027-01-01")];
    assert.equal(code(() => planNextVersion(rows, new Date("2026-08-01"))), "PRICE_NOT_AFTER_LATEST");
    assert.deepEqual(activeAt(rows, new Date("2026-08-01")).map((r) => r.id), ["r1"]);
  });
  it("the platform credential is read from configuration only and a placeholder is not a credential", () => {
    assert.equal(readPlansAdminCredential({}), null);
    assert.equal(readPlansAdminCredential({ KIOREX_PLANS_ADMIN_CLIENT_KEY: "short", KIOREX_PLANS_ADMIN_CLIENT_SECRET: "x".repeat(30) }), null);
    assert.equal(readPlansAdminCredential({ KIOREX_PLANS_ADMIN_CLIENT_KEY: "plans-admin-key", KIOREX_PLANS_ADMIN_CLIENT_SECRET: "y".repeat(24) })?.key, "plans-admin-key");
  });
});
