import { PushService } from "../mobile/push.service";
import { PrismaService } from "../../prisma/prisma.service";
import { StockLedger } from "../inventory/stock-ledger.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class ControlledService {
    private readonly prisma;
    private readonly ledger;
    private readonly push?;
    constructor(prisma: PrismaService, ledger: StockLedger, push?: PushService | undefined);
    register(orgId: string, q: {
        branchId?: string;
        drugId?: string;
        from?: Date;
        to?: Date;
        skip: number;
        take: number;
    }): Promise<{
        total: number;
        items: {
            drug: {
                id: string;
                brandName: string;
                brandNameAr: string | null;
                strength: string;
                controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
            } | null;
            lotNumber: string | null;
            performedByName: string | null;
            id: string;
            orgId: string;
            branchId: string;
            kind: string;
            drugId: string;
            reason: string | null;
            lotId: string;
            qtyDelta: number;
            refType: string | null;
            refId: string | null;
            performedBy: string;
            occurredAt: Date;
            balanceAfter: number;
            prescriberLicenceNo: string | null;
            prescriptionId: string | null;
            patientName: string | null;
            movementId: string;
            patientIdLast4: string | null;
            witnessId: string | null;
            witnessName: string | null;
        }[];
    }>;
    balances(orgId: string, branchId?: string): Promise<{
        branchId: string;
        drug: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
            controlledSchedule: import("../../generated/prisma/enums").ControlledSchedule;
        } | null;
        drugId: string;
        onHand: number;
        registerBalance: number;
        inSync: boolean;
        lastMovementAt: Date | null;
    }[]>;
    audit(user: AuthUser, d: {
        branchId: string;
        drugId: string;
        countedQty: number;
        notes?: string;
        witness: {
            id: string;
            name: string;
        };
    }): Promise<{
        match: boolean;
        expected: number;
        counted: number;
        difference: number;
        discrepancy: {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            drugId: string;
            status: string;
            notes: string | null;
            resolvedAt: Date | null;
            resolvedBy: string | null;
            witnessId: string | null;
            expectedQty: number;
            countedQty: number;
            difference: number;
            reportedBy: string;
            resolution: string | null;
        } | null;
    }>;
    discrepancies(orgId: string, q: {
        status?: string;
        branchId?: string;
    }): Promise<{
        drug: {
            id: string;
            brandName: string;
            brandNameAr: string | null;
            strength: string;
        } | null;
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        drugId: string;
        status: string;
        notes: string | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        witnessId: string | null;
        expectedQty: number;
        countedQty: number;
        difference: number;
        reportedBy: string;
        resolution: string | null;
    }[]>;
    resolve(user: AuthUser, id: string, d: {
        resolution: string;
        adjustLotId?: string;
        witness?: {
            id: string;
            name: string;
        };
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        drugId: string;
        status: string;
        notes: string | null;
        resolvedAt: Date | null;
        resolvedBy: string | null;
        witnessId: string | null;
        expectedQty: number;
        countedQty: number;
        difference: number;
        reportedBy: string;
        resolution: string | null;
    }>;
}
