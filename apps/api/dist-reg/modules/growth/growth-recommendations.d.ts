export declare const RECOMMENDATION_IDS: readonly ["CREATE_FIRST_LINK", "PRINT_COUNTER_CARD", "BRANCH_NOT_LISTED", "LINKS_UNUSED", "HIGH_REJECTION"];
export type RecommendationId = (typeof RECOMMENDATION_IDS)[number];
export interface RecommendationInput {
    activeLinks: number;
    hasDeskLink: boolean;
    branchesNotListed: number;
    unusedLinks: number;
    kiorexOrders30d: number;
    rejectedOrCancelled30d: number;
}
export interface Recommendation {
    id: RecommendationId;
    severity: "high" | "medium" | "low";
    params: Record<string, number>;
    action: "links" | "connect" | "orders";
}
export declare const THRESHOLDS: {
    readonly rejectRate: 0.2;
    readonly minOrdersForRates: 8;
    readonly unusedAfterDays: 14;
};
export declare function buildRecommendations(i: RecommendationInput): Recommendation[];
