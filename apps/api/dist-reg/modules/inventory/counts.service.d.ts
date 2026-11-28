import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "./stock-ledger.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class CountsService {
    private readonly prisma;
    private readonly ledger;
    constructor(prisma: PrismaService, ledger: StockLedger);
    start(user: AuthUser, branchId: string, type: "CYCLE" | "FULL", drugIds?: string[]): Promise<{
        lines: {
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
    } & {
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    get(orgId: string, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    list(orgId: string, branchId?: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }[]>;
    record(user: AuthUser, id: string, lines: Array<{
        lotId: string;
        qtyCounted: number;
    }>): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    submit(user: AuthUser, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    approve(user: AuthUser, id: string, witness?: {
        id: string;
        name: string;
    }): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    reject(user: AuthUser, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
}
