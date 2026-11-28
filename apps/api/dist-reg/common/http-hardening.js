"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerEnabled = swaggerEnabled;
exports.trustedProxyHops = trustedProxyHops;
exports.securityHeaderMap = securityHeaderMap;
exports.securityHeaders = securityHeaders;
exports.applyHttpHardening = applyHttpHardening;
exports.secretsEqual = secretsEqual;
const node_crypto_1 = require("node:crypto");
function swaggerEnabled(env = process.env) {
    const v = env.SWAGGER_ENABLED?.trim().toLowerCase();
    if (v === "true")
        return true;
    if (v === "false")
        return false;
    return env.NODE_ENV !== "production";
}
function trustedProxyHops(env = process.env) {
    const n = Number(env.TRUSTED_PROXY_HOPS);
    return Number.isInteger(n) && n >= 0 && n <= 5 ? n : 0;
}
function securityHeaderMap(env = process.env) {
    const h = {
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
        "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
        "Content-Security-Policy": "frame-ancestors 'none'",
    };
    if (env.NODE_ENV === "production")
        h["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains";
    return h;
}
function securityHeaders(env = process.env) {
    return (req, res, next) => {
        const docs = (req.path ?? req.url ?? "").startsWith("/docs");
        for (const [k, v] of Object.entries(securityHeaderMap(env)))
            if (!docs || (k !== "Content-Security-Policy" && k !== "X-Frame-Options"))
                res.setHeader(k, v);
        res.removeHeader?.("X-Powered-By");
        next();
    };
}
function applyHttpHardening(app, env = process.env) {
    const http = app.getHttpAdapter().getInstance();
    http.disable?.("x-powered-by");
    http.set?.("trust proxy", trustedProxyHops(env));
    http.use?.(securityHeaders(env));
}
function secretsEqual(a, b) {
    if (!a || !b)
        return false;
    const x = Buffer.from(a), y = Buffer.from(b);
    return x.length === y.length && (0, node_crypto_1.timingSafeEqual)(x, y);
}
//# sourceMappingURL=http-hardening.js.map