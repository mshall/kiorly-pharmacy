import { Inject, Injectable, Logger, Optional } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { DomainError } from "../common/errors";
import { TokenVerifier, localLoginEnabled } from "./token-verifier";
import { PassportSessions } from "./passport-sessions.service";
import { discover, hasMfa, normalizePhone, passportConfig, verifyPassportAccessToken, verifyPassportIdToken, type PassportClaims, type PassportConfig } from "./passport";

export interface ExchangeInput { code: string; codeVerifier: string; redirectUri: string; nonce: string; claim?: string }

/** Maps Kiorex Passport identities to Pharmacy staff rows (identity only: role, tenant and branch always come from our own row). */
@Injectable()
export class PassportService {
  private readonly log = new Logger(PassportService.name);
  /** Test seam. */
  fetchImpl: typeof fetch = (...a) => fetch(...a);

  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly audit: AuditService,
    @Inject(TokenVerifier) private readonly tokens: TokenVerifier,
    @Optional() @Inject(PassportSessions) private readonly sessions?: PassportSessions,
  ) {}

  /** Public config for the web login page (nothing secret). */
  async publicConfig() {
    const cfg = passportConfig();
    const localLogin = localLoginEnabled();
    if (!cfg) return { localLogin, passport: null };
    try {
      const d = await discover(cfg.issuer, this.fetchImpl);
      return { localLogin, passport: { issuer: cfg.issuer, clientId: cfg.webClientId, authorizationEndpoint: d.authorization_endpoint, scope: "openid profile phone", endSession: !!d.end_session_endpoint } };
    } catch (e) {
      this.log.warn(`Passport discovery failed: ${e instanceof Error ? e.message : String(e)}`);
      return { localLogin, passport: null };
    }
  }

  /**
   * Existing staff row for a verified Passport identity. First login: a unique active staff row with the same verified phone and no
   * Passport subject yet is linked (audited). Anything else is refused: never auto-create staff, never merge ambiguous matches.
   */
  async resolveStaff(claims: PassportClaims, cfg: PassportConfig) {
    const bySubject = await this.prisma.staffUser.findFirst({ where: { subject: claims.sub, active: true }, include: { tenant: true } });
    if (bySubject) return bySubject;
    const phone = claims.phone_number_verified === true ? normalizePhone(claims.phone_number) : null;
    if (cfg.phoneLink && phone) {
      const candidates = await this.prisma.staffUser.findMany({ where: { phone, active: true, subject: null }, include: { tenant: true }, take: 2 });
      if (candidates.length === 1) {
        const staff = candidates[0]!;
        await this.prisma.staffUser.update({ where: { id: staff.id }, data: { subject: claims.sub } });
        await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.passport_linked", entityType: "StaffUser", entityId: staff.id, meta: { via: "verified_phone" } });
        return { ...staff, subject: claims.sub };
      }
    }
    throw new DomainError("PASSPORT_NOT_LINKED", "This Kiorex Passport is not linked to a staff account. Ask your pharmacy owner to add your verified phone number.", 403);
  }

  /**
   * Owner of a freshly created organisation: the sign-up response carried a claim; the same browser now completes Passport sign-in. Binds the owner to that Passport
   * identity (created by Passport from the OTP-verified phone) and records the verified phone as the staff link key. Refused unless the phone is verified, the row is still
   * unbound, an OWNER and active, and the identity is not already bound to another staff row (no ambiguous multi-organisation resolution).
   */
  async bindOwnerClaim(claim: string, claims: PassportClaims) {
    let staffId: string;
    try { staffId = await this.tokens.readOwnerClaim(claim); } catch { throw new DomainError("CLAIM_INVALID", "The sign-up link expired. Sign in with Kiorex Passport from the login page.", 400); }
    const phone = claims.phone_number_verified === true ? normalizePhone(claims.phone_number) : null;
    if (!phone) throw new DomainError("PHONE_NOT_VERIFIED", "Kiorex Passport did not return a verified phone number", 400);
    const staff = await this.prisma.staffUser.findFirst({ where: { id: staffId, active: true, role: "OWNER", subject: null } });
    if (!staff) throw new DomainError("CLAIM_INVALID", "This sign-up was already completed. Sign in with Kiorex Passport.", 400);
    if (await this.prisma.staffUser.findFirst({ where: { subject: claims.sub, active: true }, select: { id: true } })) throw new DomainError("PASSPORT_ALREADY_LINKED", "This Kiorex Passport is already linked to another staff account", 409);
    const phoneTaken = await this.prisma.staffUser.findFirst({ where: { orgId: staff.orgId, phone, id: { not: staff.id } }, select: { id: true } });
    const done = await this.prisma.staffUser.updateMany({ where: { id: staff.id, subject: null }, data: { subject: claims.sub, ...(phoneTaken ? {} : { phone }) } });
    if (done.count !== 1) throw new DomainError("CLAIM_INVALID", "This sign-up was already completed. Sign in with Kiorex Passport.", 400);
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.passport_linked", entityType: "StaffUser", entityId: staff.id, meta: { via: "signup_claim", phoneVerified: true } });
  }

  /** Web sign-in: server-side code exchange (no CORS on the IdP), then a product session for the mapped staff. */
  async exchange(input: ExchangeInput) {
    const cfg = passportConfig();
    if (!cfg) throw new DomainError("PASSPORT_DISABLED", "Sign in with Kiorex Passport is not enabled", 404);
    let access: PassportClaims; let idToken: string; let idClaims: PassportClaims;
    try {
      const d = await discover(cfg.issuer, this.fetchImpl);
      const res = await this.fetchImpl(d.token_endpoint, {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ grant_type: "authorization_code", code: input.code, redirect_uri: input.redirectUri, client_id: cfg.webClientId, code_verifier: input.codeVerifier }),
        signal: AbortSignal.timeout(8000),
      });
      const body = (await res.json().catch(() => ({}))) as { access_token?: string; id_token?: string; error?: string };
      if (!res.ok || !body.access_token || !body.id_token) throw new Error(`token endpoint ${res.status} ${body.error ?? ""}`);
      idToken = body.id_token;
      idClaims = await verifyPassportIdToken(idToken, cfg, input.nonce);
      access = await verifyPassportAccessToken(body.access_token, cfg);
      if (access.sub !== idClaims.sub) throw new Error("sub mismatch");
    } catch (e) {
      this.log.warn(`Passport exchange failed: ${e instanceof Error ? e.message : String(e)}`);
      throw new DomainError("PASSPORT_EXCHANGE_FAILED", "Kiorex Passport sign-in failed", 401);
    }
    const merged = { ...idClaims, ...access };
    if (input.claim) await this.bindOwnerClaim(input.claim, merged);
    const staff = await this.resolveStaff(merged, cfg);
    await this.prisma.staffUser.update({ where: { id: staff.id }, data: { lastLoginAt: new Date() } });
    await this.audit.record({ orgId: staff.orgId, actorId: staff.id, action: "auth.login", entityType: "StaffUser", entityId: staff.id, meta: { via: "passport" } });
    const d = await discover(cfg.issuer, this.fetchImpl);
    const origin = new URL(input.redirectUri).origin;
    const endSessionUrl = d.end_session_endpoint
      ? `${d.end_session_endpoint}?${new URLSearchParams({ id_token_hint: idToken, post_logout_redirect_uri: `${origin}/` })}`
      : undefined;
    // one server-side row per web sign-in: a back-channel logout from Passport ends it, and it expires after the (short) max age
    const ttl = cfg.sessionMaxAgeSeconds;
    const row = await this.sessions?.open(staff, { sub: access.sub!, sid: typeof idClaims.sid === "string" ? idClaims.sid : undefined }, ttl);
    return { accessToken: await this.tokens.issueSession(staff.id, hasMfa(access), ttl, row?.id), expiresIn: ttl, ...(endSessionUrl ? { endSessionUrl } : {}) };
  }
}
