"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenVerifier = exports.SESSION_ISSUER = exports.LOCAL_ISSUER = exports.mfaEnforced = exports.localLoginEnabled = exports.authMode = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const jose_1 = require("jose");
const passport_1 = require("./passport");
const key = () => new TextEncoder().encode(secret());
function secret() {
    const s = process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET;
    if (s)
        return s;
    if (process.env.NODE_ENV === "production")
        throw new Error("AUTH_JWT_SECRET (or JWT_SECRET) is required in production");
    return "dev-only-kiorly-pharmacy-secret-change-me";
}
const authMode = () => (process.env.AUTH_MODE === "oidc" ? "oidc" : process.env.AUTH_MODE === "both" ? "both" : "local");
exports.authMode = authMode;
const localLoginEnabled = () => (0, exports.authMode)() !== "oidc";
exports.localLoginEnabled = localLoginEnabled;
const mfaEnforced = () => process.env.NODE_ENV === "production" && (0, exports.authMode)() !== "local";
exports.mfaEnforced = mfaEnforced;
const CLAIM_ISSUER = "kiorly-pharmacy-owner-claim";
exports.LOCAL_ISSUER = "kiorly-pharmacy-local";
exports.SESSION_ISSUER = "kiorly-pharmacy-passport-session";
let TokenVerifier = class TokenVerifier {
    async issueLocal(sub, ttlSeconds = 60 * 60 * 10) {
        return new jose_1.SignJWT({ amr: ["pwd"] })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(sub)
            .setIssuer(exports.LOCAL_ISSUER)
            .setAudience("kiorly-pharmacy")
            .setIssuedAt()
            .setExpirationTime(`${ttlSeconds}s`)
            .sign(key());
    }
    async issueSession(staffId, mfa, ttlSeconds = 60 * 60, sessionId) {
        return new jose_1.SignJWT({ amr: ["passport"], mfa })
            .setProtectedHeader({ alg: "HS256" })
            .setSubject(staffId)
            .setJti(sessionId ?? (0, node_crypto_1.randomUUID)())
            .setIssuer(exports.SESSION_ISSUER)
            .setAudience("kiorly-pharmacy")
            .setIssuedAt()
            .setExpirationTime(`${ttlSeconds}s`)
            .sign(key());
    }
    async issueOwnerClaim(staffId, ttlSeconds = 20 * 60) {
        return new jose_1.SignJWT({ typ: "owner-claim" })
            .setProtectedHeader({ alg: "HS256" }).setSubject(staffId).setIssuer(CLAIM_ISSUER).setAudience("kiorly-pharmacy-claim").setIssuedAt().setExpirationTime(`${ttlSeconds}s`).sign(key());
    }
    async readOwnerClaim(token) {
        const { payload } = await (0, jose_1.jwtVerify)(token, key(), { algorithms: ["HS256"], issuer: CLAIM_ISSUER, audience: "kiorly-pharmacy-claim" });
        if (payload.typ !== "owner-claim" || !payload.sub)
            throw new Error("not a claim");
        return String(payload.sub);
    }
    async verify(token) {
        if ((0, passport_1.peekAlg)(token) === "HS256") {
            const { payload } = await (0, jose_1.jwtVerify)(token, key(), { algorithms: ["HS256"], issuer: [exports.LOCAL_ISSUER, exports.SESSION_ISSUER], audience: "kiorly-pharmacy" });
            if (payload.iss === exports.LOCAL_ISSUER && !(0, exports.localLoginEnabled)())
                throw new Error("local tokens are disabled");
            if (payload.iss === exports.SESSION_ISSUER && !payload.jti)
                throw new Error("session id missing");
            return { sub: String(payload.sub), staffId: String(payload.sub), mfa: payload.mfa === true, claims: payload, ...(payload.iss === exports.SESSION_ISSUER ? { sessionId: String(payload.jti) } : {}) };
        }
        const cfg = (0, passport_1.passportConfig)();
        if (!cfg)
            throw new Error("Passport tokens are not accepted");
        const claims = await (0, passport_1.verifyPassportAccessToken)(token, cfg);
        return { sub: String(claims.sub), mfa: (0, passport_1.hasMfa)(claims) || claims.mfa === true, claims, passport: true };
    }
};
exports.TokenVerifier = TokenVerifier;
exports.TokenVerifier = TokenVerifier = __decorate([
    (0, common_1.Injectable)()
], TokenVerifier);
//# sourceMappingURL=token-verifier.js.map