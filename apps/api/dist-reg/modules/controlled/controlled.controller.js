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
exports.ControlledController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const approval_service_1 = require("../../auth/approval.service");
const controlled_service_1 = require("./controlled.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const branch_scope_1 = require("../../common/branch-scope");
const pagination_1 = require("../../common/pagination");
class AuditDto {
    branchId;
    drugId;
    countedQty;
    notes;
    witness;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditDto.prototype, "drugId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], AuditDto.prototype, "countedQty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AuditDto.prototype, "notes", void 0);
__decorate([
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], AuditDto.prototype, "witness", void 0);
class ResolveDto {
    resolution;
    adjustLotId;
    witness;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(5),
    __metadata("design:type", String)
], ResolveDto.prototype, "resolution", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ResolveDto.prototype, "adjustLotId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => approval_service_1.ApprovalDto),
    __metadata("design:type", approval_service_1.ApprovalDto)
], ResolveDto.prototype, "witness", void 0);
let ControlledController = class ControlledController {
    svc;
    approvals;
    prisma;
    constructor(svc, approvals, prisma) {
        this.svc = svc;
        this.approvals = approvals;
        this.prisma = prisma;
    }
    register(u, q) {
        const { skip, take } = (0, pagination_1.pageArgs)(q, 200);
        return this.svc.register(u.orgId, { ...(0, branch_scope_1.branchFilter)(u, q.branchId), drugId: q.drugId, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take });
    }
    balances(u, branchId) { return this.svc.balances(u.orgId, (0, branch_scope_1.branchFilter)(u, branchId).branchId); }
    async audit(u, d) { return this.svc.audit(u, { branchId: await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), drugId: d.drugId, countedQty: d.countedQty, notes: d.notes, witness: await this.approvals.witness(u, d.witness) }); }
    discrepancies(u, q) { return this.svc.discrepancies(u.orgId, { status: q.status, branchId: (0, branch_scope_1.branchFilter)(u, q.branchId).branchId }); }
    async resolve(u, id, d) { return this.svc.resolve(u, id, { resolution: d.resolution, adjustLotId: d.adjustLotId, witness: d.witness ? await this.approvals.witness(u, d.witness) : undefined }); }
};
exports.ControlledController = ControlledController;
__decorate([
    (0, common_1.Get)("register"),
    (0, decorators_1.Perm)("controlled.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ControlledController.prototype, "register", null);
__decorate([
    (0, common_1.Get)("balances"),
    (0, decorators_1.Perm)("controlled.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ControlledController.prototype, "balances", null);
__decorate([
    (0, common_1.Post)("audits"),
    (0, decorators_1.Perm)("controlled.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AuditDto]),
    __metadata("design:returntype", Promise)
], ControlledController.prototype, "audit", null);
__decorate([
    (0, common_1.Get)("discrepancies"),
    (0, decorators_1.Perm)("controlled.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ControlledController.prototype, "discrepancies", null);
__decorate([
    (0, common_1.Post)("discrepancies/:id/resolve"),
    (0, decorators_1.Perm)("controlled.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ResolveDto]),
    __metadata("design:returntype", Promise)
], ControlledController.prototype, "resolve", null);
exports.ControlledController = ControlledController = __decorate([
    (0, swagger_1.ApiTags)("controlled"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("controlled"),
    __param(0, (0, common_1.Inject)(controlled_service_1.ControlledService)),
    __param(1, (0, common_1.Inject)(approval_service_1.ApprovalService)),
    __param(2, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [controlled_service_1.ControlledService, approval_service_1.ApprovalService, prisma_service_1.PrismaService])
], ControlledController);
//# sourceMappingURL=controlled.controller.js.map