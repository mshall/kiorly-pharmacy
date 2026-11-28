import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { CommissionRateService } from "./commission-rate.service";
import { CommissionStatementService } from "./commission-statement.service";
import { GrowthInsightsService } from "./growth-insights.service";
import { ProviderLinksService, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";
export declare class GrowthMobileService {
    private readonly prisma;
    private readonly links;
    private readonly insights;
    private readonly rates;
    private readonly statements;
    constructor(prisma: PrismaService, links: ProviderLinksService, insights: GrowthInsightsService, rates: CommissionRateService, statements: CommissionStatementService);
    overview(u: AuthUser): Promise<{
        product: "PHARMACY";
        level: import("./growth-access").GrowthLevel;
        can: {
            revoke: boolean;
            commission: boolean;
            view: boolean;
            create: boolean;
            update: boolean;
        };
        plan: {
            linksUsed: number;
            maxActiveLinks: number;
            trendDays: number;
            key: import("../../generated/prisma/enums").Edition;
        };
        branchScoped: boolean;
        profileUrl: string;
        links: import("./provider-links.service").LinkDto[];
        performance: {
            days: number;
            links: {
                visits: number;
                orders: number;
                completed: number;
                visitToOrder: number | null;
                orderToCompleted: number | null;
            };
            providerOriginated: {
                orders: number;
                completed: number;
                completionRate: number | null;
            };
            marketplaceOriginated: {
                orders: number;
                completed: number;
                completionRate: number | null;
            };
            acquisitionPending: boolean;
        };
        recommendations: import("./growth-recommendations").Recommendation[];
        statement: {
            configured: boolean;
        };
        organisation: string;
        webGrowthPath: string;
        webGrowthUrl: string | null;
    }>;
    commissionRate(u: AuthUser): Promise<import("./commission-rate.service").CommissionRateCard>;
    commissionStatement(u: AuthUser, period?: string): Promise<{
        source: "KIOREX";
        orgRef: string;
        period: {
            from: string;
            to: string;
        } & {
            key: string;
        };
        currency: string;
        payoutMethod: "BANK_TRANSFER";
        onlineCollectionsMinor: number;
        cashVisitCommissionAccruedMinor: number;
        cashVisitCommissionNettedMinor: number;
        cashVisitCommissionOpenMinor: number;
        cashVisitCharges: number;
        cashBreakdown: import("./commission-statement").CashBreakdown | null;
        unknownTender: {
            charges: number;
            commissionMinor: number;
        } | null;
        deductions: {
            commissionMinor: number;
            feesMinor: number | null;
            refundsMinor: number | null;
            chargebacksMinor: number | null;
        };
        commission: {
            totalMinor: number;
            collectedMinor: number;
            openMinor: number;
            disputedOpen: number;
        };
        netPayableMinor: number;
        paidByBankTransferMinor: number;
        payouts: import("./commission-statement").StatementPayout[];
        reconciliation: import("./commission-statement").StatementReconciliation;
        feesSource: "KIOREX" | "PRODUCT_LEDGER" | null;
        connected: true;
        code?: undefined;
    } | {
        connected: false;
        code: "STATEMENT_NOT_CONNECTED";
        period: string | null;
    }>;
    linksOnly(u: AuthUser): Promise<{
        items: import("./provider-links.service").LinkDto[];
        can: {
            revoke: boolean;
            view: boolean;
            create: boolean;
            update: boolean;
        };
        plan: {
            linksUsed: number;
            maxActiveLinks: number;
            trendDays: number;
            key: import("../../generated/prisma/enums").Edition;
        };
    }>;
    qr(u: AuthUser, linkId: string): Promise<string>;
    qrJson(u: AuthUser, linkId: string): Promise<{
        url: string;
        svg: string;
        linkId: string;
    }>;
    create(u: AuthUser, b: CreateLinkBody): Promise<import("./provider-links.service").LinkDto>;
    update(u: AuthUser, id: string, b: UpdateLinkBody): Promise<import("./provider-links.service").LinkDto>;
}
