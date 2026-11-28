"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PRODUCT_LANDING_PATH = void 0;
exports.shortLinkBase = shortLinkBase;
exports.shortUrl = shortUrl;
exports.kiorexWebBase = kiorexWebBase;
exports.kiorexLandingUrl = kiorexLandingUrl;
exports.allowedRedirectHosts = allowedRedirectHosts;
exports.assertAllowedRedirect = assertAllowedRedirect;
const link_tags_1 = require("./link-tags");
const trim = (s) => s.replace(/\/+$/, "");
function shortLinkBase(env = process.env) {
    const explicit = env.LINK_SHORT_BASE_URL?.trim();
    if (explicit)
        return trim(explicit);
    const api = trim(env.PUBLIC_API_BASE_URL?.trim() || `http://localhost:${env.PORT ?? "3100"}`);
    return `${api}/api/v1/public/links`;
}
function shortUrl(code, env = process.env) {
    return `${shortLinkBase(env)}/q/${encodeURIComponent(code)}`;
}
function kiorexWebBase(env = process.env) {
    return trim(env.KIOREX_PATIENT_WEB_URL?.trim() || "http://localhost:5180");
}
exports.PRODUCT_LANDING_PATH = { PHARMACY: "/pharmacy", LAB: "/lab" };
function kiorexLandingUrl(t, env = process.env) {
    const url = new URL(`${kiorexWebBase(env)}${exports.PRODUCT_LANDING_PATH[t.product]}`);
    if (t.lt) {
        url.searchParams.set("lt", t.lt);
        if (t.channelKind)
            for (const [k, v] of Object.entries((0, link_tags_1.effectiveTags)(t.channelKind, t.tags)))
                if (v)
                    url.searchParams.set(k, v);
    }
    return url.toString();
}
function allowedRedirectHosts(env = process.env) {
    const hosts = new Set();
    for (const raw of [kiorexWebBase(env), env.KIOREX_ALLOWED_REDIRECT_HOSTS]) {
        for (const part of String(raw ?? "").split(",")) {
            const v = part.trim();
            if (!v)
                continue;
            try {
                hosts.add(new URL(v.includes("://") ? v : `https://${v}`).host.toLowerCase());
            }
            catch {
            }
        }
    }
    return hosts;
}
function assertAllowedRedirect(url, env = process.env) {
    let u;
    try {
        u = new URL(url);
    }
    catch {
        throw new Error("REDIRECT_NOT_ALLOWED");
    }
    const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
    if (u.protocol !== "https:" && !(local && u.protocol === "http:"))
        throw new Error("REDIRECT_NOT_ALLOWED");
    if (u.username || u.password)
        throw new Error("REDIRECT_NOT_ALLOWED");
    if (!allowedRedirectHosts(env).has(u.host.toLowerCase()))
        throw new Error("REDIRECT_NOT_ALLOWED");
    return u.toString();
}
//# sourceMappingURL=link-urls.js.map