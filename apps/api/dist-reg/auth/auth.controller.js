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
exports.AuthController = void 0;
exports.passwordRoleRefusal = passwordRoleRefusal;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("./decorators");
const token_verifier_1 = require("./token-verifier");
const mfa_policy_1 = require("./mfa-policy");
const permissions_1 = require("./permissions");
const password_1 = require("./password");
const permissions_service_1 = require("./permissions.service");
const tenant_mode_service_1 = require("../tenancy/tenant-mode.service");
const feature_flags_service_1 = require("../feature-flags/feature-flags.service");
const feature_flag_keys_1 = require("../feature-flags/feature-flag-keys");
const audit_service_1 = require("../audit/audit.service");
const errors_1 = require("../common/errors");
const passport_service_1 = require("./passport.service");
const passport_sessions_service_1 = require("./passport-sessions.service");
const handoff_1 = require("./handoff");
const handoff_store_1 = require("./handoff.store");
const sign_in_config_1 = require("./sign-in-config");
const sign_in_default_1 = require("./sign-in-default");
const pg_rate_limit_1 = require("../common/pg-rate-limit");
const DUMMY_SCRYPT = "scrypt$7cd38f7ab867b50df28b0c0fd63dd060$97ff8ac4f83d30b1bfdf68edd866d072bd2c128f745cd06fab3f5e84c1fc3d19";
async function passwordOk(pw, staff) {
    const ok = await (0, password_1.verifyPassword)(pw, staff?.passwordHash ?? DUMMY_SCRYPT);
    return Boolean(staff) && ok;
}
const configLimiter = (0, sign_in_default_1.makeWindowLimiter)(300, 60_000);
class LoginDto {
    email;
    password;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], LoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
