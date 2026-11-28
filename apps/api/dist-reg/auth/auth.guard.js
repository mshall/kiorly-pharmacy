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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../prisma/prisma.service");
const decorators_1 = require("./decorators");
const token_verifier_1 = require("./token-verifier");
const mfa_policy_1 = require("./mfa-policy");
const passport_service_1 = require("./passport.service");
const passport_sessions_service_1 = require("./passport-sessions.service");
const passport_1 = require("./passport");
const permissions_1 = require("./permissions");
const permissions_service_1 = require("./permissions.service");
const mobile_gate_1 = require("../modules/mobile/mobile-gate");
const errors_1 = require("../common/errors");
let AuthGuard = class AuthGuard {
    reflector;
    prisma;
    tokens;
    perms;
    passport;
    sessions;
    constructor(reflector, prisma, tokens, perms, passport, sessions) {
        this.reflector = reflector;
        this.prisma = prisma;
        this.tokens = tokens;
        this.perms = perms;
        this.passport = passport;
        this.sessions = sessions;
    }
    async canActivate(ctx) {
        if (ctx.getType() !== "http")
            return true;
        if (this.reflector.getAllAndOverride(decorators_1.IS_PUBLIC, [ctx.getHandler(), ctx.getClass()]))
            return true;
        const req = ctx.switchToHttp().getRequest();
        const header = req.headers.authorization;
        if (!header?.startsWith("Bearer "))
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "UNAUTHENTICATED", message: "Missing bearer token" });
        let verified;
        try {
            verified = await this.tokens.verify(header.slice(7));
        }
        catch {
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "INVALID_TOKEN", message: "Invalid or expired token" });
        }
        if (this.sessions) {
            if (verified.sessionId)
                await this.sessions.assertActive(verified.sessionId);
            else if (verified.passport)
                await this.sessions.assertBearerActive(verified.claims);
        }
        const cfg = verified.passport ? (0, passport_1.passportConfig)() : null;
        const staff = verified.passport && cfg && this.passport
            ? await this.passport.resolveStaff(verified.claims, cfg)
            : await this.prisma.staffUser.findFirst({
                where: verified.staffId ? { id: verified.staffId } : (0, token_verifier_1.authMode)() !== "oidc" && !verified.passport ? { id: verified.sub } : { subject: verified.sub },
                include: { tenant: true },
            });
        if (!staff || !staff.active)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "UNKNOWN_STAFF", message: "No active staff account" });
        if ((0, token_verifier_1.mfaEnforced)() && permissions_1.PRIVILEGED_ROLES.includes(staff.role) && !verified.mfa && await (0, mfa_policy_1.mfaMandatoryForRole)(staff.role)) {
            throw (0, errors_1.forbidden)("MFA_REQUIRED", "Two-step verification is required by the Kiorex Passport policy for this role");
        }
        const user = {
            userId: staff.id, orgId: staff.orgId, role: staff.role, displayName: staff.displayName, branchId: staff.branchId,
            market: staff.tenant.marketCode, edition: staff.tenant.edition, pharmacistLicenceNo: staff.pharmacistLicenceNo, mfa: verified.mfa,
        };
        req.user = user;
        const need = this.reflector.getAllAndOverride(decorators_1.REQUIRES_PERM, [ctx.getHandler(), ctx.getClass()]);
        if (need?.length && (0, mobile_gate_1.isMobilePlanGated)(req)) {
            req.deferredPerms = need;
            return true;
        }
        if (need?.length) {
            const have = await this.perms.forRole(user.orgId, user.role);
            const missing = need.filter((p) => !have.has(p));
            if (missing.length)
                throw new errors_1.DomainError("PERMISSION_DENIED", `Missing permission: ${missing.join(", ")}`, 403, { missing });
        }
        return true;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(core_1.Reflector)),
    __param(1, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(2, (0, common_1.Inject)(token_verifier_1.TokenVerifier)),
    __param(3, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __param(4, (0, common_1.Optional)()),
    __param(4, (0, common_1.Inject)(passport_service_1.PassportService)),
    __param(5, (0, common_1.Optional)()),
    __param(5, (0, common_1.Inject)(passport_sessions_service_1.PassportSessions)),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService,
        token_verifier_1.TokenVerifier,
        permissions_service_1.PermissionsService,
        passport_service_1.PassportService,
        passport_sessions_service_1.PassportSessions])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map