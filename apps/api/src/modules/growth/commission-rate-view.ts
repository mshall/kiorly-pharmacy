import type { CommissionRateSpec } from "@kiorex/contracts";
/**
 * COM-2 provider-side rate view (pure). The rate vocabulary and the resolution at an instant (`effectiveCommissionRate`) come from @kiorex/contracts 1.13.0; this file keeps only the push validation and the tolerant readers. Kiorex sets the commission rate (default per organisation type, override per organisation, maker-checker); this product only displays it.
 * The history rows arrive with their start time, so the effective rate is computed here at read time: a change that was future-dated takes effect by itself, and an old instant keeps the old rate.
 * Nothing here is a rate of its own: with no active row the answer is NOT_SET (no commission is charged, "rate not set").
 */
/** Validation of what Kiorex pushes: a malformed view is refused whole rather than shown half. */
export function rateViewProblems(b: unknown): string[] {
  if (!b || typeof b !== "object") return ["body must be an object"];
  const o = b as Record<string, unknown>;
  const out: string[] = [];
  if (typeof o.orgRef !== "string" || !o.orgRef) out.push("orgRef is required");
  if (!["CLINIC", "PHARMACY", "LAB"].includes(String(o.product))) out.push("product must be CLINIC, PHARMACY or LAB");
  if (typeof o.version !== "string" || !/^\d{1,18}$/.test(o.version)) out.push("version must be a numeric string");
  if (!Array.isArray(o.history)) out.push("history must be an array");
  else for (const [i, r] of (o.history as unknown[]).entries()) {
    const h = r as Record<string, unknown>;
    if (!h || typeof h.version !== "number" || !["DEFAULT", "ORG"].includes(String(h.scope)) || !["RATE", "INHERIT"].includes(String(h.kind)) || Number.isNaN(Date.parse(String(h.effectiveFrom)))) out.push(`history[${i}] is malformed`);
    else if (h.kind === "RATE") {
      const s = h.spec as Record<string, unknown> | null;
      if (!s || !["PERCENT", "FLAT"].includes(String(s.feeType))) out.push(`history[${i}].spec is malformed`);
    }
  }
  return out;
}

const wholeDays = (v: unknown, min: number, max: number): number | null => (typeof v === "number" && Number.isInteger(v) && v >= min && v <= max ? v : null);
const dayList = (v: unknown, min: number, max: number, maxLen: number): number[] | null => (Array.isArray(v) && v.length > 0 && v.length <= maxLen && v.every((n, i, a) => wholeDays(n, min, max) !== null && (i === 0 || n > (a[i - 1] as number))) ? [...(v as number[])] : null);

/** The configurable collection parameters of the rate in force; every one is null when Kiorex does not set it (then the Clinic default applies). Never throws on a malformed value. */
export type RateParams = { graceDays: number | null; retryDays: number[] | null; invoiceDueDays: number | null; reminderDays: number[] | null; disputeWindowDays: number | null; savedMethodChargeAllowed: boolean | null };
export const NO_RATE_PARAMS: RateParams = { graceDays: null, retryDays: null, invoiceDueDays: null, reminderDays: null, disputeWindowDays: null, savedMethodChargeAllowed: null };
export function rateParamsOf(spec: CommissionRateSpec | null | undefined): RateParams {
  if (!spec || typeof spec !== "object") return NO_RATE_PARAMS;
  return {
    graceDays: wholeDays(spec.graceDays, 0, 30), retryDays: dayList(spec.retryDays, 1, 60, 6), invoiceDueDays: wholeDays(spec.invoiceDueDays, 1, 90),
    reminderDays: dayList(spec.reminderDays, -30, 90, 8), disputeWindowDays: wholeDays(spec.disputeWindowDays, 0, 365), savedMethodChargeAllowed: typeof spec.savedMethodChargeAllowed === "boolean" ? spec.savedMethodChargeAllowed : null,
  };
}

/** COM-3 disclosure / counsel as pushed with the view (additive, optional). Only the counsel STATUS is kept: never the reviewer, the document or the conditions. Wording that is not set is a hidden block. */
export type DisclosureView = { rateDisclosure: { en: string; ar: string }; termsSummary: { en: string; ar: string }; showOverrideReason: boolean; wordingSet: boolean };
export type CounselStatusView = "NOT_REVIEWED" | "APPROVED_WITH_CONDITIONS" | "APPROVED" | "REJECTED";
const COUNSEL_STATUSES: readonly string[] = ["NOT_REVIEWED", "APPROVED_WITH_CONDITIONS", "APPROVED", "REJECTED"];
const text = (v: unknown): string => (typeof v === "string" ? v.slice(0, 4000) : "");
const bi = (v: unknown): { en: string; ar: string } => { const o = v && typeof v === "object" ? (v as Record<string, unknown>) : {}; return { en: text(o.en), ar: text(o.ar) }; };
export function parseDisclosure(raw: unknown): DisclosureView | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  const rateDisclosure = bi(o.rateDisclosure); const termsSummary = bi(o.termsSummary);
  const wordingSet = [rateDisclosure.en, rateDisclosure.ar, termsSummary.en, termsSummary.ar].some((x) => x.trim().length > 0);
  return { rateDisclosure, termsSummary, showOverrideReason: o.showOverrideReason === true, wordingSet };
}
export function parseCounselStatus(raw: unknown): { status: CounselStatusView; reviewedOn: string | null } | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.status !== "string" || !COUNSEL_STATUSES.includes(o.status)) return null;
  return { status: o.status as CounselStatusView, reviewedOn: typeof o.reviewedOn === "string" && !Number.isNaN(Date.parse(o.reviewedOn)) ? o.reviewedOn.slice(0, 10) : null };
}
