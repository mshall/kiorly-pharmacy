import { createHash, createHmac, timingSafeEqual } from "node:crypto";

/** Content-type / size validation, key hygiene and signed download URLs for object storage. Never public: nothing here yields a permanent or unauthenticated URL. */
export class StorageValidationError extends Error {
  constructor(public readonly code: "INVALID_DATA_URL" | "UNSUPPORTED_CONTENT_TYPE" | "CONTENT_MISMATCH" | "FILE_TOO_LARGE" | "INVALID_KEY", message: string) { super(message); this.name = "StorageValidationError"; }
}

export const DEFAULT_MAX_BYTES = 5 * 1024 * 1024;
/** Allowed uploads: Rx scans / attachments (images, PDF) and exports (CSV, JSON). No SVG / HTML / scripts. */
export const ALLOWED_TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "application/pdf": "pdf", "text/csv": "csv", "application/json": "json" };

export const maxBytes = (env: Record<string, string | undefined> = process.env) => (Number(env.STORAGE_MAX_BYTES) > 0 ? Number(env.STORAGE_MAX_BYTES) : DEFAULT_MAX_BYTES);

export function sniffType(b: Uint8Array): string | null {
  const at = (i: number, ...v: number[]) => v.every((x, j) => b[i + j] === x);
  if (at(0, 0xff, 0xd8, 0xff)) return "image/jpeg";
  if (at(0, 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a)) return "image/png";
  if (at(0, 0x52, 0x49, 0x46, 0x46) && at(8, 0x57, 0x45, 0x42, 0x50)) return "image/webp";
  if (at(0, 0x25, 0x50, 0x44, 0x46, 0x2d)) return "application/pdf";
  return null;
}
const isText = (b: Uint8Array) => { try { new TextDecoder("utf-8", { fatal: true }).decode(b); return !b.includes(0); } catch { return false; } };

/** Throws StorageValidationError unless `declared` is allowed, within the size cap, and the bytes really are that type. Returns the (normalised) content type. */
export function validateUpload(bytes: Uint8Array, declared: string, env: Record<string, string | undefined> = process.env): string {
  const type = declared.toLowerCase().split(";")[0]!.trim();
  if (!ALLOWED_TYPES[type]) throw new StorageValidationError("UNSUPPORTED_CONTENT_TYPE", `Content type ${type || "(none)"} is not allowed (${Object.keys(ALLOWED_TYPES).join(", ")})`);
  if (bytes.length === 0) throw new StorageValidationError("INVALID_DATA_URL", "Empty file");
  const cap = maxBytes(env);
  if (bytes.length > cap) throw new StorageValidationError("FILE_TOO_LARGE", `File too large (max ${Math.floor(cap / 1024 / 1024 * 100) / 100} MB)`);
  const sniffed = sniffType(bytes);
  const textual = type === "text/csv" || type === "application/json";
  if (textual ? !isText(bytes) || sniffed : sniffed !== type) throw new StorageValidationError("CONTENT_MISMATCH", `File content does not match ${type}`);
  return type;
}

export function parseDataUrl(dataUrl: string): { contentType: string; bytes: Buffer } {
  const m = /^data:([\w/+.-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(dataUrl);
  if (!m) throw new StorageValidationError("INVALID_DATA_URL", "Expected a base64 data URL");
  return { contentType: m[1]!, bytes: Buffer.from(m[2]!, "base64") };
}

/** Safe object key: only [a-zA-Z0-9/_.-], no `..`, no leading slash. */
export function safeKey(key: string): string {
  const k = key.replace(/[^a-zA-Z0-9/_.-]/g, "_").replace(/\.\.+/g, ".").split("/").filter((seg) => seg && seg !== ".").join("/");
  if (!k || key.endsWith("/")) throw new StorageValidationError("INVALID_KEY", "Invalid storage key");
  return k;
}

export const URL_TTL_DEFAULT_SEC = 300;
export const URL_TTL_MAX_SEC = 3600;
export const ttlSec = (env: Record<string, string | undefined> = process.env, want?: number) => Math.max(10, Math.min(want ?? (Number(env.STORAGE_URL_TTL_SEC) || URL_TTL_DEFAULT_SEC), URL_TTL_MAX_SEC));

/** Public so tests/dev can sign; it is NOT a credential and only usable outside production in mock mode without a configured secret. */
const MOCK_SIGNING_SECRET = "mock-storage-signing-secret-not-a-credential";
export function signingSecret(env: Record<string, string | undefined> = process.env): string | undefined {
  const s = env.STORAGE_SIGNING_SECRET?.trim();
  if (s) return s;
  const k = (env.STORAGE_API_KEY ?? env.STORAGE_API_TOKEN)?.trim();
  if (k) return createHash("sha256").update(`kiorex-storage-url:${k}`).digest("hex");
  return env.NODE_ENV !== "production" ? MOCK_SIGNING_SECRET : undefined;
}
const mac = (secret: string, key: string, exp: number) => createHmac("sha256", secret).update(`${key}\n${exp}`).digest("hex");

export function signDownload(key: string, ttl?: number, env: Record<string, string | undefined> = process.env, nowMs = Date.now()): { path: string; expiresAt: Date } {
  const secret = signingSecret(env);
  if (!secret) throw new StorageValidationError("INVALID_KEY", "No signing secret (set STORAGE_SIGNING_SECRET or STORAGE_API_KEY)");
  const exp = Math.floor(nowMs / 1000) + ttlSec(env, ttl);
  return { path: `/api/v1/files?key=${encodeURIComponent(key)}&exp=${exp}&sig=${mac(secret, key, exp)}`, expiresAt: new Date(exp * 1000) };
}

export type DownloadCheck = { ok: true } | { ok: false; reason: "MISSING" | "EXPIRED" | "MISMATCH" | "NOT_CONFIGURED" };
export function verifyDownload(key: string | undefined, exp: string | undefined, sig: string | undefined, env: Record<string, string | undefined> = process.env, nowMs = Date.now()): DownloadCheck {
  const secret = signingSecret(env);
  if (!secret) return { ok: false, reason: "NOT_CONFIGURED" };
  const e = Number(exp);
  if (!key || !Number.isInteger(e) || !sig || !/^[0-9a-f]{64}$/i.test(sig)) return { ok: false, reason: "MISSING" };
  if (e * 1000 < nowMs) return { ok: false, reason: "EXPIRED" };
  const want = Buffer.from(mac(secret, key, e), "hex"), got = Buffer.from(sig, "hex");
  return got.length === want.length && timingSafeEqual(got, want) ? { ok: true } : { ok: false, reason: "MISMATCH" };
}
