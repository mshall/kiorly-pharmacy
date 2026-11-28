import { PrismaService } from "../../prisma/prisma.service";
import { AGING_BUCKETS } from "../../common/aging";
import type { AuthUser } from "../../auth/auth-user";
export declare class PurchasingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    aging(orgId: string, asOf?: Date): Promise<{
        asOf: Date;
        totals: {
            [k: string]: string;
        };
        outstanding: string;
        suppliers: {
            supplierId: string;
            name: string;
            paymentTerms: string | null;
            creditLimit: string | null;
            overLimit: boolean;
            outstanding: string;
            advance: string;
            buckets: Record<(typeof AGING_BUCKETS)[number], string>;
            oldestDaysPastDue: number;
        }[];
    }>;
    statement(orgId: string, supplierId: string, q: {
        from?: Date;
        to?: Date;
    }): Promise<{
        supplier: {
            id: string;
            name: string;
            paymentTerms: string | null;
        };
        openingBalance: string;
        closingBalance: string;
        entries: {
            id: string;
            at: Date;
            type: import("../../generated/prisma/enums").SupplierLedgerType;
            note: string | null;
            amount: string;
            balance: string;
            refType: string | null;
            refId: string | null;
        }[];
    }>;
    costVariance(orgId: string, q: {
        from?: Date;
        to?: Date;
        minPct: number;
        branchId?: string;
    }): Promise<{
        minPct: number;
        count: number;
        extraCostVsPo: string;
        items: {
            receiptLineId: string;
            receivedAt: Date;
            invoiceNo: string | null;
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            supplier: string | null;
            quantity: number;
            unitCost: string;
            poUnitCost: string | null;
            prevUnitCost: string | null;
            pctVsPo: number | null;
            pctVsPrev: number | null;
            extraCost: string | null;
            worst: number;
        }[];
    }>;
    supplierReturns(orgId: string, q: {
        supplierId?: string;
        branchId?: string;
    }): Promise<{
        creditAmount: string;
        supplierName: string | null;
        lotNumber: string | null;
        brandName: string | null;
        brandNameAr: string | null;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        supplierId: string;
        reason: string;
        lotId: string;
        quantity: number;
    }[]>;
    updatePo(u: AuthUser, id: string, d: {
        notes?: string;
        expectedAt?: string;
        lines?: Array<{
            drugId: string;
            qtyOrdered: number;
            unitCost: string;
        }>;
    }): Promise<{
        lines: {
            id: string;
            drugId: string;
            purchaseOrderId: string;
            qtyOrdered: number;
            qtyReceived: number;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string | null;
        supplierId: string;
        status: import("../../generated/prisma/enums").PurchaseOrderStatus;
        origin: string;
        poNumber: string | null;
        expectedAt: Date | null;
        notes: string | null;
        sentVia: string | null;
        totalCost: import("@prisma/client-runtime-utils").Decimal;
        sentAt: Date | null;
    }>;
    closePo(u: AuthUser, id: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string | null;
        supplierId: string;
        status: import("../../generated/prisma/enums").PurchaseOrderStatus;
        origin: string;
        poNumber: string | null;
        expectedAt: Date | null;
        notes: string | null;
        sentVia: string | null;
        totalCost: import("@prisma/client-runtime-utils").Decimal;
        sentAt: Date | null;
    }>;
    poHtml(orgId: string, id: string, lang: "ar" | "en"): Promise<string>;
}
