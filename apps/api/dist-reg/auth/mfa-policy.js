"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetMfaPolicyCache = exports.ORG_TYPE = void 0;
exports.setCoverageFetcher = setCoverageFetcher;
exports.roleCovered = roleCovered;
exports.mfaMandatoryForRole = mfaMandatoryForRole;
const passport_1 = require("./passport");
exports.ORG_TYPE = "pharmacy";
const TTL_MS = 15_000;
let cache;
let fetcher = async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { accept: "application/json" } });
    if (!res.ok)
        throw new Error(`MFA policy answered ${res.status}`);
    return (await res.json());
};
function setCoverageFetcher(f, reset = true) {
    fetcher = f ?? (async (url) => {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { accept: "application/json" } });
        if (!res.ok)
            throw new Error(`MFA policy answered ${res.status}`);
        return (await res.json());
    });
    if (reset)
        cache = undefined;
}
const resetMfaPolicyCache = () => { cache = undefined; };
exports.resetMfaPolicyCache = resetMfaPolicyCache;
function endpoint(env) {
    if (env.MFA_POLICY_URL?.trim())
        return env.MFA_POLICY_URL.trim();
    const issuer = (env.OIDC_ISSUER ?? env.KIOREX_OIDC_ISSUER)?.trim().replace(/\/+$/, "") ?? (0, passport_1.passportConfig)(env)?.issuer;
    return issuer ? `${issuer}/.well-known/kiorex-mfa-policy` : null;
}
async function coverage(env) {
    const url = endpoint(env);
    if (!url)
        return null;
    if (cache && cache.url === url && Date.now() - cache.at < TTL_MS)
        return cache.value;
    let value = null;
    try {
        const c = await fetcher(url);
        value = c && typeof c === "object" && c.types && typeof c.types === "object" && typeof c.enabled === "boolean" ? c : null;
    }
    catch {
        value = null;
    }
    cache = { at: Date.now(), url, value };
    return value;
}
function roleCovered(c, role, includePartial, orgType = exports.ORG_TYPE) {
    if (!c)
        return true;
    if (!c.enabled)
        return false;
    const t = c.types[orgType];
    if (!t)
        return true;
    const hint = role.toLowerCase();
    const hit = (l) => l.includes("*") || l.includes(hint);
    return hit(t.mandatory ?? []) || (includePartial && hit(t.partial ?? []));
}
async function mfaMandatoryForRole(role, includePartial = false, env = process.env) {
    if (env.MFA_POLICY_SOURCE === "always")
        return true;
    return roleCovered(await coverage(env), role, includePartial);
}
//# sourceMappingURL=mfa-policy.js.map