/** Per-user dismissed home cards (server side). Keys are short slugs such as "kiorex-home"; the list is small, unique and ordered by first dismissal. */
export const MAX_DISMISSED = 50;
const KEY = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,63}$/;

export function sanitizeDismissed(input: unknown): string[] {
  const list = Array.isArray(input) ? input : [];
  const out: string[] = [];
  for (const k of list) { if (typeof k === "string" && KEY.test(k) && !out.includes(k)) out.push(k); if (out.length >= MAX_DISMISSED) break; }
  return out;
}
export const isValidDismissedBody = (b: unknown): b is { keys: unknown[] } => !!b && typeof b === "object" && Array.isArray((b as { keys?: unknown }).keys) && (b as { keys: unknown[] }).keys.length <= MAX_DISMISSED && (b as { keys: unknown[] }).keys.every((k) => typeof k === "string" && KEY.test(k));
