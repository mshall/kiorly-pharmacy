import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Generic provider webhook signature (what every mapping layer normalises to):
 *   header  X-Kiorex-Signature: t=<unix seconds>,v1=<hex HMAC-SHA256 of "<t>.<raw body>">
 * Vendors that sign differently (Twilio, Meta, Paymob...) are adapted in the kind's mapping file via `verifySignature`.
 */
export const SIGNATURE_HEADER = "x-kiorex-signature";
export const SIGNATURE_TOLERANCE_SEC = 300;

export function signWebhook(secret: string, rawBody: string, nowSec = Math.floor(Date.now() / 1000)): string {
  const v1 = createHmac("sha256", secret).update(`${nowSec}.${rawBody}`).digest("hex");
  return `t=${nowSec},v1=${v1}`;
}

export type SignatureCheck = { ok: true } | { ok: false; reason: "MISSING" | "MALFORMED" | "STALE" | "MISMATCH" };

export function verifyWebhookSignature(secret: string, rawBody: string, header: string | undefined, nowSec = Math.floor(Date.now() / 1000), toleranceSec = SIGNATURE_TOLERANCE_SEC): SignatureCheck {
  if (!header) return { ok: false, reason: "MISSING" };
  const parts = Object.fromEntries(header.split(",").map((p) => { const i = p.indexOf("="); return [p.slice(0, i).trim(), p.slice(i + 1).trim()]; }));
  const t = Number(parts.t);
  if (!Number.isInteger(t) || typeof parts.v1 !== "string" || !/^[0-9a-f]{64}$/i.test(parts.v1)) return { ok: false, reason: "MALFORMED" };
  if (Math.abs(nowSec - t) > toleranceSec) return { ok: false, reason: "STALE" };
  const expected = createHmac("sha256", secret).update(`${t}.${rawBody}`).digest();
  const given = Buffer.from(parts.v1, "hex");
  return given.length === expected.length && timingSafeEqual(given, expected) ? { ok: true } : { ok: false, reason: "MISMATCH" };
}
