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
exports.InventorySuiteController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const approval_service_1 = require("../../auth/approval.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const branch_scope_1 = require("../../common/branch-scope");
const pagination_1 = require("../../common/pagination");
const errors_1 = require("../../common/errors");
const locations_service_1 = require("./locations.service");
const uom_service_1 = require("./uom.service");
const inventory_analytics_service_1 = require("./inventory-analytics.service");
const inventory_service_1 = require("./inventory.service");
const inventory_dto_1 = require("./inventory.dto");
class LocationDto {
    branchId;
    code;
    label;
    kind;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], LocationDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(locations_service_1.LOCATION_KINDS),
    __metadata("design:type", String)
], LocationDto.prototype, "kind", void 0);
class LocationPatchDto {
    label;
    kind;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LocationPatchDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(locations_service_1.LOCATION_KINDS),
    __metadata("design:type", String)
], LocationPatchDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LocationPatchDto.prototype, "active", void 0);
class AssignDto {
    lotIds;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ArrayMaxSize)(200),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], AssignDto.prototype, "lotIds", void 0);
class UomDto {
    name;
    factor;
    barcode;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], UomDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2),
    (0, class_validator_1.Max)(10000),
    __metadata("design:type", Number)
], UomDto.prototype, "factor", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UomDto.prototype, "barcode", void 0);
class AutoDto {
    branchId;
    days;
    safetyDays;
    reviewDays;
    overwrite;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AutoDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(14),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], AutoDto.prototype, "days", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], AutoDto.prototype, "safetyDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(60),
    __metadata("design:type", Number)
], AutoDto.prototype, "reviewDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoDto.prototype, "overwrite", void 0);
class DamageDto {
    quantity;
    reason;
    reasonCode;
    witness;
    approval;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DamageDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], DamageDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(inventory_dto_1.ADJUST_REASONS),
    __metadata("design:type", String)
], DamageDto.prototype, "reasonCode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], DamageDto.prototype, "witness", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], DamageDto.prototype, "approval", void 0);
let InventorySuiteController = class InventorySuiteController {
    locations;
    uoms;
    analytics;
    inv;
    approvals;
    prisma;
    constructor(locations, uoms, analytics, inv, approvals, prisma) {
        this.locations = locations;
        this.uoms = uoms;
        this.analytics = analytics;
        this.inv = inv;
        this.approvals = approvals;
        this.prisma = prisma;
    }
    async locList(u, branchId) { return this.locations.list(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    async locCreate(u, d) { return this.locations.create(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d); }
    locUpdate(u, id, d) { return this.locations.update(u, id, d); }
    locContents(u, id) { return this.locations.contents(u.orgId, id); }
    locAssign(u, id, d) { return this.locations.assign(u, id, d.lotIds); }
    uomList(u, drugId) { return this.uoms.list(u.orgId, drugId); }
    uomCreate(u, drugId, d) { return this.uoms.create(u, drugId, d); }
    uomRemove(u, id) { return this.uoms.remove(u, id); }
    async movers(u, q) { return this.analytics.movers(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, q.branchId), Math.min(Math.max(Number(q.days ?? 90) || 90, 7), 365)); }
    async autoReorder(u, d) { return this.analytics.autoReorder(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), { days: d.days ?? 90, safetyDays: d.safetyDays ?? 3, reviewDays: d.reviewDays ?? 14, overwrite: !!d.overwrite }); }
    async cold(u, branchId) { return this.analytics.coldChain(u.orgId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    movements(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q, 200);
        return this.analytics.movements(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), type: q.type, reasonCode: q.reasonCode, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, q: q.q, skip, take });
    }
    lotLabels(u, ids, lang) { return this.analytics.lotLabelsHtml(u.orgId, (ids ?? "").split(",").filter(Boolean).slice(0, 100), lang === "en" ? "en" : "ar"); }
    async damage(u, id, d) {
        const lot = await this.prisma.stockLot.findFirst({ where: { id, orgId: u.orgId } });
        if (!lot)
            throw (0, errors_1.notFound)("Lot", id);
        const approver = lot.qtyOnHand - d.quantity < 0 ? await this.approvals.approver(u, "inventory.negative_stock", d.approval) : undefined;
        return this.inv.adjust(u, id, -d.quantity, d.reason, approver, d.witness ? await this.approvals.witness(u, d.witness) : undefined, d.reasonCode ?? "DAMAGE");
    }
};
exports.InventorySuiteController = InventorySuiteController;
__decorate([
    (0, common_1.Get)("locations"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "locList", null);
__decorate([
    (0, common_1.Post)("locations"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, LocationDto]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "locCreate", null);
__decorate([
    (0, common_1.Patch)("locations/:id"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, LocationPatchDto]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "locUpdate", null);
__decorate([
    (0, common_1.Get)("locations/:id/contents"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "locContents", null);
__decorate([
    (0, common_1.Post)("locations/:id/assign"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AssignDto]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "locAssign", null);
__decorate([
    (0, common_1.Get)("uoms/:drugId"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("drugId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "uomList", null);
__decorate([
    (0, common_1.Post)("uoms/:drugId"),
    (0, decorators_1.Perm)("catalogue.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("drugId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, UomDto]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "uomCreate", null);
__decorate([
    (0, common_1.Delete)("uoms/item/:id"),
    (0, decorators_1.Perm)("catalogue.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "uomRemove", null);
__decorate([
    (0, common_1.Get)("analytics/movers"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "movers", null);
__decorate([
    (0, common_1.Post)("analytics/auto-reorder"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AutoDto]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "autoReorder", null);
__decorate([
    (0, common_1.Get)("cold-chain/lots"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "cold", null);
__decorate([
    (0, common_1.Get)("movements"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "movements", null);
__decorate([
    (0, common_1.Get)("lots/labels.html"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("ids")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], InventorySuiteController.prototype, "lotLabels", null);
__decorate([
    (0, common_1.Post)("lots/:id/damage"),
    (0, decorators_1.Perm)("inventory.adjust"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, DamageDto]),
    __metadata("design:returntype", Promise)
], InventorySuiteController.prototype, "damage", null);
exports.InventorySuiteController = InventorySuiteController = __decorate([
    (0, swagger_1.ApiTags)("inventory"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("inventory"),
    __param(0, (0, common_1.Inject)(locations_service_1.LocationsService)),
    __param(1, (0, common_1.Inject)(uom_service_1.UomService)),
    __param(2, (0, common_1.Inject)(inventory_analytics_service_1.InventoryAnalyticsService)),
    __param(3, (0, common_1.Inject)(inventory_service_1.InventoryService)),
    __param(4, (0, common_1.Inject)(approval_service_1.ApprovalService)),
    __param(5, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [locations_service_1.LocationsService, uom_service_1.UomService, inventory_analytics_service_1.InventoryAnalyticsService,
        inventory_service_1.InventoryService, approval_service_1.ApprovalService, prisma_service_1.PrismaService])
], InventorySuiteController);
//# sourceMappingURL=inventory-suite.controller.js.map