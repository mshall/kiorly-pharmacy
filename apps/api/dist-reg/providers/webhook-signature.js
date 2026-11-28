"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SIGNATURE_TOLERANCE_SEC = exports.SIGNATURE_HEADER = void 0;
exports.signWebhook = signWebhook;
exports.verifyWebhookSignature = verifyWebhookSignature;
const node_crypto_1 = require("node:crypto");
exports.SIGNATURE_HEADER = "x-kiorex-signature";
exports.SIGNATURE_TOLERANCE_SEC = 300;
function signWebhook(secret, rawBody, nowSec = Math.floor(Date.now() / 1000)) {
    const v1 = (0, node_crypto_1.createHmac)("sha256", secret).update(`${nowSec}.${rawBody}`).digest("hex");
    return `t=${nowSec},v1=${v1}`;
}
function verifyWebhookSignature(secret, rawBody, header, nowSec = Math.floor(Date.now() / 1000), toleranceSec = exports.SIGNATURE_TOLERANCE_SEC) {
    if (!header)
        return { ok: false, reason: "MISSING" };
    const parts = Object.fromEntries(header.split(",").map((p) => { const i = p.indexOf("="); return [p.slice(0, i).trim(), p.slice(i + 1).trim()]; }));
    const t = Number(parts.t);
    if (!Number.isInteger(t) || typeof parts.v1 !== "string" || !/^[0-9a-f]{64}$/i.test(parts.v1))
        return { ok: false, reason: "MALFORMED" };
    if (Math.abs(nowSec - t) > toleranceSec)
        return { ok: false, reason: "STALE" };
    const expected = (0, node_crypto_1.createHmac)("sha256", secret).update(`${t}.${rawBody}`).digest();
    const given = Buffer.from(parts.v1, "hex");
    return given.length === expected.length && (0, node_crypto_1.timingSafeEqual)(given, expected) ? { ok: true } : { ok: false, reason: "MISMATCH" };
}
//# sourceMappingURL=webhook-signature.js.map