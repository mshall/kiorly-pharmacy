import { Injectable } from "@nestjs/common";
import { SignJWT, createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

export interface VerifiedToken {
  /** Local mode: StaffUser.id. OIDC mode: Kiorex Passport `sub` (mapped to StaffUser.subject). */
  sub: string;
  mfa: boolean;
  claims: JWTPayload;
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

/**
 * Verifies bearer tokens.
 *  - AUTH_MODE=local (default): HS256 tokens issued by POST /auth/login (dev/demo/E2E; staff email + password).
 *  - AUTH_MODE=oidc: RS256 tokens from Kiorex Passport (issuer + JWKS + audience validated; `acr/amr must signal MFA for privileged roles in production).
 */
@Injectable()
export class TokenVerifier {
  private jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

  async issueLocal(sub: string, ttlSeconds = 60 * 60 * 10): Promise<string> {
    return new SignJWT({ amr: ["pwd"] })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(sub)
      .setIssuer("kiorly-pharmacy-local")
      .setAudience("kiorly-pharmacy")
      .setIssuedAt()
      .setExpirationTime(`${ttlSeconds}s`)
      .sign(key());
  }

  async verify(token: string): Promise<VerifiedToken> {
    if (authMode() === "local") {
      const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"], issuer: "kiorly-pharmacy-local", audience: "kiorly-pharmacy" });
      return { sub: String(payload.sub), mfa: false, claims: payload };
    }
    const issuer = process.env.OIDC_ISSUER;
    if (!issuer) throw new Error("OIDC_ISSUER is required when AUTH_MODE=oidc");
    this.jwks ??= createRemoteJWKSet(new URL(process.env.OIDC_JWKS_URL ?? `${issuer.replace(/\/$/, "")}/jwks`));
    const { payload } = await jwtVerify(token, this.jwks, { algorithms: ["RS256"], issuer, audience: process.env.OIDC_AUDIENCE ?? "kiorly-pharmacy" });
    // @kiorex/contracts 1.2.0 (KA10): step-up signal is `acr` urn:kiorex:acr:mfa and/or `amr` (RFC 8176). Unknown claims are ignored.
    const amr = Array.isArray(payload.amr) ? (payload.amr as string[]) : [];
    return { sub: String(payload.sub), mfa: payload.acr === "urn:kiorex:acr:mfa" || amr.includes("mfa") || payload.mfa === true, claims: payload };
  }
}
