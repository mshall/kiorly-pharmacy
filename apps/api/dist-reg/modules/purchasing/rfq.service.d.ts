import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { SuppliersService } from "../suppliers/suppliers.service";
export declare class RfqService {
    private readonly prisma;
    private readonly notify;
    private readonly suppliers;
    constructor(prisma: PrismaService, notify: NotificationsService, suppliers: SuppliersService);
    private nextNumber;
    create(u: AuthUser, branchId: string, d: {
        notes?: string;
        dueAt?: string;
        lines: Array<{
            drugId: string;
            qty: number;
        }>;
        supplierIds: string[];
    }): Promise<{
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
    list(orgId: string, q: {
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
    get(orgId: string, id: string): Promise<{
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
    send(u: AuthUser, id: string): Promise<{
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
    recordQuote(u: AuthUser, id: string, supplierId: string, d: {
        lines: Array<{
            rfqLineId: string;
            unitPrice: string;
        }>;
        leadTimeDays?: number;
        validUntil?: string;
        notes?: string;
    }): Promise<{
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
    decline(u: AuthUser, id: string, supplierId: string): Promise<{
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
    award(u: AuthUser, id: string, d: {
        mode: "CHEAPEST_PER_LINE" | "SUPPLIER";
        supplierId?: string;
    }): Promise<{
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
    cancel(u: AuthUser, id: string): Promise<{
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
    fromSuggestions(u: AuthUser, branchId: string, supplierIds: string[], dueAt?: string): Promise<{
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
