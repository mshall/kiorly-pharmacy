import { Body, Controller, Get, Header, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumber, IsOptional, IsString, Max, Min, MinLength, ValidateNested } from "class-validator";
import type { RxStatus } from "../../generated/prisma/client";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { PrescriptionsService } from "./prescriptions.service";
import { PrescribersService } from "./prescribers.service";
import { RefillsService } from "./refills.service";
import { RxTransfersService } from "./transfers.service";
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
class ManualRxDto {
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() patientId?: string;
  @IsOptional() @ValidateNested() @Type(() => PatientDto) patient?: PatientDto;
  @IsOptional() @IsString() prescriberId?: string;
  @IsOptional() @IsString() prescriberName?: string;
  @IsOptional() @IsString() prescriberLicenceNo?: string;
  @IsOptional() @IsDateString() issuedAt?: string;
  @IsOptional() @IsInt() @Min(1) @Max(365) validDays?: number;
  @IsOptional() @IsInt() @Min(0) @Max(12) refillsAllowed?: number;
  @IsOptional() @IsInt() @Min(1) @Max(180) refillIntervalDays?: number;
  @IsOptional() @IsIn(["NORMAL", "URGENT"]) priority?: "NORMAL" | "URGENT";
  @IsOptional() @IsString() scanDataUrl?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => RxLineDto) lines!: RxLineDto[];
}
class AnnotateDto { @IsOptional() @IsIn(["NORMAL", "URGENT"]) priority?: "NORMAL" | "URGENT"; @IsOptional() @IsString() verificationNotes?: string; }
class RefillDto { @IsOptional() @IsString() @MinLength(3) earlyReason?: string; }
class CounterpartyDto { @IsString() @MinLength(2) name!: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsString() pharmacist?: string; @IsOptional() @IsString() licenceNo?: string; }
class TransferOutDto { @ValidateNested() @Type(() => CounterpartyDto) counterparty!: CounterpartyDto; @IsOptional() @IsString() reason?: string; }
class TransferInDto {
  @IsOptional() @IsString() branchId?: string;
  @ValidateNested() @Type(() => CounterpartyDto) counterparty!: CounterpartyDto;
  @IsOptional() @IsString() reason?: string; @IsOptional() @IsString() originalRef?: string;
  @IsOptional() @IsString() patientId?: string;
  @IsOptional() @ValidateNested() @Type(() => PatientDto) patient?: PatientDto;
  @IsString() @MinLength(2) prescriberName!: string; @IsOptional() @IsString() prescriberLicenceNo?: string;
  @IsDateString() issuedAt!: string;
  @IsOptional() @IsInt() @Min(0) @Max(12) refillsAllowed?: number;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => RxLineDto) lines!: RxLineDto[];
}
class PrescriberDto {
  @IsString() @MinLength(2) name!: string; @IsOptional() @IsString() nameAr?: string; @IsString() @MinLength(3) licenceNo!: string;
  @IsOptional() @IsString() specialty?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsString() clinicName?: string; @IsOptional() @IsString() clinicAddress?: string; @IsOptional() @IsString() notes?: string;
}
class PrescriberPatchDto {
  @IsOptional() @IsString() name?: string; @IsOptional() @IsString() nameAr?: string; @IsOptional() @IsString() specialty?: string; @IsOptional() @IsString() phone?: string; @IsOptional() @IsString() clinicName?: string;
  @IsOptional() @IsString() clinicAddress?: string; @IsOptional() @IsString() notes?: string; @IsOptional() @IsBoolean() active?: boolean;
}
class VerifyDto { @IsBoolean() verified!: boolean; }
class RejectDto { @IsString() @MinLength(3) reason!: string; }
class LineDrugDto { @IsString() drugId!: string; }

@ApiTags("prescriptions")
@ApiBearerAuth()
@Controller("prescriptions")
export class PrescriptionsController {
  constructor(
    @Inject(PrescriptionsService) private readonly svc: PrescriptionsService, @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(RefillsService) private readonly refills: RefillsService, @Inject(RxTransfersService) private readonly transfers: RxTransfersService,
  ) {}

