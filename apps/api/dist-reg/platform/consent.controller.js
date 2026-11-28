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
exports.ConsentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../auth/decorators");
const errors_1 = require("../common/errors");
const prisma_service_1 = require("../prisma/prisma.service");
const provider_types_1 = require("../providers/provider-types");
const consent_service_1 = require("./adapters/consent.service");
class GrantDto {
    subjectRef;
    purpose;
    patientId;
    expiresAt;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], GrantDto.prototype, "subjectRef", void 0);
__decorate([
    (0, class_validator_1.IsIn)(provider_types_1.CONSENT_PURPOSES),
    __metadata("design:type", String)
], GrantDto.prototype, "purpose", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GrantDto.prototype, "patientId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], GrantDto.prototype, "expiresAt", void 0);
class RevokeDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], RevokeDto.prototype, "reason", void 0);
let ConsentController = class ConsentController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    list(u, q) { return this.svc.list(u.orgId, { ...q, limit: q.limit ? Number(q.limit) : undefined }); }
    status(u, subjectRef, purpose) {
        if (!subjectRef || !consent_service_1.ConsentService.isPurpose(purpose))
            throw (0, errors_1.badRequest)("BAD_QUERY", `subjectRef and purpose (${provider_types_1.CONSENT_PURPOSES.join("|")}) are required`);
        return this.svc.status(u.orgId, subjectRef, purpose);
    }
    async grant(u, d) {
        if (d.patientId && !(await this.prisma.patientRef.findFirst({ where: { id: d.patientId, orgId: u.orgId }, select: { id: true } })))
            throw (0, errors_1.badRequest)("UNKNOWN_PATIENT", "Customer not found");
        return this.svc.grant(u.orgId, { subjectRef: d.subjectRef, patientId: d.patientId, purpose: d.purpose, source: "API", expiresAt: d.expiresAt ? new Date(d.expiresAt) : undefined, actorId: u.userId });
    }
    revoke(u, id, d) { return this.svc.revoke(u.orgId, id, d.reason, u.userId); }
};
exports.ConsentController = ConsentController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("status"),
    (0, decorators_1.Perm)("customer.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("subjectRef")),
    __param(2, (0, common_1.Query)("purpose")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "status", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GrantDto]),
    __metadata("design:returntype", Promise)
], ConsentController.prototype, "grant", null);
__decorate([
    (0, common_1.Post)(":id/revoke"),
    (0, decorators_1.Perm)("customer.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RevokeDto]),
    __metadata("design:returntype", void 0)
], ConsentController.prototype, "revoke", null);
exports.ConsentController = ConsentController = __decorate([
    (0, swagger_1.ApiTags)("consents"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("consents"),
    __param(0, (0, common_1.Inject)(consent_service_1.ConsentService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [consent_service_1.ConsentService, prisma_service_1.PrismaService])
], ConsentController);
//# sourceMappingURL=consent.controller.js.map