/**
 * The product API answers 403 `MFA_REQUIRED` to a privileged staff role whose Passport sign-in carried no second factor (production rule, unchanged).
 * A real owner who skipped two-step verification meets this on the first call (`/auth/me`), so the app shows a friendly screen that sends them to Passport
 * to set it up, instead of a blank page or the sign-in form again.
 */
export function isMfaRequired(e: unknown): boolean {
  return !!e && typeof e === "object" && (e as { code?: unknown }).code === "MFA_REQUIRED";
}

/** Where the person sets up the authenticator: the Security page of the Kiorex Passport account site on the issuer's own host. Null when the issuer is unknown. */
export function passportSecurityUrl(issuer: string | null | undefined): string | null {
  if (!issuer) return null;
  try {
    const u = new URL(issuer);
    if (u.protocol !== "https:" && u.protocol !== "http:") return null;
    return new URL("/account/security", u.origin).toString();
  } catch { return null; }
}
