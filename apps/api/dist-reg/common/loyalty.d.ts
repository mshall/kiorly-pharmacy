import type { Prisma } from "../generated/prisma/client";
import { type DecimalValue } from "./money";
import type { TenantSettings } from "../tenancy/tenant-mode.service";
type Tx = Prisma.TransactionClient;
export declare const DEFAULT_TIERS: {
    name: string;
    minSpend: string;
}[];
export declare const TIER_MULTIPLIER: Record<string, number>;
export interface LoyaltyConfig {
    enabled: boolean;
    earnPer: Prisma.Decimal;
    pointsPerEarn: number;
    redeemValue: Prisma.Decimal;
    tiers: Array<{
        name: string;
        minSpend: Prisma.Decimal;
    }>;
}
export declare function loyaltyConfig(s: TenantSettings | null | undefined): LoyaltyConfig;
export declare function tierFor(lifetimeSpend: DecimalValue, cfg: LoyaltyConfig): string;
export declare function pointsFor(total: DecimalValue, tier: string, cfg: LoyaltyConfig): number;
export declare const pointsValue: (points: number, cfg: LoyaltyConfig) => import("@prisma/client-runtime-utils").Decimal;
export declare function earnForSale(tx: Tx, p: {
    orgId: string;
    patientId: string;
    saleId: string;
    total: DecimalValue;
    by?: string;
}, cfg: LoyaltyConfig): Promise<number>;
export declare function redeemPoints(tx: Tx, p: {
    orgId: string;
    patientId: string;
    points: number;
    saleId?: string;
    by?: string;
}, cfg: LoyaltyConfig): Promise<boolean>;
export declare const adjustPoints: (tx: Tx, p: {
    orgId: string;
    patientId: string;
    points: number;
    note: string;
    by: string;
    kind?: string;
}, cfg: LoyaltyConfig) => Promise<number>;
export {};
