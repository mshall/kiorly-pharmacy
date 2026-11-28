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
exports.GrowthMobileService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const handoff_1 = require("../../auth/handoff");
const commission_rate_service_1 = require("./commission-rate.service");
const commission_statement_service_1 = require("./commission-statement.service");
const commission_statement_1 = require("./commission-statement");
const growth_insights_service_1 = require("./growth-insights.service");
const link_urls_1 = require("./link-urls");
const provider_links_service_1 = require("./provider-links.service");
let GrowthMobileService = class GrowthMobileService {
    prisma;
    links;
    insights;
    rates;
    statements;
    constructor(prisma, links, insights, rates, statements) {
        this.prisma = prisma;
        this.links = links;
        this.insights = insights;
        this.rates = rates;
        this.statements = statements;
    }
    async overview(u) {
        this.links.assert(u, "view");
        await this.links.assertConnected(u.orgId);
        const [access, list, performance, recs, tenant] = await Promise.all([
            this.links.access(u), this.links.list(u), this.insights.performance(u, { days: 30 }), this.insights.recommendations(u),
            this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId }, select: { name: true } }),
        ]);
        return {
            product: "PHARMACY",
            level: access.level, can: { ...access.can, revoke: false, commission: commission_rate_service_1.RATE_ROLES.has(u.role) }, plan: access.plan, branchScoped: access.branchScoped,
            profileUrl: `${(0, link_urls_1.kiorexWebBase)()}${link_urls_1.PRODUCT_LANDING_PATH.PHARMACY}`,
            links: list.items,
            performance: { days: performance.days, links: performance.links, providerOriginated: performance.providerOriginated, marketplaceOriginated: performance.marketplaceOriginated, acquisitionPending: performance.acquisitionPending },
            recommendations: recs.items.slice(0, 5),
            statement: performance.statement,
            organisation: tenant.name,
            webGrowthPath: "/growth",
            webGrowthUrl: ((b) => (b ? `${b}/growth` : null))((0, handoff_1.webBaseUrl)()),
        };
    }
    commissionRate(u) { return this.rates.rate(u); }
    async commissionStatement(u, period) {
        try {
            return { connected: true, ...(await this.statements.statement(u, period)) };
        }
        catch (e) {
            if ((0, commission_statement_1.isStatementNotConnected)(e))
                return { connected: false, code: "STATEMENT_NOT_CONNECTED", period: (0, commission_statement_1.periodRange)(period)?.key ?? null };
            throw e;
        }
    }
    async linksOnly(u) { const o = await this.links.list(u); const a = await this.links.access(u); return { items: o.items, can: { ...a.can, revoke: false }, plan: a.plan }; }
    qr(u, linkId) { return this.links.qrSvgFor(u, linkId); }
    qrJson(u, linkId) { return this.links.qrPayloadFor(u, linkId); }
    create(u, b) { return this.links.create(u, b); }
    update(u, id, b) { return this.links.update(u, id, { status: b.status, label: b.label }, { allowRevoke: false }); }
};
exports.GrowthMobileService = GrowthMobileService;
exports.GrowthMobileService = GrowthMobileService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(provider_links_service_1.ProviderLinksService)),
    __param(2, (0, common_1.Inject)(growth_insights_service_1.GrowthInsightsService)),
    __param(3, (0, common_1.Inject)(commission_rate_service_1.CommissionRateService)),
    __param(4, (0, common_1.Inject)(commission_statement_service_1.CommissionStatementService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        provider_links_service_1.ProviderLinksService,
        growth_insights_service_1.GrowthInsightsService,
        commission_rate_service_1.CommissionRateService,
        commission_statement_service_1.CommissionStatementService])
], GrowthMobileService);
//# sourceMappingURL=growth-mobile.service.js.map