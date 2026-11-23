import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMaxSize, IsArray, IsBoolean, IsEmail, IsIn, IsInt, IsNumber, IsNumberString, IsOptional, IsString, Matches, Max, Min, MaxLength, MinLength, ValidateIf, ValidateNested } from "class-validator";
import { PrismaService } from "../prisma/prisma.service";
import { CurrentUser, Perm, Public } from "../auth/decorators";
import type { AuthUser } from "../auth/auth-user";
import { hashPassword } from "../auth/password";
import { AuditService } from "../audit/audit.service";
import { KERNEL, type EntitlementsPort, type MarketPackPort } from "../kernel-adapter/ports";
import { DomainError, conflict, notFound } from "../common/errors";
import { RequiresFlag, RequiresFlagGuard } from "../feature-flags/requires-flag.guard";
import { StaffRole } from "../generated/prisma/client";
import { normalizePhone } from "../auth/passport";
import { PassportSessions } from "../auth/passport-sessions.service";
import { effectiveOrgDefault, type SignInDefaultMethod } from "../auth/sign-in-default";
import { tenantLinkedToKiorex } from "../auth/sign-in-config";

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
  /** E.164 (spaces/dashes tolerated); links this staff row to the person's Kiorex Passport on first Passport sign-in. */
  @IsOptional() @IsString() @MaxLength(32) phone?: string;
}
class StaffPatchDto {
  @IsOptional() @IsString() displayName?: string;
  @IsOptional() @IsIn(Object.values(StaffRole)) role?: StaffRole;
  @IsOptional() @IsString() branchId?: string;
  @IsOptional() @IsString() pharmacistLicenceNo?: string;
  @IsOptional() @IsBoolean() active?: boolean;
  @IsOptional() @IsString() @MinLength(8) password?: string;
  /** E.164, or null / "" to clear. */
  @IsOptional() @ValidateIf((_o, v) => v !== null) @IsString() @MaxLength(32) phone?: string | null;
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
  @IsOptional() @IsNumber() @Min(0) @Max(100) costVarianceTolerancePct?: number;
  @IsOptional() @IsInt() @Min(0) @Max(365) customerCreditDays?: number;
  @IsOptional() @IsNumberString() vatRate?: string;
  @IsOptional() @IsNumberString() shiftVarianceThreshold?: string;
  @IsOptional() @IsString() ownerPhone?: string;
  @IsOptional() @IsString() ownerEmail?: string;
  @IsOptional() @IsIn(["ar", "en"]) defaultLocale?: "ar" | "en";
  @IsOptional() @IsString() receiptFooter?: string;
  /** Preselected sign-in method on the login page (both stay offered); null = automatic. Stored in its own column, not in the settings JSON. */
  @IsOptional() @ValidateIf((_o, v) => v !== null) @IsIn(["PASSWORD", "PASSPORT"]) defaultSignInMethod?: SignInDefaultMethod | null;
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
    @Inject(PassportSessions) private readonly sessions: PassportSessions,
  ) {}

  /** Staff phone: strict E.164 (formatting characters tolerated), unique inside the tenant. Returns null for "clear". Never logged. */
  private async cleanPhone(orgId: string, raw: string | null | undefined, exceptId?: string): Promise<string | null> {
    if (raw === null || raw === undefined || raw.trim() === "") return null;
    const phone = normalizePhone(raw);
    if (!phone) throw new DomainError("INVALID_PHONE", "Phone must be in international format, e.g. +201000002004", 400);
    const clash = await this.prisma.staffUser.findFirst({ where: { orgId, phone, ...(exceptId ? { id: { not: exceptId } } : {}) }, select: { id: true } });
    if (clash) throw conflict("PHONE_TAKEN", "Another staff member already uses this phone number");
    return phone;
  }

  /** Self-serve onboarding (Lite). `pharmacy.module` OFF => no new sign-ups (KX-08 §09). */
  @Post("onboarding/signup")
  @Public()
  @UseGuards(RequiresFlagGuard)
  @RequiresFlag("pharmacy.module")
  async signup(@Body() dto: SignupDto) {
    if (await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } })) throw conflict("EMAIL_TAKEN", "Email already registered");
    const passwordHash = await hashPassword(dto.password);
    const r = await this.prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: dto.pharmacyName, marketCode: dto.marketCode ?? "EG", edition: "LITE", settings: { mode: "STANDALONE" } } });
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
    return rows.map(({ passwordHash: _p, subject, ...s }) => ({ ...s, passportLinked: !!subject }));
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
    const phone = await this.cleanPhone(u.orgId, dto.phone);
    const s = await this.prisma.staffUser.create({
      data: { orgId: u.orgId, displayName: dto.displayName, email: dto.email.toLowerCase(), passwordHash: await hashPassword(dto.password), role: dto.role, branchId: dto.branchId, pharmacistLicenceNo: dto.pharmacistLicenceNo, phone },
    });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.create", entityType: "StaffUser", entityId: s.id, meta: { role: dto.role, linkKeySet: !!phone } });
    const { passwordHash: _p, subject, ...out } = s;
    return { ...out, passportLinked: !!subject };
  }

  @Patch("staff/:id")
  @Perm("staff.manage")
  async patchStaff(@CurrentUser() u: AuthUser, @Param("id") id: string, @Body() dto: StaffPatchDto) {
    const s = await this.prisma.staffUser.findFirst({ where: { id, orgId: u.orgId } });
    if (!s) throw notFound("Staff", id);
    if (id === u.userId && ((dto.active === false) || (dto.role && dto.role !== s.role))) throw conflict("CANNOT_CHANGE_SELF", "You cannot deactivate yourself or change your own role");
    const role = dto.role ?? s.role;
    const lic = dto.pharmacistLicenceNo ?? s.pharmacistLicenceNo;
    if (role === "PHARMACIST" && !lic) throw new DomainError("LICENCE_REQUIRED", "Pharmacists need a syndicate licence number", 400);
    if (dto.branchId && !(await this.prisma.branch.findFirst({ where: { id: dto.branchId, orgId: u.orgId } }))) throw notFound("Branch", dto.branchId);
    const { password, phone: rawPhone, ...rest } = dto;
    const phoneChange = rawPhone !== undefined ? { phone: await this.cleanPhone(u.orgId, rawPhone, id) } : {};
    let r;
    try {
      r = await this.prisma.staffUser.update({ where: { id }, data: { ...rest, ...phoneChange, ...(password ? { passwordHash: await hashPassword(password) } : {}) } });
    } catch (e) {
      if ((e as { code?: string }).code === "P2002") throw conflict("PHONE_TAKEN", "Another staff member already uses this phone number");
      throw e;
    }
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.update", entityType: "StaffUser", entityId: id, meta: { fields: Object.keys(dto).filter((k) => k !== "password" && k !== "phone"), passwordChanged: !!password, linkKeyChanged: rawPhone !== undefined } });
    // deactivating a staff member ends their Kiorex Passport web sessions straight away
    if (dto.active === false && s.active) await this.sessions.revokeForStaff(id, "staff_deactivated");
    const { passwordHash: _p, subject, ...out } = r;
    return { ...out, passportLinked: !!subject };
  }

  @Get("settings")
  @Perm("settings.read")
  async settings(@CurrentUser() u: AuthUser) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const pack = this.packs.get(t.marketCode, null);
    const linkedToKiorex = await tenantLinkedToKiorex(this.prisma, t);
    return { name: t.name, edition: t.edition, market: t.marketCode, subscriptionStatus: t.subscriptionStatus, pack, settings: t.settings ?? {}, defaultSignInMethod: t.defaultSignInMethod, effectiveSignInMethod: effectiveOrgDefault({ stored: t.defaultSignInMethod, linkedToKiorex }), linkedToKiorex };
  }

  @Patch("settings")
  @Perm("settings.write")
  async patchSettings(@CurrentUser() u: AuthUser, @Body() dto: SettingsDto) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    const { defaultSignInMethod, ...json } = dto;
    const settings = { ...((t.settings as object | null) ?? {}), ...json };
    await this.prisma.tenant.update({ where: { id: u.orgId }, data: { settings: JSON.parse(JSON.stringify(settings)), ...(defaultSignInMethod !== undefined ? { defaultSignInMethod } : {}) } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "settings.update", entityType: "Tenant", entityId: u.orgId, meta: { fields: Object.keys(dto) } });
    if (defaultSignInMethod !== undefined && defaultSignInMethod !== t.defaultSignInMethod) await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "settings.default_signin_method", entityType: "Tenant", entityId: u.orgId, meta: { from: t.defaultSignInMethod, to: defaultSignInMethod } });
    return settings;
  }

  @Get("plans")
  @Perm("settings.read")
  async plan(@CurrentUser() u: AuthUser) {
    const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
    return { edition: t.edition };
  }
}
