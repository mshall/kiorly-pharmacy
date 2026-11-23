import { createRemoteJWKSet, decodeProtectedHeader, jwtVerify, type JWTPayload } from "jose";

/**
 * Kiorex Passport (OIDC) relying-party configuration for the Pharmacy API.
 *
 * Modes (AUTH_MODE):
 *  - `local` (default; dev/demo/E2E): staff e-mail + password. Passport sign-in is ALSO accepted when AUTH_ACCEPT_PASSPORT=true and
 *    OIDC_ISSUER is set ("dual"), never when NODE_ENV=production.
 *  - `oidc`: Passport only. `/auth/login` is disabled; bearer tokens are Passport access tokens (staff mobile app) or the short
 *    product session issued by `/auth/oidc/exchange` after a verified Passport code exchange (web).
 */
export interface PassportConfig {
  issuer: string;
  jwksUrl: string;
  /** Accepted `aud` of Passport access tokens (Passport issues `kiorex-api`; a product audience is accepted too). */
  audiences: string[];
  /** Accepted OAuth clients (`client_id` claim): the staff app and this product's web client. */
  allowedClients: string[];
  /** Public PKCE client of the staff web. */
  webClientId: string;
  /** First Passport login matches an existing staff row by verified phone (never in production unless OIDC_PHONE_LINK=true). */
  phoneLink: boolean;
  /** Max age of a web session started with Passport (seconds). Short on purpose: it is the fallback re-validation when a back-channel logout is missed. */
  sessionMaxAgeSeconds: number;
}

const list = (v: string | undefined, d: string[]) => (v?.trim() ? v.split(",").map((s) => s.trim()).filter(Boolean) : d);

/** `OIDC_SESSION_MAX_AGE_SECONDS`: default 1 h, clamped to 60 s .. 8 h (the previous fixed session length). */
export function sessionMaxAge(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.min(8 * 3600, Math.max(60, Math.floor(n))) : 3600;
}

export function passportConfig(env: NodeJS.ProcessEnv = process.env): PassportConfig | null {
  const issuer = (env.OIDC_ISSUER ?? env.KIOREX_OIDC_ISSUER)?.trim().replace(/\/+$/, "");
  if (!issuer) return null;
  const prod = env.NODE_ENV === "production";
  const oidc = env.AUTH_MODE === "oidc";
  if (!oidc && (prod || env.AUTH_ACCEPT_PASSPORT !== "true")) return null;
  const webClientId = env.OIDC_WEB_CLIENT_ID?.trim() || "kiorly-pharmacy-web";
  return {
    issuer,
    jwksUrl: env.OIDC_JWKS_URL?.trim() || `${issuer}/jwks`,
    audiences: list(env.OIDC_AUDIENCE, ["kiorex-api", "kiorly-pharmacy"]),
    allowedClients: list(env.OIDC_ALLOWED_CLIENTS, ["kiorly", "kiorly", webClientId]),
    webClientId,
    phoneLink: env.OIDC_PHONE_LINK ? env.OIDC_PHONE_LINK === "true" : !prod,
    sessionMaxAgeSeconds: sessionMaxAge(env.OIDC_SESSION_MAX_AGE_SECONDS),
  };
}

export interface Discovery { authorization_endpoint: string; token_endpoint: string; end_session_endpoint?: string; jwks_uri?: string }

const discoveryCache = new Map<string, { at: number; doc: Discovery }>();
export async function discover(issuer: string, fetchImpl: typeof fetch = fetch): Promise<Discovery> {
  const hit = discoveryCache.get(issuer);
  if (hit && Date.now() - hit.at < 5 * 60_000) return hit.doc;
  const res = await fetchImpl(`${issuer}/.well-known/openid-configuration`, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Passport discovery failed (${res.status})`);
  const doc = (await res.json()) as Discovery;
  discoveryCache.set(issuer, { at: Date.now(), doc });
  return doc;
}
export const resetDiscoveryCache = () => discoveryCache.clear();

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();
export const jwks = (url: string) => { let j = jwksCache.get(url); if (!j) { j = createRemoteJWKSet(new URL(url)); jwksCache.set(url, j); } return j; };

export const peekAlg = (token: string): string | undefined => { try { return decodeProtectedHeader(token).alg; } catch { return undefined; } };

export interface PassportClaims extends JWTPayload {
  phone_number?: string;
  phone_number_verified?: boolean;
  name?: string;
  sid?: string;
  acr?: string;
  amr?: string[];
  client_id?: string;
}

/** Verifies a Passport access token (signature via JWKS, issuer, audience, accepted client). Throws when anything is off. */
export async function verifyPassportAccessToken(token: string, cfg: PassportConfig): Promise<PassportClaims> {
  const { payload } = await jwtVerify(token, jwks(cfg.jwksUrl), { algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.audiences });
  const p = payload as PassportClaims;
  if (!p.sub) throw new Error("no sub");
  if (!p.client_id || !cfg.allowedClients.includes(p.client_id)) throw new Error("client not allowed");
  return p;
}

export const hasMfa = (c: PassportClaims) => c.acr === "urn:kiorex:acr:mfa" || (Array.isArray(c.amr) && c.amr.includes("mfa"));

export async function verifyPassportIdToken(idToken: string, cfg: PassportConfig, nonce: string): Promise<PassportClaims> {
  const { payload } = await jwtVerify(idToken, jwks(cfg.jwksUrl), { algorithms: ["RS256"], issuer: cfg.issuer, audience: cfg.webClientId });
  if (payload.nonce !== nonce) throw new Error("nonce mismatch");
  return payload as PassportClaims;
}

/** Strip formatting; E.164 comparison only (no guessing of country codes). */
export function normalizePhone(p: string | null | undefined): string | null {
  if (!p) return null;
  const s = p.replace(/[\s\-().]/g, "").replace(/^00/, "+");
  return /^\+\d{8,15}$/.test(s) ? s : null;
}
