import { Prisma } from "@prisma/client";
import { D, round2 } from "./money";

/** Pure payables / receivables aging. Credits (payments, return credits) are applied to the OLDEST invoices first (FIFO); what remains is bucketed by days past due. */
export const AGING_BUCKETS = ["current", "d1_30", "d31_60", "d61_90", "d90_plus"] as const;
export type AgingBucket = (typeof AGING_BUCKETS)[number];
export interface AgingInvoice { id: string; at: Date; dueDays: number; amount: Prisma.Decimal.Value }
export interface AgingResult { outstanding: Prisma.Decimal; credit: Prisma.Decimal; buckets: Record<AgingBucket, Prisma.Decimal>; open: Array<{ id: string; at: Date; dueAt: Date; remaining: Prisma.Decimal; daysPastDue: number; bucket: AgingBucket }> }

export function bucketFor(daysPastDue: number): AgingBucket {
  return daysPastDue <= 0 ? "current" : daysPastDue <= 30 ? "d1_30" : daysPastDue <= 60 ? "d31_60" : daysPastDue <= 90 ? "d61_90" : "d90_plus";
}

/** `credits` is the total of payments + credit notes (positive number). Any credit beyond the invoices is returned as `credit` (an advance / overpayment). */
export function ageInvoices(invoices: readonly AgingInvoice[], credits: Prisma.Decimal.Value, asOf: Date = new Date()): AgingResult {
  let left = D(credits);
  const buckets = Object.fromEntries(AGING_BUCKETS.map((b) => [b, D(0)])) as Record<AgingBucket, Prisma.Decimal>;
  const open: AgingResult["open"] = [];
  for (const inv of [...invoices].sort((a, b) => a.at.getTime() - b.at.getTime())) {
    const amount = D(inv.amount);
    const applied = Prisma.Decimal.min(left, amount);
    left = left.minus(applied);
    const remaining = round2(amount.minus(applied));
    if (remaining.lte(0)) continue;
    const dueAt = new Date(inv.at.getTime() + inv.dueDays * 86_400_000);
    const daysPastDue = Math.floor((asOf.getTime() - dueAt.getTime()) / 86_400_000);
    const bucket = bucketFor(daysPastDue);
    buckets[bucket] = buckets[bucket].plus(remaining);
    open.push({ id: inv.id, at: inv.at, dueAt, remaining, daysPastDue, bucket });
  }
  const outstanding = open.reduce((a, o) => a.plus(o.remaining), D(0));
  return { outstanding, credit: round2(left), buckets, open };
}

/** "30 days", "net 15", "15", "cash" => days. Unknown / cash => 0. */
export function termsDays(terms: string | null | undefined): number {
  const m = /(\d{1,3})/.exec(terms ?? "");
  return m ? Number(m[1]) : 0;
}
