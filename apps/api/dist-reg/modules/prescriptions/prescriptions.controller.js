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
exports.PrescribersController = exports.PrescriptionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const prescriptions_service_1 = require("./prescriptions.service");
const prescribers_service_1 = require("./prescribers.service");
const refills_service_1 = require("./refills.service");
const transfers_service_1 = require("./transfers.service");
const branch_scope_1 = require("../../common/branch-scope");
const prisma_service_1 = require("../../prisma/prisma.service");
const pagination_1 = require("../../common/pagination");
class PatientDto {
    displayName;
    phone;
    externalId;
    birthYear;
    allergies;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], PatientDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatientDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PatientDto.prototype, "externalId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], PatientDto.prototype, "birthYear", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], PatientDto.prototype, "allergies", void 0);
class RxLineDto {
    drugId;
    activeIngredient;
    drugName;
    strength;
    dosageForm;
    quantity;
    directions;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "activeIngredient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "drugName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "strength", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "dosageForm", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RxLineDto.prototype, "quantity", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RxLineDto.prototype, "directions", void 0);
class PaperRxDto {
    branchId;
    patient;
    prescriberName;
    prescriberLicenceNo;
    issuedAt;
    scanDataUrl;
    scanFileName;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaperRxDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PatientDto),
    __metadata("design:type", PatientDto)
], PaperRxDto.prototype, "patient", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], PaperRxDto.prototype, "prescriberName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaperRxDto.prototype, "prescriberLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaperRxDto.prototype, "issuedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaperRxDto.prototype, "scanDataUrl", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaperRxDto.prototype, "scanFileName", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RxLineDto),
    __metadata("design:type", Array)
], PaperRxDto.prototype, "lines", void 0);
class ManualRxDto {
    branchId;
    patientId;
    patient;
    prescriberId;
    prescriberName;
    prescriberLicenceNo;
    issuedAt;
    validDays;
    refillsAllowed;
    refillIntervalDays;
    priority;
    scanDataUrl;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PatientDto),
    __metadata("design:type", PatientDto)
], ManualRxDto.prototype, "patient", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "prescriberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "prescriberName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "prescriberLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "issuedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], ManualRxDto.prototype, "validDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], ManualRxDto.prototype, "refillsAllowed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], ManualRxDto.prototype, "refillIntervalDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["NORMAL", "URGENT"]),
    __metadata("design:type", String)
], ManualRxDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ManualRxDto.prototype, "scanDataUrl", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RxLineDto),
    __metadata("design:type", Array)
], ManualRxDto.prototype, "lines", void 0);
class AnnotateDto {
    priority;
    verificationNotes;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["NORMAL", "URGENT"]),
    __metadata("design:type", String)
], AnnotateDto.prototype, "priority", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AnnotateDto.prototype, "verificationNotes", void 0);
class RefillDto {
    earlyReason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RefillDto.prototype, "earlyReason", void 0);
class CounterpartyDto {
    name;
    phone;
    pharmacist;
    licenceNo;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], CounterpartyDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CounterpartyDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CounterpartyDto.prototype, "pharmacist", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CounterpartyDto.prototype, "licenceNo", void 0);
class TransferOutDto {
    counterparty;
    reason;
}
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CounterpartyDto),
    __metadata("design:type", CounterpartyDto)
], TransferOutDto.prototype, "counterparty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferOutDto.prototype, "reason", void 0);
class TransferInDto {
    branchId;
    counterparty;
    reason;
    originalRef;
    patientId;
    patient;
    prescriberName;
    prescriberLicenceNo;
    issuedAt;
    refillsAllowed;
    lines;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => CounterpartyDto),
    __metadata("design:type", CounterpartyDto)
], TransferInDto.prototype, "counterparty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "reason", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "originalRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => PatientDto),
    __metadata("design:type", PatientDto)
], TransferInDto.prototype, "patient", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], TransferInDto.prototype, "prescriberName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "prescriberLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TransferInDto.prototype, "issuedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], TransferInDto.prototype, "refillsAllowed", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => RxLineDto),
    __metadata("design:type", Array)
], TransferInDto.prototype, "lines", void 0);
class PrescriberDto {
    name;
    nameAr;
    licenceNo;
    specialty;
    phone;
    clinicName;
    clinicAddress;
    notes;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], PrescriberDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], PrescriberDto.prototype, "licenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "clinicName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "clinicAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberDto.prototype, "notes", void 0);
