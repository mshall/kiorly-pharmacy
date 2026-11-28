import type { ClaimStatus } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
declare class ClaimDto {
    branchId?: string;
    saleId?: string;
    insurerName: string;
    memberRef: string;
    policyNo?: string;
    amountClaimed: string;
    patientCopay?: string;
}
declare class ApproveDto {
    approvedAmount?: string;
    note?: string;
}
declare class RejectDto {
    reason: string;
}
declare class ClaimPayDto {
    amount: string;
    reference?: string;
}
declare class BatchDto {
    ids: string[];
    submissionRef: string;
}
declare class TransitionDto {
    status: "SUBMITTED" | "APPROVED" | "REJECTED" | "PAID";
    responseNote?: string;
}
export declare class ClaimsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(u: AuthUser, branchId: string, d: ClaimDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    list(orgId: string, status?: ClaimStatus): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }[]>;
    transition(u: AuthUser, id: string, status: ClaimStatus, note?: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    approve(u: AuthUser, id: string, d: {
        approvedAmount?: string;
        note?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    reject(u: AuthUser, id: string, reason: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    pay(u: AuthUser, id: string, d: {
        amount: string;
        reference?: string;
    }): Promise<{
        claim: {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            status: ClaimStatus;
            saleId: string | null;
            rejectionReason: string | null;
            insurerName: string;
            memberRef: string;
            policyNo: string | null;
            amountClaimed: import("@prisma/client-runtime-utils").Decimal;
            patientCopay: import("@prisma/client-runtime-utils").Decimal;
            approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            submissionRef: string | null;
            dueAt: Date | null;
            submittedAt: Date | null;
            resolvedAt: Date | null;
            responseNote: string | null;
        };
        outstanding: string;
    }>;
    batchSubmit(u: AuthUser, ids: string[], submissionRef: string): Promise<{
        submitted: number;
        submissionRef: string;
    }>;
    reconciliation(orgId: string): Promise<{
        insurers: {
            insurer: string;
            claims: number;
            claimed: string;
            approved: string;
            rejected: string;
            paid: string;
            outstanding: string;
            shortfall: string;
            overdue: number;
        }[];
        totals: {
            claimed: string;
            paid: string;
            outstanding: string;
            overdue: number;
        };
    }>;
    payments(orgId: string, claimId: string): Promise<{
        id: string;
        orgId: string;
        createdBy: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        reference: string | null;
        paidAt: Date;
        claimId: string;
    }[]>;
    summary(orgId: string): Promise<{
        status: ClaimStatus;
        count: number;
        amount: string;
    }[]>;
}
export declare class ClaimsController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: ClaimsService, prisma: PrismaService);
    list(u: AuthUser, status?: ClaimStatus): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }[]>;
    summary(u: AuthUser): Promise<{
        status: ClaimStatus;
        count: number;
        amount: string;
    }[]>;
    reconciliation(u: AuthUser): Promise<{
        insurers: {
            insurer: string;
            claims: number;
            claimed: string;
            approved: string;
            rejected: string;
            paid: string;
            outstanding: string;
            shortfall: string;
            overdue: number;
        }[];
        totals: {
            claimed: string;
            paid: string;
            outstanding: string;
            overdue: number;
        };
    }>;
    batch(u: AuthUser, d: BatchDto): Promise<{
        submitted: number;
        submissionRef: string;
    }>;
    payments(u: AuthUser, id: string): Promise<{
        id: string;
        orgId: string;
        createdBy: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        reference: string | null;
        paidAt: Date;
        claimId: string;
    }[]>;
    approve(u: AuthUser, id: string, d: ApproveDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    reject(u: AuthUser, id: string, d: RejectDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    pay(u: AuthUser, id: string, d: ClaimPayDto): Promise<{
        claim: {
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string;
            createdBy: string;
            status: ClaimStatus;
            saleId: string | null;
            rejectionReason: string | null;
            insurerName: string;
            memberRef: string;
            policyNo: string | null;
            amountClaimed: import("@prisma/client-runtime-utils").Decimal;
            patientCopay: import("@prisma/client-runtime-utils").Decimal;
            approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
            paidAmount: import("@prisma/client-runtime-utils").Decimal;
            submissionRef: string | null;
            dueAt: Date | null;
            submittedAt: Date | null;
            resolvedAt: Date | null;
            responseNote: string | null;
        };
        outstanding: string;
    }>;
    create(u: AuthUser, d: ClaimDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
    transition(u: AuthUser, id: string, d: TransitionDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        createdBy: string;
        status: ClaimStatus;
        saleId: string | null;
        rejectionReason: string | null;
        insurerName: string;
        memberRef: string;
        policyNo: string | null;
        amountClaimed: import("@prisma/client-runtime-utils").Decimal;
        patientCopay: import("@prisma/client-runtime-utils").Decimal;
        approvedAmount: import("@prisma/client-runtime-utils").Decimal | null;
        paidAmount: import("@prisma/client-runtime-utils").Decimal;
        submissionRef: string | null;
        dueAt: Date | null;
        submittedAt: Date | null;
        resolvedAt: Date | null;
        responseNote: string | null;
    }>;
}
export declare class ClaimsModule {
}
export {};
