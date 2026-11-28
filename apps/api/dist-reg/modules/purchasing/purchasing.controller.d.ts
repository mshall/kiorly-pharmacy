import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { PurchasingService } from "./purchasing.service";
import { RfqService } from "./rfq.service";
declare class RfqLineDto {
    drugId: string;
    qty: number;
}
declare class RfqDto {
    branchId?: string;
    notes?: string;
    dueAt?: string;
    lines: RfqLineDto[];
    supplierIds: string[];
}
declare class RfqFromSuggDto {
    branchId?: string;
    supplierIds: string[];
    dueAt?: string;
}
declare class QuoteLineDto {
    rfqLineId: string;
    unitPrice: string;
}
declare class QuoteDto {
    lines: QuoteLineDto[];
    leadTimeDays?: number;
    validUntil?: string;
    notes?: string;
}
declare class AwardDto {
    mode: "CHEAPEST_PER_LINE" | "SUPPLIER";
    supplierId?: string;
}
declare class PoLineDto {
    drugId: string;
    qtyOrdered: number;
    unitCost: string;
}
declare class PoPatchDto {
    notes?: string;
    expectedAt?: string;
    lines?: PoLineDto[];
}
declare class CloseDto {
    reason: string;
}
export declare class PurchasingController {
    private readonly svc;
    private readonly rfq;
    private readonly prisma;
    constructor(svc: PurchasingService, rfq: RfqService, prisma: PrismaService);
    aging(u: AuthUser, asOf?: string): Promise<{
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
            buckets: Record<typeof import("../../common/aging").AGING_BUCKETS[number], string>;
            oldestDaysPastDue: number;
        }[];
    }>;
    statement(u: AuthUser, id: string, q: {
        from?: string;
        to?: string;
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
    costVariance(u: AuthUser, q: {
        from?: string;
        to?: string;
        minPct?: string;
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
    returns(u: AuthUser, q: {
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
    poPatch(u: AuthUser, id: string, d: PoPatchDto): Promise<{
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
    poClose(u: AuthUser, id: string, d: CloseDto): Promise<{
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
    poPrint(u: AuthUser, id: string, lang?: string): Promise<string>;
    rfqList(u: AuthUser, q: {
        status?: string;
        branchId?: string;
    }): Promise<{
        lineCount: number;
        quoted: number;
        invited: number;
        lines: {
            id: string;
            drugId: string;
            rfqId: string;
            qty: number;
        }[];
        quotes: {
            id: string;
            createdAt: Date;
            leadTimeDays: number | null;
            supplierId: string;
            status: string;
            notes: string | null;
            receivedAt: Date | null;
            validUntil: Date | null;
            rfqId: string;
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }[]>;
    rfqCreate(u: AuthUser, d: RfqDto): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqFromSug(u: AuthUser, d: RfqFromSuggDto): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqGet(u: AuthUser, id: string): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqSend(u: AuthUser, id: string): Promise<{
        notified: number;
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqQuote(u: AuthUser, id: string, sid: string, d: QuoteDto): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqDecline(u: AuthUser, id: string, sid: string): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
    rfqAward(u: AuthUser, id: string, d: AwardDto): Promise<{
        rfq: {
            quotes: {
                id: string;
                supplierId: string;
                supplierName: string;
                status: string;
                leadTimeDays: number | null;
                validUntil: Date | null;
                notes: string | null;
                receivedAt: Date | null;
                complete: boolean;
                total: string;
            }[];
            lines: {
                id: string;
                drugId: string;
                qty: number;
                drug: {
                    id: string;
                    brandName: string;
                    brandNameAr: string | null;
                    strength: string;
                } | null;
                bestSupplierId: string | null;
                bestPrice: string | null;
                offers: {
                    supplierId: string;
                    unitPrice: string;
                }[];
            }[];
            number: string;
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            status: string;
            notes: string | null;
            dueAt: Date | null;
            awardedAt: Date | null;
        };
        purchaseOrders: ({
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
        })[];
    }>;
    rfqCancel(u: AuthUser, id: string): Promise<{
        quotes: {
            id: string;
            supplierId: string;
            supplierName: string;
            status: string;
            leadTimeDays: number | null;
            validUntil: Date | null;
            notes: string | null;
            receivedAt: Date | null;
            complete: boolean;
            total: string;
        }[];
        lines: {
            id: string;
            drugId: string;
            qty: number;
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
            } | null;
            bestSupplierId: string | null;
            bestPrice: string | null;
            offers: {
                supplierId: string;
                unitPrice: string;
            }[];
        }[];
        number: string;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: string;
        notes: string | null;
        dueAt: Date | null;
        awardedAt: Date | null;
    }>;
}
export {};