  /** Manual entry (walk-in, phone, handwritten): works with no scan and no Kiorly. */
  @Post("manual") @Perm("rx.intake")
  async manual(@CurrentUser() u: AuthUser, @Body() d: ManualRxDto) { return this.svc.intakePaper(u, { ...d, source: "MANUAL_ENTRY", branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }

  @Get("verification-queue") @Perm("rx.read")
  queue(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.verificationQueue(u.orgId, branchFilter(u, branchId).branchId); }

  @Get("partial") @Perm("rx.read")
  partial(@CurrentUser() u: AuthUser, @Query("branchId") branchId?: string) { return this.svc.partialFills(u.orgId, branchFilter(u, branchId).branchId); }

  @Get("refills/due") @Perm("rx.read")
  due(@CurrentUser() u: AuthUser, @Query() q: { days?: string; branchId?: string }) { return this.refills.due(u.orgId, { days: Math.min(Math.max(Number(q.days ?? 7) || 7, 0), 90), branchId: branchFilter(u, q.branchId).branchId }); }

  @Post("refills/reminders/run") @Perm("rx.refill")
  reminders(@CurrentUser() u: AuthUser, @Query("days") days?: string) { return this.refills.runReminders(u, days ? Number(days) : undefined); }

  @Post("transfer-in") @Perm("rx.transfer")
  async transferIn(@CurrentUser() u: AuthUser, @Body() d: TransferInDto) { const { branchId, ...rest } = d; return this.transfers.in(u, await resolveBranchId(this.prisma, u, branchId), rest); }

  @Get("transfers") @Perm("rx.read")
  transferList(@CurrentUser() u: AuthUser, @Query() q: { direction?: string; branchId?: string; page?: string; pageSize?: string }) { const { skip, take } = pageArgs(q); return this.transfers.list(u.orgId, { direction: q.direction, branchId: branchFilter(u, q.branchId).branchId, skip, take }); }

  @Get("transfers/:id/note.html") @Header("Content-Type", "text/html; charset=utf-8") @Perm("rx.read")
  transferNote(@CurrentUser() u: AuthUser, @Param("id") id: string, @Query("lang") lang?: string) { return this.transfers.noteHtml(u.orgId, id, lang === "en" ? "en" : "ar"); }

  @Post("paper") @Perm("rx.intake")
  async paper(@CurrentUser() u: AuthUser, @Body() d: PaperRxDto) { return this.svc.intakePaper(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }

  @Get() @Perm("rx.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; status?: RxStatus; source?: string; prescriberId?: string; patientId?: string; q?: string; page?: string; pageSize?: string }) {
    const { skip, take } = pageArgs(q);
    return this.svc.list(u.orgId, { ...branchFilter(u, q.branchId), status: q.status, source: q.source, prescriberId: q.prescriberId, patientId: q.patientId, q: q.q, skip, take });
  }

  @Get(":id") @Perm("rx.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Get(":id/balance") @Perm("rx.read")
  balance(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.balance(u.orgId, id); }

  @Get(":id/lines/:lineId/substitutes") @Perm("rx.read")
  async substitutes(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("lineId") lineId: string, @Query("branchId") branchId?: string) { return this.svc.lineSubstitutes(u, id, lineId, await resolveBranchId(this.prisma, u, branchId)); }

  @Get(":id/refills") @Perm("rx.read")
  refillHistory(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.refills.history(u.orgId, id); }

  @Post(":id/refill") @Perm("rx.refill")
  refill(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RefillDto) { return this.refills.refill(u, id, d); }

  @Post(":id/transfer-out") @Perm("rx.transfer")
  transferOut(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: TransferOutDto) { return this.transfers.out(u, id, d); }

  @Patch(":id") @Perm("rx.validate")
  annotate(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: AnnotateDto) { return this.svc.annotate(u, id, d); }

  @Post(":id/validate") @Perm("rx.validate")
  validate(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.validate(u, id); }

  @Post(":id/reject") @Perm("rx.validate")
  reject(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: RejectDto) { return this.svc.reject(u, id, d.reason); }

  @Put(":id/lines/:lineId/drug") @Perm("rx.validate")
  lineDrug(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("lineId") lineId: string, @Body() d: LineDrugDto) { return this.svc.setLineDrug(u, id, lineId, d.drugId); }
}

@ApiTags("prescribers")
@ApiBearerAuth()
@Controller("prescribers")
export class PrescribersController {
  constructor(@Inject(PrescribersService) private readonly svc: PrescribersService) {}
  @Get() @Perm("rx.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { q?: string; verified?: string; page?: string; pageSize?: string }) { const { page, pageSize } = pageArgs(q); return this.svc.list(u.orgId, { q: q.q, verified: q.verified === undefined ? undefined : q.verified === "true", page, pageSize }); }
  @Post() @Perm("rx.intake")
  create(@CurrentUser() u: AuthUser, @Body() d: PrescriberDto) { return this.svc.create(u, d); }
  @Get(":id") @Perm("rx.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }
  @Patch(":id") @Perm("prescriber.manage")
  update(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: PrescriberPatchDto) { return this.svc.update(u, id, d); }
  @Post(":id/verify") @Perm("prescriber.manage")
  verify(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: VerifyDto) { return this.svc.verify(u, id, d.verified); }
}
