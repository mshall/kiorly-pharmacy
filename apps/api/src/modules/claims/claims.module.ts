import { Body, Controller, Get, Inject, Injectable, Module, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsIn, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import type { ClaimStatus } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { RequiresFlag, RequiresFlagGuard } from "../../feature-flags/requires-flag.guard";
import { RequiresEntitlement, RequiresEntitlementGuard } from "../../kernel-adapter/requires-entitlement.guard";
import { DomainError, notFound } from "../../common/errors";
import { D, money } from "../../common/money";
import { resolveBranchId } from "../../common/branch-scope";

class ClaimDto {
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() saleId?: string;
  @IsString() @MinLength(2) insurerName!: string;
  @IsString() @MinLength(2) memberRef!: string;
  @IsOptional() @IsString() policyNo?: string;
  @IsNumberString() amountClaimed!: string;
  @IsOptional() @IsNumberString() patientCopay?: string;
}
class ApproveDto { @IsOptional() @IsNumberString() approvedAmount?: string; @IsOptional() @IsString() note?: string; }
class RejectDto { @IsString() @MinLength(3) reason!: string; }
class ClaimPayDto { @IsNumberString() amount!: string; @IsOptional() @IsString() reference?: string; }
class BatchDto { @IsArray() @ArrayMinSize(1) @IsString({ each: true }) ids!: string[]; @IsString() @MinLength(2) submissionRef!: string; }
class TransitionDto { @IsIn(["SUBMITTED", "APPROVED", "REJECTED", "PAID"]) status!: "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID"; @IsOptional() @IsString() responseNote?: string; }

const NEXT: Record<ClaimStatus, ClaimStatus[]> = { DRAFT: ["SUBMITTED"], SUBMITTED: ["APPROVED", "REJECTED"], APPROVED: ["PAID", "REJECTED"], REJECTED: [], PAID: [] };

/**
 * Insurer claims, basic data model (pharmacy.insurer_claims; cash/self-pay is the default path and is unaffected when OFF).
 * No insurer/TPA API is called (mock only) and NOTHING is reported to any tax authority — claims are insurer reimbursements.
 */
@Injectable()
export class ClaimsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}
  async create(u: AuthUser, branchId: string, d: ClaimDto) {
    if (d.saleId && !(await this.prisma.sale.findFirst({ where: { id: d.saleId, orgId: u.orgId } }))) throw notFound("Sale", d.saleId);
    const c = await this.prisma.insurerClaim.create({ data: { orgId: u.orgId, branchId, saleId: d.saleId, insurerName: d.insurerName, memberRef: d.memberRef, policyNo: d.policyNo, amountClaimed: d.amountClaimed, patientCopay: d.patientCopay ?? "0", createdBy: u.userId } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.create", entityType: "InsurerClaim", entityId: c.id, meta: { amount: money(d.amountClaimed) } } });
    return c;
  }
  list(orgId: string, status?: ClaimStatus) { return this.prisma.insurerClaim.findMany({ where: { orgId, ...(status ? { status } : {}) }, orderBy: { createdAt: "desc" }, take: 200 }); }
  async transition(u: AuthUser, id: string, status: ClaimStatus, note?: string) {
    const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
    if (!c) throw notFound("Claim", id);
    if (!NEXT[c.status].includes(status)) throw new DomainError("BAD_TRANSITION", `${c.status} -> ${status} is not allowed`, 409);
    const approved = D(c.approvedAmount ?? c.amountClaimed);
    const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status, responseNote: note, ...(status === "SUBMITTED" ? { submittedAt: new Date() } : {}), ...(status === "APPROVED" ? { approvedAmount: approved, dueAt: new Date(Date.now() + 30 * 86_400_000) } : {}), ...(status === "REJECTED" ? { rejectionReason: note ?? "Rejected" } : {}), ...(status === "PAID" ? { paidAmount: approved } : {}), ...(status === "PAID" || status === "REJECTED" ? { resolvedAt: new Date() } : {}) } });
    if (status === "PAID" && approved.gt(c.paidAmount)) await this.prisma.claimPayment.create({ data: { orgId: u.orgId, claimId: id, amount: approved.minus(c.paidAmount), reference: "marked paid", createdBy: u.userId } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: `claim.${status.toLowerCase()}`, entityType: "InsurerClaim", entityId: id, meta: { from: c.status } } });
    return r;
  }
  /** Insurer approves (possibly less than claimed). */
  async approve(u: AuthUser, id: string, d: { approvedAmount?: string; note?: string }) {
    const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
    if (!c) throw notFound("Claim", id);
    if (c.status !== "SUBMITTED") throw new DomainError("BAD_TRANSITION", `Only a SUBMITTED claim can be approved (is ${c.status})`, 409);
    const amount = D(d.approvedAmount ?? c.amountClaimed);
    if (amount.lte(0) || amount.gt(c.amountClaimed)) throw new DomainError("INVALID_AMOUNT", "Approved amount must be between 0 and the claimed amount", 400);
    const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status: "APPROVED", approvedAmount: amount, responseNote: d.note, dueAt: new Date(Date.now() + 30 * 86_400_000) } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.approved", entityType: "InsurerClaim", entityId: id, meta: { claimed: money(c.amountClaimed), approved: money(amount) } } });
    return r;
  }

  async reject(u: AuthUser, id: string, reason: string) {
    const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
    if (!c) throw notFound("Claim", id);
    if (!["SUBMITTED", "APPROVED"].includes(c.status) || D(c.paidAmount).gt(0)) throw new DomainError("BAD_TRANSITION", `A ${c.status} claim${D(c.paidAmount).gt(0) ? " with payments" : ""} cannot be rejected`, 409);
    const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason, resolvedAt: new Date() } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.rejected", entityType: "InsurerClaim", entityId: id, meta: { reason } } });
    return r;
  }

  /** Reconciliation: a payment from the insurer against an approved claim; partial payments allowed; PAID when the approved amount is fully received. */
  async pay(u: AuthUser, id: string, d: { amount: string; reference?: string }) {
    const c = await this.prisma.insurerClaim.findFirst({ where: { id, orgId: u.orgId } });
    if (!c) throw notFound("Claim", id);
    if (c.status !== "APPROVED") throw new DomainError("BAD_TRANSITION", `Payments are recorded against APPROVED claims (is ${c.status})`, 409);
    const approved = D(c.approvedAmount ?? c.amountClaimed), remaining = approved.minus(c.paidAmount);
    if (D(d.amount).lte(0) || D(d.amount).gt(remaining)) throw new DomainError("INVALID_AMOUNT", `Payment must be between 0.01 and the outstanding ${money(remaining)}`, 400, { outstanding: money(remaining) });
    return this.prisma.$transaction(async (tx) => {
      await tx.claimPayment.create({ data: { orgId: u.orgId, claimId: id, amount: d.amount, reference: d.reference, createdBy: u.userId } });
      const paid = D(c.paidAmount).plus(d.amount), done = paid.gte(approved);
      const r = await tx.insurerClaim.update({ where: { id }, data: { paidAmount: paid, ...(done ? { status: "PAID", resolvedAt: new Date() } : {}) } });
      await tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.payment", entityType: "InsurerClaim", entityId: id, meta: { amount: money(d.amount), paid: money(paid), complete: done } } });
      return { claim: r, outstanding: money(approved.minus(paid)) };
    });
  }

  async batchSubmit(u: AuthUser, ids: string[], submissionRef: string) {
    const claims = await this.prisma.insurerClaim.findMany({ where: { id: { in: ids }, orgId: u.orgId } });
    if (claims.length !== ids.length) throw notFound("Claim");
    const bad = claims.find((c) => c.status !== "DRAFT");
    if (bad) throw new DomainError("BAD_TRANSITION", `Claim ${bad.id} is ${bad.status}, only DRAFT claims can be submitted`, 409);
    await this.prisma.$transaction([
      this.prisma.insurerClaim.updateMany({ where: { id: { in: ids } }, data: { status: "SUBMITTED", submittedAt: new Date(), submissionRef } }),
      this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "claim.batch_submit", entityType: "InsurerClaim", entityId: "batch", meta: { count: ids.length, submissionRef } } }),
    ]);
    return { submitted: ids.length, submissionRef };
  }

  /** Per insurer: claimed / approved / rejected / paid / outstanding, plus overdue claims (submitted > 30 days without an answer or approved and unpaid past due). */
  async reconciliation(orgId: string) {
    const claims = await this.prisma.insurerClaim.findMany({ where: { orgId }, orderBy: { createdAt: "desc" }, take: 2000 });
    const by = new Map<string, { insurer: string; claims: number; claimed: ReturnType<typeof D>; approved: ReturnType<typeof D>; rejected: ReturnType<typeof D>; paid: ReturnType<typeof D>; outstanding: ReturnType<typeof D>; shortfall: ReturnType<typeof D>; overdue: number }>();
    const now = Date.now();
    for (const c of claims) {
      const g = by.get(c.insurerName) ?? { insurer: c.insurerName, claims: 0, claimed: D(0), approved: D(0), rejected: D(0), paid: D(0), outstanding: D(0), shortfall: D(0), overdue: 0 };
      g.claims++; g.claimed = g.claimed.plus(c.amountClaimed); g.paid = g.paid.plus(c.paidAmount);
      if (c.status === "REJECTED") g.rejected = g.rejected.plus(c.amountClaimed);
      if (c.status === "APPROVED" || c.status === "PAID") { const a = D(c.approvedAmount ?? c.amountClaimed); g.approved = g.approved.plus(a); g.shortfall = g.shortfall.plus(D(c.amountClaimed).minus(a)); if (c.status === "APPROVED") { g.outstanding = g.outstanding.plus(a.minus(c.paidAmount)); if (c.dueAt && c.dueAt.getTime() < now) g.overdue++; } }
      if (c.status === "SUBMITTED") { g.outstanding = g.outstanding.plus(c.amountClaimed); if (c.submittedAt && now - c.submittedAt.getTime() > 30 * 86_400_000) g.overdue++; }
      by.set(c.insurerName, g);
    }
    const insurers = [...by.values()].map((g) => ({ insurer: g.insurer, claims: g.claims, claimed: money(g.claimed), approved: money(g.approved), rejected: money(g.rejected), paid: money(g.paid), outstanding: money(g.outstanding), shortfall: money(g.shortfall), overdue: g.overdue }));
    return { insurers, totals: { claimed: money(insurers.reduce((a, i) => a.plus(i.claimed), D(0))), paid: money(insurers.reduce((a, i) => a.plus(i.paid), D(0))), outstanding: money(insurers.reduce((a, i) => a.plus(i.outstanding), D(0))), overdue: insurers.reduce((a, i) => a + i.overdue, 0) } };
  }

  async payments(orgId: string, claimId: string) { return this.prisma.claimPayment.findMany({ where: { orgId, claimId }, orderBy: { paidAt: "desc" } }); }

  async summary(orgId: string) {
    const rows = await this.prisma.insurerClaim.groupBy({ by: ["status"], where: { orgId }, _sum: { amountClaimed: true }, _count: true });
    return rows.map((r) => ({ status: r.status, count: r._count, amount: money(D(r._sum.amountClaimed ?? 0)) }));
  }
}

