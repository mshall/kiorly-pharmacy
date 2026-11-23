/**
 * Kiorex Passport sign-in for the staff web: OIDC authorization code + PKCE (S256), public client `kiorly-pharmacy-web`.
 * The browser only does the redirect + PKCE; the API redeems the code server-side (the IdP token endpoint is not CORS-enabled and
 * the browser never holds Passport tokens) and returns the product session plus the RP-initiated logout URL (id_token_hint).
 */
import { ApiError } from "./api";

export interface AuthConfig {
  localLogin: boolean;
  /** Per-organisation default (ADR-038 amendment): which method the login page preselects. Both stay offered when Passport is available. */
  defaultMethod?: "PASSWORD" | "PASSPORT";
  passportAvailable?: boolean;
  passport: null | { issuer: string; clientId: string; authorizationEndpoint: string; scope: string; endSession: boolean };
}

const TXN_KEY = "kiorly.passport.txn";
const END_SESSION_KEY = "kiorly.passport.endSession";
export const CALLBACK_PATH = "/auth/callback";

const rand = (bytes: number) => { const a = new Uint8Array(bytes); crypto.getRandomValues(a); return b64url(a); };
export const b64url = (a: Uint8Array) => btoa(String.fromCharCode(...a)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
export async function s256(verifier: string): Promise<string> {
  return b64url(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier))));
}

export async function fetchAuthConfig(org?: string | null): Promise<AuthConfig> {
  try {
    const res = await fetch(`/api/v1/auth/config${org ? `?org=${encodeURIComponent(org)}` : ""}`);
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as AuthConfig;
  } catch {
    return { localLogin: true, passport: null }; // older API / offline: keep the password form
  }
}

export async function startPassportSignIn(cfg: NonNullable<AuthConfig["passport"]>, lang: string): Promise<void> {
  const verifier = rand(48); const state = rand(24); const nonce = rand(24);
  const redirectUri = `${window.location.origin}${CALLBACK_PATH}`;
  sessionStorage.setItem(TXN_KEY, JSON.stringify({ state, nonce, verifier, redirectUri }));
  const u = new URL(cfg.authorizationEndpoint);
  u.search = new URLSearchParams({
    response_type: "code", client_id: cfg.clientId, redirect_uri: redirectUri, scope: cfg.scope, state, nonce,
    code_challenge: await s256(verifier), code_challenge_method: "S256", ui_locales: lang.startsWith("ar") ? "ar" : "en",
  }).toString();
  window.location.assign(u.toString());
}

/** Callback: validates `state`, then the API redeems the code. Resolves with the product session token. */
export async function completePassportSignIn(search: string): Promise<{ accessToken: string }> {
  const p = new URLSearchParams(search);
  const raw = sessionStorage.getItem(TXN_KEY);
  sessionStorage.removeItem(TXN_KEY); // single use
  if (p.get("error")) throw new ApiError(401, "PASSPORT_DENIED", p.get("error_description") ?? p.get("error")!);
  const txn = raw ? (JSON.parse(raw) as { state: string; nonce: string; verifier: string; redirectUri: string }) : null;
  const code = p.get("code");
  if (!txn || !code || p.get("state") !== txn.state) throw new ApiError(400, "PASSPORT_STATE", "The sign-in attempt expired. Please start again.");
  const res = await fetch("/api/v1/auth/oidc/exchange", {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ code, codeVerifier: txn.verifier, redirectUri: txn.redirectUri, nonce: txn.nonce }),
  });
  const data = (await res.json().catch(() => ({}))) as { accessToken?: string; endSessionUrl?: string; code?: string; message?: string };
  if (!res.ok || !data.accessToken) throw new ApiError(res.status, data.code ?? "PASSPORT_FAILED", data.message ?? "Kiorex Passport sign-in failed");
  try { if (data.endSessionUrl) localStorage.setItem(END_SESSION_KEY, data.endSessionUrl); else localStorage.removeItem(END_SESSION_KEY); } catch { /* storage unavailable */ }
  return { accessToken: data.accessToken };
}

/** The Passport RP-initiated logout URL (id_token_hint) of a Passport-started session, consumed once. */
export function takeEndSessionUrl(): string | null {
  try { const u = localStorage.getItem(END_SESSION_KEY); localStorage.removeItem(END_SESSION_KEY); return u; } catch { return null; }
}
