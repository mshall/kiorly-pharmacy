import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { PermissionsService } from "../../auth/permissions.service";
import { FinanceService } from "../finance/finance.service";
import { AlertsService } from "../admin/alerts.service";
export declare class DashboardService {
    private readonly prisma;
    private readonly flags;
    private readonly perms;
    private readonly finance;
    private readonly alerts;
    constructor(prisma: PrismaService, flags: FeatureFlagsService, perms: PermissionsService, finance: FinanceService, alerts: AlertsService);
    summary(u: AuthUser, branchId: string): Promise<{
        salesTrend: {
            day: string;
            total: string;
        }[];
        topSellers: {
            brandName: string;
            qty: number;
        }[];
        refillsDue: number;
        rxVerification: number;
        controlledDiscrepancies: number;
        finance: {
            revenueNet: string;
            grossMargin: string;
            grossMarginPct: number;
            expenses: string;
            receivables: string;
            payables: string;
        } | null;
        today: {
            salesCount: number;
            salesTotal: string;
        };
        rxQueue: number;
        awaitingSignoff: number;
        blockedLots: number;
        expiring30: number;
        expiredInStock: number;
        lowStock: number;
        openShift: {
            id: string;
            openedAt: Date;
        } | null;
        kiorexOrdersPending: number | null;
        syncConflicts: number;
    }>;
}
export declare class DashboardController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: DashboardService, prisma: PrismaService);
    get(u: AuthUser, branchId?: string): Promise<{
        salesTrend: {
            day: string;
            total: string;
        }[];
        topSellers: {
            brandName: string;
            qty: number;
        }[];
        refillsDue: number;
        rxVerification: number;
        controlledDiscrepancies: number;
        finance: {
            revenueNet: string;
            grossMargin: string;
            grossMarginPct: number;
            expenses: string;
            receivables: string;
            payables: string;
        } | null;
        today: {
            salesCount: number;
            salesTotal: string;
        };
        rxQueue: number;
        awaitingSignoff: number;
        blockedLots: number;
        expiring30: number;
        expiredInStock: number;
        lowStock: number;
        openShift: {
            id: string;
            openedAt: Date;
        } | null;
        kiorexOrdersPending: number | null;
        syncConflicts: number;
    }>;
    notifications(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").NotificationStatus;
        sentAt: Date | null;
        refType: string | null;
        refId: string | null;
        body: string;
        channel: import("../../generated/prisma/enums").NotificationChannel;
        recipient: string;
        template: string;
        locale: string;
        provider: string;
        providerMessageId: string | null;
        error: string | null;
        deliveredAt: Date | null;
    }[]>;
    outbox(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        status: import("../../generated/prisma/enums").OutboxStatus;
        sentAt: Date | null;
        type: string;
        occurredAt: Date;
        aggregateId: string;
        attempts: number;
        lastError: string | null;
    }[]>;
}
export declare class DashboardModule {
}
