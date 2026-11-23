import { jwtVerify, type JWTVerifyGetKey } from "jose";
import type { PassportConfig } from "./passport";

/**
 * OpenID Connect Back-Channel Logout 1.0 (§2.4, §2.6) receiver helpers. Kiorex Passport POSTs a signed `logout_token` to this product when
 * a session is revoked (account page, admin, RP-initiated logout elsewhere) or the account is deleted. Verification is delegated to `jose`:
 * signature (RS256 via the issuer JWKS), `typ=logout+jwt`, issuer, audience (this product's web client), `iat`/`exp`/`jti`, the
 * back-channel-logout event, no `nonce`, and at least one of `sub` / `sid`.
 */
export const BACKCHANNEL_LOGOUT_EVENT = "http://schemas.openid.net/event/backchannel-logout";
export const KX_EVENT_SUBJECT_DELETED = "https://schemas.kiorex.com/event/subject.deleted";
export const LOGOUT_TOKEN_TYP = "logout+jwt";

export class LogoutTokenError extends Error {}

export interface VerifiedLogout {
  jti: string;
  /** Seconds since epoch. */
  exp: number;
  sub?: string;
  sid?: string;
  /** `subject.deleted` revokes everything of the subject and unlinks it; otherwise a session revocation. */
  subjectDeleted: boolean;
}

export async function verifyLogoutToken(token: unknown, cfg: PassportConfig, getKey: JWTVerifyGetKey, now: Date = new Date()): Promise<VerifiedLogout> {
  if (typeof token !== "string" || !token || token.length > 8192) throw new LogoutTokenError("missing logout_token");
  let payload;
  try {
    ({ payload } = await jwtVerify(token, getKey, {
      algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.webClientId, typ: LOGOUT_TOKEN_TYP, clockTolerance: 5, currentDate: now,
      requiredClaims: ["iat", "exp", "jti", "events"],
    }));
  } catch (e) {
    throw new LogoutTokenError(`invalid logout token: ${e instanceof Error ? e.message : "verification failed"}`);
  }
  const events = payload.events as Record<string, unknown> | undefined;
  if (!events || typeof events !== "object" || !(BACKCHANNEL_LOGOUT_EVENT in events)) throw new LogoutTokenError("missing backchannel-logout event");
  if ("nonce" in payload) throw new LogoutTokenError("logout token must not contain nonce");
  const sub = typeof payload.sub === "string" && payload.sub ? payload.sub : undefined;
  const sid = typeof payload.sid === "string" && payload.sid ? payload.sid : undefined;
  if (!sub && !sid) throw new LogoutTokenError("logout token needs sub or sid");
  return { jti: String(payload.jti), exp: Number(payload.exp), sub, sid, subjectDeleted: KX_EVENT_SUBJECT_DELETED in events };
}
