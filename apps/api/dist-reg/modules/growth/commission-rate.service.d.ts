import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { type CommissionRateHistoryRow, type EffectiveCommissionRate } from "@kiorex/contracts";
import { type RateParams } from "./commission-rate-view";
export interface CommissionRateCard {
    known: boolean;
    product: string | null;
    state: "SET" | "NOT_SET";
    effective: EffectiveCommissionRate;
    default: EffectiveCommissionRate;
    override: EffectiveCommissionRate | null;
    inheriting: boolean;
    upcoming: CommissionRateHistoryRow | null;
    history: CommissionRateHistoryRow[];
    receivedAt: unknown;
    disclosure: {
        rateDisclosure: {
            en: string;
            ar: string;
        };
        termsSummary: {
            en: string;
            ar: string;
        };
    } | null;
    counsel: {
        status: string;
    } | null;
    params: RateParams;
}
export declare const RATE_ROLES: Set<string>;
export declare class CommissionRateService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    ingest(orgId: string, body: unknown): Promise<{
        applied: boolean;
    }>;
    kiorexOrgRef(orgId: string): Promise<string | null>;
    rate(user: AuthUser, now?: Date): Promise<CommissionRateCard>;
    view(orgId: string, now?: Date): Promise<CommissionRateCard>;
}
