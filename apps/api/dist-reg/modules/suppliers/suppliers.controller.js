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
exports.SuppliersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const suppliers_service_1 = require("./suppliers.service");
const recall_service_1 = require("./recall/recall.service");
const requires_entitlement_guard_1 = require("../../kernel-adapter/requires-entitlement.guard");
const prisma_service_1 = require("../../prisma/prisma.service");
const branch_scope_1 = require("../../common/branch-scope");
class SupplierDto {
    name;
    phone;
    email;
    paymentTerms;
    creditLimit;
    leadTimeDays;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], SupplierDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "creditLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SupplierDto.prototype, "leadTimeDays", void 0);
class SupplierPatchDto {
    name;
    phone;
    email;
    paymentTerms;
    creditLimit;
    leadTimeDays;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPatchDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPatchDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SupplierPatchDto.prototype, "paymentTerms", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SupplierPatchDto.prototype, "creditLimit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], SupplierPatchDto.prototype, "leadTimeDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], SupplierPatchDto.prototype, "active", void 0);
class PayDto {
    amount;
    note;
    idempotencyKey;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PayDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayDto.prototype, "idempotencyKey", void 0);
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
class PoDto {
    branchId;
    supplierId;
    notes;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoDto.prototype, "supplierId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PoDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PoLineDto),
    __metadata("design:type", Array)
], PoDto.prototype, "lines", void 0);
class SendDto {
    via;
}
__decorate([
    (0, class_validator_1.IsIn)(["WHATSAPP", "EMAIL"]),
    __metadata("design:type", String)
], SendDto.prototype, "via", void 0);
class SuggestionItemDto {
    drugId;
    qty;
    supplierId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], SuggestionItemDto.prototype, "qty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SuggestionItemDto.prototype, "supplierId", void 0);
class FromSuggestionsDto {
    branchId;
    items;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FromSuggestionsDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => SuggestionItemDto),
    __metadata("design:type", Array)
], FromSuggestionsDto.prototype, "items", void 0);
class RecallDto {
    drugId;
    lotNumbers;
    reason;
    source;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecallDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RecallDto.prototype, "lotNumbers", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RecallDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecallDto.prototype, "source", void 0);
let SuppliersController = class SuppliersController {
    svc;
    recalls;
    prisma;
    constructor(svc, recalls, prisma) {
        this.svc = svc;
        this.recalls = recalls;
        this.prisma = prisma;
    }
    list(u) { return this.svc.list(u.orgId); }
    create(u, d) { return this.svc.create(u.orgId, d); }
    get(u, id) { return this.svc.get(u.orgId, id); }
    update(u, id, d) { return this.svc.update(u.orgId, id, d); }
    ledger(u, id) { return this.svc.ledger(u.orgId, id); }
    pay(u, id, d) { return this.svc.pay(u, id, d.amount, d.note, d.idempotencyKey); }
    async pos(u, branchId) { return this.svc.listPos(u.orgId, u.branchId ?? branchId); }
    async createPo(u, d) { return this.svc.createPo(u, { ...d, branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) }); }
    getPo(u, id) { return this.svc.getPo(u.orgId, id); }
    send(u, id, d) { return this.svc.sendPo(u, id, d.via); }
    cancel(u, id) { return this.svc.cancelPo(u, id); }
    async suggestions(u, branchId) { return this.svc.suggestions(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    async fromSuggestions(u, d) { return this.svc.createPosFromSuggestions(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d.items); }
    recallList(u) { return this.recalls.list(u.orgId); }
    recallEnter(u, d) { return this.recalls.enter(u, d); }
    recallLift(u, id) { return this.recalls.lift(u, id); }
};
exports.SuppliersController = SuppliersController;
__decorate([
    (0, common_1.Get)("suppliers"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)("suppliers"),
    (0, decorators_1.Perm)("supplier.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SupplierDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("suppliers/:id"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)("suppliers/:id"),
    (0, decorators_1.Perm)("supplier.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SupplierPatchDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "update", null);
__decorate([
    (0, common_1.Get)("suppliers/:id/ledger"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "ledger", null);
__decorate([
    (0, common_1.Post)("suppliers/:id/payments"),
    (0, decorators_1.Perm)("supplier.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PayDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "pay", null);
__decorate([
    (0, common_1.Get)("purchase-orders"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "pos", null);
__decorate([
    (0, common_1.Post)("purchase-orders"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PoDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "createPo", null);
__decorate([
    (0, common_1.Get)("purchase-orders/:id"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "getPo", null);
__decorate([
    (0, common_1.Post)("purchase-orders/:id/send"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SendDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "send", null);
__decorate([
    (0, common_1.Post)("purchase-orders/:id/cancel"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "cancel", null);
__decorate([
    (0, common_1.Get)("reorder/suggestions"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("supplier.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "suggestions", null);
__decorate([
    (0, common_1.Post)("reorder/create-pos"),
    (0, common_1.UseGuards)(requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("purchasing"),
    (0, decorators_1.Perm)("po.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FromSuggestionsDto]),
    __metadata("design:returntype", Promise)
], SuppliersController.prototype, "fromSuggestions", null);
__decorate([
    (0, common_1.Get)("recalls"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "recallList", null);
__decorate([
    (0, common_1.Post)("recalls"),
    (0, decorators_1.Perm)("recall.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RecallDto]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "recallEnter", null);
__decorate([
    (0, common_1.Post)("recalls/:id/lift"),
    (0, decorators_1.Perm)("recall.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SuppliersController.prototype, "recallLift", null);
exports.SuppliersController = SuppliersController = __decorate([
    (0, swagger_1.ApiTags)("suppliers"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(suppliers_service_1.SuppliersService)),
    __param(1, (0, common_1.Inject)(recall_service_1.RecallService)),
    __param(2, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [suppliers_service_1.SuppliersService, recall_service_1.RecallService, prisma_service_1.PrismaService])
], SuppliersController);
//# sourceMappingURL=suppliers.controller.js.map