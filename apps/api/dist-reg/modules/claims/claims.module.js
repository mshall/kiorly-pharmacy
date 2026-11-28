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
exports.ClaimsModule = exports.ClaimsController = exports.ClaimsService = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
const decorators_1 = require("../../auth/decorators");
const requires_flag_guard_1 = require("../../feature-flags/requires-flag.guard");
const requires_entitlement_guard_1 = require("../../kernel-adapter/requires-entitlement.guard");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const branch_scope_1 = require("../../common/branch-scope");
class ClaimDto {
    branchId;
    saleId;
    insurerName;
    memberRef;
    policyNo;
    amountClaimed;
    patientCopay;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimDto.prototype, "saleId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], ClaimDto.prototype, "insurerName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], ClaimDto.prototype, "memberRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimDto.prototype, "policyNo", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClaimDto.prototype, "amountClaimed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClaimDto.prototype, "patientCopay", void 0);
class ApproveDto {
    approvedAmount;
    note;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ApproveDto.prototype, "approvedAmount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ApproveDto.prototype, "note", void 0);
class RejectDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    __metadata("design:type", String)
], RejectDto.prototype, "reason", void 0);
class ClaimPayDto {
    amount;
    reference;
}
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], ClaimPayDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ClaimPayDto.prototype, "reference", void 0);
class BatchDto {
    ids;
    submissionRef;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMinSize)(1),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], BatchDto.prototype, "ids", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], BatchDto.prototype, "submissionRef", void 0);
