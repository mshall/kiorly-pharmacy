"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttlSec = exports.URL_TTL_MAX_SEC = exports.URL_TTL_DEFAULT_SEC = exports.maxBytes = exports.ALLOWED_TYPES = exports.DEFAULT_MAX_BYTES = exports.StorageValidationError = void 0;
exports.sniffType = sniffType;
exports.validateUpload = validateUpload;
exports.parseDataUrl = parseDataUrl;
exports.safeKey = safeKey;
exports.signingSecret = signingSecret;
exports.signDownload = signDownload;
exports.verifyDownload = verifyDownload;
const node_crypto_1 = require("node:crypto");
class StorageValidationError extends Error {
    code;
    constructor(code, message) {
        super(message);
        this.code = code;
        this.name = "StorageValidationError";
    }
}
exports.StorageValidationError = StorageValidationError;
exports.DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
exports.ALLOWED_TYPES = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf", "text/csv": "csv", "application/json": "json" };
const maxBytes = (env = process.env) => (Number(env.STORAGE_MAX_BYTES) > 0 ? Number(env.STORAGE_MAX_BYTES) : exports.DEFAULT_MAX_BYTES);
exports.maxBytes = maxBytes;
function sniffType(b) {
    const at = (i, ...v) => v.every((x, j) => b[i + j] === x);
    if (at(0, 0xff, 0xd8, 0xff))
        return "image/jpeg";
    if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))
        return "image/png";
    if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50))
        return "image/webp";
    if (at(0, 0x25, 0x50, 0x44, 0x46, 0x2d))
        return "application/pdf";
    return null;
}
const isText = (b) => { try {
    new TextDecoder("utf-8", { fatal: true }).decode(b);
    return !b.includes(0);
}
catch {
    return false;
} };
function validateUpload(bytes, declared, env = process.env) {
    const type = declared.toLowerCase().split(";")[0].trim();
    if (!exports.ALLOWED_TYPES[type])
        throw new StorageValidationError("UNSUPPORTED_CONTENT_TYPE", `Content type ${type || "(none)"} is not allowed (${Object.keys(exports.ALLOWED_TYPES).join(", ")})`);
    if (bytes.length === 0)
        throw new StorageValidationError("INVALID_DATA_URL", "Empty file");
    const cap = (0, exports.maxBytes)(env);
    if (bytes.length > cap)
        throw new StorageValidationError("FILE_TOO_LARGE", `File too large (max ${Math.floor(cap / 1024 / 1024 * 100) / 100} MB)`);
    const sniffed = sniffType(bytes);
    const textual = type === "text/csv" || type === "application/json";
    if (textual ? !isText(bytes) || sniffed : sniffed !== type)
        throw new StorageValidationError("CONTENT_MISMATCH", `File content does not match ${type}`);
    return type;
}
function parseDataUrl(dataUrl) {
    const m = /^data:([\w/+.-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
    if (!m)
        throw new StorageValidationError("INVALID_DATA_URL", "Expected a base64 data URL");
    return { contentType: m[1], bytes: Buffer.from(m[2], "base64") };
}
function safeKey(key) {
    const k = key.replace(/[^a-zA-Z0-9/_.-]/g, "_").replace(/\.\.+/g, ".").split("/").filter((seg) => seg && seg !== ".").join("/");
    if (!k || key.endsWith("/"))
        throw new StorageValidationError("INVALID_KEY", "Invalid storage key");
    return k;
}
exports.URL_TTL_DEFAULT_SEC = 300;
exports.URL_TTL_MAX_SEC = 3600;
const ttlSec = (env = process.env, want) => Math.max(10, Math.min(want ?? (Number(env.STORAGE_URL_TTL_SEC) || exports.URL_TTL_DEFAULT_SEC), exports.URL_TTL_MAX_SEC));
exports.ttlSec = ttlSec;
const MOCK_SIGNING_SECRET = "mock-storage-signing-secret-not-a-credential";
function signingSecret(env = process.env) {
    const s = env.STORAGE_SIGNING_SECRET?.trim();
    if (s)
        return s;
    const k = (env.STORAGE_API_KEY ?? env.STORAGE_API_TOKEN)?.trim();
    if (k)
        return (0, node_crypto_1.createHash)("sha256").update(`kiorex-storage-url:${k}`).digest("hex");
    return env.NODE_ENV !== "production" ? MOCK_SIGNING_SECRET : undefined;
}
const mac = (secret, key, exp) => (0, node_crypto_1.createHmac)("sha256", secret).update(`${key}\n${exp}`).digest("hex");
function signDownload(key, ttl, env = process.env, nowMs = Date.now()) {
    const secret = signingSecret(env);
    if (!secret)
        throw new StorageValidationError("INVALID_KEY", "No signing secret (set STORAGE_SIGNING_SECRET or STORAGE_API_KEY)");
    const exp = Math.floor(nowMs / 1000) + (0, exports.ttlSec)(env, ttl);
    return { path: `/api/v1/files?key=${encodeURIComponent(key)}&exp=${exp}&sig=${mac(secret, key, exp)}`, expiresAt: new Date(exp * 1000) };
}
function verifyDownload(key, exp, sig, env = process.env, nowMs = Date.now()) {
    const secret = signingSecret(env);
    if (!secret)
        return { ok: false, reason: "NOT_CONFIGURED" };
    const e = Number(exp);
    if (!key || !Number.isInteger(e) || !sig || !/^[0-9a-f]{64}$/i.test(sig))
        return { ok: false, reason: "MISSING" };
    if (e * 1000 < nowMs)
        return { ok: false, reason: "EXPIRED" };
    const want = Buffer.from(mac(secret, key, e), "hex"), got = Buffer.from(sig, "hex");
    return got.length === want.length && (0, node_crypto_1.timingSafeEqual)(got, want) ? { ok: true } : { ok: false, reason: "MISMATCH" };
}
//# sourceMappingURL=storage-policy.js.map