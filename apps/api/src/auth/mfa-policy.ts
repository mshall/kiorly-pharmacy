import { passportConfig } from "./passport";

/**
 * Two-step verification follows the Kiorex Passport MFA policy (founder decision, 28 Nov 2026; MFA_POLICY.md in kiorex-account).
 *
 * Passport owns the policy (maker-checker, audited). This product only asks it, per ORGANISATION TYPE and role hint, whether the factor is mandatory:
 *  - policy OFF for the type (default): a privileged role (owner, pharmacist, branch manager, chain ops) works with a Passport sign-in that has no authenticator;
 *  - policy ON for the type: the privileged role needs the MFA claim (Passport forces the enrolment at sign-in; a session without the claim is refused);
 *  - the policy cannot be read (Passport unreachable, malformed answer): FAIL CLOSED = mandatory, exactly the behaviour before this change.
 * `MFA_POLICY_SOURCE=always` pins "mandatory" regardless of Passport (an operator who wants the hard rule). `MFA_POLICY_URL` overrides the endpoint.
 * The coverage answer holds no person and no organisation id; it is cached for 15 s.
 */
export const ORG_TYPE = "pharmacy" as const;
export interface Coverage { enabled: boolean; types: Record<string, { mandatory: string[]; partial: string[] }> }
export type CoverageFetcher = (url: string) => Promise<Coverage>;

const TTL_MS = 15_000;
let cache: { at: number; url: string; value: Coverage | null } | undefined;
let fetcher: CoverageFetcher = async (url) => {
  const res = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`MFA policy answered ${res.status}`);
  return (await res.json()) as Coverage;
};
/** Test hook. */
export function setCoverageFetcher(f: CoverageFetcher | undefined, reset = true): void {
  fetcher = f ?? (async (url) => {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000), headers: { accept: "application/json" } });
    if (!res.ok) throw new Error(`MFA policy answered ${res.status}`);
    return (await res.json()) as Coverage;
  });
  if (reset) cache = undefined;
}
export const resetMfaPolicyCache = () => { cache = undefined; };

function endpoint(env: NodeJS.ProcessEnv): string | null {
  if (env.MFA_POLICY_URL?.trim()) return env.MFA_POLICY_URL.trim();
  const issuer = (env.OIDC_ISSUER ?? env.KIOREX_OIDC_ISSUER)?.trim().replace(/\/+$/, "") ?? passportConfig(env)?.issuer;
  return issuer ? `${issuer}/.well-known/kiorex-mfa-policy` : null;
}

async function coverage(env: NodeJS.ProcessEnv): Promise<Coverage | null> {
  const url = endpoint(env);
  if (!url) return null;
  if (cache && cache.url === url && Date.now() - cache.at < TTL_MS) return cache.value;
  let value: Coverage | null = null;
  try {
    const c = await fetcher(url);
    value = c && typeof c === "object" && c.types && typeof c.types === "object" && typeof c.enabled === "boolean" ? c : null;
  } catch { value = null; }
  cache = { at: Date.now(), url, value };
  return value;
}

/** Pure decision (unit tested). `partial` also counts rules that cover only some organisations of the type (used for the password path, where the safe answer is wanted). */
export function roleCovered(c: Coverage | null, role: string, includePartial: boolean, orgType: string = ORG_TYPE): boolean {
  if (!c) return true; // unknown: fail closed
  if (!c.enabled) return false;
  const t = c.types[orgType];
  if (!t) return true;
  const hint = role.toLowerCase();
  const hit = (l: string[]) => l.includes("*") || l.includes(hint);
  return hit(t.mandatory ?? []) || (includePartial && hit(t.partial ?? []));
}

/** Is two-step verification mandatory for this staff role right now? (Callers have already checked that the role is privileged and the process is production-style.) */
export async function mfaMandatoryForRole(role: string, includePartial = false, env: NodeJS.ProcessEnv = process.env): Promise<boolean> {
  if (env.MFA_POLICY_SOURCE === "always") return true;
  return roleCovered(await coverage(env), role, includePartial);
}
