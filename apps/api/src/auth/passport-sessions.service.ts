import { Inject, Injectable, Logger } from "@nestjs/common";
import type { JWTVerifyGetKey } from "jose";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { DomainError } from "../common/errors";
import { jwks, passportConfig, type PassportClaims } from "./passport";
import { LogoutTokenError, verifyLogoutToken } from "./backchannel";

/** Raw Passport access tokens live at most this long after a logout (they are <= 15 min); revocation records are kept slightly longer. */
const BEARER_REVOCATION_TTL_MS = 60 * 60 * 1000;

/**
 * Server-side ends of Passport web sessions: one row per sign-in (`PassportSession`), ended by a verified back-channel logout, by
 * deactivating the staff member, or by the short max age. Nothing here holds Passport tokens, and no phone/name is ever logged.
 */
@Injectable()
export class PassportSessions {
  private readonly log = new Logger(PassportSessions.name);
  /** Test seam: JWKS resolver for logout tokens. */
  keyResolver: ((jwksUrl: string) => JWTVerifyGetKey) | null = null;

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
  ) {}

  async open(staff: { id: string; orgId: string }, claims: { sub: string; sid?: string }, ttlSeconds: number) {
    return this.prisma.passportSession.create({
      data: { orgId: staff.orgId, staffId: staff.id, sub: claims.sub, sid: claims.sid ?? null, expiresAt: new Date(Date.now() + ttlSeconds * 1000) },
    });
  }

  /** Throws 401 SESSION_REVOKED when the web session was ended (or never existed). */
  async assertActive(sessionId: string): Promise<void> {
    const s = await this.prisma.passportSession.findUnique({ where: { id: sessionId }, select: { revokedAt: true, expiresAt: true } });
    if (!s || s.revokedAt || s.expiresAt.getTime() < Date.now()) throw new DomainError("SESSION_REVOKED", "Your session ended. Sign in again.", 401);
  }

  /** Raw Passport access token (staff mobile app): refuse when its `sid` was logged out, or its `sub` was logged out after the token was issued. */
  async assertBearerActive(claims: Pick<PassportClaims, "sub" | "sid" | "iat">): Promise<void> {
    const or: Array<{ kind: string; value: string }> = [];
    if (claims.sid) or.push({ kind: "SID", value: claims.sid });
    if (claims.sub) or.push({ kind: "SUB", value: claims.sub });
    if (!or.length) return;
    const hits = await this.prisma.passportRevocation.findMany({ where: { OR: or, expiresAt: { gt: new Date() } } });
    const iatMs = (claims.iat ?? 0) * 1000;
    if (hits.some((h) => h.kind === "SID" || h.revokedAt.getTime() >= iatMs)) throw new DomainError("SESSION_REVOKED", "Your session ended. Sign in again.", 401);
  }

  /** Ends every open web session of a staff member (deactivation, role change to inactive). Returns how many were ended. */
  async revokeForStaff(staffId: string, reason: string): Promise<number> {
    return (await this.prisma.passportSession.updateMany({ where: { staffId, revokedAt: null }, data: { revokedAt: new Date(), revokedReason: reason } })).count;
  }

  /**
   * POST /auth/oidc/backchannel-logout. Verifies the logout_token (signature, issuer, audience, typ, events, sid/sub), refuses replays
   * (jti is stored), then ends the matching sessions. Idempotent: a second token for the same sid revokes nothing more and still succeeds.
   */
  async backchannelLogout(logoutToken: unknown): Promise<{ revoked: number }> {
    const cfg = passportConfig();
    if (!cfg) throw new DomainError("PASSPORT_DISABLED", "Sign in with Kiorex Passport is not enabled", 404);
    let v;
    try {
      v = await verifyLogoutToken(logoutToken, cfg, this.keyResolver ? this.keyResolver(cfg.jwksUrl) : (jwks(cfg.jwksUrl) as JWTVerifyGetKey));
    } catch (e) {
      throw new DomainError("INVALID_LOGOUT_TOKEN", e instanceof LogoutTokenError ? e.message : "invalid logout token", 400);
    }
    const now = new Date();
    try {
      await this.prisma.logoutTokenSeen.create({ data: { jti: v.jti, expiresAt: new Date(Math.max(v.exp * 1000, now.getTime()) + 5 * 60_000) } });
    } catch (e) {
      if ((e as { code?: string }).code === "P2002") throw new DomainError("INVALID_LOGOUT_TOKEN", "logout token replayed", 400);
      throw e;
    }
    void this.prisma.logoutTokenSeen.deleteMany({ where: { expiresAt: { lt: now } } }).catch(() => undefined);

    const where = v.sid && !v.subjectDeleted ? { sid: v.sid } : { sub: v.sub! };
    const rows = await this.prisma.passportSession.findMany({ where: { ...where, revokedAt: null }, select: { id: true, orgId: true, staffId: true } });
    await this.prisma.passportSession.updateMany({ where: { id: { in: rows.map((r) => r.id) } }, data: { revokedAt: now, revokedReason: v.subjectDeleted ? "subject.deleted" : "backchannel_logout" } });
    const expiresAt = new Date(now.getTime() + BEARER_REVOCATION_TTL_MS);
    const rec = v.sid && !v.subjectDeleted ? { kind: "SID", value: v.sid } : { kind: "SUB", value: v.sub! };
    await this.prisma.passportRevocation.upsert({ where: { kind_value: rec }, create: { ...rec, expiresAt }, update: { revokedAt: now, expiresAt } });
    if (v.subjectDeleted && v.sub) {
      // the Passport identity no longer exists: unlink the staff row (never delete it); a new Passport with the same verified phone can link again
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
}
