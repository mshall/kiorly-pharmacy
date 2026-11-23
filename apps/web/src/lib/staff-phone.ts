/** Staff phone for Kiorex Passport linking: strict E.164 after dropping spaces, dashes, dots and brackets (mirrors the API's `normalizePhone`). */
export function normalizeStaffPhone(p: string | null | undefined): string | null {
  if (!p) return null;
  const s = p.replace(/[\s\-().]/g, "").replace(/^00/, "+");
  return /^\+[1-9]\d{7,14}$/.test(s) ? s : null;
}
export const isE164 = (p: string): boolean => normalizeStaffPhone(p) !== null;
