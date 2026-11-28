import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { InventoryService } from "../inventory/inventory.service";
import { FeatureFlagsService } from "../../feature-flags/feature-flags.service";
import { ForecastingService } from "../forecasting/forecasting.service";
import { type EntitlementsPort } from "../../kernel-adapter/ports";
export interface Suggestion {
    drugId: string;
    brandName: string;
    brandNameAr: string | null;
    position: number;
    minQty: number;
    maxQty: number;
    suggestedQty: number;
    method: "MIN_MAX" | "FORECAST";
    supplierId: string | null;
    forecast?: {
        avgDailyDemand: number;
        explanation: string;
    };
}
export declare class SuppliersService {
    private readonly prisma;
    private readonly notify;
    private readonly inv;
    private readonly flags;
    private readonly forecasting;
    private readonly ent;
    constructor(prisma: PrismaService, notify: NotificationsService, inv: InventoryService, flags: FeatureFlagsService, forecasting: ForecastingService, ent: EntitlementsPort);
    list(orgId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        email: string | null;
        paymentTerms: string | null;
        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
        balance: import("@prisma/client-runtime-utils").Decimal;
        leadTimeDays: number;
    }[]>;
    get(orgId: string, id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        email: string | null;
        paymentTerms: string | null;
        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
        balance: import("@prisma/client-runtime-utils").Decimal;
        leadTimeDays: number;
    }>;
    create(orgId: string, d: {
        name: string;
        phone?: string;
        email?: string;
        paymentTerms?: string;
        creditLimit?: string;
        leadTimeDays?: number;
    }): import("../../generated/prisma/models").Prisma__SupplierClient<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        email: string | null;
        paymentTerms: string | null;
        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
        balance: import("@prisma/client-runtime-utils").Decimal;
        leadTimeDays: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(orgId: string, id: string, d: Record<string, unknown>): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        phone: string | null;
        active: boolean;
        email: string | null;
        paymentTerms: string | null;
        creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
        balance: import("@prisma/client-runtime-utils").Decimal;
        leadTimeDays: number;
    }>;
    ledger(orgId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        createdBy: string;
        supplierId: string;
        type: import("../../generated/prisma/enums").SupplierLedgerType;
        refType: string | null;
        refId: string | null;
        note: string | null;
        idempotencyKey: string | null;
        amount: import("@prisma/client-runtime-utils").Decimal;
    }[]>;
    pay(user: AuthUser, id: string, amount: string, note?: string, idempotencyKey?: string): Promise<{
        entry: {
            id: string;
            createdAt: Date;
            orgId: string;
            createdBy: string;
            supplierId: string;
            type: import("../../generated/prisma/enums").SupplierLedgerType;
            refType: string | null;
            refId: string | null;
            note: string | null;
            idempotencyKey: string | null;
            amount: import("@prisma/client-runtime-utils").Decimal;
        };
        replayed: boolean;
    }>;
    private nextPoNumber;
    createPo(user: AuthUser, input: {
        branchId: string;
        supplierId: string;
        origin?: string;
        notes?: string;
        lines: Array<{
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
    listPos(orgId: string, branchId?: string): Promise<({
        supplier: {
            name: string;
        };
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
    })[]>;
    getPo(orgId: string, id: string): Promise<{
        supplier: {
            id: string;
            name: string;
            createdAt: Date;
            orgId: string;
            phone: string | null;
            active: boolean;
            email: string | null;
            paymentTerms: string | null;
            creditLimit: import("@prisma/client-runtime-utils").Decimal | null;
            balance: import("@prisma/client-runtime-utils").Decimal;
            leadTimeDays: number;
        };
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
    sendPo(user: AuthUser, id: string, via: "WHATSAPP" | "EMAIL"): Promise<{
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
    cancelPo(user: AuthUser, id: string): Promise<{
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
    suggestions(user: AuthUser, branchId: string): Promise<{
        method: "MIN_MAX" | "FORECAST";
        items: Suggestion[];
    }>;
    createPosFromSuggestions(user: AuthUser, branchId: string, items: Array<{
        drugId: string;
        qty: number;
        supplierId?: string;
    }>): Promise<({
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
    })[]>;
}
