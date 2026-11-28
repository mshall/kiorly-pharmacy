import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare const CASH_IN_CATEGORIES: readonly ["FLOAT_TOP_UP", "OWNER_DEPOSIT", "OTHER_IN"];
export declare const CASH_OUT_CATEGORIES: readonly ["PETTY_CASH", "BANK_DEPOSIT", "SUPPLIER_PAYMENT", "EXPENSE", "OWNER_WITHDRAWAL", "OTHER_OUT"];
export declare class CashService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(u: AuthUser, branchId: string, d: {
        kind: "IN" | "OUT";
        category: string;
        amount: string;
        reason: string;
        refType?: string;
        refId?: string;
    }, db?: Pick<PrismaService, "shift" | "cashMovement" | "auditLog">): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        kind: string;
        category: string;
        createdBy: string;
        reason: string;
        refType: string | null;
        refId: string | null;
        shiftId: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    list(orgId: string, q: {
        shiftId?: string;
        branchId?: string;
    }): Promise<{
        amount: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        kind: string;
        category: string;
        createdBy: string;
        reason: string;
        refType: string | null;
        refId: string | null;
        shiftId: string;
    }[]>;
    totals(orgId: string, shiftId: string): Promise<{
        cashIn: import("@prisma/client-runtime-utils").Decimal;
        cashOut: import("@prisma/client-runtime-utils").Decimal;
    }>;
    mustShift(orgId: string, shiftId: string): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").ShiftStatus;
        closedAt: Date | null;
        openedBy: string;
        closedBy: string | null;
        openingFloat: import("@prisma/client-runtime-utils").Decimal;
        countedCash: import("@prisma/client-runtime-utils").Decimal | null;
        expectedCash: import("@prisma/client-runtime-utils").Decimal | null;
        variance: import("@prisma/client-runtime-utils").Decimal | null;
        varianceAlerted: boolean;
        zReport: import("@prisma/client/runtime/client").JsonValue | null;
        openedAt: Date;
    }>;
}