class TransitionDto {
    status;
    responseNote;
}
__decorate([
    (0, class_validator_1.IsIn)(["SUBMITTED", "APPROVED", "REJECTED", "PAID"]),
    __metadata("design:type", String)
], TransitionDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TransitionDto.prototype, "responseNote", void 0);
const NEXT = { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED", "REJECTED"], APPROVED: ["PAID", "REJECTED"], REJECTED: [], PAID: [] };
let ClaimsService = class ClaimsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(u, branchId, d) {
        if (d.saleId && !(await this.prisma.sale.findFirst({ where: { id: d.saleId, orgId: u.orgId } })))
            throw (0, errors_1.notFound)("Sale", d.saleId);
        const c = await this.prisma.insurerClaim.create({ data: { orgId: u.orgId, branchId, saleId: d.saleId, insurerName: d.insurerName, memberRef: d.memberRef, policyNo: d.policyNo, amountClaimed: d.amountClaimed, patientCopay: d.patientCopay ?? "0", createdBy: u.userId } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.create", entityType: "InsurerClaim", entityId: c.id, meta: { amount: (0, money_1.money)(d.amountClaimed) } } });
        return c;
    }
    list(orgId, status) { return this.prisma.insurerClaim.findMany({ where: { orgId, ...(status ? { status } : {}) }, orderBy: { createdAt: "desc" }, take: 200 }); }
    async transition(u, id, status, note) {
        const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Claim", id);
        if (!NEXT[c.status].includes(status))
            throw new errors_1.DomainError("BAD_TRANSITION", `${c.status} -> ${status} is not allowed`, 409);
        const approved = (0, money_1.D)(c.approvedAmount ?? c.amountClaimed);
        const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status, responseNote: note, ...(status === "SUBMITTED" ? { submittedAt: new Date() } : {}), ...(status === "APPROVED" ? { approvedAmount: approved, dueAt: new Date(Date.now() + 30 * 86_400_000) } : {}), ...(status === "REJECTED" ? { rejectionReason: note ?? "Rejected" } : {}), ...(status === "PAID" ? { paidAmount: approved } : {}), ...(status === "PAID" || status === "REJECTED" ? { resolvedAt: new Date() } : {}) } });
        if (status === "PAID" && approved.gt(c.paidAmount))
            await this.prisma.claimPayment.create({ data: { orgId: u.orgId, claimId: id, amount: approved.minus(c.paidAmount), reference: "marked paid", createdBy: u.userId } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: `claim.${status.toLowerCase()}`, entityType: "InsurerClaim", entityId: id, meta: { from: c.status } } });
        return r;
    }
    async approve(u, id, d) {
        const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Claim", id);
        if (c.status !== "SUBMITTED")
            throw new errors_1.DomainError("BAD_TRANSITION", `Only a SUBMITTED claim can be approved (is ${c.status})`, 409);
        const amount = (0, money_1.D)(d.approvedAmount ?? c.amountClaimed);
        if (amount.lte(0) || amount.gt(c.amountClaimed))
            throw new errors_1.DomainError("INVALID_AMOUNT", "Approved amount must be between 0 and the claimed amount", 400);
        const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status: "APPROVED", approvedAmount: amount, responseNote: d.note, dueAt: new Date(Date.now() + 30 * 86_400_000) } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.approved", entityType: "InsurerClaim", entityId: id, meta: { claimed: (0, money_1.money)(c.amountClaimed), approved: (0, money_1.money)(amount) } } });
        return r;
    }
    async reject(u, id, reason) {
        const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Claim", id);
        if (!["SUBMITTED", "APPROVED"].includes(c.status) || (0, money_1.D)(c.paidAmount).gt(0))
            throw new errors_1.DomainError("BAD_TRANSITION", `A ${c.status} claim${(0, money_1.D)(c.paidAmount).gt(0) ? " with payments" : ""} cannot be rejected`, 409);
        const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason, resolvedAt: new Date() } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.rejected", entityType: "InsurerClaim", entityId: id, meta: { reason } } });
        return r;
    }
    async pay(u, id, d) {
        const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Claim", id);
        if (c.status !== "APPROVED")
            throw new errors_1.DomainError("BAD_TRANSITION", `Payments are recorded against APPROVED claims (is ${c.status})`, 409);
        const approved = (0, money_1.D)(c.approvedAmount ?? c.amountClaimed), remaining = approved.minus(c.paidAmount);
        if ((0, money_1.D)(d.amount).lte(0) || (0, money_1.D)(d.amount).gt(remaining))
            throw new errors_1.DomainError("INVALID_AMOUNT", `Payment must be between 0.01 and the outstanding ${(0, money_1.money)(remaining)}`, 400, { outstanding: (0, money_1.money)(remaining) });
        return this.prisma.$transaction(async (tx) => {
            await tx.claimPayment.create({ data: { orgId: u.orgId, claimId: id, amount: d.amount, reference: d.reference, createdBy: u.userId } });
            const paid = (0, money_1.D)(c.paidAmount).plus(d.amount), done = paid.gte(approved);
            const r = await tx.insurerClaim.update({ where: { id }, data: { paidAmount: paid, ...(done ? { status: "PAID", resolvedAt: new Date() } : {}) } });
            await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.payment", entityType: "InsurerClaim", entityId: id, meta: { amount: (0, money_1.money)(d.amount), paid: (0, money_1.money)(paid), complete: done } } });
            return { claim: r, outstanding: (0, money_1.money)(approved.minus(paid)) };
        });
    }
    async batchSubmit(u, ids, submissionRef) {
        const claims = await this.prisma.insurerClaim.findMany({ where: { id: { in: ids }, orgId: u.orgId } });
        if (claims.length !== ids.length)
            throw (0, errors_1.notFound)("Claim");
        const bad = claims.find((c) => c.status !== "DRAFT");
        if (bad)
            throw new errors_1.DomainError("BAD_TRANSITION", `Claim ${bad.id} is ${bad.status}, only DRAFT claims can be submitted`, 409);
        await this.prisma.$transaction([
            this.prisma.insurerClaim.updateMany({ where: { id: { in: ids } }, data: { status: "SUBMITTED", submittedAt: new Date(), submissionRef } }),
            this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.batch_submit", entityType: "InsurerClaim", entityId: "batch", meta: { count: ids.length, submissionRef } } }),
        ]);
        return { submitted: ids.length, submissionRef };
    }
    async reconciliation(orgId) {
        const claims = await this.prisma.insurerClaim.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 2000 });
        const by = new Map();
        const now = Date.now();
        for (const c of claims) {
            const g = by.get(c.insurerName) ?? { insurer: c.insurerName, claims: 0, claimed: (0, money_1.D)(0), approved: (0, money_1.D)(0), rejected: (0, money_1.D)(0), paid: (0, money_1.D)(0), outstanding: (0, money_1.D)(0), shortfall: (0, money_1.D)(0), overdue: 0 };
            g.claims++;
            g.claimed = g.claimed.plus(c.amountClaimed);
            g.paid = g.paid.plus(c.paidAmount);
            if (c.status === "REJECTED")
                g.rejected = g.rejected.plus(c.amountClaimed);
            if (c.status === "APPROVED" || c.status === "PAID") {
                const a = (0, money_1.D)(c.approvedAmount ?? c.amountClaimed);
                g.approved = g.approved.plus(a);
                g.shortfall = g.shortfall.plus((0, money_1.D)(c.amountClaimed).minus(a));
                if (c.status === "APPROVED") {
                    g.outstanding = g.outstanding.plus(a.minus(c.paidAmount));
                    if (c.dueAt && c.dueAt.getTime() < now)
                        g.overdue++;
                }
            }
            if (c.status === "SUBMITTED") {
                g.outstanding = g.outstanding.plus(c.amountClaimed);
                if (c.submittedAt && now - c.submittedAt.getTime() > 30 * 86_400_000)
                    g.overdue++;
            }
            by.set(c.insurerName, g);
        }
        const insurers = [...by.values()].map((g) => ({ insurer: g.insurer, claims: g.claims, claimed: (0, money_1.money)(g.claimed), approved: (0, money_1.money)(g.approved), rejected: (0, money_1.money)(g.rejected), paid: (0, money_1.money)(g.paid), outstanding: (0, money_1.money)(g.outstanding), shortfall: (0, money_1.money)(g.shortfall), overdue: g.overdue }));
        return { insurers, totals: { claimed: (0, money_1.money)(insurers.reduce((a, i) => a.plus(i.claimed), (0, money_1.D)(0))), paid: (0, money_1.money)(insurers.reduce((a, i) => a.plus(i.paid), (0, money_1.D)(0))), outstanding: (0, money_1.money)(insurers.reduce((a, i) => a.plus(i.outstanding), (0, money_1.D)(0))), overdue: insurers.reduce((a, i) => a + i.overdue, 0) } };
    }
    async payments(orgId, claimId) { return this.prisma.claimPayment.findMany({ where: { orgId, claimId }, orderBy: { paidAt: "desc" } }); }
    async summary(orgId) {
        const rows = await this.prisma.insurerClaim.groupBy({ by: ["status"], where: { orgId }, _sum: { amountClaimed: true }, _count: true });
        return rows.map((r) => ({ status: r.status, count: r._count, amount: (0, money_1.money)((0, money_1.D)(r._sum.amountClaimed ?? 0)) }));
    }
};
exports.ClaimsService = ClaimsService;
exports.ClaimsService = ClaimsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ClaimsService);
let ClaimsController = class ClaimsController {
    svc;
    prisma;
    constructor(svc, prisma) {
        this.svc = svc;
        this.prisma = prisma;
    }
    list(u, status) { return this.svc.list(u.orgId, status); }
    summary(u) { return this.svc.summary(u.orgId); }
    reconciliation(u) { return this.svc.reconciliation(u.orgId); }
    batch(u, d) { return this.svc.batchSubmit(u, d.ids, d.submissionRef); }
    payments(u, id) { return this.svc.payments(u.orgId, id); }
    approve(u, id, d) { return this.svc.approve(u, id, d); }
    reject(u, id, d) { return this.svc.reject(u, id, d.reason); }
    pay(u, id, d) { return this.svc.pay(u, id, d); }
    async create(u, d) { return this.svc.create(u, await (0, branch_scope_1.resolveBranchId)(this.prisma, u, d.branchId), d); }
    transition(u, id, d) { return this.svc.transition(u, id, d.status, d.responseNote); }
};
exports.ClaimsController = ClaimsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("status")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)("summary"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "summary", null);
__decorate([
    (0, common_1.Get)("reconciliation"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "reconciliation", null);
__decorate([
    (0, common_1.Post)("batch-submit"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BatchDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "batch", null);
__decorate([
    (0, common_1.Get)(":id/payments"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "payments", null);
__decorate([
    (0, common_1.Post)(":id/approve"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ApproveDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "approve", null);
__decorate([
    (0, common_1.Post)(":id/reject"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, RejectDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "reject", null);
__decorate([
    (0, common_1.Post)(":id/payments"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, ClaimPayDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "pay", null);
__decorate([
    (0, common_1.Post)(),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ClaimDto]),
    __metadata("design:returntype", Promise)
], ClaimsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(":id/transition"),
    (0, decorators_1.Perm)("claims.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, TransitionDto]),
    __metadata("design:returntype", void 0)
], ClaimsController.prototype, "transition", null);
exports.ClaimsController = ClaimsController = __decorate([
    (0, swagger_1.ApiTags)("claims"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard, requires_entitlement_guard_1.RequiresEntitlementGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.insurer_claims"),
    (0, requires_entitlement_guard_1.RequiresEntitlement)("insurer_claims"),
    (0, common_1.Controller)("claims"),
    __param(0, (0, common_1.Inject)(ClaimsService)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [ClaimsService, prisma_service_1.PrismaService])
], ClaimsController);
let ClaimsModule = class ClaimsModule {
};
exports.ClaimsModule = ClaimsModule;
exports.ClaimsModule = ClaimsModule = __decorate([
    (0, common_1.Module)({ controllers: [ClaimsController], providers: [ClaimsService] })
], ClaimsModule);
//# sourceMappingURL=claims.module.js.map