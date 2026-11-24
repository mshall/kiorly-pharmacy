import { createHash, createHmac, randomBytes } from "node:crypto";
import { INTAKE_PATH, deriveIntakeSigningKey, enrolmentIdOf, newIntakeNonce, signIntakeRequest } from "@kiorex/contracts";

/** Intake signing lives in kiorex-contracts (1.9.0): one implementation for Kiorex, Clinic, Pharmacy and Lab. Re-exported here so callers keep one import. */
export { deriveIntakeSigningKey, enrolmentIdOf, newIntakeNonce };

/**
 * Shared by Kiorly Pharmacy and Kiorly Lab "Connect to Kiorex" (ADR-040). Pure helpers, no I/O.
 * The request to Kiorex is signed `sha256=HMAC(key, `${ts}.${rawBody}`)` where key = sha256 hex of the enrolment code (first request) or the issued intake key (later requests); see `intakeHeaders`.
 */
export type StepStatus = "done" | "action_needed" | "waiting_kiorex" | "blocked";
export type ConnectStatus = "STANDALONE" | "CONSENTED" | "REQUESTED" | "CHANGES_REQUESTED" | "REJECTED" | "APPROVED" | "PAUSED";
export interface ConnectStep { key: string; status: StepStatus; optional?: boolean; link?: string; detail?: Record<string, unknown> }
export const KIOREX_TERMS_VERSION = "2026-11";

/**
 * Intake authentication (kiorex-contracts 1.9.0 `intake.ts`, imported, not copied): the FIRST request is signed with the one-time enrolment code that Kiorex ops hand over
 * (`kxe_<id>.<secret>`), later requests with the intake key Kiorex returned once (`kxi_...`). HMAC key = hex(sha256(secret)); body carries a single-use nonce.
 */
export const isEnrolmentCode = (code: unknown): code is string => typeof code === "string" && !!enrolmentIdOf(code);
export const intakeHeaders = (secret: string, ts: number, body: string, enrolmentCode?: string): Record<string, string> => signIntakeRequest({ secret, body, timestamp: ts, enrolmentCode });

/** Kiorex answers status polls to whoever knows this token. Derived (not stored): HMAC of the org id under the integration KEK. */
export const deriveStatusToken = (kek: string, orgId: string) => createHmac("sha256", createHash("sha256").update(kek).digest()).update(`kiorex-connect-status:${orgId}`).digest("base64url");
export const newClientKey = (prefix: string) => `${prefix}_${randomBytes(9).toString("hex")}`;
export const newSecret = () => randomBytes(32).toString("base64url");
/** Kiorex API base for the intake; the pharmacy / lab only ever stores a host. */
export const kiorexHost = (env: Record<string, string | undefined> = process.env) => (env.KIOREX_BASE_URL ?? env.KIOREX_API_URL ?? "http://localhost:4000").replace(/\/+$/, "").replace(/\/api\/v1$/, "");
export const intakeUrl = (host: string) => `${host}/api/v1${INTAKE_PATH}`;
export const publicApiBase = (env: Record<string, string | undefined> = process.env) => (env.PUBLIC_API_BASE_URL ?? `http://localhost:${env.PORT ?? "3100"}`).replace(/\/+$/, "");

/** Payout details are a placeholder: a short label only. Anything that looks like an account / card / IBAN number is refused so no bank data is ever stored here. */
export function validatePayoutLabel(label: unknown): { ok: true; value: string } | { ok: false; code: "PAYOUT_LABEL_INVALID" | "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER" } {
  if (typeof label !== "string") return { ok: false, code: "PAYOUT_LABEL_INVALID" };
  const v = label.trim();
  if (v.length < 2 || v.length > 40) return { ok: false, code: "PAYOUT_LABEL_INVALID" };
  if (/\d{6,}/.test(v.replace(/[\s-]/g, "")) || /\b[A-Za-z]{2}\d{2}[A-Za-z0-9]{8,}/.test(v)) return { ok: false, code: "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER" };
  return { ok: true, value: v };
}

export const progressPct = (steps: ConnectStep[]) => { const req = steps.filter((s) => !s.optional); return Math.round((req.filter((s) => s.status === "done").length / req.length) * 100); };
/** Request to go live is available when every prerequisite step is done and nothing has been sent yet (or Kiorex asked for changes). */
export const canRequest = (steps: ConnectStep[], status: ConnectStatus) => (status === "CONSENTED" || status === "CHANGES_REQUESTED" || status === "REJECTED") && steps.filter((s) => !s.optional && !["request", "live"].includes(s.key)).every((s) => s.status === "done");
