import { declaredEnvironment } from "./demo-seed-guard";
import { hashPassword } from "../auth/password";

/**
 * The demo seeds publish a demo password (DEV ONLY). On a DEPLOYED environment (KIORLY_ENV / KIOREX_ENV / ENV_TAG names anything but local or dev) the seeded staff get NO password,
 * so e-mail + password sign-in (AUTH_MODE=both) can never be opened with a published credential; they sign in with Kiorex Passport. ADR-061, 28 Nov 2026.
 */
export function demoPasswordsAllowed(env: Record<string, string | undefined> = process.env): boolean {
  const e = declaredEnvironment(env);
  return e === null || e === "dev" || e === "development" || e === "local";
}
export async function demoPasswordHash(pw: string, env: Record<string, string | undefined> = process.env): Promise<string | null> {
  return demoPasswordsAllowed(env) ? hashPassword(pw) : null;
}
