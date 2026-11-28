"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEntitlementExempt = isEntitlementExempt;
exports.isMobilePlanGated = isMobilePlanGated;
function isEntitlementExempt(method, path) {
    const p = path.split("?")[0].replace(/\/+$/, "");
    if (/^\/api\/v1\/auth(\/|$)/.test(p) || p === "/api/v1/mobile/bootstrap")
        return true;
    if (/^\/api\/v1\/mobile\/alerts(\/|$)/.test(p))
        return true;
    if (method === "GET" && p === "/api/v1/mobile/pharmacy/controlled/pending-witness")
        return true;
    if (method === "POST" && p === "/api/v1/mobile/pharmacy/controlled/countersign")
        return true;
    if (method === "POST" && p === "/api/v1/mobile/upgrade-request")
        return true;
    return method === "DELETE" && /^\/api\/v1\/mobile\/devices\/[^/]+$/.test(p);
}
function isMobilePlanGated(req) {
    const url = req.originalUrl ?? req.url;
    const c = req.headers["x-kiorly-client"];
    const client = Array.isArray(c) ? c[0] : c;
    const isApp = Boolean(client && /^(?:kiorly|kiorly-team|kiorly-work)(\/|$)/.test(client)) || /^\/api\/v1\/mobile(\/|$|\?)/.test(url);
    return isApp && !isEntitlementExempt(req.method, url);
}
//# sourceMappingURL=mobile-gate.js.map