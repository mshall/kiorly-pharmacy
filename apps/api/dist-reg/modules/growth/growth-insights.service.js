"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrowthInsightsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const growth_plan_limits_1 = require("./growth-plan-limits");
const commission_rate_service_1 = require("./commission-rate.service");
const growth_metrics_1 = require("./growth-metrics");
const growth_recommendations_1 = require("./growth-recommendations");
const link_counters_1 = require("./link-counters");
const provider_links_service_1 = require("./provider-links.service");
let GrowthInsightsService = class GrowthInsightsService {
    prisma;
    links;
    rates;
    constructor(prisma, links, rates) {
        this.prisma = prisma;
        this.links = links;
        this.rates = rates;
    }
    async performance(user, q = {}) {
        const orgId = this.links.assert(user, "view");
        await this.links.assertConnected(orgId);
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { edition: true } });
        const days = Math.min((0, growth_plan_limits_1.growthLimitsFor)(t.edition).trendDays, Math.max(7, Math.round(q.days ?? 30)));
        const since = (0, link_counters_1.utcDay)(new Date(Date.now() - (days - 1) * 86_400_000));
        const orderWhere = { orgId, createdAt: { gte: since }, ...(user.branchId ? { branchId: user.branchId } : {}) };
        const linkWhere = { orgId, date: { gte: since }, ...(user.branchId ? { link: { OR: [{ ownerScope: "ORG" }, { branchRef: user.branchId }] } } : {}) };
        const [byStatus, daily] = await Promise.all([
            this.prisma.kiorexOrder.groupBy({ by: ["status"], where: orderWhere, _count: { _all: true } }),
            this.prisma.providerReferralLinkDaily.aggregate({ where: linkWhere, _sum: { visits: true, orders: true, completed: true } }),
        ]);
        const n = (...s) => byStatus.filter((r) => s.includes(r.status)).reduce((a, r) => a + r._count._all, 0);
        const perf = (0, growth_metrics_1.buildPerformance)({ total: byStatus.reduce((a, r) => a + r._count._all, 0), completed: n("DISPENSED"), rejectedOrCancelled: n("REJECTED", "CANCELLED", "EXPIRED") }, { visits: daily._sum.visits ?? 0, orders: daily._sum.orders ?? 0, completed: daily._sum.completed ?? 0 });
        const rate = await this.rates.view(orgId);
        return { days, ...perf, statement: { configured: rate.state === "SET" } };
    }
    async recommendations(user) {
        const orgId = this.links.assert(user, "view");
        await this.links.assertConnected(orgId);
        const since30 = new Date(Date.now() - 30 * 86_400_000);
        const stale = new Date(Date.now() - growth_recommendations_1.THRESHOLDS.unusedAfterDays * 86_400_000);
        const branchFilter = user.branchId ? { id: user.branchId } : {};
        const [active, notListed, visits, byStatus] = await Promise.all([
            this.prisma.providerReferralLink.findMany({ where: { ...{ orgId, status: "ACTIVE" }, ...(user.branchId ? { OR: [{ ownerScope: "ORG" }, { branchRef: user.branchId }] } : {}) }, select: { id: true, ownerScope: true, createdAt: true } }),
            this.prisma.branch.count({ where: { orgId, active: true, ...branchFilter, NOT: { id: { in: (await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true }, select: { branchId: true } })).map((s) => s.branchId) } } } }),
            this.prisma.providerReferralLinkDaily.groupBy({ by: ["linkId"], where: { orgId, date: { gte: (0, link_counters_1.utcDay)(since30) } }, _sum: { visits: true } }),
            this.prisma.kiorexOrder.groupBy({ by: ["status"], where: { orgId, createdAt: { gte: since30 }, ...(user.branchId ? { branchId: user.branchId } : {}) }, _count: { _all: true } }),
        ]);
        const visited = new Set(visits.filter((v) => (v._sum.visits ?? 0) > 0).map((v) => v.linkId));
        const total = byStatus.reduce((a, r) => a + r._count._all, 0);
        const bad = byStatus.filter((r) => ["REJECTED", "CANCELLED", "EXPIRED"].includes(r.status)).reduce((a, r) => a + r._count._all, 0);
        const items = (0, growth_recommendations_1.buildRecommendations)({
            activeLinks: active.length,
            hasDeskLink: active.some((l) => l.ownerScope === "DESK"),
            branchesNotListed: notListed,
            unusedLinks: active.filter((l) => l.createdAt < stale && !visited.has(l.id)).length,
            kiorexOrders30d: total,
            rejectedOrCancelled30d: bad,
        });
        return { items, guardrail: "Recommendations never suggest extra purchases, price pressure on customers or review tactics, and never use what a customer ordered." };
    }
};
exports.GrowthInsightsService = GrowthInsightsService;
exports.GrowthInsightsService = GrowthInsightsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(provider_links_service_1.ProviderLinksService)),
    __param(2, (0, common_1.Inject)(commission_rate_service_1.CommissionRateService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, provider_links_service_1.ProviderLinksService, commission_rate_service_1.CommissionRateService])
], GrowthInsightsService);
//# sourceMappingURL=growth-insights.service.js.map