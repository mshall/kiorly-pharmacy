import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto, ApprovalService } from "../../auth/approval.service";
import { ControlledService } from "./controlled.service";
import { PrismaService } from "../../prisma/prisma.service";
import { branchFilter, resolveBranchId } from "../../common/branch-scope";
import { pageArgs } from "../../common/pagination";

class AuditDto {
  @IsOptional() @IsString() branchId?: string;
  @IsString() drugId!: string;
  @IsInt() @Min(0) countedQty!: number;
  @IsOptional() @IsString() notes?: string;
  @ValidateNested() @Type(() => ApprovalDto) witness!: ApprovalDto;
}
class ResolveDto {
  @IsString() @MinLength(5) resolution!: string;
  @IsOptional() @IsString() adjustLotId?: string;
  @IsOptional() @ValidateNested() @Type(() => ApprovalDto) witness?: ApprovalDto;
}

@ApiTags("controlled")
@ApiBearerAuth()
@Controller("controlled")
export class ControlledController {
  constructor(@Inject(ControlledService) private readonly svc: ControlledService, @Inject(ApprovalService) private readonly approvals: ApprovalService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("register") @Perm("controlled.read")
  register(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; drugId?: string; from?: string; to?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q, 200);
    return this.svc.register(u.orgId, { ...branchFilter(u, q.branchId), drugId: q.drugId, from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take });
  }
  @Get("balances") @Perm("controlled.read")
  balances(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.balances(u.orgId, branchFilter(u, branchId).branchId); }

  @Post("audits") @Perm("controlled.manage")
  async audit(@CurrentUser() u: AuthUser, @Body() d: AuditDto) { return this.svc.audit(u, { branchId: await resolveBranchId(this.prisma, u, d.branchId), drugId: d.drugId, countedQty: d.countedQty, notes: d.notes, witness: await this.approvals.witness(u, d.witness) }); }

  @Get("discrepancies") @Perm("controlled.read")
  discrepancies(@CurrentUser() u: AuthUser, @Query() q: { status?: string; branchId?: string }) { return this.svc.discrepancies(u.orgId, { status: q.status, branchId: branchFilter(u, q.branchId).branchId }); }

  @Post("discrepancies/:id/resolve") @Perm("controlled.manage")
  async resolve(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ResolveDto) { return this.svc.resolve(u, id, { resolution: d.resolution, adjustLotId: d.adjustLotId, witness: d.witness ? await this.approvals.witness(u, d.witness) : undefined }); }
}
