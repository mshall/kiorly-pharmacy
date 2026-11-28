import { PrismaService } from "../prisma/prisma.service";
export type OperatingMode = "STANDALONE" | "INTEGRATED";
export interface TenantSettings {
    mode?: OperatingMode;
    vatRate?: string;
    currency?: string;
    defaultLocale?: "ar" | "en";
    languages?: Array<"ar" | "en">;
    taxRates?: Array<{
        code: string;
        label: string;
        rate: string;
    }>;
    receipt?: {
        header?: string;
        footer?: string;
        showVat?: boolean;
        showLicence?: boolean;
        paper?: "80mm" | "a4";
        logoText?: string;
    };
    printers?: Array<{
        id: string;
        name: string;
        kind: "RECEIPT" | "LABEL" | "A4";
        paper?: string;
        note?: string;
    }>;
    loyalty?: {
        enabled?: boolean;
        earnPer?: string;
        pointsPerEarn?: number;
        redeemValue?: string;
        tiers?: Array<{
            name: string;
            minSpend: string;
        }>;
    };
    maxCashierDiscountPct?: number;
    refillReminderDays?: number;
    costVarianceTolerancePct?: number;
    customerCreditDays?: number;
    ownerPhone?: string;
    ownerEmail?: string;
    receiptFooter?: string;
    shiftVarianceThreshold?: string;
    [k: string]: unknown;
}
export declare class TenantModeService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    settings(orgId: string): Promise<TenantSettings>;
    mode(orgId: string): Promise<OperatingMode>;
    isStandalone(orgId: string): Promise<boolean>;
}
