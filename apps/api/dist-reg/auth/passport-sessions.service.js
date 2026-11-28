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
var PassportSessions_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PassportSessions = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
const errors_1 = require("../common/errors");
const passport_1 = require("./passport");
const backchannel_1 = require("./backchannel");
const BEARER_REVOCATION_TTL_MS = 60 * 60 * 1000;
let PassportSessions = PassportSessions_1 = class PassportSessions {
    prisma;
    audit;
    log = new common_1.Logger(PassportSessions_1.name);
    keyResolver = null;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async open(staff, claims, ttlSeconds) {
        return this.prisma.passportSession.create({
            data: { orgId: staff.orgId, staffId: staff.id, sub: claims.sub, sid: claims.sid ?? null, expiresAt: new Date(Date.now() + ttlSeconds * 1000) },
        });
    }
    async assertActive(sessionId) {
        const s = await this.prisma.passportSession.findUnique({ where: { id: sessionId }, select: { revokedAt: true, expiresAt: true, lastSeenAt: true } });
        if (!s || s.revokedAt || s.expiresAt.getTime() < Date.now())
            throw new errors_1.DomainError("SESSION_REVOKED", "Your session ended. Sign in again.", 401);
        const idleMin = (0, passport_1.sessionIdleMinutes)(process.env.OIDC_SESSION_IDLE_MINUTES);
        if (idleMin > 0 && s.lastSeenAt) {
            const idleMs = Date.now() - s.lastSeenAt.getTime();
            if (idleMs > idleMin * 60_000) {
                await this.prisma.passportSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { revokedAt: new Date(), revokedReason: "idle_timeout" } });
                throw new errors_1.DomainError("SESSION_REVOKED", "Your session ended after a period of inactivity. Sign in again.", 401);
            }
            if (idleMs > 60_000)
                await this.prisma.passportSession.updateMany({ where: { id: sessionId, revokedAt: null }, data: { lastSeenAt: new Date() } });
        }
    }
    async assertBearerActive(claims) {
        const or = [];
        if (claims.sid)
            or.push({ kind: "SID", value: claims.sid });
        if (claims.sub)
            or.push({ kind: "SUB", value: claims.sub });
        if (!or.length)
            return;
        const hits = await this.prisma.passportRevocation.findMany({ where: { OR: or, expiresAt: { gt: new Date() } } });
        const iatMs = (claims.iat ?? 0) * 1000;
        if (hits.some((h) => h.kind === "SID" || h.revokedAt.getTime() >= iatMs))
            throw new errors_1.DomainError("SESSION_REVOKED", "Your session ended. Sign in again.", 401);
    }
    async revokeForStaff(staffId, reason) {
        return (await this.prisma.passportSession.updateMany({ where: { staffId, revokedAt: null }, data: { revokedAt: new Date(), revokedReason: reason } })).count;
    }
    async backchannelLogout(logoutToken) {
        const cfg = (0, passport_1.passportConfig)();
        if (!cfg)
            throw new errors_1.DomainError("PASSPORT_DISABLED", "Sign in with Kiorex Passport is not enabled", 404);
        let v;
        try {
            v = await (0, backchannel_1.verifyLogoutToken)(logoutToken, cfg, this.keyResolver ? this.keyResolver(cfg.jwksUrl) : (0, passport_1.jwks)(cfg.jwksUrl));
        }
        catch (e) {
            throw new errors_1.DomainError("INVALID_LOGOUT_TOKEN", e instanceof backchannel_1.LogoutTokenError ? e.message : "invalid logout token", 400);
        }
        const now = new Date();
        try {
            await this.prisma.logoutTokenSeen.create({ data: { jti: v.jti, expiresAt: new Date(Math.max(v.exp * 1000, now.getTime()) + 5 * 60_000) } });
        }
        catch (e) {
            if (e.code === "P2002")
                throw new errors_1.DomainError("INVALID_LOGOUT_TOKEN", "logout token replayed", 400);
            throw e;
        }
        void this.prisma.logoutTokenSeen.deleteMany({ where: { expiresAt: { lt: now } } }).catch(() => undefined);
        const where = v.sid && !v.subjectDeleted ? { sid: v.sid } : { sub: v.sub };
        const rows = await this.prisma.passportSession.findMany({ where: { ...where, revokedAt: null }, select: { id: true, orgId: true, staffId: true } });
        await this.prisma.passportSession.updateMany({ where: { id: { in: rows.map((r) => r.id) } }, data: { revokedAt: now, revokedReason: v.subjectDeleted ? "subject.deleted" : "backchannel_logout" } });
        const expiresAt = new Date(now.getTime() + BEARER_REVOCATION_TTL_MS);
        const rec = v.sid && !v.subjectDeleted ? { kind: "SID", value: v.sid } : { kind: "SUB", value: v.sub };
        await this.prisma.passportRevocation.upsert({ where: { kind_value: rec }, create: { ...rec, expiresAt }, update: { revokedAt: now, expiresAt } });
        if (v.subjectDeleted && v.sub) {
            const linked = await this.prisma.staffUser.findMany({ where: { subject: v.sub }, select: { id: true, orgId: true } });
            for (const s of linked) {
                await this.prisma.staffUser.update({ where: { id: s.id }, data: { subject: null } });
                await this.audit.record({ orgId: s.orgId, actorId: null, action: "auth.passport_unlinked", entityType: "StaffUser", entityId: s.id, meta: { via: "subject.deleted" } });
            }
        }
        for (const r of rows) {
            await this.audit.record({ orgId: r.orgId, actorId: r.staffId, action: "auth.session_revoked", entityType: "StaffUser", entityId: r.staffId, meta: { via: "backchannel_logout", event: v.subjectDeleted ? "subject.deleted" : "session.revoked" } });
        }
        this.log.log(`back-channel logout: ${rows.length} session(s) ended`);
        return { revoked: rows.length };
    }
};
exports.PassportSessions = PassportSessions;
exports.PassportSessions = PassportSessions = PassportSessions_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PassportSessions);
//# sourceMappingURL=passport-sessions.service.js.map