import { Prisma } from "../generated/prisma/client";
import { type DecimalValue } from "./money";
export declare const AGING_BUCKETS: readonly ["current", "d1_30", "d31_60", "d61_90", "d90_plus"];
export type AgingBucket = (typeof AGING_BUCKETS)[number];
export interface AgingInvoice {
    id: string;
    at: Date;
    dueDays: number;
    amount: DecimalValue;
}
export interface AgingResult {
    outstanding: Prisma.Decimal;
    credit: Prisma.Decimal;
    buckets: Record<AgingBucket, Prisma.Decimal>;
    open: Array<{
        id: string;
        at: Date;
        dueAt: Date;
        remaining: Prisma.Decimal;
        daysPastDue: number;
        bucket: AgingBucket;
    }>;
}
export declare function bucketFor(daysPastDue: number): AgingBucket;
export declare function ageInvoices(invoices: readonly AgingInvoice[], credits: DecimalValue, asOf?: Date): AgingResult;
export declare function termsDays(terms: string | null | undefined): number;
