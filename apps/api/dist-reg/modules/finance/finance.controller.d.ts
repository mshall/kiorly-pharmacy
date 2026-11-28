import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { FinanceService } from "./finance.service";
declare class ExpenseDto {
    branchId?: string;
    category: string;
    amount: string;
    vatAmount?: string;
    method?: string;
    description: string;
    supplierId?: string;
    expenseDate?: string;
    receiptRef?: string;
    fromDrawer?: boolean;
}
export declare class FinanceController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: FinanceService, prisma: PrismaService);
    overview(u: AuthUser, q: {
        from?: string;
        to?: string;
        branchId?: string;
    }): Promise<{
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
    margin(u: AuthUser, q: {
        from?: string;
        to?: string;
        branchId?: string;
        by?: string;
    }): Promise<{
        key: string;
        label: string;
        labelAr: string | null;
        units: number;
        revenue: string;
        cogs: string;
        margin: string;
        marginPct: number;
    }[]>;
    receivables(u: AuthUser): Promise<{
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
            buckets: Record<typeof import("../../common/aging").AGING_BUCKETS[number], string>;
            oldestDaysPastDue: number;
        }[];
    }>;
    categories(): readonly ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"];
    expenses(u: AuthUser, q: {
        from?: string;
        to?: string;
        branchId?: string;
        category?: string;
        page?: string;
        pageSize?: string;
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
    createExpense(u: AuthUser, d: ExpenseDto): Promise<{
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
}
export {};
