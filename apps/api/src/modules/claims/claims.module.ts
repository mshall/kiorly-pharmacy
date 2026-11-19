import { Body, Controller, Get, Inject, Injectable, Module, Param, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsIn, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import type { ClaimStatus } from "@prisma/client";
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
    const r = await this.prisma.insurerClaim.update({ where: { id }, data: { status, responseNote: note, ...(status === "SUBMITTED" ? { submittedAt: new Date() } : {}), ...(status === "PAID" || status === "REJECTED" ? { resolvedAt: new Date() } : {}) } });
    await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: `claim.${status.toLowerCase()}`, entityType: "InsurerClaim", entityId: id, meta: { from: c.status } } });
    return r;
  }
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
  @Post() @Perm("claims.manage") async create(@CurrentUser() u: AuthUser, @Body() d: ClaimDto) { return this.svc.create(u, await resolveBranchId(this.prisma, u, d.branchId), d); }
  @Post(":id/transition") @Perm("claims.manage") transition(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: TransitionDto) { return this.svc.transition(u, id, d.status, d.responseNote); }
}

@Module({ controllers: [ClaimsController], providers: [ClaimsService] })
export class ClaimsModule {}
