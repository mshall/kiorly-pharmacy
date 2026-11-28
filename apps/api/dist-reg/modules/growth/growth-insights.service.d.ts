import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { CommissionRateService } from "./commission-rate.service";
import { ProviderLinksService } from "./provider-links.service";
export declare class GrowthInsightsService {
    private readonly prisma;
    private readonly links;
    private readonly rates;
    constructor(prisma: PrismaService, links: ProviderLinksService, rates: CommissionRateService);
    performance(user: AuthUser, q?: {
        days?: number;
    }): Promise<{
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
    recommendations(user: AuthUser): Promise<{
        items: import("./growth-recommendations").Recommendation[];
        guardrail: string;
    }>;
}
