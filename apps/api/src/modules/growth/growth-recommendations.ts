/**
 * Recommendations for the partner Growth workspace (GRW-P4-B1): a CLOSED catalogue of five rules (ids only; the wording lives in the web and app strings, AR and EN).
 * Guardrails (tested): nothing here may encourage over-treatment, extra purchases, patient-facing price pressure or any review or testimonial tactic, and no rule reads
 * what a customer ordered (only counts of orders by status).
 */
export const RECOMMENDATION_IDS = ["CREATE_FIRST_LINK", "PRINT_COUNTER_CARD", "BRANCH_NOT_LISTED", "LINKS_UNUSED", "HIGH_REJECTION"] as const;
export type RecommendationId = (typeof RECOMMENDATION_IDS)[number];

export interface RecommendationInput {
  activeLinks: number;
  hasDeskLink: boolean;
  /** Branches (pharmacy) or sites (lab) that are not offered on Kiorex yet. */
  branchesNotListed: number;
  /** ACTIVE links older than 14 days with no visit in the last 30 days. */
  unusedLinks: number;
  /** Orders (pharmacy) or bookings (lab) Kiorex sent in the last 30 days and how many the partner rejected or cancelled. */
  kiorexOrders30d: number;
  rejectedOrCancelled30d: number;
}

export interface Recommendation {
  id: RecommendationId;
  severity: "high" | "medium" | "low";
  /** Numbers the UI interpolates into its sentence. */
  params: Record<string, number>;
  /** Where the UI sends the user. */
  action: "links" | "connect" | "orders";
}

export const THRESHOLDS = { rejectRate: 0.2, minOrdersForRates: 8, unusedAfterDays: 14 } as const;

export function buildRecommendations(i: RecommendationInput): Recommendation[] {
  const out: Recommendation[] = [];
  if (i.branchesNotListed > 0) out.push({ id: "BRANCH_NOT_LISTED", severity: "high", params: { count: i.branchesNotListed }, action: "connect" });
  if (i.kiorexOrders30d >= THRESHOLDS.minOrdersForRates) {
    const r = i.rejectedOrCancelled30d / i.kiorexOrders30d;
    if (r >= THRESHOLDS.rejectRate) out.push({ id: "HIGH_REJECTION", severity: "medium", params: { percent: Math.round(r * 100) }, action: "orders" });
  }
  if (i.activeLinks === 0) out.push({ id: "CREATE_FIRST_LINK", severity: "medium", params: {}, action: "links" });
  else {
    if (!i.hasDeskLink) out.push({ id: "PRINT_COUNTER_CARD", severity: "low", params: {}, action: "links" });
    if (i.unusedLinks > 0) out.push({ id: "LINKS_UNUSED", severity: "low", params: { count: i.unusedLinks }, action: "links" });
  }
  const rank = { high: 0, medium: 1, low: 2 } as const;
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