class PrescriberPatchDto {
    name;
    nameAr;
    specialty;
    phone;
    clinicName;
    clinicAddress;
    notes;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "nameAr", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "specialty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "clinicName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "clinicAddress", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrescriberPatchDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PrescriberPatchDto.prototype, "active", void 0);
class VerifyDto {
    verified;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], VerifyDto.prototype, "verified", void 0);
class RejectDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RejectDto.prototype, "reason", void 0);
class LineDrugDto {
    drugId;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], LineDrugDto.prototype, "drugId", void 0);
let PrescriptionsController = class PrescriptionsController {
    svc;
    prisma;
    refills;
    transfers;
    constructor(svc, prisma, refills, transfers) {
        this.svc = svc;
        this.prisma = prisma;
        this.refills = refills;
        this.transfers = transfers;
    }
    async manual(u, d) { return this.svc.intakePaper(u, { ...d, source: "MANUAL_ENTRY", branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) }); }
    scanUrl(u, id, ttl) { return this.svc.scanUrl(u.orgId, id, ttl ? Number(ttl) : undefined); }
    queue(u, branchId) { return this.svc.verificationQueue(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    partial(u, branchId) { return this.svc.partialFills(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    due(u, q) { return this.refills.due(u.orgId, { days: Math.min(Math.max(Number(q.days ?? 7) || 7, 0), 90), branchId: (0, branch_scope_1.branchFilter)(u, q.branchId).branchId }); }
    reminders(u, days) { return this.refills.runReminders(u, days ? Number(days) : undefined); }
    async transferIn(u, d) { const { branchId, ...rest } = d; return this.transfers.in(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId), rest); }
    transferList(u, q) { const { skip, take } = (0, pagination_1.pageArgs)(q); return this.transfers.list(u.orgId, { direction: q.direction, branchId: (0, branch_scope_1.branchFilter)(u, q.branchId).branchId, skip, take }); }
    transferNote(u, id, lang) { return this.transfers.noteHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }
    async paper(u, d) { return this.svc.intakePaper(u, { ...d, branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId) }); }
    list(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q);
        return this.svc.list(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), status: q.status, source: q.source, prescriberId: q.prescriberId, patientId: q.patientId, q: q.q, skip, take });
    }
    get(u, id) { return this.svc.get(u.orgId, id); }
    balance(u, id) { return this.svc.balance(u.orgId, id); }
    async substitutes(u, id, lineId, branchId) { return this.svc.lineSubstitutes(u, id, lineId, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, branchId)); }
    refillHistory(u, id) { return this.refills.history(u.orgId, id); }
    refill(u, id, d) { return this.refills.refill(u, id, d); }
    transferOut(u, id, d) { return this.transfers.out(u, id, d); }
    annotate(u, id, d) { return this.svc.annotate(u, id, d); }
    validate(u, id) { return this.svc.validate(u, id); }
    reject(u, id, d) { return this.svc.reject(u, id, d.reason); }
    lineDrug(u, id, lineId, d) { return this.svc.setLineDrug(u, id, lineId, d.drugId); }
};
exports.PrescriptionsController = PrescriptionsController;
__decorate([
    (0, common_1.Post)("manual"),
    (0, decorators_1.Perm)("rx.intake"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ManualRxDto]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "manual", null);
__decorate([
    (0, common_1.Get)(":id/scan-url"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("ttl")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "scanUrl", null);
__decorate([
    (0, common_1.Get)("verification-queue"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "queue", null);
__decorate([
    (0, common_1.Get)("partial"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "partial", null);
__decorate([
    (0, common_1.Get)("refills/due"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "due", null);
__decorate([
    (0, common_1.Post)("refills/reminders/run"),
    (0, decorators_1.Perm)("rx.refill"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("days")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "reminders", null);
__decorate([
    (0, common_1.Post)("transfer-in"),
    (0, decorators_1.Perm)("rx.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TransferInDto]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "transferIn", null);
__decorate([
    (0, common_1.Get)("transfers"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "transferList", null);
__decorate([
    (0, common_1.Get)("transfers/:id/note.html"),
    (0, common_1.Header)("Content-Type", "text/html; charset=utf-8"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)("lang")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "transferNote", null);
__decorate([
    (0, common_1.Post)("paper"),
    (0, decorators_1.Perm)("rx.intake"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PaperRxDto]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "paper", null);
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "get", null);
__decorate([
    (0, common_1.Get)(":id/balance"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "balance", null);
__decorate([
    (0, common_1.Get)(":id/lines/:lineId/substitutes"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("lineId")),
    __param(3, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], PrescriptionsController.prototype, "substitutes", null);
__decorate([
    (0, common_1.Get)(":id/refills"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "refillHistory", null);
__decorate([
    (0, common_1.Post)(":id/refill"),
    (0, decorators_1.Perm)("rx.refill"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RefillDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "refill", null);
__decorate([
    (0, common_1.Post)(":id/transfer-out"),
    (0, decorators_1.Perm)("rx.transfer"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, TransferOutDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "transferOut", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, decorators_1.Perm)("rx.validate"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, AnnotateDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "annotate", null);
__decorate([
    (0, common_1.Post)(":id/validate"),
    (0, decorators_1.Perm)("rx.validate"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "validate", null);
__decorate([
    (0, common_1.Post)(":id/reject"),
    (0, decorators_1.Perm)("rx.validate"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RejectDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "reject", null);
__decorate([
    (0, common_1.Put)(":id/lines/:lineId/drug"),
    (0, decorators_1.Perm)("rx.validate"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Param)("lineId")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, LineDrugDto]),
    __metadata("design:returntype", void 0)
], PrescriptionsController.prototype, "lineDrug", null);
exports.PrescriptionsController = PrescriptionsController = __decorate([
    (0, swagger_1.ApiTags)("prescriptions"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("prescriptions"),
    __param(0, (0, common_1.Inject)(prescriptions_service_1.PrescriptionsService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(2, (0, common_1.Inject)(refills_service_1.RefillsService)),
    __param(3, (0, common_1.Inject)(transfers_service_1.RxTransfersService)),
    __metadata("design:paramtypes", [prescriptions_service_1.PrescriptionsService, prisma_service_1.PrismaService,
        refills_service_1.RefillsService, transfers_service_1.RxTransfersService])
], PrescriptionsController);
let PrescribersController = class PrescribersController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    list(u, q) { const { page, pageSize } = (0, pagination_1.pageArgs)(q); return this.svc.list(u.orgId, { q: q.q, verified: q.verified === undefined ? undefined : q.verified === "true", page, pageSize }); }
    create(u, d) { return this.svc.create(u, d); }
    get(u, id) { return this.svc.get(u.orgId, id); }
    update(u, id, d) { return this.svc.update(u, id, d); }
    verify(u, id, d) { return this.svc.verify(u, id, d.verified); }
};
exports.PrescribersController = PrescribersController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PrescribersController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Perm)("rx.intake"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PrescriberDto]),
    __metadata("design:returntype", void 0)
], PrescribersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, decorators_1.Perm)("rx.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], PrescribersController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, decorators_1.Perm)("prescriber.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, PrescriberPatchDto]),
    __metadata("design:returntype", void 0)
], PrescribersController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/verify"),
    (0, decorators_1.Perm)("prescriber.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, VerifyDto]),
    __metadata("design:returntype", void 0)
], PrescribersController.prototype, "verify", null);
exports.PrescribersController = PrescribersController = __decorate([
    (0, swagger_1.ApiTags)("prescribers"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("prescribers"),
    __param(0, (0, common_1.Inject)(prescribers_service_1.PrescribersService)),
    __metadata("design:paramtypes", [prescribers_service_1.PrescribersService])
], PrescribersController);
//# sourceMappingURL=prescriptions.controller.js.map