import type { AuthUser } from "../../auth/auth-user";
import { SuppliersService } from "./suppliers.service";
import { RecallService } from "./recall/recall.service";
import { PrismaService } from "../../prisma/prisma.service";
declare class SupplierDto {
    name: string;
    phone?: string;
    email?: string;
    paymentTerms?: string;
    creditLimit?: string;
    leadTimeDays?: number;
}
declare class SupplierPatchDto {
    name?: string;
    phone?: string;
    email?: string;
    paymentTerms?: string;
    creditLimit?: string;
    leadTimeDays?: number;
    active?: boolean;
}
declare class PayDto {
    amount: string;
    note?: string;
    idempotencyKey?: string;
}
declare class PoLineDto {
    drugId: string;
    qtyOrdered: number;
    unitCost: string;
}
declare class PoDto {
    branchId?: string;
    supplierId: string;
    notes?: string;
    lines: PoLineDto[];
}
declare class SendDto {
    via: "WHATSAPP" | "EMAIL";
}
declare class SuggestionItemDto {
    drugId: string;
    qty: number;
    supplierId?: string;
}
declare class FromSuggestionsDto {
    branchId?: string;
    items: SuggestionItemDto[];
}
declare class RecallDto {
    drugId: string;
    lotNumbers: string[];
    reason: string;
    source?: string;
}
export declare class SuppliersController {
    private readonly svc;
    private readonly recalls;
    private readonly prisma;
    constructor(svc: SuppliersService, recalls: RecallService, prisma: PrismaService);
    list(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
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
    create(u: AuthUser, d: SupplierDto): import("../../generated/prisma/models").Prisma__SupplierClient<{
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
    get(u: AuthUser, id: string): Promise<{
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
    update(u: AuthUser, id: string, d: SupplierPatchDto): Promise<{
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
    ledger(u: AuthUser, id: string): Promise<{
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
    pay(u: AuthUser, id: string, d: PayDto): Promise<{
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
    pos(u: AuthUser, branchId?: string): Promise<({
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
    createPo(u: AuthUser, d: PoDto): Promise<{
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
    getPo(u: AuthUser, id: string): Promise<{
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
    send(u: AuthUser, id: string, d: SendDto): Promise<{
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
    cancel(u: AuthUser, id: string): Promise<{
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
    suggestions(u: AuthUser, branchId?: string): Promise<{
        method: "MIN_MAX" | "FORECAST";
        items: import("./suppliers.service").Suggestion[];
    }>;
    fromSuggestions(u: AuthUser, d: FromSuggestionsDto): Promise<({
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
    recallList(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }[]>;
    recallEnter(u: AuthUser, d: RecallDto): Promise<{
        blockedWithinMs: number;
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }>;
    recallLift(u: AuthUser, id: string): Promise<{
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }>;
}
export {};
