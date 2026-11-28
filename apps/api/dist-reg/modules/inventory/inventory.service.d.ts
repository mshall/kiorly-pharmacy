import { PushService } from "../mobile/push.service";
import { Prisma, type LotStatus } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "./stock-ledger.service";
import { type MarketPackPort } from "../../kernel-adapter/ports";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
export interface LotQuery {
    branchId?: string;
    drugId?: string;
    status?: LotStatus;
    expiringWithinDays?: number;
    q?: string;
    includeEmpty?: boolean;
    skip: number;
    take: number;
}
export declare class InventoryService {
    private readonly prisma;
    private readonly ledger;
    private readonly packs;
    private readonly notify;
    private readonly push?;
    constructor(prisma: PrismaService, ledger: StockLedger, packs: MarketPackPort, notify: NotificationsService, push?: PushService | undefined);
    lots(orgId: string, q: LotQuery): Promise<{
        total: number;
        items: {
            unitCost: string;
            available: number;
            daysToExpiry: number;
            blockReason: import("./lot-guard/lot-guard").LotBlockReason | null;
            drug: {
                brandName: string;
                brandNameAr: string | null;
                strength: string;
                dosageForm: string;
                controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
                coldChain: boolean;
            };
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            drugId: string;
            supplierId: string | null;
            status: LotStatus;
            purchaseOrderId: string | null;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            qtyReserved: number;
            supplierInvoiceNo: string | null;
            receivedAt: Date;
            blockedReason: string | null;
            blockedAt: Date | null;
            recallNoticeId: string | null;
            statusBeforeBlock: LotStatus | null;
            locationId: string | null;
        }[];
    }>;
    stock(orgId: string, branchId: string, q: {
        q?: string;
        skip: number;
        take: number;
        lowOnly?: boolean;
    }): Promise<{
        total: number;
        items: {
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            dosageForm: string;
            rxOnly: boolean;
            controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            onHand: number;
            reserved: number;
            sellable: number;
            blocked: number;
            nextExpiry: Date | null;
            minQty: number | null;
            maxQty: number | null;
            low: boolean;
        }[];
    }>;
    fefo(orgId: string, branchId: string, drugId: string, qty: number): Promise<{
        picks: Array<import("./lot-guard/lot-guard").PickLine & {
            lotNumber: string;
            expiryDate: Date;
        }>;
        shortage: number;
    }>;
    atp(orgId: string, branchId: string): Promise<Map<string, number>>;
    quarantine(user: AuthUser, lotId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        drugId: string;
        supplierId: string | null;
        status: LotStatus;
        purchaseOrderId: string | null;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        lotNumber: string;
        expiryDate: Date;
        qtyOnHand: number;
        qtyReserved: number;
        supplierInvoiceNo: string | null;
        receivedAt: Date;
        blockedReason: string | null;
        blockedAt: Date | null;
        recallNoticeId: string | null;
        statusBeforeBlock: LotStatus | null;
        locationId: string | null;
    }>;
    release(user: AuthUser, lotId: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        drugId: string;
        supplierId: string | null;
        status: LotStatus;
        purchaseOrderId: string | null;
        unitCost: import("@prisma/client-runtime-utils").Decimal;
        lotNumber: string;
        expiryDate: Date;
        qtyOnHand: number;
        qtyReserved: number;
        supplierInvoiceNo: string | null;
        receivedAt: Date;
        blockedReason: string | null;
        blockedAt: Date | null;
        recallNoticeId: string | null;
        statusBeforeBlock: LotStatus | null;
        locationId: string | null;
    }>;
    adjust(user: AuthUser, lotId: string, quantity: number, reason: string, approvedBy?: string, witness?: {
        id: string;
        name: string;
    }, reasonCode?: string): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        reason: string | null;
        lotId: string;
        type: import("../../generated/prisma/enums").StockMovementType;
        qtyDelta: number;
        refType: string | null;
        refId: string | null;
        reasonCode: string | null;
        managerApprovalBy: string | null;
        performedBy: string;
        occurredAt: Date;
    }>;
    writeOff(user: AuthUser, lotId: string, reason: string, witness?: {
        id: string;
        name: string;
    }): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        reason: string | null;
        lotId: string;
        type: import("../../generated/prisma/enums").StockMovementType;
        qtyDelta: number;
        refType: string | null;
        refId: string | null;
        reasonCode: string | null;
        managerApprovalBy: string | null;
        performedBy: string;
        occurredAt: Date;
    }>;
    expirySweep(orgId?: string): Promise<{
        expired: number;
    }>;
    expiryBuckets(orgId: string, branchId?: string): Promise<{
        expired: {
            lotId: string;
            branchId: string;
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            daysToExpiry: number;
            supplierId: string | null;
            unitCost: string;
            status: LotStatus;
        }[];
        d30: {
            lotId: string;
            branchId: string;
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            daysToExpiry: number;
            supplierId: string | null;
            unitCost: string;
            status: LotStatus;
        }[];
        d60: {
            lotId: string;
            branchId: string;
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            daysToExpiry: number;
            supplierId: string | null;
            unitCost: string;
            status: LotStatus;
        }[];
        d90: {
            lotId: string;
            branchId: string;
            drugId: string;
            brandName: string;
            brandNameAr: string | null;
            lotNumber: string;
            expiryDate: Date;
            qtyOnHand: number;
            daysToExpiry: number;
            supplierId: string | null;
            unitCost: string;
            status: LotStatus;
        }[];
    }>;
    runExpiryAlerts(orgId?: string): Promise<{
        alerts: number;
    }>;
    returnToSupplier(user: AuthUser, input: {
        lotId: string;
        quantity: number;
        reason: string;
        creditAmount?: string;
        witness?: {
            id: string;
            name: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        supplierId: string;
        reason: string;
        lotId: string;
        quantity: number;
        creditAmount: import("@prisma/client-runtime-utils").Decimal;
    }>;
    recordTemperature(user: AuthUser, lotId: string, temperatureC: number): Promise<{
        reading: {
            id: string;
            orgId: string;
            lotId: string;
            temperatureC: import("@prisma/client-runtime-utils").Decimal;
            excursion: boolean;
            recordedBy: string;
            recordedAt: Date;
        };
        excursion: boolean;
        quarantined: boolean;
        range: {
            min: number;
            max: number;
        };
    }>;
    readings(orgId: string, lotId: string): Prisma.PrismaPromise<{
        id: string;
        orgId: string;
        lotId: string;
        temperatureC: import("@prisma/client-runtime-utils").Decimal;
        excursion: boolean;
        recordedBy: string;
        recordedAt: Date;
    }[]>;
    setReorderPolicy(orgId: string, branchId: string, p: {
        drugId: string;
        minQty: number;
        maxQty: number;
        leadTimeDays?: number;
        supplierId?: string;
    }): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        drugId: string;
        leadTimeDays: number;
        supplierId: string | null;
        updatedAt: Date;
        minQty: number;
        maxQty: number;
    }>;
    reorderPolicies(orgId: string, branchId: string): Prisma.PrismaPromise<({
        drug: {
            brandName: string;
            brandNameAr: string | null;
            strength: string;
        };
    } & {
        id: string;
        orgId: string;
        branchId: string;
        drugId: string;
        leadTimeDays: number;
        supplierId: string | null;
        updatedAt: Date;
        minQty: number;
        maxQty: number;
    })[]>;
}
