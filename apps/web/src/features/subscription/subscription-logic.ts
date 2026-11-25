/** SUB-01 pure helpers (no React). */
export const isFreeEdition = (e: string) => e === "LITE";
export function usagePercent(current: number, limit: number | null): number | null {
  if (limit == null) return null;
  if (limit === 0) return current > 0 ? 100 : 0;
  return Math.min(100, Math.round((current / limit) * 100));
}
/** Capability rows: the union over all plans, in first-seen order; add-on markers stay distinct rows. */
export function capabilityRows(plans: { capabilities: string[]; addOns: string[] }[]): string[] {
  const seen: string[] = [];
  for (const p of plans) for (const c of [...p.capabilities, ...p.addOns.map((a) => `${a} (add-on)`)]) if (!seen.includes(c)) seen.push(c);
  return seen;
}
export const hasCap = (p: { capabilities: string[]; addOns: string[] }, row: string) => p.capabilities.includes(row) || p.addOns.map((a) => `${a} (add-on)`).includes(row);
export const priceOf = (p: { prices: { interval: string; amount: string; currency: string }[] }, interval: string) => p.prices.find((x) => x.interval === interval) ?? null;
