"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.growthLimitsFor = exports.GROWTH_PLAN_LIMITS = void 0;
exports.GROWTH_PLAN_LIMITS = {
    LITE: { maxActiveLinks: 3, trendDays: 30 },
    PRO: { maxActiveLinks: 25, trendDays: 90 },
    CHAIN: { maxActiveLinks: 100, trendDays: 180 },
    ENTERPRISE: { maxActiveLinks: 500, trendDays: 365 },
};
const growthLimitsFor = (edition) => exports.GROWTH_PLAN_LIMITS[edition] ?? exports.GROWTH_PLAN_LIMITS.LITE;
exports.growthLimitsFor = growthLimitsFor;
//# sourceMappingURL=growth-plan-limits.js.map