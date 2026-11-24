/**
 * Plan limits for the Growth workspace (PROPOSED_DEFAULT, NEEDS_HUMAN: plan packaging is a founder decision). A limit caps ACTIVE + PAUSED links only;
 * revoking frees a slot. Same numbers as the Clinic (LITE 3, PRO 25, CHAIN 100, ENTERPRISE 500).
 */
export interface GrowthPlanLimits { maxActiveLinks: number; trendDays: number }
export const GROWTH_PLAN_LIMITS: Record<string, GrowthPlanLimits> = {
  LITE: { maxActiveLinks: 3, trendDays: 30 },
  PRO: { maxActiveLinks: 25, trendDays: 90 },
  CHAIN: { maxActiveLinks: 100, trendDays: 180 },
  ENTERPRISE: { maxActiveLinks: 500, trendDays: 365 },
};
export const growthLimitsFor = (edition: string): GrowthPlanLimits => GROWTH_PLAN_LIMITS[edition] ?? GROWTH_PLAN_LIMITS.LITE!;
