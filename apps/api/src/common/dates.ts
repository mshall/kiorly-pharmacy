/**
 * Market business day (EG: Africa/Cairo). Lot expiry is evaluated against the MARKET calendar day, identically in the DB
 * (kx_today(), migration 0003) and here, so the service check and the DB trigger can never disagree.
 */
export const MARKET_TZ = process.env.MARKET_TZ ?? "Africa/Cairo";

/** Today's market date as a Date at 00:00 UTC (the way Prisma represents @db.Date values). */
export function marketToday(now: Date = new Date()): Date {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: MARKET_TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
  return new Date(`${parts}T00:00:00.000Z`);
}
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);
