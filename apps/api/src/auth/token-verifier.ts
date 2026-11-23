import { Injectable } from "@nestjs/common";
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
}

export type AuthMode = "local" | "oidc";

const key = () => new TextEncoder().encode(secret());
function secret(): string {
  const s = process.env.AUTH_JWT_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("AUTH_JWT_SECRET is required in production");
  return "dev-only-kiorly-pharmacy-secret-change-me";
}
export const authMode = (): AuthMode => (process.env.AUTH_MODE === "oidc" ? "oidc" : "local");

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
  async issueSession(staffId: string, mfa: boolean, ttlSeconds = 60 * 60 * 8): Promise<string> {
    return new SignJWT({ amr: ["passport"], mfa })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(staffId)
      .setIssuer(SESSION_ISSUER)
      .setAudience("kiorly-pharmacy")
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(key());
  }

  async verify(token: string): Promise<VerifiedToken> {
    if (peekAlg(token) === "HS256") {
      const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: [LOCAL_ISSUER, SESSION_ISSUER], audience: "kiorly-pharmacy" });
      if (payload.iss === LOCAL_ISSUER && authMode() !== "local") throw new Error("local tokens are disabled");
      return { sub: String(payload.sub), staffId: String(payload.sub), mfa: payload.mfa === true, claims: payload };
    }
    const cfg = passportConfig();
    if (!cfg) throw new Error("Passport tokens are not accepted");
    const claims = await verifyPassportAccessToken(token, cfg);
    return { sub: String(claims.sub), mfa: hasMfa(claims) || claims.mfa === true, claims, passport: true };
  }
}
