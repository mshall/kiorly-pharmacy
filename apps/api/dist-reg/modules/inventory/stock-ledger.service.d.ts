import { Prisma, type PrismaClient, type StockMovementType, type StockLot } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { type PickLine } from "./lot-guard/lot-guard";
type Tx = Prisma.TransactionClient;
type Db = PrismaClient | Tx;
export interface PostMovement {
    orgId: string;
    branchId: string;
    lotId: string;
    type: StockMovementType;
    quantity: number;
    performedBy: string;
    reason?: string;
    refType?: string;
    refId?: string;
    approvedBy?: string;
    fromReservation?: boolean;
    reasonCode?: string;
    witness?: {
        id: string;
        name: string;
    };
}
export declare class StockLedger {
    private readonly prisma;
    constructor(prisma: PrismaService);
    lockLot(tx: Tx, lotId: string, orgId: string): Promise<StockLot>;
    post(tx: Tx, m: PostMovement): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        reason: string | null;
        lotId: string;
        type: StockMovementType;
        qtyDelta: number;
        refType: string | null;
        refId: string | null;
        reasonCode: string | null;
        managerApprovalBy: string | null;
        performedBy: string;
        occurredAt: Date;
    }>;
    candidateLots(db: Db, orgId: string, branchId: string, drugId: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        drugId: string;
        supplierId: string | null;
        status: import("../../generated/prisma/enums").LotStatus;
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
        statusBeforeBlock: import("../../generated/prisma/enums").LotStatus | null;
        locationId: string | null;
    }[]>;
    fefoPlan(db: Db, orgId: string, branchId: string, drugId: string, qty: number): Promise<{
        picks: Array<PickLine & {
            lotNumber: string;
            expiryDate: Date;
        }>;
        shortage: number;
    }>;
}
export {};
