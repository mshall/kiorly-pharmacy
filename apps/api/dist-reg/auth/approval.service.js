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
exports.ApprovalService = exports.ApprovalDto = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const permissions_service_1 = require("./permissions.service");
const password_1 = require("./password");
const errors_1 = require("../common/errors");
class ApprovalDto {
    email;
    password;
}
exports.ApprovalDto = ApprovalDto;
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ApprovalDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApprovalDto.prototype, "password", void 0);
let ApprovalService = class ApprovalService {
    prisma;
    perms;
    constructor(prisma, perms) {
        this.prisma = prisma;
        this.perms = perms;
    }
    async approver(actor, perm, approval) {
        if (!approval) {
            if (await this.perms.has(actor.orgId, actor.role, perm))
                return actor.userId;
            throw new errors_1.DomainError("APPROVAL_REQUIRED", `Manager approval required (${perm})`, 403, { permission: perm });
        }
        const staff = await this.prisma.staffUser.findFirst({ where: { orgId: actor.orgId, email: approval.email.toLowerCase(), active: true } });
        if (!staff || !(await (0, password_1.verifyPassword)(approval.password, staff.passwordHash)) || !(await this.perms.has(actor.orgId, staff.role, perm))) {
            throw new errors_1.DomainError("APPROVAL_DENIED", "Approver credentials invalid or lacking permission", 403, { permission: perm });
        }
        return staff.id;
    }
    async witness(actor, w) {
        if (!w)
            throw new errors_1.DomainError("WITNESS_REQUIRED", "A witness (second staff member) must countersign controlled-substance stock changes", 409);
        const staff = await this.prisma.staffUser.findFirst({ where: { orgId: actor.orgId, email: w.email.toLowerCase(), active: true } });
        if (!staff || !(await (0, password_1.verifyPassword)(w.password, staff.passwordHash)))
            throw new errors_1.DomainError("WITNESS_DENIED", "Witness credentials invalid", 403);
        if (staff.id === actor.userId)
            throw new errors_1.DomainError("WITNESS_SAME_PERSON", "The witness must be a different person", 409);
        return { id: staff.id, name: staff.displayName };
    }
};
exports.ApprovalService = ApprovalService;
exports.ApprovalService = ApprovalService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, permissions_service_1.PermissionsService])
], ApprovalService);
//# sourceMappingURL=approval.service.js.map