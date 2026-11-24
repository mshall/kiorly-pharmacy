import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PgRateLimiter, type RawSql } from "./pg-rate-limit";

/** A fake of the one statement the limiter issues: counts per (key, window) and refuses at the limit, like the SQL does. */
function fake(): RawSql {
  const rows = new Map<string, number>();
  return {
    $queryRawUnsafe: (async (_q: string, k: string, start: Date, _exp: Date, limit: number) => {
      const id = `${k}|${start.getTime()}`; const n = rows.get(id) ?? 0;
      if (n >= limit) return [];
      rows.set(id, n + 1); return [{ count: n + 1 }];
    }) as RawSql["$queryRawUnsafe"],
    $executeRawUnsafe: async () => 0,
  };
}

describe("PgRateLimiter (shared sign-in throttle)", () => {
  it("admits up to the limit per window, then refuses with Retry-After, and a new window starts clean", async () => {
    let t = 1_000_000; const l = new PgRateLimiter(fake(), () => t);
    for (let i = 0; i < 10; i++) assert.equal((await l.hit("login:a@b.c", 10, 60_000)).ok, true);
    const r = await l.hit("login:a@b.c", 10, 60_000);
    assert.equal(r.ok, false); assert.ok(r.retryAfterSec >= 1 && r.retryAfterSec <= 60);
    assert.equal((await l.hit("login:other", 10, 60_000)).ok, true, "keys are independent");
    t += 60_000; assert.equal((await l.hit("login:a@b.c", 10, 60_000)).ok, true);
  });
  it("two limiter instances over the same store share the counters (cross-process)", async () => {
    const db = fake(); const a = new PgRateLimiter(db, () => 5_000); const b = new PgRateLimiter(db, () => 5_000);
    for (let i = 0; i < 5; i++) await a.hit("k", 6, 60_000);
    assert.equal((await b.hit("k", 6, 60_000)).ok, true); assert.equal((await a.hit("k", 6, 60_000)).ok, false);
  });
});
