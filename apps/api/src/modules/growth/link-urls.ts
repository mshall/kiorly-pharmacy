import { effectiveTags } from "./link-tags";

/**
 * URL building for partner provider links (GRW-P4-B1, adapted from the Clinic `link-urls.ts`). Everything is derived from configuration and server-side
 * entities; a caller-supplied URL is never accepted anywhere (open-redirect protection by construction) and `assertAllowedRedirect` re-checks the host
 * against the configured set before any 302.
 *
 *   LINK_SHORT_BASE_URL     origin that serves `/q/<code>` (today the public API `${PUBLIC_API_BASE_URL}/api/v1/public/links`, later `https://kiorly.link`, NH-008)
 *   KIOREX_PATIENT_WEB_URL  Kiorex patient site that serves the pharmacy / lab brand page (default http://localhost:5180 in dev)
 *   KIOREX_ALLOWED_REDIRECT_HOSTS  extra comma separated hosts
 */
type Env = NodeJS.ProcessEnv;
export type LinkProduct = "PHARMACY" | "LAB";

const trim = (s: string) => s.replace(/\/+$/, "");

/** `<base>/q/<code>`: the short form printed in QR codes (less dense). */
export function shortLinkBase(env: Env = process.env): string {
  const explicit = env.LINK_SHORT_BASE_URL?.trim();
  if (explicit) return trim(explicit);
  const api = trim(env.PUBLIC_API_BASE_URL?.trim() || `http://localhost:${env.PORT ?? "3100"}`);
  return `${api}/api/v1/public/links`;
}

export function shortUrl(code: string, env: Env = process.env): string {
  return `${shortLinkBase(env)}/q/${encodeURIComponent(code)}`;
}

export function kiorexWebBase(env: Env = process.env): string {
  return trim(env.KIOREX_PATIENT_WEB_URL?.trim() || "http://localhost:5180");
}

/** Path of the Kiorex brand page of a product (PH: `/pharmacy`, LB: `/lab`; the ordering landing). */
export const PRODUCT_LANDING_PATH: Record<LinkProduct, string> = { PHARMACY: "/pharmacy", LAB: "/lab" };

export interface LandingTarget {
  product: LinkProduct;
  /** Signed touch token, when the link is ACTIVE and the organisation is connected. */
  lt?: string | null;
  channelKind?: string;
  tags?: unknown;
}

/** Kiorex landing URL with the signed touch and UTM tags (consumed by the Kiorex touch endpoint, then stripped from the canonical URL). */
export function kiorexLandingUrl(t: LandingTarget, env: Env = process.env): string {
  const url = new URL(`${kiorexWebBase(env)}${PRODUCT_LANDING_PATH[t.product]}`);
  if (t.lt) {
    url.searchParams.set("lt", t.lt);
    if (t.channelKind) for (const [k, v] of Object.entries(effectiveTags(t.channelKind, t.tags))) if (v) url.searchParams.set(k, v);
  }
  return url.toString();
}

export function allowedRedirectHosts(env: Env = process.env): Set<string> {
  const hosts = new Set<string>();
  for (const raw of [kiorexWebBase(env), env.KIOREX_ALLOWED_REDIRECT_HOSTS]) {
    for (const part of String(raw ?? "").split(",")) {
      const v = part.trim();
      if (!v) continue;
      try {
        hosts.add(new URL(v.includes("://") ? v : `https://${v}`).host.toLowerCase());
      } catch {
        /* ignore malformed config entry */
      }
    }
  }
  return hosts;
}

/** Throws when `url` is not https (or http on localhost) on a configured host, or carries credentials. */
export function assertAllowedRedirect(url: string, env: Env = process.env): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error("REDIRECT_NOT_ALLOWED");
  }
  const local = u.hostname === "localhost" || u.hostname === "127.0.0.1";
  if (u.protocol !== "https:" && !(local && u.protocol === "http:")) throw new Error("REDIRECT_NOT_ALLOWED");
  if (u.username || u.password) throw new Error("REDIRECT_NOT_ALLOWED");
  if (!allowedRedirectHosts(env).has(u.host.toLowerCase())) throw new Error("REDIRECT_NOT_ALLOWED");
  return u.toString();
}
