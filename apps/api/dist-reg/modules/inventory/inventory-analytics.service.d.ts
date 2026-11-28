import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export type MoverClass = "FAST" | "NORMAL" | "SLOW" | "DEAD";
export declare function classifyMovers<T extends {
    units: number;
    onHand: number;
}>(rows: T[]): Array<T & {
    class: MoverClass;
}>;
export declare class InventoryAnalyticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    movers(orgId: string, branchId: string, days: number): Promise<{
        days: number;
        counts: {
            FAST: number;
            NORMAL: number;
            SLOW: number;
            DEAD: number;
        };
        deadStockValue: string;
        items: ({
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            category: string | null;
            units: number;
            perDay: number;
            onHand: number;
            daysOfCover: number | null;
            stockValue: string;
            lastSold: Date | null;
            lastReceived: Date | null;
        } & {
            class: MoverClass;
        })[];
    }>;
    autoReorder(u: AuthUser, branchId: string, o: {
        days: number;
        safetyDays: number;
        reviewDays: number;
        overwrite: boolean;
    }): Promise<{
        created: number;
        updated: number;
        skipped: number;
    }>;
    coldChain(orgId: string, branchId: string): Promise<{
        lotId: string;
        brandName: string;
        brandNameAr: string | null;
        strength: string;
        lotNumber: string;
        expiryDate: Date;
        qtyOnHand: number;
        status: import("../../generated/prisma/enums").LotStatus;
        locationId: string | null;
        lastReading: {
            temperatureC: string;
            excursion: boolean;
            recordedAt: Date;
        } | null;
        readings24h: number;
    }[]>;
    movements(orgId: string, q: {
        branchId?: string;
        type?: string;
        reasonCode?: string;
        from?: Date;
        to?: Date;
        q?: string;
        skip: number;
        take: number;
    }): Promise<{
        total: number;
        items: {
            id: string;
            type: import("../../generated/prisma/enums").StockMovementType;
            qtyDelta: number;
            reason: string | null;
            reasonCode: string | null;
            occurredAt: Date;
            branchId: string;
            lotId: string;
            lotNumber: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            performedBy: string;
        }[];
    }>;
    lotLabelsHtml(orgId: string, lotIds: string[], lang: "ar" | "en"): Promise<string>;
}
