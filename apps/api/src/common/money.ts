import { Prisma } from "../generated/prisma/client";

export type Dec = Prisma.Decimal;
/** Anything a Decimal can be built from (number, string or Decimal) — `Decimal.Value` is not exported by the Prisma 7 client. */
export type DecimalValue = ConstructorParameters<typeof Prisma.Decimal>[0];
export const D = (v: DecimalValue | null | undefined): Prisma.Decimal => new Prisma.Decimal(v ?? 0);
export const round2 = (v: DecimalValue): Prisma.Decimal => D(v).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
export const sum = (xs: DecimalValue[]): Prisma.Decimal => xs.reduce<Prisma.Decimal>((a, b) => a.plus(b), D(0));
/** Decimal -> JSON-safe string with 2 dp. */
export const money = (v: DecimalValue | null | undefined): string => round2(v ?? 0).toFixed(2);

/** VAT-inclusive prices: vat = gross * rate / (1 + rate). Display / export only — never submitted to any authority. */
export function vatFromGross(gross: DecimalValue, rate: DecimalValue): Prisma.Decimal {
  const r = D(rate);
  if (r.isZero()) return D(0);
  return round2(D(gross).mul(r).div(r.plus(1)));
}
