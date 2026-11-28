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
exports.MobileEntitlementService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const feature_flags_service_1 = require("../../feature-flags/feature-flags.service");
const mobile_plan_1 = require("./mobile-plan");
let MobileEntitlementService = class MobileEntitlementService {
    prisma;
    flags;
    constructor(prisma, flags) {
        this.prisma = prisma;
        this.flags = flags;
    }
    async tenant(orgId) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }
    async evaluate(orgId) {
        const t = await this.tenant(orgId);
        const entitled = (0, mobile_plan_1.planIncludesMobile)(t.edition, t.subscriptionStatus);
        const d = this.flags.evaluate(mobile_plan_1.MOBILE_FLAG, { orgId, market: t.marketCode, entitled });
        const base = { key: mobile_plan_1.MOBILE_FLAG, requiredPlan: "PRO", plan: (0, mobile_plan_1.normalisePlan)(t.edition), rawPlan: t.edition };
        if (d.enabled)
            return { ...base, enabled: true, reason: null, scope: "org" };
        if (!entitled || d.scope === "entitlement")
            return { ...base, enabled: false, reason: "PLAN_BELOW_PRO", scope: "org" };
        return { ...base, enabled: false, reason: "FLAG_OFF", scope: d.scope ?? "global" };
    }
    async assertEnabled(orgId) {
        const e = await this.evaluate(orgId);
        if (!e.enabled)
            throw new common_1.ForbiddenException({ statusCode: 403, code: "FEATURE_DISABLED", key: "mobile_staff_app", scope: e.reason === "FLAG_OFF" ? e.scope : "org", message: "Kiorly is not included in your plan." });
    }
};
exports.MobileEntitlementService = MobileEntitlementService;
exports.MobileEntitlementService = MobileEntitlementService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, feature_flags_service_1.FeatureFlagsService])
], MobileEntitlementService);
//# sourceMappingURL=mobile-entitlement.service.js.map