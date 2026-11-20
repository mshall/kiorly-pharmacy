import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, Put, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDateString, IsEmail, IsIn, IsInt, IsNumberString, IsOptional, IsString, MinLength } from "class-validator";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { CustomerRegistryService } from "./customer-registry.service";
import { pageArgs } from "../../common/pagination";

class CustomerDto {
  @IsString() @MinLength(2) displayName!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsIn(["F", "M"]) gender?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) allergies?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) chronicConditions?: string[];
  @IsOptional() @IsString() medicalNotes?: string;
  @IsOptional() @IsBoolean() pregnant?: boolean;
  @IsOptional() @IsBoolean() lactating?: boolean;
  @IsOptional() @IsBoolean() renalImpairment?: boolean;
  @IsOptional() @IsBoolean() hepaticImpairment?: boolean;
  @IsOptional() @IsNumberString() weightKg?: string;
  @IsOptional() @IsString() nationalId?: string;
  @IsOptional() @IsBoolean() consentDataProcessing?: boolean;
  @IsOptional() @IsBoolean() consentMarketing?: boolean;
  @IsOptional() @IsBoolean() force?: boolean;
}
class CustomerPatchDto {
  @IsOptional() @IsString() @MinLength(2) displayName?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsIn(["F", "M"]) gender?: string;
  @IsOptional() @IsDateString() dateOfBirth?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsArray() @IsString({ each: true }) allergies?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) chronicConditions?: string[];
  @IsOptional() @IsString() medicalNotes?: string;
  @IsOptional() @IsBoolean() pregnant?: boolean;
  @IsOptional() @IsBoolean() lactating?: boolean;
  @IsOptional() @IsBoolean() renalImpairment?: boolean;
  @IsOptional() @IsBoolean() hepaticImpairment?: boolean;
  @IsOptional() @IsNumberString() weightKg?: string;
  @IsOptional() @IsString() nationalId?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
class NoteDto { @IsString() @MinLength(1) body!: string; @IsOptional() @IsIn(["NOTE", "COUNSELLING", "COMPLAINT"]) kind?: string; }
class FamilyDto { @IsString() relatedPatientId!: string; @IsString() @MinLength(2) relation!: string; }
class ConsentDto { @IsBoolean() dataProcessing!: boolean; @IsBoolean() marketing!: boolean; }
class CreditDto { @IsNumberString() creditLimit!: string; }
class PointsDto { @IsInt() points!: number; @IsString() @MinLength(3) note!: string; }
class MergeDto { @IsString() sourceId!: string; }

@ApiTags("customers")
@ApiBearerAuth()
@Controller("customers")
export class CustomersController {
  constructor(@Inject(CustomerRegistryService) private readonly svc: CustomerRegistryService) {}

  @Get() @Perm("customer.read")
  list(@CurrentUser() u: AuthUser, @Query() q: { q?: string; page?: string; pageSize?: string; inactive?: string; credit?: string; allergies?: string }) {
    const { page, pageSize } = pageArgs(q);
    return this.svc.search(u.orgId, { q: q.q, page, pageSize, includeInactive: q.inactive === "true", withCredit: q.credit === "true", withAllergies: q.allergies === "true" });
  }
  @Post() @Perm("customer.write")
  create(@CurrentUser() u: AuthUser, @Body() d: CustomerDto) { const { force, ...rest } = d; return this.svc.create(u, rest, { force }); }
  @Get("duplicates") @Perm("customer.merge")
  duplicates(@CurrentUser() u: AuthUser) { return this.svc.duplicates(u.orgId); }
  @Get(":id") @Perm("customer.read")
  get(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.profile(u.orgId, id); }
  @Patch(":id") @Perm("customer.write")
  patch(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CustomerPatchDto) { return this.svc.update(u, id, d); }
  @Get(":id/history") @Perm("customer.read")
  history(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.history(u.orgId, id); }
  @Get(":id/notes") @Perm("customer.read")
  notes(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.notes(u.orgId, id); }
  @Post(":id/notes") @Perm("customer.write")
  addNote(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: NoteDto) { return this.svc.addNote(u, id, d); }
  @Get(":id/family") @Perm("customer.read")
  family(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.family(u.orgId, id); }
  @Post(":id/family") @Perm("customer.write")
  addFamily(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: FamilyDto) { return this.svc.addFamily(u, id, d); }
  @Delete(":id/family/:linkId") @Perm("customer.write")
  removeFamily(@CurrentUser() u: AuthUser, @Param("id") id: string, @Param("linkId") linkId: string) { return this.svc.removeFamily(u, id, linkId); }
  @Put(":id/consent") @Perm("customer.write")
  consent(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: ConsentDto) { return this.svc.setConsent(u, id, d); }
  @Post(":id/credit-account") @Perm("customer.credit", "pos.refund_approve")
  credit(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: CreditDto) { return this.svc.openCreditAccount(u, id, d.creditLimit); }
  @Get(":id/loyalty") @Perm("customer.read")
  loyalty(@CurrentUser() u: AuthUser, @Param("id") id: string) { return this.svc.loyalty(u.orgId, id); }
  @Post(":id/loyalty/adjust") @Perm("loyalty.manage")
  adjust(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: PointsDto) { return this.svc.adjustLoyalty(u, id, d); }
  @Post(":id/merge") @Perm("customer.merge")
  merge(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() d: MergeDto) { return this.svc.merge(u, id, d.sourceId); }
}
