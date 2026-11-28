"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_TOUCH_DEFAULT_TTL_MS = exports.LINK_TOUCH_VERSION = void 0;
exports.linkTouchSecret = linkTouchSecret;
exports.signLinkTouch = signLinkTouch;
exports.verifyLinkTouch = verifyLinkTouch;
const node_crypto_1 = require("node:crypto");
const link_code_1 = require("./link-code");
exports.LINK_TOUCH_VERSION = 1;
exports.LINK_TOUCH_DEFAULT_TTL_MS = 72 * 60 * 60 * 1000;
const PREFIX = "kx-lt1\n";
const DEV_FALLBACK = "kx_dev_webhook_secret";
function linkTouchSecret(env = process.env) {
    const explicit = env.LINK_TOUCH_SIGNING_SECRET?.trim() || env.KIOREX_OUTBOX_WEBHOOK_SECRET?.trim();
    if (explicit)
        return explicit;
    return env.NODE_ENV === "production" ? null : DEV_FALLBACK;
}
function sign(secret, payloadB64) {
    return (0, node_crypto_1.createHmac)("sha256", secret).update(PREFIX + payloadB64).digest("base64url");
}
function signLinkTouch(input, secret = linkTouchSecret()) {
    if (!secret)
        return null;
    const code = (0, link_code_1.normalizeLinkCode)(input.code);
    if (!code)
        return null;
    const claims = { o: input.orgId, c: code, t: (input.now ?? new Date()).getTime(), v: exports.LINK_TOUCH_VERSION };
    const payload = Buffer.from(JSON.stringify(claims), "utf8").toString("base64url");
    return `${payload}.${sign(secret, payload)}`;
}
function verifyLinkTouch(token, opts) {
    const secret = opts?.secret === undefined ? linkTouchSecret() : opts.secret;
    if (!secret)
        return { ok: false, reason: "NO_SECRET" };
    if (typeof token !== "string" || token.length > 600)
        return { ok: false, reason: "MALFORMED" };
    const parts = token.split(".");
    if (parts.length !== 2 || !parts[0] || !parts[1])
        return { ok: false, reason: "MALFORMED" };
    const expected = Buffer.from(sign(secret, parts[0]));
    const given = Buffer.from(parts[1]);
    if (expected.length !== given.length || !(0, node_crypto_1.timingSafeEqual)(expected, given))
        return { ok: false, reason: "BAD_SIGNATURE" };
    let claims;
    try {
        claims = JSON.parse(Buffer.from(parts[0], "base64url").toString("utf8"));
    }
    catch {
        return { ok: false, reason: "MALFORMED" };
    }
    if (!claims || claims.v !== exports.LINK_TOUCH_VERSION || typeof claims.o !== "string" || typeof claims.t !== "number" || !(0, link_code_1.normalizeLinkCode)(claims.c)) {
        return { ok: false, reason: "MALFORMED" };
    }
    const now = (opts?.now ?? new Date()).getTime();
    const ttl = opts?.ttlMs ?? exports.LINK_TOUCH_DEFAULT_TTL_MS;
    if (claims.t > now + 5 * 60 * 1000 || now - claims.t > ttl)
        return { ok: false, reason: "EXPIRED" };
    return { ok: true, claims };
}
//# sourceMappingURL=link-touch.js.map