import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsIn, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Matches, Max, Min, MinLength, ValidateNested } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Perm, Public } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { hashPassword } from "../auth/password";
import { AuditService } from "../audit/audit.service";
import { KERNEL, type EntitlementsPort, type MarketPackPort } from "../kernel-adapter/ports";
import { DomainError, conflict, notFound } from "../common/errors";
import { RequiresFlag, RequiresFlagGuard } from "../feature-flags/requires-flag.guard";
import { StaffRole } from "@prisma/client";

class BranchDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() code?: string;
  @IsOptional() @IsString() licenceNo?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
}
class BranchPatchDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() licenceNo?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsBoolean() active?: boolean;
}
class StaffDto {
  @IsString() @MinLength(2) displayName!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsIn(Object.values(StaffRole)) role!: StaffRole;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() pharmacistLicenceNo?: string;
}
class StaffPatchDto {
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsIn(Object.values(StaffRole)) role?: StaffRole;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() pharmacistLicenceNo?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsString() @MinLength(8) password?: string;
}
class ReceiptSettingsDto {
  @IsOptional() @IsString() header?: string; @IsOptional() @IsString() footer?: string; @IsOptional() @IsBoolean() showVat?: boolean; @IsOptional() @IsBoolean() showLicence?: boolean;
  @IsOptional() @IsIn(["80mm", "a4"]) paper?: "80mm" | "a4"; @IsOptional() @IsString() logoText?: string;
}
class PrinterDto { @IsString() id!: string; @IsString() name!: string; @IsIn(["RECEIPT", "LABEL", "A4"]) kind!: "RECEIPT" | "LABEL" | "A4"; @IsOptional() @IsString() paper?: string; @IsOptional() @IsString() note?: string; }
class TaxRateDto { @IsString() @MinLength(1) code!: string; @IsString() @MinLength(1) label!: string; @IsNumberString() rate!: string; }
class TierDto { @IsString() name!: string; @IsNumberString() minSpend!: string; }
class LoyaltyDto {
  @IsOptional() @IsBoolean() enabled?: boolean; @IsOptional() @IsNumberString() earnPer?: string; @IsOptional() @IsInt() @Min(1) pointsPerEarn?: number; @IsOptional() @IsNumberString() redeemValue?: string;
  @IsOptional() @IsArray() @ArrayMaxSize(8) @ValidateNested({ each: true }) @Type(() => TierDto) tiers?: TierDto[];
}
class SettingsDto {
  @IsOptional() @IsIn(["STANDALONE", "INTEGRATED"]) mode?: "STANDALONE" | "INTEGRATED";
  @IsOptional() @Matches(/^[A-Z]{3}$/) currency?: string;
  @IsOptional() @IsArray() @IsIn(["ar", "en"], { each: true }) languages?: Array<"ar" | "en">;
  @IsOptional() @ValidateNested() @Type(() => ReceiptSettingsDto) receipt?: ReceiptSettingsDto;
  @IsOptional() @IsArray() @ArrayMaxSize(10) @ValidateNested({ each: true }) @Type(() => PrinterDto) printers?: PrinterDto[];
  @IsOptional() @IsArray() @ArrayMaxSize(10) @ValidateNested({ each: true }) @Type(() => TaxRateDto) taxRates?: TaxRateDto[];
  @IsOptional() @ValidateNested() @Type(() => LoyaltyDto) loyalty?: LoyaltyDto;
  @IsOptional() @IsNumber() @Min(0) @Max(100) maxCashierDiscountPct?: number;
  @IsOptional() @IsInt() @Min(0) @Max(30) refillReminderDays?: number;
  @IsOptional() @IsNumberString() vatRate?: string;
  @IsOptional() @IsNumberString() shiftVarianceThreshold?: string;
  @IsOptional() @IsString() ownerPhone?: string;
  @IsOptional() @IsString() ownerEmail?: string;
  @IsOptional() @IsIn(["ar", "en"]) defaultLocale?: "ar" | "en";
  @IsOptional() @IsString() receiptFooter?: string;
}
class SignupDto {
  @IsString() @MinLength(2) pharmacyName!: string;
  @IsString() @MinLength(2) ownerName!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
  @IsOptional() @IsString() branchName?: string;
  @IsOptional() @IsString() pharmacistLicenceNo?: string;
  @IsOptional() @IsString() marketCode?: string;
}