@ApiTags("claims")
@ApiBearerAuth()
@UseGuards(RequiresFlagGuard, RequiresEntitlementGuard)
@RequiresFlag("pharmacy.insurer_claims")
@RequiresEntitlement("insurer_claims")
@Controller("claims")
export class ClaimsController {
  constructor(@Inject(ClaimsService) private readonly svc: ClaimsService, @Inject(PrismaService) private readonly prisma: PrismaService) {}
  @Get() @Perm("claims.manage") list(@CurrentUser() u: AuthUser, @Query("status") status?: ClaimStatus) { return this.svc.list(u.orgId, status); }
  @Get("summary") @Perm("claims.manage") summary(@CurrentUser() u: AuthUser) { return this.svc.summary(u.orgId); }
  @Get("reconciliation") @Perm("claims.manage") reconciliation(@CurrentUser() u: AuthUser) { return this.svc.reconciliation(u.orgId); }
  @Post("batch-submit") @Perm("claims.manage") batch(@CurrentUser() u: AuthUser, @Body() d: BatchDto) { return this.svc.batchSubmit(u, d.ids, d.submissionRef); }
  @Get(":id/payments") @Perm("claims.manage") payments(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.payments(u.orgId, id); }
  @Post(":id/approve") @Perm("claims.manage") approve(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ApproveDto) { return this.svc.approve(u, id, d); }
  @Post(":id/reject") @Perm("claims.manage") reject(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RejectDto) { return this.svc.reject(u, id, d.reason); }
  @Post(":id/payments") @Perm("claims.manage") pay(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ClaimPayDto) { return this.svc.pay(u, id, d); }
  @Post() @Perm("claims.manage") async create(@CurrentUser() u: AuthUser, @Body() d: ClaimDto) { return this.svc.create(u, await resolveBranchId(this.prisma, u, d.branchId), d); }
  @Post(":id/transition") @Perm("claims.manage") transition(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: TransitionDto) { return this.svc.transition(u, id, d.status, d.responseNote); }
}

@Module({ controllers: [ClaimsController], providers: [ClaimsService] })
export class ClaimsModule {}
