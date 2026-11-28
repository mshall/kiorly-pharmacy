export interface GrowthPlanLimits {
    maxActiveLinks: number;
    trendDays: number;
}
export declare const GROWTH_PLAN_LIMITS: Record<string, GrowthPlanLimits>;
export declare const growthLimitsFor: (edition: string) => GrowthPlanLimits;
