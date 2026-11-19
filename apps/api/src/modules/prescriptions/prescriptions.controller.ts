import { Body, Controller, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsInt, IsNumber, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import type { RxStatus } from "@prisma/client";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { PrescriptionsService } from "./prescriptions.service";
import { resolveBranchId, branchFilter } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { pageArgs } from "../../common/pagination";

class PatientDto {
  @IsString() @MinLength(2) displayName!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() externalId?: string;
  @IsOptional() @IsInt() birthYear?: number;
  @IsOptional() @IsArray() @IsString({ each: true }) allergies?: string[];
}
class RxLineDto {
  @IsOptional() @IsString() drugId?: string;
  @IsOptional() @IsString() activeIngredient?: string;
  @IsOptional() @IsString() drugName?: string;
  @IsOptional() @IsString() strength?: string;
  @IsOptional() @IsString() dosageForm?: string;
  @IsNumber() @Min(1) quantity!: number;
  @IsOptional() @IsString() directions?: string;
}
class PaperRxDto {
  @IsOptional() @IsString() branchId?: string;
  @ValidateNested() @Type(() => PatientDto) patient!: PatientDto;
  @IsString() @MinLength(2) prescriberName!: string;
  @IsOptional() @IsString() prescriberLicenceNo?: string;
  @IsOptional() @IsString() issuedAt?: string;
  @IsOptional() @IsString() scanDataUrl?: string;
  @IsOptional() @IsString() scanFileName?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => RxLineDto) lines!: RxLineDto[];
}
class RejectDto { @IsString() @MinLength(3) reason!: string; }
class LineDrugDto { @IsString() drugId!: string; }

@ApiTags("prescriptions")
@ApiBearerAuth()
@Controller("prescriptions")
export class PrescriptionsController {
  constructor(@Inject(PrescriptionsService) private readonly svc: PrescriptionsService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Post("paper") @Perm("rx.intake")
  async paper(@CurrentUser() u: AuthUser, @Body() d: PaperRxDto) { return this.svc.intakePaper(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }

  @Get() @Perm("rx.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; status?: RxStatus; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q);
    return this.svc.list(u.orgId, { ...branchFilter(u, q.branchId), status: q.status, skip, take });
  }

  @Get(":id") @Perm("rx.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Post(":id/validate") @Perm("rx.validate")
  validate(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.validate(u, id); }

  @Post(":id/reject") @Perm("rx.validate")
  reject(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RejectDto) { return this.svc.reject(u, id, d.reason); }

  @Put(":id/lines/:lineId/drug") @Perm("rx.validate")
  lineDrug(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("lineId") lineId: string, @Body() d: LineDrugDto) { return this.svc.setLineDrug(u, id, lineId, d.drugId); }
}
