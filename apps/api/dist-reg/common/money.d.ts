import { Prisma } from "../generated/prisma/client";
export type Dec = Prisma.Decimal;
export type DecimalValue = ConstructorParameters<typeof Prisma.Decimal>[0];
export declare const D: (v: DecimalValue | null | undefined) => Prisma.Decimal;
export declare const round2: (v: DecimalValue) => Prisma.Decimal;
export declare const sum: (xs: DecimalValue[]) => Prisma.Decimal;
export declare const money: (v: DecimalValue | null | undefined) => string;
export declare function vatFromGross(gross: DecimalValue, rate: DecimalValue): Prisma.Decimal;
