import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "./stock-ledger.service";
import { type MarketPackPort } from "../../kernel-adapter/ports";
import type { AuthUser } from "../../auth/auth-user";
import { UomService } from "./uom.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
export interface ReceiptLineInput {
    drugId?: string;
    scan?: string;
    lotNumber?: string;
    expiryDate?: string;
    quantity: number;
    unitCost: string;
    temperatureC?: number;
    uom?: string;
    locationId?: string;
}
export interface ReceiptInput {
    branchId: string;
    supplierId?: string;
    purchaseOrderId?: string;
    invoiceNo?: string;
    invoiceTotal?: string;
    idempotencyKey?: string;
    lines: ReceiptLineInput[];
}
export declare class ReceivingService {
    private readonly prisma;
    private readonly ledger;
    private readonly packs;
    private readonly uoms;
    private readonly modes;
    constructor(prisma: PrismaService, ledger: StockLedger, packs: MarketPackPort, uoms: UomService, modes: TenantModeService);
    resolveScan(orgId: string, code: string): Promise<{
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
    receive(user: AuthUser, input: ReceiptInput): Promise<{
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
}
