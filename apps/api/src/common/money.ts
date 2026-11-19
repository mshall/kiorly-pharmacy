import { Prisma } from "@prisma/client";

export type Dec = Prisma.Decimal;
export const D = (v: Prisma.Decimal.Value | null | undefined): Prisma.Decimal => new Prisma.Decimal(v ?? 0);
export const round2 = (v: Prisma.Decimal.Value): Prisma.Decimal => D(v).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
export const sum = (xs: Prisma.Decimal.Value[]): Prisma.Decimal => xs.reduce<Prisma.Decimal>((a, b) => a.plus(b), D(0));
/** Decimal -> JSON-safe string with 2 dp. */
export const money = (v: Prisma.Decimal.Value | null | undefined): string => round2(v ?? 0).toFixed(2);

/** VAT-inclusive prices: vat = gross * rate / (1 + rate). Display / export only — never submitted to any authority. */
export function vatFromGross(gross: Prisma.Decimal.Value, rate: Prisma.Decimal.Value): Prisma.Decimal {
  const r = D(rate);
  if (r.isZero()) return D(0);
  return round2(D(gross).mul(r).div(r.plus(1)));
}