class OidcExchangeDto {
    code;
    codeVerifier;
    redirectUri;
    nonce;
    claim;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], OidcExchangeDto.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(43),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], OidcExchangeDto.prototype, "codeVerifier", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(512),
    __metadata("design:type", String)
], OidcExchangeDto.prototype, "redirectUri", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(256),
    __metadata("design:type", String)
], OidcExchangeDto.prototype, "nonce", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(2048),
    __metadata("design:type", String)
], OidcExchangeDto.prototype, "claim", void 0);
class HandoffLoginDto {
    email;
    password;
}
__decorate([
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], HandoffLoginDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    (0, class_validator_1.MaxLength)(256),
    __metadata("design:type", String)
], HandoffLoginDto.prototype, "password", void 0);
class HandoffExchangeDto {
    code;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(128),
    __metadata("design:type", String)
], HandoffExchangeDto.prototype, "code", void 0);
let pgLimiter;
async function throttle(prisma, key, perMinute = Number(process.env.SIGNIN_RATE_PER_MINUTE) || 10) {
    pgLimiter ??= new pg_rate_limit_1.PgRateLimiter(prisma);
    const r = await pgLimiter.hit(`signin:${key}`, perMinute, 60_000);
    if (!r.ok)
        throw new errors_1.DomainError("RATE_LIMITED", "Too many login attempts, try again in a minute", 429, { retryAfterSec: r.retryAfterSec });
}
async function passwordRoleRefusal(role) {
    return (0, token_verifier_1.mfaEnforced)() && permissions_1.PRIVILEGED_ROLES.includes(role) && await (0, mfa_policy_1.mfaMandatoryForRole)(role, true)
        ? new errors_1.DomainError("PASSPORT_REQUIRED_FOR_ROLE", "This role signs in with Kiorex Passport (two-step verification). Use Sign in with Kiorex Passport.", 403)
        : null;
}
const IP_SIGNIN_PER_MINUTE = () => Number(process.env.SIGNIN_RATE_PER_IP_PER_MINUTE) || 30;
let AuthController = class AuthController {
    prisma;
    tokens;
    flags;
    audit;
    perms;
    modes;
    passport;
    sessions;
    handoffStore;
    constructor(prisma, tokens, flags, audit, perms, modes, passport, sessions, handoffStore) {
        this.prisma = prisma;
        this.tokens = tokens;
        this.flags = flags;
        this.audit = audit;
        this.perms = perms;
        this.modes = modes;
        this.passport = passport;
        this.sessions = sessions;
        this.handoffStore = handoffStore;
    }
    handoffCodes() { return new handoff_1.HandoffCodes(this.handoffStore, "pharmacy"); }
    async config(org, req, res) {
        const base = await this.passport.publicConfig();
        res.setHeader("Cache-Control", "no-store");
        if (!configLimiter(req.ip ?? "anon"))
            throw new errors_1.DomainError("RATE_LIMITED", "Too many requests, try again in a minute", 429);
        const facts = org ? await (0, sign_in_config_1.orgSignInFacts)(this.prisma, org) : null;
        return { ...base, ...(0, sign_in_config_1.resolvePublicSignInConfig)({ passportAvailable: base.passport !== null, org: facts, deployment: (0, sign_in_config_1.deploymentDefaultMethod)() }) };
    }
    async exchange(dto) {
        await throttle(this.prisma, `oidc:${dto.codeVerifier.slice(0, 12)}`);
        return this.passport.exchange(dto);
    }
    async backchannelLogout(logoutToken, res) {
        res.setHeader("Cache-Control", "no-store");
        await this.sessions.backchannelLogout(logoutToken);
        return {};
    }
    async login(dto, req) {
        if (!(0, token_verifier_1.localLoginEnabled)())
            throw new errors_1.DomainError("LOCAL_LOGIN_DISABLED", "Sign in with Kiorex Passport", 404);
        await throttle(this.prisma, `ip:${req.ip ?? "anon"}`, IP_SIGNIN_PER_MINUTE());
        await throttle(this.prisma, dto.email.toLowerCase());
        const staff = await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (!(await passwordOk(dto.password, staff)) || !staff || !staff.active)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "BAD_CREDENTIALS", message: "Invalid email or password" });
        const refusal = await passwordRoleRefusal(staff.role);
        if (refusal)
            throw refusal;
        await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id });
        return { accessToken: await this.tokens.issueLocal(staff.id) };
    }
    async handoffLogin(dto, origin, req, res) {
        res.setHeader("Cache-Control", "no-store");
        if (!(0, handoff_1.isHomeOrigin)(origin))
            throw new errors_1.DomainError("HANDOFF_ORIGIN_NOT_ALLOWED", "This sign-in start is not allowed from here", 403);
        if (!(0, token_verifier_1.localLoginEnabled)())
            throw new errors_1.DomainError("LOCAL_LOGIN_DISABLED", "Sign in with Kiorex Passport", 404);
        await throttle(this.prisma, `ip:${req.ip ?? "anon"}`, IP_SIGNIN_PER_MINUTE());
        await throttle(this.prisma, dto.email.toLowerCase());
        const staff = await this.prisma.staffUser.findUnique({ where: { email: dto.email.toLowerCase() } });
        if (!(await passwordOk(dto.password, staff)) || !staff || !staff.active)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "BAD_CREDENTIALS", message: "Invalid email or password" });
        const refusal = await passwordRoleRefusal(staff.role);
        if (refusal)
            throw refusal;
        const { code, expiresInSeconds } = await this.handoffCodes().issue({ subjectId: staff.id, origin: origin });
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.handoff_issued", entityType: "StaffUser", entityId: staff.id, meta: { via: "kiorly-home" } });
        const web = (0, handoff_1.webBaseUrl)();
        return { status: "OK", code, expiresInSeconds, redirectUrl: web ? `${web}/login?handoff=${encodeURIComponent(code)}&from=kiorly-home` : null };
    }
    async handoffExchange(dto, res) {
        res.setHeader("Cache-Control", "no-store");
        let subjectId;
        try {
            ({ subjectId } = await this.handoffCodes().redeem({ code: dto.code }));
        }
        catch (e) {
            if (e instanceof handoff_1.HandoffError)
                throw new common_1.UnauthorizedException({ statusCode: 401, code: e.code, message: e.message });
            throw e;
        }
        const staff = await this.prisma.staffUser.findUnique({ where: { id: subjectId } });
        if (!staff || !staff.active)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "HANDOFF_INVALID", message: "The sign-in link is invalid or expired. Sign in again." });
        const refusal = await passwordRoleRefusal(staff.role);
        if (refusal)
            throw refusal;
        await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id, meta: { via: "kiorly-home-handoff" } });
        return { accessToken: await this.tokens.issueLocal(staff.id) };
    }
    async me(u) {
        const [mode, perms] = await Promise.all([this.modes.mode(u.orgId), this.perms.forRole(u.orgId, u.role)]);
        const [tenant, branches] = await Promise.all([
            this.prisma.tenant.findUniqueOrThrow({ where: { id: u.orgId } }),
            this.prisma.branch.findMany({ where: { orgId: u.orgId, active: true, ...(u.branchId ? { id: u.branchId } : {}) }, orderBy: { name: "asc" } }),
        ]);
        return {
            user: { id: u.userId, displayName: u.displayName, role: u.role, branchId: u.branchId, isPharmacist: !!u.pharmacistLicenceNo },
            tenant: { id: tenant.id, name: tenant.name, edition: tenant.edition, market: tenant.marketCode, onboarded: !!tenant.onboardedAt, mode, currency: (tenant.settings ?? {}).currency ?? "EGP" },
            branches: branches.map((b) => ({ id: b.id, name: b.name, code: b.code })),
            permissions: [...perms],
            flags: Object.fromEntries(feature_flag_keys_1.FLAG_DEFINITIONS.map((f) => [f.key, this.flags.isEnabled(f.key, { orgId: u.orgId, market: u.market }) && !(mode === "STANDALONE" && f.key === "pharmacy.kiorex_orders")])),
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)("config"),
    (0, decorators_1.Public)(),
    __param(0, (0, common_1.Query)("org")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "config", null);
__decorate([
    (0, common_1.Post)("oidc/exchange"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [OidcExchangeDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "exchange", null);
__decorate([
    (0, common_1.Post)("oidc/backchannel-logout"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)("logout_token")),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "backchannelLogout", null);
__decorate([
    (0, common_1.Post)("login"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)("handoff/login"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)("origin")),
    __param(2, (0, common_1.Req)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HandoffLoginDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handoffLogin", null);
__decorate([
    (0, common_1.Post)("handoff/exchange"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HandoffExchangeDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "handoffExchange", null);
__decorate([
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("auth"),
    (0, common_1.Controller)("auth"),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(token_verifier_1.TokenVerifier)),
    __param(2, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __param(3, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(4, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __param(5, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __param(6, (0, common_1.Inject)(passport_service_1.PassportService)),
    __param(7, (0, common_1.Inject)(passport_sessions_service_1.PassportSessions)),
    __param(8, (0, common_1.Inject)(handoff_store_1.PrismaHandoffStore)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        token_verifier_1.TokenVerifier,
        feature_flags_service_1.FeatureFlagsService,
        audit_service_1.AuditService,
        permissions_service_1.PermissionsService,
        tenant_mode_service_1.TenantModeService,
        passport_service_1.PassportService,
        passport_sessions_service_1.PassportSessions,
        handoff_store_1.PrismaHandoffStore])
], AuthController);
//# sourceMappingURL=auth.controller.js.map