@ApiTags("tenancy")
@ApiBearerAuth()
@Controller()
export class TenancyController {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(KERNEL.entitlements) private readonly ent: EntitlementsPort,
    @Inject(KERNEL.marketPacks) private readonly packs: MarketPackPort,
  ) {}

  /** Self-serve onboarding (Lite). `pharmacy.module` OFF => no new sign-ups (KX-08 §09). */
  @Post("onboarding/signup")
  @Public()
  @UseGuards(RequiresFlagGuard)
  @RequiresFlag("pharmacy.module")
  async signup(@Body() dto: SignupDto) {
    if (await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } })) throw conflict("EMAIL_TAKEN", "Email already registered");
    const passwordHash = await hashPassword(dto.password);
    const r = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: dto.pharmacyName, marketCode: dto.marketCode ?? "EG", edition: "LITE" } });
      const branch = await tx.branch.create({ data: { orgId: tenant.id, name: dto.branchName ?? dto.pharmacyName, code: "B1" } });
      const owner = await tx.staffUser.create({
        data: { orgId: tenant.id, displayName: dto.ownerName, email: dto.email.toLowerCase(), passwordHash, role: "OWNER", pharmacistLicenceNo: dto.pharmacistLicenceNo },
      });
      await this.audit.record({ orgId: tenant.id, actorId: owner.id, action: "tenant.signup", entityType: "Tenant", entityId: tenant.id }, tx);
      return { tenantId: tenant.id, branchId: branch.id, ownerId: owner.id };
    });
    return r;
  }

  @Post("onboarding/complete")
  @Perm("settings.write")
  async completeOnboarding(@CurrentUser() u: AuthUser) {
    await this.prisma.tenant.update({ where: { id: u.orgId }, data: { onboardedAt: new Date() } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "tenant.onboarding_complete", entityType: "Tenant", entityId: u.orgId });
    return { ok: true };
  }

  @Get("branches")
  @Perm("settings.read")
  branches(@CurrentUser() u: AuthUser) {
    return this.prisma.branch.findMany({ where: { orgId: u.orgId }, orderBy: { name: "asc" } });
  }

  @Post("branches")
  @Perm("settings.write")
  async createBranch(@CurrentUser() u: AuthUser, @Body() dto: BranchDto) {
    const count = await this.prisma.branch.count({ where: { orgId: u.orgId, active: true } });
    const over = await this.ent.checkLimit(u.orgId, "branches", count + 1);
    if (over) throw new DomainError("PLAN_LIMIT", `Your plan allows ${over.limit} branch(es)`, 402, over);
    const b = await this.prisma.branch.create({ data: { orgId: u.orgId, ...dto } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "branch.create", entityType: "Branch", entityId: b.id });
    return b;
  }

  @Patch("branches/:id")
  @Perm("settings.write")
  async patchBranch(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() dto: BranchPatchDto) {
    const b = await this.prisma.branch.findFirst({ where: { id, orgId: u.orgId } });
    if (!b) throw notFound("Branch", id);
    const r = await this.prisma.branch.update({ where: { id }, data: dto });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "branch.update", entityType: "Branch", entityId: id, meta: { fields: Object.keys(dto) } });
    return r;
  }

  @Get("staff")
  @Perm("staff.manage")
  async staff(@CurrentUser() u: AuthUser) {
    const rows = await this.prisma.staffUser.findMany({ where: { orgId: u.orgId }, orderBy: { displayName: "asc" } });
    return rows.map(({ passwordHash: _p, ...s }) => s);
  }

  @Post("staff")
  @Perm("staff.manage")
  async createStaff(@CurrentUser() u: AuthUser, @Body() dto: StaffDto) {
    if (dto.role === "PHARMACIST" && !dto.pharmacistLicenceNo) throw new DomainError("LICENCE_REQUIRED", "Pharmacists need a syndicate licence number", 400);
    const count = await this.prisma.staffUser.count({ where: { orgId: u.orgId, active: true } });
    const over = await this.ent.checkLimit(u.orgId, "users", count + 1);
    if (over) throw new DomainError("PLAN_LIMIT", `Your plan allows ${over.limit} users`, 402, over);
    if (dto.branchId && !(await this.prisma.branch.findFirst({ where: { id: dto.branchId, orgId: u.orgId } }))) throw notFound("Branch", dto.branchId);
    if (await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } })) throw conflict("EMAIL_TAKEN", "Email already registered");
    const s = await this.prisma.staffUser.create({
      data: { orgId: u.orgId, displayName: dto.displayName, email: dto.email.toLowerCase(), passwordHash: await hashPassword(dto.password), role: dto.role, branchId: dto.branchId, pharmacistLicenceNo: dto.pharmacistLicenceNo },
    });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.create", entityType: "StaffUser", entityId: s.id, meta: { role: dto.role } });
    const { passwordHash: _p, ...out } = s;
    return out;
  }

  @Patch("staff/:id")
  @Perm("staff.manage")
  async patchStaff(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() dto: StaffPatchDto) {
    const s = await this.prisma.staffUser.findFirst({ where: { id, orgId: u.orgId } });
    if (!s) throw notFound("Staff", id);
    const { password, ...rest } = dto;
    const r = await this.prisma.staffUser.update({ where: { id }, data: { ...rest, ...(password ? { passwordHash: await hashPassword(password) } : {}) } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.update", entityType: "StaffUser", entityId: id, meta: { fields: Object.keys(dto).filter((k) => k !== "password"), passwordChanged: !!password } });
    const { passwordHash: _p, ...out } = r;
    return out;
  }

  @Get("settings")
  @Perm("settings.read")
  async settings(@CurrentUser() u: AuthUser) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const pack = this.packs.get(t.marketCode, null);
    return { name: t.name, edition: t.edition, market: t.marketCode, subscriptionStatus: t.subscriptionStatus, pack, settings: t.settings ?? {} };
  }

  @Patch("settings")
  @Perm("settings.write")
  async patchSettings(@CurrentUser() u: AuthUser, @Body() dto: SettingsDto) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const settings = { ...((t.settings as object | null) ?? {}), ...dto };
    await this.prisma.tenant.update({ where: { id: u.orgId }, data: { settings } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "settings.update", entityType: "Tenant", entityId: u.orgId, meta: { fields: Object.keys(dto) } });
    return settings;
  }

  @Get("plans")
  @Perm("settings.read")
  async plan(@CurrentUser() u: AuthUser) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    return { edition: t.edition };
  }
}
