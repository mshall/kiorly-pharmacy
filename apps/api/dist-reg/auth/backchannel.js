"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutTokenError = exports.LOGOUT_TOKEN_TYP = exports.KX_EVENT_SUBJECT_DELETED = exports.BACKCHANNEL_LOGOUT_EVENT = void 0;
exports.verifyLogoutToken = verifyLogoutToken;
const jose_1 = require("jose");
exports.BACKCHANNEL_LOGOUT_EVENT = "http://schemas.openid.net/event/backchannel-logout";
exports.KX_EVENT_SUBJECT_DELETED = "https://schemas.kiorex.com/event/subject.deleted";
exports.LOGOUT_TOKEN_TYP = "logout+jwt";
class LogoutTokenError extends Error {
}
exports.LogoutTokenError = LogoutTokenError;
async function verifyLogoutToken(token, cfg, getKey, now = new Date()) {
    if (typeof token !== "string" || !token || token.length > 8192)
        throw new LogoutTokenError("missing logout_token");
    let payload;
    try {
        ({ payload } = await (0, jose_1.jwtVerify)(token, getKey, {
            algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.webClientId, typ: exports.LOGOUT_TOKEN_TYP, clockTolerance: 5, currentDate: now,
            requiredClaims: ["iat", "exp", "jti", "events"],
        }));
    }
    catch (e) {
        throw new LogoutTokenError(`invalid logout token: ${e instanceof Error ? e.message : "verification failed"}`);
    }
    const events = payload.events;
    if (!events || typeof events !== "object" || !(exports.BACKCHANNEL_LOGOUT_EVENT in events))
        throw new LogoutTokenError("missing backchannel-logout event");
    if ("nonce" in payload)
        throw new LogoutTokenError("logout token must not contain nonce");
    const sub = typeof payload.sub === "string" && payload.sub ? payload.sub : undefined;
    const sid = typeof payload.sid === "string" && payload.sid ? payload.sid : undefined;
    if (!sub && !sid)
        throw new LogoutTokenError("logout token needs sub or sid");
    return { jti: String(payload.jti), exp: Number(payload.exp), sub, sid, subjectDeleted: exports.KX_EVENT_SUBJECT_DELETED in events };
}
//# sourceMappingURL=backchannel.js.map