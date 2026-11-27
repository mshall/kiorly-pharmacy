import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { hasMfa, passportConfig, peekAlg, verifyPassportAccessToken } from "./passport";

export interface VerifiedToken {
  /** Local mode: StaffUser.id. OIDC mode: Kiorex Passport `sub` (mapped to StaffUser.subject). */
  sub: string;
  mfa: boolean;
  claims: JWTPayload;
  /** Set for product-issued tokens (password login, Passport web session): the StaffUser.id. */
  staffId?: string;
  /** Raw Passport access token (staff mobile app): `sub` maps to StaffUser.subject. */
  passport?: boolean;
  /** Passport web session: the `PassportSession` row id (`jti`), checked against back-channel logout on every request. */
  sessionId?: string;
}

/** `both` (explicit, per environment): e-mail + password AND Kiorex Passport side by side, also in production. Default stays `local` (dev) or `oidc` (hosted). */
export type AuthMode = "local" | "oidc" | "both";

const key = () => new TextEncoder().encode(secret());
function secret(): string {
  const s = process.env.AUTH_JWT_SECRET || process.env.JWT_SECRET; // JWT_SECRET is what the infra secret injects
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_JWT_SECRET (or JWT_SECRET) is required in production");
  return "dev-only-kiorly-pharmacy-secret-change-me";
}
export const authMode = (): AuthMode => (process.env.AUTH_MODE === "oidc" ? "oidc" : process.env.AUTH_MODE === "both" ? "both" : "local");
/** Password sign-in offered (local or both). */
export const localLoginEnabled = (): boolean => authMode() !== "oidc";
/** Production rule: privileged roles need the MFA claim whenever Passport is the identity provider (oidc or both). */
export const mfaEnforced = (): boolean => process.env.NODE_ENV === "production" && authMode() !== "local";

const CLAIM_ISSUER = "kiorly-pharmacy-owner-claim";
export const LOCAL_ISSUER = "kiorly-pharmacy-local";
/** Issued by `POST /auth/oidc/exchange` after a verified Passport code exchange (web). Accepted in every mode. */
export const SESSION_ISSUER = "kiorly-pharmacy-passport-session";

/**
 * Verifies bearer tokens.
 *  - HS256 product tokens: `POST /auth/login` (AUTH_MODE=local only) and the Passport web session (`/auth/oidc/exchange`, any mode).
 *  - RS256 Passport access tokens (staff mobile app): AUTH_MODE=oidc, or AUTH_ACCEPT_PASSPORT=true outside production. Issuer + JWKS +
 *    audience + accepted client validated; privileged roles need acr/amr MFA in production.
 */
@Injectable()
export class TokenVerifier {
  async issueLocal(sub: string, ttlSeconds = 60 * 60 * 10): Promise<string> {
    return new SignJWT({ amr: ["pwd"] })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(sub)
      .setIssuer(LOCAL_ISSUER)
      .setAudience("kiorly-pharmacy")
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(key());
  }

  /** Web session after Passport sign-in (the browser never holds the Passport tokens). */
  async issueSession(staffId: string, mfa: boolean, ttlSeconds = 60 * 60, sessionId?: string): Promise<string> {
    return new SignJWT({ amr: ["passport"], mfa })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(staffId)
      .setJti(sessionId ?? randomUUID())
      .setIssuer(SESSION_ISSUER)
      .setAudience("kiorly-pharmacy")
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(key());
  }

  /**
   * Sign-up claim: proves that the browser that created an organisation is the one completing the Passport sign-in that binds the owner.
   * Not a session (own issuer and audience: `verify` refuses it). Single use by construction: it binds only while the owner has no Passport subject yet.
   */
  async issueOwnerClaim(staffId: string, ttlSeconds = 20 * 60): Promise<string> {
    return new SignJWT({ typ: "owner-claim" })
      .setProtectedHeader({ alg: "HS256" }).setSubject(staffId).setIssuer(CLAIM_ISSUER).setAudience("kiorly-pharmacy-claim").setIssuedAt().setExpirationTime(`${ttlSeconds}s`).sign(key());
  }
  async readOwnerClaim(token: string): Promise<string> {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: CLAIM_ISSUER, audience: "kiorly-pharmacy-claim" });
    if (payload.typ !== "owner-claim" || !payload.sub) throw new Error("not a claim");
    return String(payload.sub);
  }

  async verify(token: string): Promise<VerifiedToken> {
    if (peekAlg(token) === "HS256") {
      const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: [LOCAL_ISSUER, SESSION_ISSUER], audience: "kiorly-pharmacy" });
      if (payload.iss === LOCAL_ISSUER && !localLoginEnabled()) throw new Error("local tokens are disabled");
      if (payload.iss === SESSION_ISSUER && !payload.jti) throw new Error("session id missing");
      return { sub: String(payload.sub), staffId: String(payload.sub), mfa: payload.mfa === true, claims: payload, ...(payload.iss === SESSION_ISSUER ? { sessionId: String(payload.jti) } : {}) };
    }
    const cfg = passportConfig();
    if (!cfg) throw new Error("Passport tokens are not accepted");
    const claims = await verifyPassportAccessToken(token, cfg);
    return { sub: String(claims.sub), mfa: hasMfa(claims) || claims.mfa === true, claims, passport: true };
  }
}
