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
exports.TenancyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("../auth/decorators");
const password_1 = require("../auth/password");
const audit_service_1 = require("../audit/audit.service");
const ports_1 = require("../kernel-adapter/ports");
const errors_1 = require("../common/errors");
const requires_flag_guard_1 = require("../feature-flags/requires-flag.guard");
const client_1 = require("../generated/prisma/client");
const passport_1 = require("../auth/passport");
const passport_sessions_service_1 = require("../auth/passport-sessions.service");
const token_verifier_1 = require("../auth/token-verifier");
const sign_in_default_1 = require("../auth/sign-in-default");
const sign_in_config_1 = require("../auth/sign-in-config");
class BranchDto {
    name;
    code;
    licenceNo;
    address;
    phone;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], BranchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "licenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "phone", void 0);
class BranchPatchDto {
    name;
    licenceNo;
    address;
    phone;
    active;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchPatchDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchPatchDto.prototype, "licenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchPatchDto.prototype, "address", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], BranchPatchDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BranchPatchDto.prototype, "active", void 0);
class StaffDto {
    displayName;
    email;
    password;
    role;
    branchId;
    pharmacistLicenceNo;
    phone;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], StaffDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], StaffDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], StaffDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsIn)(Object.values(client_1.StaffRole)),
    __metadata("design:type", String)
], StaffDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffDto.prototype, "pharmacistLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", String)
], StaffDto.prototype, "phone", void 0);
class StaffPatchDto {
    displayName;
    role;
    branchId;
    pharmacistLicenceNo;
    active;
    password;
    phone;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffPatchDto.prototype, "displayName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(Object.values(client_1.StaffRole)),
    __metadata("design:type", String)
], StaffPatchDto.prototype, "role", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffPatchDto.prototype, "branchId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], StaffPatchDto.prototype, "pharmacistLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], StaffPatchDto.prototype, "active", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], StaffPatchDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_o, v) => v !== null),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(32),
    __metadata("design:type", Object)
], StaffPatchDto.prototype, "phone", void 0);
class ReceiptSettingsDto {
    header;
    footer;
    showVat;
    showLicence;
    paper;
    logoText;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptSettingsDto.prototype, "header", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptSettingsDto.prototype, "footer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReceiptSettingsDto.prototype, "showVat", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], ReceiptSettingsDto.prototype, "showLicence", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["80mm", "a4"]),
    __metadata("design:type", String)
], ReceiptSettingsDto.prototype, "paper", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ReceiptSettingsDto.prototype, "logoText", void 0);
class PrinterDto {
    id;
    name;
    kind;
    paper;
    note;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrinterDto.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrinterDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsIn)(["RECEIPT", "LABEL", "A4"]),
    __metadata("design:type", String)
], PrinterDto.prototype, "kind", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrinterDto.prototype, "paper", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PrinterDto.prototype, "note", void 0);
class TaxRateDto {
    code;
    label;
    rate;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], TaxRateDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], TaxRateDto.prototype, "label", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], TaxRateDto.prototype, "rate", void 0);
class TierDto {
    name;
    minSpend;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TierDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], TierDto.prototype, "minSpend", void 0);
