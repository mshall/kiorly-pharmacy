"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PlatformAdminHmacGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformAdminHmacGuard = void 0;
exports.readPlansAdminCredential = readPlansAdminCredential;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@kiorex/contracts");
const node_crypto_1 = require("node:crypto");
function readPlansAdminCredential(env = process.env) {
    const key = env.KIOREX_PLANS_ADMIN_CLIENT_KEY?.trim(), secret = env.KIOREX_PLANS_ADMIN_CLIENT_SECRET?.trim();
    if (!key || !secret || key.length < 8 || secret.length < 24)
        return null;
    return { key, secret };
}
const safeEq = (a, b) => { const x = Buffer.from(a), y = Buffer.from(b); return x.length === y.length && (0, node_crypto_1.timingSafeEqual)(x, y); };
let PlatformAdminHmacGuard = class PlatformAdminHmacGuard {
    static { PlatformAdminHmacGuard_1 = this; }
    static nonces = new Map();
    async canActivate(ctx) {
        const req = ctx.switchToHttp().getRequest();
        const deny = (reason, status = 401) => new common_1.HttpException({ statusCode: status, code: "HMAC_REJECTED", message: reason }, status);
        const cred = readPlansAdminCredential();
        if (!cred)
            throw new common_1.HttpException({ statusCode: 404, code: "NOT_FOUND", message: "Not found" }, 404);
        const key = req.headers[contracts_1.KIORLY_HEADERS.clientKey.toLowerCase()];
        if (!key || !safeEq(key, cred.key))
            throw deny("unknown client key");
        const v = (0, contracts_1.verifyKiorlyRequest)({ headers: req.headers, method: req.method, path: req.originalUrl.split("?")[0], body: req.rawBody?.length ? req.rawBody : "", secret: cred.secret });
        if (!v.ok)
            throw deny(v.reason);
        const nonce = req.headers[contracts_1.KIORLY_HEADERS.nonce.toLowerCase()];
        const now = Date.now();
        for (const [n, t] of PlatformAdminHmacGuard_1.nonces)
            if (now - t > 10 * 60_000)
                PlatformAdminHmacGuard_1.nonces.delete(n);
        if (PlatformAdminHmacGuard_1.nonces.has(nonce))
            throw deny("nonce replay");
        PlatformAdminHmacGuard_1.nonces.set(nonce, now);
        return true;
    }
};
exports.PlatformAdminHmacGuard = PlatformAdminHmacGuard;
exports.PlatformAdminHmacGuard = PlatformAdminHmacGuard = PlatformAdminHmacGuard_1 = __decorate([
    (0, common_1.Injectable)()
], PlatformAdminHmacGuard);
//# sourceMappingURL=platform-admin-hmac.guard.js.map