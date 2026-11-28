import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { InventoryService } from "./inventory.service";
import { ReceivingService } from "./receiving.service";
import { CountsService } from "./counts.service";
import { TransfersService } from "./transfers.service";
import { ApprovalService } from "../../auth/approval.service";
import * as dto from "./inventory.dto";
import type { LotStatus } from "../../generated/prisma/client";
export declare class InventoryController {
    private readonly inv;
    private readonly receiving;
    private readonly counts;
    private readonly transfers;
    private readonly approvals;
    private readonly prisma;
    constructor(inv: InventoryService, receiving: ReceivingService, counts: CountsService, transfers: TransfersService, approvals: ApprovalService, prisma: PrismaService);
    lots(u: AuthUser, q: {
        branchId?: string;
        drugId?: string;
        status?: LotStatus;
        expiringWithinDays?: string;
        q?: string;
        includeEmpty?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
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
    stock(u: AuthUser, q: {
        branchId?: string;
        q?: string;
        lowOnly?: string;
        page?: string;
        pageSize?: string;
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
    fefo(u: AuthUser, q: {
        drugId: string;
        qty?: string;
        branchId?: string;
    }): Promise<{
        picks: Array<import("./lot-guard/lot-guard").PickLine & {
            lotNumber: string;
            expiryDate: Date;
        }>;
        shortage: number;
    }>;
    scan(u: AuthUser, d: dto.ScanDto): Promise<{
        gtin: string | null;
        lotNumber: string | null;
        expiryDate: string | null;
        drug: {
            id: string;
            createdAt: Date;
            orgId: string | null;
            active: boolean;
            brandName: string;
            brandNameAr: string | null;
            activeIngredient: string;
            strength: string;
            dosageForm: string;
            packSize: string;
            gtin: string | null;
            manufacturer: string | null;
            rxOnly: boolean;
            controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            coldChain: boolean;
            otc: boolean;
            marketCodes: import("@prisma/client/runtime/client").JsonValue | null;
            substitutionGroupId: string | null;
            vatRate: import("@prisma/client-runtime-utils").Decimal | null;
            category: string | null;
            baseUnit: string;
            sourceKey: string | null;
        } | null;
    }>;
    receive(u: AuthUser, d: dto.ReceiptDto): Promise<{
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string | null;
        purchaseOrderId: string | null;
        receivedAt: Date;
        receivedBy: string;
        idempotencyKey: string | null;
        invoiceNo: string | null;
        invoiceTotal: import("@prisma/client-runtime-utils").Decimal | null;
    } | {
        replayed: boolean;
        lines: {
            id: string;
            drugId: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            lotId: string;
            quantity: number;
            receiptId: string;
            poUnitCost: import("@prisma/client-runtime-utils").Decimal | null;
            prevUnitCost: import("@prisma/client-runtime-utils").Decimal | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string | null;
        purchaseOrderId: string | null;
        receivedAt: Date;
        receivedBy: string;
        idempotencyKey: string | null;
        invoiceNo: string | null;
        invoiceTotal: import("@prisma/client-runtime-utils").Decimal | null;
    }>;
    receipts(u: AuthUser, q: {
        branchId?: string;
    }): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        lines: {
            id: string;
            drugId: string;
            unitCost: import("@prisma/client-runtime-utils").Decimal;
            lotId: string;
            quantity: number;
            receiptId: string;
            poUnitCost: import("@prisma/client-runtime-utils").Decimal | null;
            prevUnitCost: import("@prisma/client-runtime-utils").Decimal | null;
        }[];
    } & {
        id: string;
        orgId: string;
        branchId: string;
        supplierId: string | null;
        purchaseOrderId: string | null;
        receivedAt: Date;
        receivedBy: string;
        idempotencyKey: string | null;
        invoiceNo: string | null;
        invoiceTotal: import("@prisma/client-runtime-utils").Decimal | null;
    })[]>;
    quarantine(u: AuthUser, id: string, d: dto.ReasonDto): Promise<{
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
    release(u: AuthUser, id: string, d: dto.ReasonDto): Promise<{
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
    writeOff(u: AuthUser, id: string, d: dto.ReasonDto): Promise<{
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
    adjust(u: AuthUser, d: dto.AdjustDto): Promise<{
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
    expiry(u: AuthUser, branchId?: string): Promise<{
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
    sweep(u: AuthUser): Promise<{
        alerts: number;
        expired: number;
    }>;
    returnToSupplier(u: AuthUser, d: dto.ReturnSupplierDto): Promise<{
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
    temperature(u: AuthUser, lotId: string, d: dto.TempDto): Promise<{
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
    readings(u: AuthUser, lotId: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        lotId: string;
        temperatureC: import("@prisma/client-runtime-utils").Decimal;
        excursion: boolean;
        recordedBy: string;
        recordedAt: Date;
    }[]>;
    policies(u: AuthUser, branchId?: string): Promise<({
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
    setPolicy(u: AuthUser, d: dto.PolicyDto, branchId?: string): Promise<{
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
    countList(u: AuthUser, branchId?: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }[]>;
    countStart(u: AuthUser, d: dto.CountStartDto): Promise<{
        lines: {
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
    } & {
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    countGet(u: AuthUser, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    countRecord(u: AuthUser, id: string, d: dto.CountRecordDto): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    countSubmit(u: AuthUser, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    countApprove(u: AuthUser, id: string, d: dto.WitnessDto): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    countReject(u: AuthUser, id: string): Promise<{
        lines: {
            lotNumber: string | undefined;
            brandName: string | undefined;
            brandNameAr: string | null | undefined;
            expiryDate: Date | undefined;
            variance: number | null;
            id: string;
            lotId: string;
            stockCountId: string;
            qtyExpected: number;
            qtyCounted: number | null;
        }[];
        id: string;
        orgId: string;
        branchId: string;
        status: import("../../generated/prisma/enums").StockCountStatus;
        type: import("../../generated/prisma/enums").StockCountType;
        startedBy: string;
        approvedBy: string | null;
        startedAt: Date;
        closedAt: Date | null;
    }>;
    transferList(u: AuthUser): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    })[]>;
    transferCreate(u: AuthUser, d: dto.TransferDto): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    transferDispatch(u: AuthUser, id: string, d: dto.WitnessDto): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    transferReceive(u: AuthUser, id: string): Promise<{
        lines: {
            id: string;
            drugId: string;
            lotId: string;
            quantity: number;
            transferId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
    transferCancel(u: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../../generated/prisma/enums").TransferStatus;
        receivedAt: Date | null;
        receivedBy: string | null;
        fromBranchId: string;
        toBranchId: string;
        requestedBy: string;
        dispatchedBy: string | null;
        dispatchedAt: Date | null;
    }>;
}
