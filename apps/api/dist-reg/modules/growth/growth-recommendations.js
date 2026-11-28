"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.THRESHOLDS = exports.RECOMMENDATION_IDS = void 0;
exports.buildRecommendations = buildRecommendations;
exports.RECOMMENDATION_IDS = ["CREATE_FIRST_LINK", "PRINT_COUNTER_CARD", "BRANCH_NOT_LISTED", "LINKS_UNUSED", "HIGH_REJECTION"];
exports.THRESHOLDS = { rejectRate: 0.2, minOrdersForRates: 8, unusedAfterDays: 14 };
function buildRecommendations(i) {
    const out = [];
    if (i.branchesNotListed > 0)
        out.push({ id: "BRANCH_NOT_LISTED", severity: "high", params: { count: i.branchesNotListed }, action: "connect" });
    if (i.kiorexOrders30d >= exports.THRESHOLDS.minOrdersForRates) {
        const r = i.rejectedOrCancelled30d / i.kiorexOrders30d;
        if (r >= exports.THRESHOLDS.rejectRate)
            out.push({ id: "HIGH_REJECTION", severity: "medium", params: { percent: Math.round(r * 100) }, action: "orders" });
    }
    if (i.activeLinks === 0)
        out.push({ id: "CREATE_FIRST_LINK", severity: "medium", params: {}, action: "links" });
    else {
        if (!i.hasDeskLink)
            out.push({ id: "PRINT_COUNTER_CARD", severity: "low", params: {}, action: "links" });
        if (i.unusedLinks > 0)
            out.push({ id: "LINKS_UNUSED", severity: "low", params: { count: i.unusedLinks }, action: "links" });
    }
    const rank = { high: 0, medium: 1, low: 2 };
    return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
//# sourceMappingURL=growth-recommendations.js.map