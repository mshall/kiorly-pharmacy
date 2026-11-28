"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryHandoffStore = exports.HandoffCodes = exports.isHomeOrigin = exports.newHandoffCode = exports.hashHandoffCode = exports.HandoffError = exports.HANDOFF_PRODUCT = exports.HANDOFF_TTL_MS = void 0;
exports.homeOrigins = homeOrigins;
exports.webBaseUrl = webBaseUrl;
const node_crypto_1 = require("node:crypto");
exports.HANDOFF_TTL_MS = 30_000;
exports.HANDOFF_PRODUCT = "pharmacy";
class HandoffError extends Error {
    code = "HANDOFF_INVALID";
    constructor() { super("The sign-in link is invalid or expired. Sign in again."); }
}
exports.HandoffError = HandoffError;
const hashHandoffCode = (code) => (0, node_crypto_1.createHash)("sha256").update(code, "utf8").digest("hex");
exports.hashHandoffCode = hashHandoffCode;
const newHandoffCode = () => (0, node_crypto_1.randomBytes)(32).toString("base64url");
exports.newHandoffCode = newHandoffCode;
const CODE_SHAPE = /^[A-Za-z0-9_-]{43}$/;
const LOCAL_HOME = "http://localhost:5194,http://127.0.0.1:5194";
function homeOrigins(env = process.env) {
    const raw = env.KIORLY_HOME_ORIGINS?.trim() || (env.NODE_ENV === "production" ? "" : LOCAL_HOME);
    return raw.split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
}
const isHomeOrigin = (origin, env = process.env) => !!origin && homeOrigins(env).includes(origin.replace(/\/+$/, ""));
exports.isHomeOrigin = isHomeOrigin;
function webBaseUrl(env = process.env, localDefault = "http://localhost:5192") {
    const v = (env.WEB_APP_URL?.trim() || (env.NODE_ENV === "production" ? "" : localDefault)).replace(/\/+$/, "");
    return v || null;
}
class HandoffCodes {
    store;
    product;
    opts;
    constructor(store, product, opts = {}) {
        this.store = store;
        this.product = product;
        this.opts = opts;
    }
    now() { return this.opts.now ? this.opts.now() : new Date(); }
    async issue(input) {
        const ttl = this.opts.ttlMs ?? exports.HANDOFF_TTL_MS;
        const code = (0, exports.newHandoffCode)();
        const now = this.now();
        await this.store.insert({ codeHash: (0, exports.hashHandoffCode)(code), product: this.product, edition: input.edition ?? null, origin: input.origin.replace(/\/+$/, ""), subjectId: input.subjectId, expiresAt: new Date(now.getTime() + ttl) });
        void this.store.purge(new Date(now.getTime() - 10 * 60_000)).catch(() => undefined);
        return { code, expiresInSeconds: Math.round(ttl / 1000) };
    }
    async redeem(input) {
        if (typeof input.code !== "string" || !CODE_SHAPE.test(input.code))
            throw new HandoffError();
        const entry = await this.store.consume((0, exports.hashHandoffCode)(input.code), this.now());
        if (!entry || entry.expiresAt.getTime() <= this.now().getTime())
            throw new HandoffError();
        if (entry.product !== this.product)
            throw new HandoffError();
        if ((input.edition ?? null) !== entry.edition)
            throw new HandoffError();
        if (input.expectOrigin !== undefined && input.expectOrigin.replace(/\/+$/, "") !== entry.origin)
            throw new HandoffError();
        return { subjectId: entry.subjectId, origin: entry.origin, edition: entry.edition };
    }
}
exports.HandoffCodes = HandoffCodes;
class MemoryHandoffStore {
    rows = new Map();
    async insert(e) { this.rows.set(e.codeHash, { ...e, usedAt: null }); }
    async consume(codeHash, now) {
        const r = this.rows.get(codeHash);
        if (!r || r.usedAt || r.expiresAt.getTime() <= now.getTime())
            return null;
        r.usedAt = now;
        return r;
    }
    async purge(before) { for (const [k, r] of this.rows)
        if (r.expiresAt < before)
            this.rows.delete(k); }
}
exports.MemoryHandoffStore = MemoryHandoffStore;
//# sourceMappingURL=handoff.js.map