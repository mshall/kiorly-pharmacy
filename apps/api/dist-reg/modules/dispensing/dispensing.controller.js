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
exports.DispensingController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const dispensing_service_1 = require("./dispensing.service");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_1 = require("../../common/pagination");
class SubstitutionDto {
    fromDrugId;
    consent;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubstitutionDto.prototype, "fromDrugId", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SubstitutionDto.prototype, "consent", void 0);
class ItemDto {
    prescriptionLineId;
    drugId;
    quantity;
    substitution;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemDto.prototype, "prescriptionLineId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ItemDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], ItemDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => SubstitutionDto),
    __metadata("design:type", SubstitutionDto)
], ItemDto.prototype, "substitution", void 0);
class CreateDto {
    branchId;
    prescriptionId;
    kiorexOrderId;
    patientId;
    partialReason;
    items;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDto.prototype, "prescriptionId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDto.prototype, "kiorexOrderId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CreateDto.prototype, "partialReason", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ItemDto),
    __metadata("design:type", Array)
], CreateDto.prototype, "items", void 0);
class OverrideDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], OverrideDto.prototype, "reason", void 0);
class ControlledIdDto {
    nationalId;
    patientName;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ControlledIdDto.prototype, "nationalId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], ControlledIdDto.prototype, "patientName", void 0);
class SignoffDto {
    counsellingNotes;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignoffDto.prototype, "counsellingNotes", void 0);
class CounsellingDto {
    notes;
    topics;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CounsellingDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CounsellingDto.prototype, "topics", void 0);
class CancelDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], CancelDto.prototype, "reason", void 0);
class PayDto {
    method;
    amount;
    walletRef;
}
__decorate([
    (0, class_validator_1.IsIn)(["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT"]),
    __metadata("design:type", String)
], PayDto.prototype, "method", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], PayDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PayDto.prototype, "walletRef", void 0);
class CompleteDto {
    idempotencyKey;
    payments;
    customerAccountId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], CompleteDto.prototype, "idempotencyKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PayDto),
    __metadata("design:type", Array)
], CompleteDto.prototype, "payments", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CompleteDto.prototype, "customerAccountId", void 0);
class RegisterQuery {
    branchId;
    from;
    to;
    page;
    pageSize;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterQuery.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RegisterQuery.prototype, "from", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RegisterQuery.prototype, "to", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterQuery.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], RegisterQuery.prototype, "pageSize", void 0);
let DispensingController = class DispensingController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    async create(u, d) { return this.svc.create(u, { ...d, branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) }); }
    list(u, q) { const { skip, take } = (0, pagination_1.pageArgs)(q); return this.svc.list(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), status: q.status, skip, take }); }
    get(u, id) { return this.svc.get(u.orgId, id); }
    override(u, id, checkId, d) { return this.svc.override(u, id, checkId, d.reason); }
    controlledId(u, id, d) { return this.svc.captureControlledId(u, id, d); }
    signoff(u, id, d) { return this.svc.signOff(u, id, d.counsellingNotes); }
    counselling(u, id, d) { return this.svc.setCounselling(u, id, d); }
    labels(u, id, lang) { return this.svc.labelsHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }
    repick(u, id) { return this.svc.repick(u, id); }
    cancel(u, id, d) { return this.svc.cancel(u, id, d.reason); }
    complete(u, id, d) { return this.svc.complete(u, id, d); }
    register(u, q) { const { skip, take } = (0, pagination_1.pageArgs)(q); return this.svc.controlledRegister(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take }); }
};
exports.DispensingController = DispensingController;
__decorate([
    (0, common_1.Post)("dispensings"),
    (0, decorators_1.Perm)("dispense.create"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateDto]),
    __metadata("design:returntype", Promise)
], DispensingController.prototype, "create", null);
__decorate([
    (0, common_1.Get)("dispensings"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("dispensings/:id"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/override/:checkId"),
    (0, decorators_1.Perm)("dispense.signoff"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("checkId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, OverrideDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "override", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/controlled-id"),
    (0, decorators_1.Perm)("dispense.create"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ControlledIdDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "controlledId", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/signoff"),
    (0, decorators_1.Perm)("dispense.signoff"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SignoffDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "signoff", null);
__decorate([
    (0, common_1.Put)("dispensings/:id/counselling"),
    (0, decorators_1.Perm)("dispense.signoff"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CounsellingDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "counselling", null);
__decorate([
    (0, common_1.Get)("dispensings/:id/labels.html"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "labels", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/repick"),
    (0, decorators_1.Perm)("dispense.create"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "repick", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/cancel"),
    (0, decorators_1.Perm)("dispense.create"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CancelDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)("dispensings/:id/complete"),
    (0, decorators_1.Perm)("dispense.complete"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, CompleteDto]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "complete", null);
__decorate([
    (0, common_1.Get)("controlled-register"),
    (0, decorators_1.Perm)("controlled.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RegisterQuery]),
    __metadata("design:returntype", void 0)
], DispensingController.prototype, "register", null);
exports.DispensingController = DispensingController = __decorate([
    (0, swagger_1.ApiTags)("dispensing"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(dispensing_service_1.DispensingService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [dispensing_service_1.DispensingService, prisma_service_1.PrismaService])
], DispensingController);
//# sourceMappingURL=dispensing.controller.js.map