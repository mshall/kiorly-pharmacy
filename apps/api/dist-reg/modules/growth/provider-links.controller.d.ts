import { StreamableFile } from "@nestjs/common";
import type { Response } from "express";
import type { AuthUser } from "../../auth/auth-user";
import { CommissionRateService } from "./commission-rate.service";
import { CommissionStatementService } from "./commission-statement.service";
import { GrowthInsightsService } from "./growth-insights.service";
import { ProviderLinksService, type CreateLinkBody, type UpdateLinkBody } from "./provider-links.service";
export declare class ProviderLinksController {
    private readonly links;
    private readonly insights;
    private readonly rates;
    private readonly statements;
    constructor(links: ProviderLinksService, insights: GrowthInsightsService, rates: CommissionRateService, statements: CommissionStatementService);
    access(u: AuthUser): Promise<{
        level: import("./growth-access").GrowthLevel;
        connected: boolean;
        branchScoped: boolean;
        can: {
            view: boolean;
            create: boolean;
            update: boolean;
            revoke: boolean;
        };
        plan: {
            linksUsed: number;
            maxActiveLinks: number;
            trendDays: number;
            key: import("../../generated/prisma/enums").Edition;
        };
    }>;
    list(u: AuthUser, status?: string): Promise<{
        items: import("./provider-links.service").LinkDto[];
    }>;
    create(u: AuthUser, b: CreateLinkBody): Promise<import("./provider-links.service").LinkDto>;
    update(u: AuthUser, id: string, b: UpdateLinkBody): Promise<import("./provider-links.service").LinkDto>;
    qrSvg(u: AuthUser, id: string, res: Response): Promise<string>;
    qrPng(u: AuthUser, id: string, res: Response, width?: string): Promise<StreamableFile>;
    poster(u: AuthUser, id: string, res: Response, lang?: string, size?: string, kind?: string, print?: string): Promise<string>;
    summary(u: AuthUser, days?: string): Promise<{
        days: number;
        totals: import("./provider-links.service").LinkTotals;
        byLink: {
            visits: number;
            orders: number;
            completed: number;
            linkId: string;
            code: string;
            label: string;
            status: import("../../generated/prisma/enums").ReferralLinkStatus;
        }[];
        trend: {
            visits: number;
            orders: number;
            completed: number;
            date: string;
        }[];
        note: string;
    }>;
    commissionRate(u: AuthUser): Promise<import("./commission-rate.service").CommissionRateCard>;
    commissionStatement(u: AuthUser, period?: string): Promise<import("./commission-statement").StatementView & {
        period: import("./commission-statement").StatementView["period"] & {
            key: string;
        };
        feesSource: "KIOREX" | "PRODUCT_LEDGER" | null;
    }>;
    commissionStatementCsv(u: AuthUser, period: string, res: Response): Promise<StreamableFile>;
    commissionStatementPrint(u: AuthUser, period: string, res: Response, lang?: string, print?: string): Promise<string>;
    performance(u: AuthUser, days?: string): Promise<{
        statement: {
            configured: boolean;
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
        links: {
            visits: number;
            orders: number;
            completed: number;
            visitToOrder: number | null;
            orderToCompleted: number | null;
        };
        kiorex: {
            orders: number;
            completed: number;
            rejectedOrCancelled: number;
        };
        acquisitionPending: boolean;
        days: number;
    }>;
    recommendations(u: AuthUser): Promise<{
        items: import("./growth-recommendations").Recommendation[];
        guardrail: string;
    }>;
}