class LoyaltyDto {
    enabled;
    earnPer;
    pointsPerEarn;
    redeemValue;
    tiers;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], LoyaltyDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], LoyaltyDto.prototype, "earnPer", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], LoyaltyDto.prototype, "pointsPerEarn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], LoyaltyDto.prototype, "redeemValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(8),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TierDto),
    __metadata("design:type", Array)
], LoyaltyDto.prototype, "tiers", void 0);
class SettingsDto {
    mode;
    currency;
    languages;
    receipt;
    printers;
    taxRates;
    loyalty;
    maxCashierDiscountPct;
    refillReminderDays;
    costVarianceTolerancePct;
    customerCreditDays;
    vatRate;
    shiftVarianceThreshold;
    ownerPhone;
    ownerEmail;
    defaultLocale;
    receiptFooter;
    defaultSignInMethod;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["STANDALONE", "INTEGRATED"]),
    __metadata("design:type", String)
], SettingsDto.prototype, "mode", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.Matches)(/^[A-Z]{3}$/),
    __metadata("design:type", String)
], SettingsDto.prototype, "currency", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsIn)(["ar", "en"], { each: true }),
    __metadata("design:type", Array)
], SettingsDto.prototype, "languages", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => ReceiptSettingsDto),
    __metadata("design:type", ReceiptSettingsDto)
], SettingsDto.prototype, "receipt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PrinterDto),
    __metadata("design:type", Array)
], SettingsDto.prototype, "printers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ArrayMaxSize)(10),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TaxRateDto),
    __metadata("design:type", Array)
], SettingsDto.prototype, "taxRates", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => LoyaltyDto),
    __metadata("design:type", LoyaltyDto)
], SettingsDto.prototype, "loyalty", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SettingsDto.prototype, "maxCashierDiscountPct", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(30),
    __metadata("design:type", Number)
], SettingsDto.prototype, "refillReminderDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(100),
    __metadata("design:type", Number)
], SettingsDto.prototype, "costVarianceTolerancePct", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(365),
    __metadata("design:type", Number)
], SettingsDto.prototype, "customerCreditDays", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "vatRate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "shiftVarianceThreshold", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "ownerPhone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "ownerEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["ar", "en"]),
    __metadata("design:type", String)
], SettingsDto.prototype, "defaultLocale", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SettingsDto.prototype, "receiptFooter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateIf)((_o, v) => v !== null),
    (0, class_validator_1.IsIn)(["PASSWORD", "PASSPORT"]),
    __metadata("design:type", Object)
], SettingsDto.prototype, "defaultSignInMethod", void 0);
class SignupDto {
    pharmacyName;
    ownerName;
    email;
    password;
    branchName;
    pharmacistLicenceNo;
    marketCode;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], SignupDto.prototype, "pharmacyName", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], SignupDto.prototype, "ownerName", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(8),
    __metadata("design:type", String)
], SignupDto.prototype, "password", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupDto.prototype, "branchName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SignupDto.prototype, "pharmacistLicenceNo", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z]{2}$/, { message: "marketCode must be a two-letter country code" }),
    __metadata("design:type", String)
], SignupDto.prototype, "marketCode", void 0);
let TenancyController = class TenancyController {
    prisma;
    audit;
    ent;
    packs;
    sessions;
    tokens;
    constructor(prisma, audit, ent, packs, sessions, tokens) {
        this.prisma = prisma;
        this.audit = audit;
        this.ent = ent;
        this.packs = packs;
        this.sessions = sessions;
        this.tokens = tokens;
    }
    async cleanPhone(orgId, raw, exceptId) {
        if (raw === null || raw === undefined || raw.trim() === "")
            return null;
        const phone = (0, passport_1.normalizePhone)(raw);
        if (!phone)
            throw new errors_1.DomainError("INVALID_PHONE", "Phone must be in international format, e.g. +201000002004", 400);
        const clash = await this.prisma.staffUser.findFirst({ where: { orgId, phone, ...(exceptId ? { id: { not: exceptId } } : {}) }, select: { id: true } });
        if (clash)
            throw (0, errors_1.conflict)("PHONE_TAKEN", "Another staff member already uses this phone number");
        return phone;
    }
    async signup(dto) {
        if (await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } }))
            throw (0, errors_1.conflict)("EMAIL_TAKEN", "Email already registered");
        const passwordHash = await (0, password_1.hashPassword)(dto.password);
        const r = await this.prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({ data: { name: dto.pharmacyName, marketCode: (dto.marketCode ?? "EG").toUpperCase(), edition: "LITE", settings: { mode: "STANDALONE" } } });
            const branch = await tx.branch.create({ data: { orgId: tenant.id, name: dto.branchName ?? dto.pharmacyName, code: "B1" } });
            const owner = await tx.staffUser.create({
                data: { orgId: tenant.id, displayName: dto.ownerName, email: dto.email.toLowerCase(), passwordHash, role: "OWNER", pharmacistLicenceNo: dto.pharmacistLicenceNo },
            });
            await this.audit.record({ orgId: tenant.id, actorId: owner.id, action: "tenant.signup", entityType: "Tenant", entityId: tenant.id }, tx);
            return { tenantId: tenant.id, branchId: branch.id, ownerId: owner.id };
        });
        return { ...r, ownerClaim: await this.tokens.issueOwnerClaim(r.ownerId) };
    }
    async completeOnboarding(u) {
        await this.prisma.tenant.update({ where: { id: u.orgId }, data: { onboardedAt: new Date() } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "tenant.onboarding_complete", entityType: "Tenant", entityId: u.orgId });
        return { ok: true };
    }
    branches(u) {
        return this.prisma.branch.findMany({ where: { orgId: u.orgId }, orderBy: { name: "asc" } });
    }
    async createBranch(u, dto) {
        const count = await this.prisma.branch.count({ where: { orgId: u.orgId, active: true } });
        const over = await this.ent.checkLimit(u.orgId, "branches", count + 1);
        if (over)
            throw new errors_1.DomainError("PLAN_LIMIT", `Your plan allows ${over.limit} branch(es)`, 402, over);
        const b = await this.prisma.branch.create({ data: { orgId: u.orgId, ...dto } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "branch.create", entityType: "Branch", entityId: b.id });
        return b;
    }
    async patchBranch(u, id, dto) {
        const b = await this.prisma.branch.findFirst({ where: { id, orgId: u.orgId } });
        if (!b)
            throw (0, errors_1.notFound)("Branch", id);
        const r = await this.prisma.branch.update({ where: { id }, data: dto });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "branch.update", entityType: "Branch", entityId: id, meta: { fields: Object.keys(dto) } });
        return r;
    }
    async staff(u) {
        const rows = await this.prisma.staffUser.findMany({ where: { orgId: u.orgId }, orderBy: { displayName: "asc" } });
        return rows.map(({ passwordHash: _p, subject, ...s }) => ({ ...s, passportLinked: !!subject }));
    }
    async createStaff(u, dto) {
        if (dto.role === "PHARMACIST" && !dto.pharmacistLicenceNo)
            throw new errors_1.DomainError("LICENCE_REQUIRED", "Pharmacists need a syndicate licence number", 400);
        const count = await this.prisma.staffUser.count({ where: { orgId: u.orgId, active: true } });
        const over = await this.ent.checkLimit(u.orgId, "users", count + 1);
        if (over)
            throw new errors_1.DomainError("PLAN_LIMIT", `Your plan allows ${over.limit} users`, 402, over);
        if (dto.branchId && !(await this.prisma.branch.findFirst({ where: { id: dto.branchId, orgId: u.orgId } })))
            throw (0, errors_1.notFound)("Branch", dto.branchId);
        if (await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } }))
            throw (0, errors_1.conflict)("EMAIL_TAKEN", "Email already registered");
        const phone = await this.cleanPhone(u.orgId, dto.phone);
        const s = await this.prisma.staffUser.create({
            data: { orgId: u.orgId, displayName: dto.displayName, email: dto.email.toLowerCase(), passwordHash: await (0, password_1.hashPassword)(dto.password), role: dto.role, branchId: dto.branchId, pharmacistLicenceNo: dto.pharmacistLicenceNo, phone },
        });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.create", entityType: "StaffUser", entityId: s.id, meta: { role: dto.role, linkKeySet: !!phone } });
        const { passwordHash: _p, subject, ...out } = s;
        return { ...out, passportLinked: !!subject };
    }
    async patchStaff(u, id, dto) {
        const s = await this.prisma.staffUser.findFirst({ where: { id, orgId: u.orgId } });
        if (!s)
            throw (0, errors_1.notFound)("Staff", id);
        if (id === u.userId && ((dto.active === false) || (dto.role && dto.role !== s.role)))
            throw (0, errors_1.conflict)("CANNOT_CHANGE_SELF", "You cannot deactivate yourself or change your own role");
        const role = dto.role ?? s.role;
        const lic = dto.pharmacistLicenceNo ?? s.pharmacistLicenceNo;
        if (role === "PHARMACIST" && !lic)
            throw new errors_1.DomainError("LICENCE_REQUIRED", "Pharmacists need a syndicate licence number", 400);
        if (dto.branchId && !(await this.prisma.branch.findFirst({ where: { id: dto.branchId, orgId: u.orgId } })))
            throw (0, errors_1.notFound)("Branch", dto.branchId);
        const { password, phone: rawPhone, ...rest } = dto;
        const phoneChange = rawPhone !== undefined ? { phone: await this.cleanPhone(u.orgId, rawPhone, id) } : {};
        let r;
        try {
            r = await this.prisma.staffUser.update({ where: { id }, data: { ...rest, ...phoneChange, ...(password ? { passwordHash: await (0, password_1.hashPassword)(password) } : {}) } });
        }
        catch (e) {
            if (e.code === "P2002")
                throw (0, errors_1.conflict)("PHONE_TAKEN", "Another staff member already uses this phone number");
            throw e;
        }
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "staff.update", entityType: "StaffUser", entityId: id, meta: { fields: Object.keys(dto).filter((k) => k !== "password" && k !== "phone"), passwordChanged: !!password, linkKeyChanged: rawPhone !== undefined } });
        if (dto.active === false && s.active)
            await this.sessions.revokeForStaff(id, "staff_deactivated");
        const { passwordHash: _p, subject, ...out } = r;
        return { ...out, passportLinked: !!subject };
    }
    async settings(u) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
        const pack = this.packs.get(t.marketCode, null);
        const linkedToKiorex = await (0, sign_in_config_1.tenantLinkedToKiorex)(this.prisma, t);
        return { name: t.name, edition: t.edition, market: t.marketCode, subscriptionStatus: t.subscriptionStatus, pack, settings: t.settings ?? {}, defaultSignInMethod: t.defaultSignInMethod, effectiveSignInMethod: (0, sign_in_default_1.effectiveOrgDefault)({ stored: t.defaultSignInMethod, linkedToKiorex }), linkedToKiorex };
    }
    async patchSettings(u, dto) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
        const { defaultSignInMethod, ...json } = dto;
        const settings = { ...(t.settings ?? {}), ...json };
        await this.prisma.tenant.update({ where: { id: u.orgId }, data: { settings: JSON.parse(JSON.stringify(settings)), ...(defaultSignInMethod !== undefined ? { defaultSignInMethod } : {}) } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "settings.update", entityType: "Tenant", entityId: u.orgId, meta: { fields: Object.keys(dto) } });
        if (defaultSignInMethod !== undefined && defaultSignInMethod !== t.defaultSignInMethod)
            await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "settings.default_signin_method", entityType: "Tenant", entityId: u.orgId, meta: { from: t.defaultSignInMethod, to: defaultSignInMethod } });
        return settings;
    }
    async plan(u) {
        const t = await this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } });
        return { edition: t.edition };
    }
};
exports.TenancyController = TenancyController;
__decorate([
    (0, common_1.Post)("onboarding/signup"),
    (0, decorators_1.Public)(),
    (0, common_1.UseGuards)(requires_flag_guard_1.RequiresFlagGuard),
    (0, requires_flag_guard_1.RequiresFlag)("pharmacy.module"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SignupDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)("onboarding/complete"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "completeOnboarding", null);
__decorate([
    (0, common_1.Get)("branches"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TenancyController.prototype, "branches", null);
__decorate([
    (0, common_1.Post)("branches"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, BranchDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "createBranch", null);
__decorate([
    (0, common_1.Patch)("branches/:id"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, BranchPatchDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "patchBranch", null);
__decorate([
    (0, common_1.Get)("staff"),
    (0, decorators_1.Perm)("staff.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "staff", null);
__decorate([
    (0, common_1.Post)("staff"),
    (0, decorators_1.Perm)("staff.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, StaffDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Patch)("staff/:id"),
    (0, decorators_1.Perm)("staff.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, StaffPatchDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "patchStaff", null);
__decorate([
    (0, common_1.Get)("settings"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "settings", null);
__decorate([
    (0, common_1.Patch)("settings"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SettingsDto]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "patchSettings", null);
__decorate([
    (0, common_1.Get)("plans"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenancyController.prototype, "plan", null);
exports.TenancyController = TenancyController = __decorate([
    (0, swagger_1.ApiTags)("tenancy"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(ports_1.KERNEL.entitlements)),
    __param(3, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(4, (0, common_1.Inject)(passport_sessions_service_1.PassportSessions)),
    __param(5, (0, common_1.Inject)(token_verifier_1.TokenVerifier)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService, Object, Object, passport_sessions_service_1.PassportSessions,
        token_verifier_1.TokenVerifier])
], TenancyController);
//# sourceMappingURL=tenancy.controller.js.map