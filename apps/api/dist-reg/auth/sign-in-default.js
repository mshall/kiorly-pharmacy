"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGN_IN_METHODS = void 0;
exports.parseSignInMethod = parseSignInMethod;
exports.deploymentDefaultMethod = deploymentDefaultMethod;
exports.effectiveOrgDefault = effectiveOrgDefault;
exports.resolvePublicSignInConfig = resolvePublicSignInConfig;
exports.cleanOrgHint = cleanOrgHint;
exports.makeWindowLimiter = makeWindowLimiter;
exports.SIGN_IN_METHODS = ["PASSWORD", "PASSPORT"];
function parseSignInMethod(v) {
    if (typeof v !== "string")
        return null;
    const u = v.trim().toUpperCase();
    return u === "PASSWORD" || u === "PASSPORT" ? u : null;
}
function deploymentDefaultMethod(env = process.env) {
    return parseSignInMethod(env.SIGNIN_DEFAULT_METHOD) ?? "PASSWORD";
}
function effectiveOrgDefault(o) {
    return o.stored ?? (o.linkedToKiorex ? "PASSPORT" : "PASSWORD");
}
function resolvePublicSignInConfig(i) {
    if (!i.passportAvailable)
        return { passportAvailable: false, defaultMethod: "PASSWORD" };
    return { passportAvailable: true, defaultMethod: i.org ? effectiveOrgDefault(i.org) : i.deployment };
}
function cleanOrgHint(v) {
    return typeof v === "string" && /^[A-Za-z0-9][A-Za-z0-9_-]{1,63}$/.test(v.trim()) ? v.trim() : null;
}
function makeWindowLimiter(max, windowMs, now = Date.now) {
    const hits = new Map();
    return (key) => {
        const t = now();
        const h = hits.get(key);
        if (hits.size > 5000)
            for (const [k, v] of hits)
                if (t - v.t > windowMs)
                    hits.delete(k);
        if (!h || t - h.t > windowMs) {
            hits.set(key, { n: 1, t });
            return true;
        }
        return ++h.n <= max;
    };
}
//# sourceMappingURL=sign-in-default.js.map