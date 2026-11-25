/** G-24: minutes without a click, key or touch before the browser signs out (`VITE_SESSION_IDLE_MINUTES`, default 30, 0 = off, clamped 5..480). The API enforces the same limit (OIDC_SESSION_IDLE_MINUTES). */
export function idleLimitMs(raw: string | undefined): number {
  if (raw === undefined || raw.trim() === "") return 30 * 60_000;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 30 * 60_000;
  return n <= 0 ? 0 : Math.min(480, Math.max(5, Math.floor(n))) * 60_000;
}
export const IDLE_NOTICE_KEY = "kiorly.sessionNotice";
