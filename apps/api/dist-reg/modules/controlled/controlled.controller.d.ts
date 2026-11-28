import type { AuthUser } from "../../auth/auth-user";
import { ApprovalDto, ApprovalService } from "../../auth/approval.service";
import { ControlledService } from "./controlled.service";
import { PrismaService } from "../../prisma/prisma.service";
declare class AuditDto {
    branchId?: string;
    drugId: string;
    countedQty: number;
    notes?: string;
    witness: ApprovalDto;
}
declare class ResolveDto {
    resolution: string;
    adjustLotId?: string;
    witness?: ApprovalDto;
}
export declare class ControlledController {
    private readonly svc;
    private readonly approvals;
    private readonly prisma;
    constructor(svc: ControlledService, approvals: ApprovalService, prisma: PrismaService);
    register(u: AuthUser, q: {
        branchId?: string;
        drugId?: string;
        from?: string;
        to?: string;
        page?: string;
        pageSize?: string;
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
    balances(u: AuthUser, branchId?: string): Promise<{
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
    audit(u: AuthUser, d: AuditDto): Promise<{
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
    discrepancies(u: AuthUser, q: {
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
    resolve(u: AuthUser, id: string, d: ResolveDto): Promise<{
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
export {};
