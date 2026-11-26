import { isAbsolute, resolve, sep } from "node:path";

/**
 * Deployment-time settings that must work on any host (App Runner, a single Docker host, ...): the HTTP prefix, the browser CORS allow-list and the
 * "is the object-store directory ephemeral?" startup warning. Pure functions over an env map so they are unit-testable. Never logs secret values.
 */
type Env = Record<string, string | undefined>;

export const DEFAULT_API_PREFIX = "api/v1";

/**
 * Global HTTP prefix of the application API (health, auth, web calls). `API_PREFIX` (default `api/v1`, slashes trimmed). The Kiorex machine API and the
 * web build assume the default; change it only together with the proxy in front and the Passport redirect/back-channel URIs.
 */
export function apiPrefix(env: Env = process.env): string {
  const raw = (env.API_PREFIX ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!raw) return DEFAULT_API_PREFIX;
  if (!/^[A-Za-z0-9._~-]+(\/[A-Za-z0-9._~-]+)*$/.test(raw)) throw new Error("API_PREFIX must be a URL path of letters, digits and . _ ~ - separated by / (for example api/v1)");
  return raw;
}

/** CORS allow-list: `CORS_ORIGINS` (comma separated, trailing slashes dropped); `localDefault` only outside production. */
export function corsOrigins(env: Env = process.env, localDefault = ""): string[] {
  const raw = env.CORS_ORIGINS?.trim() ?? (env.NODE_ENV === "production" ? "" : localDefault);
  return raw.split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean);
}

/** Startup notice: production with no CORS_ORIGINS means browsers can only call this API same-origin (reverse proxy); that is valid, so a notice only. */
export function corsNotice(env: Env = process.env): string | null {
  return env.NODE_ENV === "production" && !env.CORS_ORIGINS?.trim()
    ? "cors: CORS_ORIGINS is not set; cross-origin browser calls are refused (same-origin calls through a reverse proxy keep working)."
    : null;
}

const EPHEMERAL_ROOTS = ["/tmp", "/var/tmp", "/dev/shm", "/run"];

/**
 * Is the local object-store directory likely to disappear on redeploy/restart? True when STORAGE_DIR is unset or relative (the image filesystem), under the
 * working directory of the app, or under a tmp-like root. `STORAGE_DIR_PERSISTENT=true` states that a volume is mounted there and silences the notice.
 */
export function storageDirIsEphemeral(env: Env = process.env, cwd: string = process.cwd()): boolean {
  const dir = env.STORAGE_DIR?.trim();
  if (!dir) return true;
  if (!isAbsolute(dir)) return true;
  const p = resolve(dir);
  if (EPHEMERAL_ROOTS.some((r) => p === r || p.startsWith(r + sep))) return true;
  const c = resolve(cwd);
  return p === c || p.startsWith(c + sep);
}

/** Warning text (or null): production, local-disk storage (STORAGE_MODE mock/unset) and an ephemeral directory. */
export function ephemeralStorageWarning(env: Env = process.env, cwd: string = process.cwd()): string | null {
  if (env.NODE_ENV !== "production") return null;
  if ((env.STORAGE_MODE ?? "mock").trim().toLowerCase() === "real") return null;
  if (env.STORAGE_DIR_PERSISTENT?.trim().toLowerCase() === "true") return null;
  if (!storageDirIsEphemeral(env, cwd)) return null;
  return "storage: STORAGE_MODE=mock writes to local disk and STORAGE_DIR is unset or on an ephemeral path; files are LOST on every redeploy or restart. Mount a persistent volume (single Docker host: -v <host-dir>:/data/storage with STORAGE_DIR=/data/storage) or use STORAGE_MODE=real. Set STORAGE_DIR_PERSISTENT=true once a volume is mounted at that path.";
}

export function warnStartupConfig(log: (message: string) => void = (m) => console.warn(m), env: Env = process.env): void {
  for (const m of [ephemeralStorageWarning(env), corsNotice(env)]) if (m) log(m);
}
