import type { AuthUser } from "../auth/auth-user";
import { PrismaService } from "../prisma/prisma.service";
import { type ConsentPurpose } from "../providers/provider-types";
import { ConsentService } from "./adapters/consent.service";
declare class GrantDto {
    subjectRef: string;
    purpose: ConsentPurpose;
    patientId?: string;
    expiresAt?: string;
}
declare class RevokeDto {
    reason?: string;
}
export declare class ConsentController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: ConsentService, prisma: PrismaService);
    list(u: AuthUser, q: {
        subjectRef?: string;
        patientId?: string;
        purpose?: string;
        status?: string;
        limit?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        revokedAt: Date | null;
        createdBy: string | null;
        status: import("../generated/prisma/enums").ConsentStatus;
        source: string;
        updatedAt: Date;
        patientId: string | null;
        tokenHash: string | null;
        providerRef: string | null;
        subjectRef: string;
        purpose: string;
        grantedAt: Date;
        revokeReason: string | null;
        syncError: string | null;
    }[]>;
    status(u: AuthUser, subjectRef: string, purpose: string): Promise<{
        subjectRef: string;
        purpose: ConsentPurpose;
        valid: boolean;
        active: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            revokedAt: Date | null;
            createdBy: string | null;
            status: import("../generated/prisma/enums").ConsentStatus;
            source: string;
            updatedAt: Date;
            patientId: string | null;
            tokenHash: string | null;
            providerRef: string | null;
            subjectRef: string;
            purpose: string;
            grantedAt: Date;
            revokeReason: string | null;
            syncError: string | null;
        } | null;
        history: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            revokedAt: Date | null;
            createdBy: string | null;
            status: import("../generated/prisma/enums").ConsentStatus;
            source: string;
            updatedAt: Date;
            patientId: string | null;
            tokenHash: string | null;
            providerRef: string | null;
            subjectRef: string;
            purpose: string;
            grantedAt: Date;
            revokeReason: string | null;
            syncError: string | null;
        }[];
        registry: unknown;
    }>;
    grant(u: AuthUser, d: GrantDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        revokedAt: Date | null;
        createdBy: string | null;
        status: import("../generated/prisma/enums").ConsentStatus;
        source: string;
        updatedAt: Date;
        patientId: string | null;
        tokenHash: string | null;
        providerRef: string | null;
        subjectRef: string;
        purpose: string;
        grantedAt: Date;
        revokeReason: string | null;
        syncError: string | null;
    }>;
    revoke(u: AuthUser, id: string, d: RevokeDto): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        revokedAt: Date | null;
        createdBy: string | null;
        status: import("../generated/prisma/enums").ConsentStatus;
        source: string;
        updatedAt: Date;
        patientId: string | null;
        tokenHash: string | null;
        providerRef: string | null;
        subjectRef: string;
        purpose: string;
        grantedAt: Date;
        revokeReason: string | null;
        syncError: string | null;
    }>;
}
export {};
