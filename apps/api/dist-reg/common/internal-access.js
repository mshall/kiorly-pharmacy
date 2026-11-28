"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPrivateAddress = isPrivateAddress;
exports.hasInternalHealthAccess = hasInternalHealthAccess;
const node_crypto_1 = require("node:crypto");
const node_net_1 = require("node:net");
const one = (v) => (Array.isArray(v) ? v[0] : v)?.trim() ?? "";
function isPrivateAddress(raw) {
    if (!raw)
        return false;
    const a = raw.replace(/^::ffff:/i, "").toLowerCase();
    const v = (0, node_net_1.isIP)(a);
    if (v === 4) {
        const [p, q] = a.split(".").map(Number);
        return p === 127 || p === 10 || (p === 172 && q >= 16 && q <= 31) || (p === 192 && q === 168) || (p === 169 && q === 254);
    }
    if (v === 6)
        return a === "::1" || a.startsWith("fc") || a.startsWith("fd") || a.startsWith("fe80");
    return false;
}
function hasInternalHealthAccess(req, env = process.env) {
    const expected = env.HEALTH_DETAIL_TOKEN?.trim();
    const given = one(req.headers?.["x-health-token"]);
    if (expected && given && given.length === expected.length && (0, node_crypto_1.timingSafeEqual)(Buffer.from(given), Buffer.from(expected)))
        return true;
    if (one(req.headers?.["x-forwarded-for"]) || one(req.headers?.["forwarded"]))
        return false;
    return isPrivateAddress(req.socket?.remoteAddress);
}
//# sourceMappingURL=internal-access.js.map