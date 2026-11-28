import type { ConsentRecord } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { type CanonicalEvent, type ConsentPurpose } from "../../providers/provider-types";
export interface GrantInput {
    subjectRef: string;
    patientId?: string;
    purpose: ConsentPurpose;
    source: "CUSTOMER_REGISTRY" | "ERX" | "API" | "DEV_DEMO";
    expiresAt?: Date;
    tokenHash?: string;
    actorId?: string;
}
export declare class ConsentService {
    private readonly prisma;
    private readonly log;
    constructor(prisma: PrismaService);
    static isPurpose(p: string): p is ConsentPurpose;
    private registry;
    grant(orgId: string, i: GrantInput): Promise<ConsentRecord>;
    recordErxConsent(orgId: string, p: {
        patientRef: string;
        patientId?: string;
        token: string;
        expiresAt?: Date;
    }): Promise<void>;
    syncCustomerConsent(orgId: string, patientId: string, subjectRef: string, flags: Partial<Record<"DATA_PROCESSING" | "MARKETING", boolean>>, actorId?: string): Promise<void>;
    list(orgId: string, q?: {
        subjectRef?: string;
        patientId?: string;
        purpose?: string;
        status?: string;
        limit?: number;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        revokedAt: Date | null;
        createdBy: string | null;
        status: import("../../generated/prisma/enums").ConsentStatus;
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
    status(orgId: string, subjectRef: string, purpose: ConsentPurpose): Promise<{
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
            status: import("../../generated/prisma/enums").ConsentStatus;
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
            status: import("../../generated/prisma/enums").ConsentStatus;
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
    revoke(orgId: string, id: string, reason?: string, actorId?: string): Promise<ConsentRecord>;
    onEvent(e: CanonicalEvent): Promise<boolean>;
    private applyRevocation;
}
