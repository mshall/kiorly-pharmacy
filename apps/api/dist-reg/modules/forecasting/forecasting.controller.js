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
exports.ForecastingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../../auth/decorators");
const requires_flag_guard_1 = require("../../feature-flags/requires-flag.guard");
const requires_entitlement_guard_1 = require("../../kernel-adapter/requires-entitlement.guard");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const forecasting_service_1 = require("./forecasting.service");
let ForecastingController = class ForecastingController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    async demand(u, q) {
        return this.svc.forecast(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, q.branchId), Number(q.horizonDays ?? 14));
    }
    async expiryRisk(u, branchId) {
        return this.svc.expiryRisk(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId));
    }
};
exports.ForecastingController = ForecastingController;
__decorate([
    (0, common_1.Get)("demand"),
    (0, decorators_1.Perm)("forecast.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ForecastingController.prototype, "demand", null);
__decorate([
    (0, common_1.Get)("expiry-risk"),
    (0, decorators_1.Perm)("forecast.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ForecastingController.prototype, "expiryRisk", null);
exports.ForecastingController = ForecastingController = __decorate([
    (0, swagger_1.ApiTags)("forecasting"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard, requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.forecasting"),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("forecasting"),
    (0, common_1.Controller)("forecasting"),
    __param(0, (0, common_1.Inject)(forecasting_service_1.ForecastingService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [forecasting_service_1.ForecastingService, prisma_service_1.PrismaService])
], ForecastingController);
//# sourceMappingURL=forecasting.controller.js.map