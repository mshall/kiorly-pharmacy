import { PrismaService } from "../../prisma/prisma.service";
import { AGING_BUCKETS } from "../../common/aging";
import type { AuthUser } from "../../auth/auth-user";
import { CashService } from "../pos/cash.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
export declare const EXPENSE_CATEGORIES: readonly ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"];
export interface Range {
    orgId: string;
    branchId?: string;
    from: Date;
    to: Date;
}
export declare class FinanceService {
    private readonly prisma;
    private readonly cash;
    private readonly modes;
    constructor(prisma: PrismaService, cash: CashService, modes: TenantModeService);
    private salesTotals;
    overview(r: Range): Promise<{
        range: {
            from: Date;
            to: Date;
        };
        sales: {
            count: number;
            gross: string;
            discounts: string;
            vatIncluded: string;
            revenueNet: string;
            refunds: string;
        };
        cogs: string;
        grossMargin: string;
        grossMarginPct: number;
        expenses: {
            total: string;
            byCategory: {
                category: string;
                amount: string;
            }[];
        };
        netOperatingProfit: string;
        paymentsByMethod: {
            method: string;
            received: string;
            refunded: string;
            net: string;
        }[];
        receivables: string;
        payables: string;
        claimsOutstanding: string;
        daily: {
            day: string;
            revenue: string;
            cogs: string;
            margin: string;
            expenses: string;
        }[];
    }>;
    margin(r: Range, by: "product" | "category"): Promise<{
        key: string;
        label: string;
        labelAr: string | null;
        units: number;
        revenue: string;
        cogs: string;
        margin: string;
        marginPct: number;
    }[]>;
    createExpense(u: AuthUser, branchId: string, d: {
        category: string;
        amount: string;
        vatAmount?: string;
        method?: string;
        description: string;
        supplierId?: string;
        expenseDate?: string;
        receiptRef?: string;
        fromDrawer?: boolean;
    }): Promise<{
        amount: string;
        vatAmount: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        category: string;
        createdBy: string;
        supplierId: string | null;
        voidedBy: string | null;
        voidedAt: Date | null;
        method: string;
        description: string;
        expenseDate: Date;
        receiptRef: string | null;
        fromDrawer: boolean;
        cashMovementId: string | null;
    }>;
    listExpenses(orgId: string, q: {
        branchId?: string;
        category?: string;
        from?: Date;
        to?: Date;
        skip: number;
        take: number;
    }): Promise<{
        total: number;
        sum: string;
        items: {
            amount: string;
            vatAmount: string;
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            category: string;
            createdBy: string;
            supplierId: string | null;
            voidedBy: string | null;
            voidedAt: Date | null;
            method: string;
            description: string;
            expenseDate: Date;
            receiptRef: string | null;
            fromDrawer: boolean;
            cashMovementId: string | null;
        }[];
    }>;
    voidExpense(u: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        category: string;
        createdBy: string;
        supplierId: string | null;
        voidedBy: string | null;
        voidedAt: Date | null;
        vatAmount: import("@prisma/client-runtime-utils").Decimal;
        method: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        description: string;
        expenseDate: Date;
        receiptRef: string | null;
        fromDrawer: boolean;
        cashMovementId: string | null;
    }>;
    receivables(orgId: string, asOf?: Date): Promise<{
        asOf: Date;
        creditDays: number;
        outstanding: string;
        totals: {
            [k: string]: string;
        };
        customers: {
            accountId: string;
            customer: {
                id: string;
                phone: string | null;
                displayName: string;
                customerNo: string | null;
            };
            creditLimit: string;
            balance: string;
            outstanding: string;
            overLimit: boolean;
            buckets: Record<(typeof AGING_BUCKETS)[number], string>;
            oldestDaysPastDue: number;
        }[];
    }>;
}
