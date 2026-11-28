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
var PassportService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const errors_1 = require("../common/errors");
const token_verifier_1 = require("./token-verifier");
const passport_sessions_service_1 = require("./passport-sessions.service");
const passport_1 = require("./passport");
let PassportService = PassportService_1 = class PassportService {
    prisma;
    audit;
    tokens;
    sessions;
    log = new common_1.Logger(PassportService_1.name);
    fetchImpl = (...a) => fetch(...a);
    constructor(prisma, audit, tokens, sessions) {
        this.prisma = prisma;
        this.audit = audit;
        this.tokens = tokens;
        this.sessions = sessions;
    }
    async publicConfig() {
        const cfg = (0, passport_1.passportConfig)();
        const localLogin = (0, token_verifier_1.localLoginEnabled)();
        if (!cfg)
            return { localLogin, passport: null };
        try {
            const d = await (0, passport_1.discover)(cfg.issuer, this.fetchImpl);
            return { localLogin, passport: { issuer: cfg.issuer, clientId: cfg.webClientId, authorizationEndpoint: d.authorization_endpoint, scope: "openid profile phone", endSession: !!d.end_session_endpoint } };
        }
        catch (e) {
            this.log.warn(`Passport discovery failed: ${e instanceof Error ? e.message : String(e)}`);
            return { localLogin, passport: null };
        }
    }
    async resolveStaff(claims, cfg) {
        const bySubject = await this.prisma.staffUser.findFirst({ where: { subject: claims.sub, active: true }, include: { tenant: true } });
        if (bySubject)
            return bySubject;
        const phone = claims.phone_number_verified === true ? (0, passport_1.normalizePhone)(claims.phone_number) : null;
        if (cfg.phoneLink && phone) {
            const candidates = await this.prisma.staffUser.findMany({ where: { phone, active: true, subject: null }, include: { tenant: true }, take: 2 });
            if (candidates.length === 1) {
                const staff = candidates[0];
                await this.prisma.staffUser.update({ where: { id: staff.id }, data: { subject: claims.sub } });
                await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.passport_linked", entityType: "StaffUser", entityId: staff.id, meta: { via: "verified_phone" } });
                return { ...staff, subject: claims.sub };
            }
        }
        throw new errors_1.DomainError("PASSPORT_NOT_LINKED", "This Kiorex Passport is not linked to a staff account. Ask your pharmacy owner to add your verified phone number.", 403);
    }
    async bindOwnerClaim(claim, claims) {
        let staffId;
        try {
            staffId = await this.tokens.readOwnerClaim(claim);
        }
        catch {
            throw new errors_1.DomainError("CLAIM_INVALID", "The sign-up link expired. Sign in with Kiorex Passport from the login page.", 400);
        }
        const phone = claims.phone_number_verified === true ? (0, passport_1.normalizePhone)(claims.phone_number) : null;
        if (!phone)
            throw new errors_1.DomainError("PHONE_NOT_VERIFIED", "Kiorex Passport did not return a verified phone number", 400);
        const staff = await this.prisma.staffUser.findFirst({ where: { id: staffId, active: true, role: "OWNER", subject: null } });
        if (!staff)
            throw new errors_1.DomainError("CLAIM_INVALID", "This sign-up was already completed. Sign in with Kiorex Passport.", 400);
        if (await this.prisma.staffUser.findFirst({ where: { subject: claims.sub, active: true }, select: { id: true } }))
            throw new errors_1.DomainError("PASSPORT_ALREADY_LINKED", "This Kiorex Passport is already linked to another staff account", 409);
        const phoneTaken = await this.prisma.staffUser.findFirst({ where: { orgId: staff.orgId, phone, id: { not: staff.id } }, select: { id: true } });
        const done = await this.prisma.staffUser.updateMany({ where: { id: staff.id, subject: null }, data: { subject: claims.sub, ...(phoneTaken ? {} : { phone }) } });
        if (done.count !== 1)
            throw new errors_1.DomainError("CLAIM_INVALID", "This sign-up was already completed. Sign in with Kiorex Passport.", 400);
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.passport_linked", entityType: "StaffUser", entityId: staff.id, meta: { via: "signup_claim", phoneVerified: true } });
    }
    async exchange(input) {
        const cfg = (0, passport_1.passportConfig)();
        if (!cfg)
            throw new errors_1.DomainError("PASSPORT_DISABLED", "Sign in with Kiorex Passport is not enabled", 404);
        let access;
        let idToken;
        let idClaims;
        try {
            const d = await (0, passport_1.discover)(cfg.issuer, this.fetchImpl);
            const res = await this.fetchImpl(d.token_endpoint, {
                method: "POST",
                headers: { "content-type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams({ grant_type: "authorization_code", code: input.code, redirect_uri: input.redirectUri, client_id: cfg.webClientId, code_verifier: input.codeVerifier }),
                signal: AbortSignal.timeout(8000),
            });
            const body = (await res.json().catch(() => ({})));
            if (!res.ok || !body.access_token || !body.id_token)
                throw new Error(`token endpoint ${res.status} ${body.error ?? ""}`);
            idToken = body.id_token;
            idClaims = await (0, passport_1.verifyPassportIdToken)(idToken, cfg, input.nonce);
            access = await (0, passport_1.verifyPassportAccessToken)(body.access_token, cfg);
            if (access.sub !== idClaims.sub)
                throw new Error("sub mismatch");
        }
        catch (e) {
            this.log.warn(`Passport exchange failed: ${e instanceof Error ? e.message : String(e)}`);
            throw new errors_1.DomainError("PASSPORT_EXCHANGE_FAILED", "Kiorex Passport sign-in failed", 401);
        }
        const merged = { ...idClaims, ...access };
        if (input.claim)
            await this.bindOwnerClaim(input.claim, merged);
        const staff = await this.resolveStaff(merged, cfg);
        await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id, meta: { via: "passport" } });
        const d = await (0, passport_1.discover)(cfg.issuer, this.fetchImpl);
        const origin = new URL(input.redirectUri).origin;
        const endSessionUrl = d.end_session_endpoint
            ? `${d.end_session_endpoint}?${new URLSearchParams({ id_token_hint: idToken, post_logout_redirect_uri: `${origin}/` })}`
            : undefined;
        const ttl = cfg.sessionMaxAgeSeconds;
        const row = await this.sessions?.open(staff, { sub: access.sub, sid: typeof idClaims.sid === "string" ? idClaims.sid : undefined }, ttl);
        return { accessToken: await this.tokens.issueSession(staff.id, (0, passport_1.hasMfa)(access), ttl, row?.id), expiresIn: ttl, ...(endSessionUrl ? { endSessionUrl } : {}) };
    }
};
exports.PassportService = PassportService;
exports.PassportService = PassportService = PassportService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(token_verifier_1.TokenVerifier)),
    __param(3, (0, common_1.Optional)()),
    __param(3, (0, common_1.Inject)(passport_sessions_service_1.PassportSessions)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService,
        token_verifier_1.TokenVerifier,
        passport_sessions_service_1.PassportSessions])
], PassportService);
//# sourceMappingURL=passport.service.js.map