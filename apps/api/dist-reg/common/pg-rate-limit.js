"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgRateLimiter = void 0;
class PgRateLimiter {
    db;
    now;
    constructor(db, now = Date.now) {
        this.db = db;
        this.now = now;
    }
    win(key, windowMs) { const t = this.now(); const start = Math.floor(t / windowMs) * windowMs; return { k: `${key}|${windowMs}`, start: new Date(start), end: start + windowMs, t }; }
    async hit(key, limit, windowMs) {
        const w = this.win(key, windowMs);
        const rows = await this.db.$queryRawUnsafe(`INSERT INTO "RateLimitBucket" ("key","windowStart","count","expiresAt") VALUES ($1,$2,1,$3)
       ON CONFLICT ("key","windowStart") DO UPDATE SET "count" = "RateLimitBucket"."count" + 1 WHERE "RateLimitBucket"."count" < $4 RETURNING "count"`, w.k, w.start, new Date(w.end + 60_000), limit);
        if (Math.random() < 0.01)
            void this.sweep().catch(() => undefined);
        return rows.length ? { ok: true, retryAfterSec: 0 } : { ok: false, retryAfterSec: Math.max(1, Math.ceil((w.end - w.t) / 1000)) };
    }
    async sweep() { return this.db.$executeRawUnsafe(`DELETE FROM "RateLimitBucket" WHERE "expiresAt" < $1`, new Date(this.now())); }
    async reset() { await this.db.$executeRawUnsafe(`DELETE FROM "RateLimitBucket"`); }
}
exports.PgRateLimiter = PgRateLimiter;
//# sourceMappingURL=pg-rate-limit.js.map