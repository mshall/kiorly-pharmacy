/**
 * SUB-01 (Pharmacy): pure subscription policy, mirrors Clinic's `subscriptions/subscription-policy.ts` (same rules, same names) until the
 * commerce kernel ships (ADR-004/027), when this file is replaced by the kernel's. No prices, tax rates or legal wording here.
 * Platform-level defaults live in `DEFAULT_SUBSCRIPTION_POLICY` and can be overridden by the deployment (`SUBSCRIPTION_POLICY_JSON`);
 * the maker-checker config catalog is a Kiorex control-plane item (NEEDS_HUMAN LG-SUB-7).
 */
export type LapseAction = "DOWNGRADE_TO_LITE";
export type SubscriptionPolicy = {
  autoRenewDefault: boolean;
  orgMayDisableAutoRenew: boolean;
  renewalReminderDaysBefore: number[];
  /** Charge retry offsets (days after the first failure). */
  retryDays: number[];
  /** Days after the period end (first failed charge) at which the organisation moves to Lite. */
  downgradeAfterDays: number;
  liteReadOnlyGraceDays: number;
  taxRatePercent: number;
  reminderQuietHours: { start: number; end: number };
};

export const DEFAULT_SUBSCRIPTION_POLICY: SubscriptionPolicy = {
  autoRenewDefault: true,
  orgMayDisableAutoRenew: true,
  renewalReminderDaysBefore: [7, 3, 1],
  retryDays: [1, 3, 7],
  downgradeAfterDays: 15,
  liteReadOnlyGraceDays: 30,
  taxRatePercent: 0,
  reminderQuietHours: { start: 21, end: 8 },
};

const int = (v: unknown, d: number, min: number, max: number) => (typeof v === "number" && Number.isFinite(v) ? Math.min(max, Math.max(min, Math.floor(v))) : d);
const days = (v: unknown, d: number[]) => (Array.isArray(v) ? [...new Set(v.filter((x): x is number => typeof x === "number" && x >= 0 && x <= 90).map(Math.floor))].sort((a, b) => b - a) : d);

export function parseSubscriptionPolicy(raw: unknown): SubscriptionPolicy {
  const d = DEFAULT_SUBSCRIPTION_POLICY;
  const r = raw && typeof raw === "object" && !Array.isArray(raw) ? (raw as Record<string, unknown>) : {};
  const q = (r.reminderQuietHours ?? {}) as Record<string, unknown>;
  return {
    autoRenewDefault: typeof r.autoRenewDefault === "boolean" ? r.autoRenewDefault : d.autoRenewDefault,
    orgMayDisableAutoRenew: typeof r.orgMayDisableAutoRenew === "boolean" ? r.orgMayDisableAutoRenew : d.orgMayDisableAutoRenew,
    renewalReminderDaysBefore: days(r.renewalReminderDaysBefore, [...d.renewalReminderDaysBefore]),
    retryDays: Array.isArray(r.retryDays) ? days(r.retryDays, [...d.retryDays]).sort((a, b) => a - b) : [...d.retryDays],
    downgradeAfterDays: int(r.downgradeAfterDays, d.downgradeAfterDays, 1, 365),
    liteReadOnlyGraceDays: int(r.liteReadOnlyGraceDays, d.liteReadOnlyGraceDays, 0, 365),
    taxRatePercent: typeof r.taxRatePercent === "number" && r.taxRatePercent >= 0 && r.taxRatePercent <= 100 ? r.taxRatePercent : d.taxRatePercent,
    reminderQuietHours: { start: int(q.start, d.reminderQuietHours.start, 0, 23), end: int(q.end, d.reminderQuietHours.end, 0, 23) },
  };
}

/** Deployment override: SUBSCRIPTION_POLICY_JSON (invalid JSON falls back to defaults, never throws at request time). */
export function loadPolicy(env: NodeJS.ProcessEnv = process.env): SubscriptionPolicy {
  try { return parseSubscriptionPolicy(env.SUBSCRIPTION_POLICY_JSON ? JSON.parse(env.SUBSCRIPTION_POLICY_JSON) : null); } catch { return parseSubscriptionPolicy(null); }
}

export const effectiveAutoRenew = (s: { autoRenew: boolean; autoRenewForced: string | null }) => (s.autoRenewForced === "ON" ? true : s.autoRenewForced === "OFF" ? false : s.autoRenew);
export const FREE_EDITION = "LITE";
export const isFree = (edition: string) => edition === FREE_EDITION;

export type PeriodEndDecision = "RENEW" | "DOWNGRADE_AUTO_RENEW_OFF" | "NONE";
export function decidePeriodEnd(i: { edition: string; autoRenew: boolean; currentPeriodEnd: Date; now: Date }): PeriodEndDecision {
  if (i.currentPeriodEnd > i.now || isFree(i.edition)) return "NONE";
  return i.autoRenew ? "RENEW" : "DOWNGRADE_AUTO_RENEW_OFF";
}

const DAY = 86_400_000;
/** Tightest due offset only; a tighter one already sent supersedes looser ones. */
export function reminderOffsetsDue(i: { currentPeriodEnd: Date; now: Date; offsets: readonly number[]; alreadySent: readonly number[] }): number[] {
  if (i.currentPeriodEnd <= i.now) return [];
  const left = Math.ceil((i.currentPeriodEnd.getTime() - i.now.getTime()) / DAY);
  const tight = i.alreadySent.length ? Math.min(...i.alreadySent) : Infinity;
  const due = i.offsets.filter((o) => left <= o && !i.alreadySent.includes(o) && o < tight);
  return due.length ? [Math.min(...due)] : [];
}

export function nextOutsideQuietHours(now: Date, quiet: { start: number; end: number }, tz = 2): Date {
  const inQ = (d: Date) => { const h = (((d.getUTCHours() + tz) % 24) + 24) % 24; return quiet.start === quiet.end ? false : quiet.start < quiet.end ? h >= quiet.start && h < quiet.end : h >= quiet.start || h < quiet.end; };
  let d = new Date(now);
  for (let k = 0; k < 25 && inQ(d); k++) d = new Date(d.getTime() + 3_600_000);
  return d;
}

export type PlanShape = { edition: string; maxUsers: number | null; maxBranches: number | null; capabilities: readonly string[] };
export type DowngradeImpact = {
  fromEdition: string; toEdition: string; lostFeatures: string[];
  reducedLimits: { key: "users" | "branches"; from: number | null; to: number | null; current: number; overBy: number }[];
  dataRetained: true; readOnlyGraceDays: number; restoredOnUpgrade: true;
};
export function computeDowngradeImpact(from: PlanShape, to: PlanShape, usage: { users: number; branches: number }, readOnlyGraceDays: number): DowngradeImpact {
  const lost = from.capabilities.filter((c) => !to.capabilities.includes(c)).sort();
  const limits: DowngradeImpact["reducedLimits"] = [];
  for (const [key, f, t] of [["users", from.maxUsers, to.maxUsers], ["branches", from.maxBranches, to.maxBranches]] as const) {
    if (t != null && (f == null || t < f)) limits.push({ key, from: f, to: t, current: usage[key], overBy: Math.max(0, usage[key] - t) });
  }
  return { fromEdition: from.edition, toEdition: to.edition, lostFeatures: lost, reducedLimits: limits, dataRetained: true, readOnlyGraceDays, restoredOnUpgrade: true };
}
export const liteGraceActive = (s: { downgradedToLiteAt: Date | null; liteReadOnlyGraceUntil: Date | null }, now: Date) => s.downgradedToLiteAt != null && s.liteReadOnlyGraceUntil != null && s.liteReadOnlyGraceUntil > now;
