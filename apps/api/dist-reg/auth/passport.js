"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasMfa = exports.peekAlg = exports.jwks = exports.resetDiscoveryCache = void 0;
exports.sessionMaxAge = sessionMaxAge;
exports.sessionIdleMinutes = sessionIdleMinutes;
exports.passportConfig = passportConfig;
exports.discover = discover;
exports.verifyPassportAccessToken = verifyPassportAccessToken;
exports.verifyPassportIdToken = verifyPassportIdToken;
exports.normalizePhone = normalizePhone;
const jose_1 = require("jose");
const list = (v, d) => (v?.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : d);
function sessionMaxAge(v) {
    const n = Number(v);
    return Number.isFinite(n) && n > 0 ? Math.min(8 * 3600, Math.max(60, Math.floor(n))) : 3600;
}
function sessionIdleMinutes(v) {
    if (v === undefined || v.trim() === "")
        return 30;
    const n = Number(v);
    if (!Number.isFinite(n))
        return 30;
    return n <= 0 ? 0 : Math.min(480, Math.max(5, Math.floor(n)));
}
function passportConfig(env = process.env) {
    const issuer = (env.OIDC_ISSUER ?? env.KIOREX_OIDC_ISSUER)?.trim().replace(/\/+$/, "");
    if (!issuer)
        return null;
    const prod = env.NODE_ENV === "production";
    const oidc = env.AUTH_MODE === "oidc" || env.AUTH_MODE === "both";
    if (!oidc && (prod || env.AUTH_ACCEPT_PASSPORT !== "true"))
        return null;
    const webClientId = env.OIDC_WEB_CLIENT_ID?.trim() || "kiorly-pharmacy-web";
    return {
        issuer,
        jwksUrl: env.OIDC_JWKS_URL?.trim() || `${issuer}/jwks`,
        audiences: list(env.OIDC_AUDIENCE, ["kiorex-api", "kiorly-pharmacy"]),
        allowedClients: list(env.OIDC_ALLOWED_CLIENTS, ["kiorly", "kiorly", webClientId]),
        webClientId,
        phoneLink: env.OIDC_PHONE_LINK ? env.OIDC_PHONE_LINK === "true" : !prod,
        sessionMaxAgeSeconds: sessionMaxAge(env.OIDC_SESSION_MAX_AGE_SECONDS),
    };
}
const discoveryCache = new Map();
async function discover(issuer, fetchImpl = fetch) {
    const hit = discoveryCache.get(issuer);
    if (hit && Date.now() - hit.at < 5 * 60_000)
        return hit.doc;
    const res = await fetchImpl(`${issuer}/.well-known/openid-configuration`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok)
        throw new Error(`Passport discovery failed (${res.status})`);
    const doc = (await res.json());
    discoveryCache.set(issuer, { at: Date.now(), doc });
    return doc;
}
const resetDiscoveryCache = () => discoveryCache.clear();
exports.resetDiscoveryCache = resetDiscoveryCache;
const jwksCache = new Map();
const jwks = (url) => { let j = jwksCache.get(url); if (!j) {
    j = (0, jose_1.createRemoteJWKSet)(new URL(url));
    jwksCache.set(url, j);
} return j; };
exports.jwks = jwks;
const peekAlg = (token) => { try {
    return (0, jose_1.decodeProtectedHeader)(token).alg;
}
catch {
    return undefined;
} };
exports.peekAlg = peekAlg;
async function verifyPassportAccessToken(token, cfg) {
    const { payload } = await (0, jose_1.jwtVerify)(token, (0, exports.jwks)(cfg.jwksUrl), { algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.audiences });
    const p = payload;
    if (!p.sub)
        throw new Error("no sub");
    if (!p.client_id || !cfg.allowedClients.includes(p.client_id))
        throw new Error("client not allowed");
    return p;
}
const hasMfa = (c) => c.acr === "urn:kiorex:acr:mfa" || (Array.isArray(c.amr) && c.amr.includes("mfa"));
exports.hasMfa = hasMfa;
async function verifyPassportIdToken(idToken, cfg, nonce) {
    const { payload } = await (0, jose_1.jwtVerify)(idToken, (0, exports.jwks)(cfg.jwksUrl), { algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.webClientId });
    if (payload.nonce !== nonce)
        throw new Error("nonce mismatch");
    return payload;
}
function normalizePhone(p) {
    if (!p)
        return null;
    const s = p.replace(/[\s\-().]/g, "").replace(/^00/, "+");
    return /^\+\d{8,15}$/.test(s) ? s : null;
}
//# sourceMappingURL=passport.js.map