import { Body, Controller, Get, Inject, Param, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsDateString, IsIn, IsInt, IsNumberString, IsOptional, IsString, Min, MinLength, ValidateNested } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { DispensingService } from "./dispensing.service";
import { resolveBranchId, branchFilter } from "../../common/branch-scope";
import { PrismaService } from "../../prisma/prisma.service";
import { pageArgs } from "../../common/pagination";

class SubstitutionDto { @IsString() fromDrugId!: string; @IsBoolean() consent!: boolean; }
class ItemDto {
  @IsOptional() @IsString() prescriptionLineId?: string;
  @IsString() drugId!: string;
  @IsInt() @Min(1) quantity!: number;
  @IsOptional() @ValidateNested() @Type(() => SubstitutionDto) substitution?: SubstitutionDto;
}
class CreateDto {
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() prescriptionId?: string;
  @IsOptional() @IsString() kiorexOrderId?: string;
  @IsOptional() @IsString() patientId?: string;
  @IsArray() @ArrayMinSize(1) @ValidateNested({ each: true }) @Type(() => ItemDto) items!: ItemDto[];
}
class OverrideDto { @IsString() @MinLength(5) reason!: string; }
class ControlledIdDto { @IsString() nationalId!: string; @IsString() @MinLength(2) patientName!: string; }
class SignoffDto { @IsOptional() @IsString() counsellingNotes?: string; }
class CancelDto { @IsString() @MinLength(3) reason!: string; }
class PayDto { @IsIn(["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT"]) method!: "CASH" | "CARD" | "INSTAPAY" | "FAWRY" | "WALLET" | "CUSTOMER_CREDIT"; @IsNumberString() amount!: string; @IsOptional() @IsString() walletRef?: string; }
class CompleteDto {
  @IsString() @MinLength(8) idempotencyKey!: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => PayDto) payments?: PayDto[];
  @IsOptional() @IsString() customerAccountId?: string;
}
class RegisterQuery { @IsOptional() @IsString() branchId?: string; @IsOptional() @IsDateString() from?: string; @IsOptional() @IsDateString() to?: string; @IsOptional() page?: string; @IsOptional() pageSize?: string; }

@ApiTags("dispensing")
@ApiBearerAuth()
@Controller()
export class DispensingController {
  constructor(@Inject(DispensingService) private readonly svc: DispensingService, @Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Post("dispensings") @Perm("dispense.create")
  async create(@CurrentUser() u: AuthUser, @Body() d: CreateDto) { return this.svc.create(u, { ...d, branchId: await resolveBranchId(this.prisma, u, d.branchId) }); }

  @Get("dispensings") @Perm("rx.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { branchId?: string; status?: string; page?: string; pageSize?: string }) { const { skip, take } = pageArgs(q); return this.svc.list(u.orgId, { ...branchFilter(u, q.branchId), status: q.status, skip, take }); }

  @Get("dispensings/:id") @Perm("rx.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.get(u.orgId, id); }

  @Post("dispensings/:id/override/:checkId") @Perm("dispense.signoff")
  override(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("checkId") checkId: string, @Body() d: OverrideDto) { return this.svc.override(u, id, checkId, d.reason); }

  @Post("dispensings/:id/controlled-id") @Perm("dispense.create")
  controlledId(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ControlledIdDto) { return this.svc.captureControlledId(u, id, d); }

  @Post("dispensings/:id/signoff") @Perm("dispense.signoff")
  signoff(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: SignoffDto) { return this.svc.signOff(u, id, d.counsellingNotes); }

  @Post("dispensings/:id/repick") @Perm("dispense.create")
  repick(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.repick(u, id); }

  @Post("dispensings/:id/cancel") @Perm("dispense.create")
  cancel(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CancelDto) { return this.svc.cancel(u, id, d.reason); }

  @Post("dispensings/:id/complete") @Perm("dispense.complete")
  complete(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CompleteDto) { return this.svc.complete(u, id, d); }

  @Get("controlled-register") @Perm("controlled.read")
  register(@CurrentUser() u: AuthUser, @Query() q: RegisterQuery) { const { skip, take } = pageArgs(q); return this.svc.controlledRegister(u.orgId, { ...branchFilter(u, q.branchId), from: q.from ? new Date(q.from) : undefined, to: q.to ? new Date(q.to) : undefined, skip, take }); }
}
