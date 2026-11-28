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
exports.PurchasingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const requires_entitlement_guard_1 = require("../../kernel-adapter/requires-entitlement.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const branch_scope_1 = require("../../common/branch-scope");
const purchasing_service_1 = require("./purchasing.service");
const rfq_service_1 = require("./rfq.service");
class RfqLineDto {
    drugId;
    qty;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RfqLineDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RfqLineDto.prototype, "qty", void 0);
class RfqDto {
    branchId;
    notes;
    dueAt;
    lines;
    supplierIds;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RfqDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RfqDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RfqDto.prototype, "dueAt", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RfqLineDto),
    __metadata("design:type", Array)
], RfqDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RfqDto.prototype, "supplierIds", void 0);
class RfqFromSuggDto {
    branchId;
    supplierIds;
    dueAt;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RfqFromSuggDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RfqFromSuggDto.prototype, "supplierIds", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RfqFromSuggDto.prototype, "dueAt", void 0);
class QuoteLineDto {
    rfqLineId;
    unitPrice;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteLineDto.prototype, "rfqLineId", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], QuoteLineDto.prototype, "unitPrice", void 0);
class QuoteDto {
    lines;
    leadTimeDays;
    validUntil;
    notes;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => QuoteLineDto),
    __metadata("design:type", Array)
], QuoteDto.prototype, "lines", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], QuoteDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], QuoteDto.prototype, "validUntil", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], QuoteDto.prototype, "notes", void 0);
class AwardDto {
    mode;
    supplierId;
}
__decorate([
    (0, class_validator_1.IsIn)(["CHEAPEST_PER_LINE", "SUPPLIER"]),
    __metadata("design:type", String)
], AwardDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AwardDto.prototype, "supplierId", void 0);
class PoLineDto {
    drugId;
    qtyOrdered;
    unitCost;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoLineDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PoLineDto.prototype, "qtyOrdered", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PoLineDto.prototype, "unitCost", void 0);
class PoPatchDto {
    notes;
    expectedAt;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoPatchDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], PoPatchDto.prototype, "expectedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PoLineDto),
    __metadata("design:type", Array)
], PoPatchDto.prototype, "lines", void 0);
class CloseDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CloseDto.prototype, "reason", void 0);
let PurchasingController = class PurchasingController {
    svc;
    rfq;
    prisma;
    constructor(svc, rfq, prisma) {
        this.svc = svc;
        this.rfq = rfq;
        this.prisma = prisma;
    }
    aging(u, asOf) { return this.svc.aging(u.orgId, asOf ? new Date(asOf) : undefined); }
    statement(u, id, q) { return this.svc.statement(u.orgId, id, { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined }); }
    costVariance(u, q) { return this.svc.costVariance(u.orgId, { from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, minPct: Number(q.minPct ?? 5) || 0, ...(0, branch_scope_1.branchFilter)(u, q.branchId) }); }
    returns(u, q) { return this.svc.supplierReturns(u.orgId, { supplierId: q.supplierId, ...(0, branch_scope_1.branchFilter)(u, q.branchId) }); }
    poPatch(u, id, d) { return this.svc.updatePo(u, id, d); }
    poClose(u, id, d) { return this.svc.closePo(u, id, d.reason); }
    poPrint(u, id, lang) { return this.svc.poHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }
    rfqList(u, q) { return this.rfq.list(u.orgId, { status: q.status, ...(0, branch_scope_1.branchFilter)(u, q.branchId) }); }
    async rfqCreate(u, d) { return this.rfq.create(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d); }
    async rfqFromSug(u, d) { return this.rfq.fromSuggestions(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d.supplierIds, d.dueAt); }
    rfqGet(u, id) { return this.rfq.get(u.orgId, id); }
    rfqSend(u, id) { return this.rfq.send(u, id); }
    rfqQuote(u, id, sid, d) { return this.rfq.recordQuote(u, id, sid, d); }
    rfqDecline(u, id, sid) { return this.rfq.decline(u, id, sid); }
    rfqAward(u, id, d) { return this.rfq.award(u, id, d); }
    rfqCancel(u, id) { return this.rfq.cancel(u, id); }
};
exports.PurchasingController = PurchasingController;
__decorate([
    (0, common_1.Get)("aging"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("asOf")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "aging", null);
__decorate([
    (0, common_1.Get)("suppliers/:id/statement"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "statement", null);
__decorate([
    (0, common_1.Get)("cost-variance"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "costVariance", null);
__decorate([
    (0, common_1.Get)("supplier-returns"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "returns", null);
__decorate([
    (0, common_1.Patch)("purchase-orders/:id"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PoPatchDto]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "poPatch", null);
__decorate([
    (0, common_1.Post)("purchase-orders/:id/close"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CloseDto]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "poClose", null);
__decorate([
    (0, common_1.Get)("purchase-orders/:id/print.html"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "poPrint", null);
__decorate([
    (0, common_1.Get)("rfqs"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqList", null);
__decorate([
    (0, common_1.Post)("rfqs"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RfqDto]),
    __metadata("design:returntype", Promise)
], PurchasingController.prototype, "rfqCreate", null);
__decorate([
    (0, common_1.Post)("rfqs/from-suggestions"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RfqFromSuggDto]),
    __metadata("design:returntype", Promise)
], PurchasingController.prototype, "rfqFromSug", null);
__decorate([
    (0, common_1.Get)("rfqs/:id"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqGet", null);
__decorate([
    (0, common_1.Post)("rfqs/:id/send"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqSend", null);
__decorate([
    (0, common_1.Post)("rfqs/:id/quotes/:supplierId"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("supplierId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, QuoteDto]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqQuote", null);
__decorate([
    (0, common_1.Post)("rfqs/:id/quotes/:supplierId/decline"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("supplierId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqDecline", null);
__decorate([
    (0, common_1.Post)("rfqs/:id/award"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AwardDto]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqAward", null);
__decorate([
    (0, common_1.Post)("rfqs/:id/cancel"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PurchasingController.prototype, "rfqCancel", null);
exports.PurchasingController = PurchasingController = __decorate([
    (0, swagger_1.ApiTags)("purchasing"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("purchasing"),
    __param(0, (0, common_1.Inject)(purchasing_service_1.PurchasingService)),
    __param(1, (0, common_1.Inject)(rfq_service_1.RfqService)),
    __param(2, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [purchasing_service_1.PurchasingService, rfq_service_1.RfqService, prisma_service_1.PrismaService])
], PurchasingController);
//# sourceMappingURL=purchasing.controller.js.map