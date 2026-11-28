import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
export declare const REFILL_VALIDITY_DAYS = 180;
export declare class RefillsService {
    private readonly prisma;
    private readonly notify;
    private readonly modes;
    constructor(prisma: PrismaService, notify: NotificationsService, modes: TenantModeService);
    refill(user: AuthUser, id: string, d?: {
        earlyReason?: string;
    }): Promise<{
        prescription: {
            id: string;
            orgId: string;
            branchId: string;
            status: import("../../generated/prisma/enums").RxStatus;
            source: import("../../generated/prisma/enums").RxSource;
            receivedAt: Date;
            patientId: string | null;
            sourceEventId: string | null;
            sourceRxRef: string | null;
            consentTokenHash: string | null;
            consentVerifiedAt: Date | null;
            consentExpiresAt: Date | null;
            prescriberName: string | null;
            prescriberLicenceNo: string | null;
            prescriberVerifiedBadge: boolean;
            issuedAt: Date | null;
            validUntil: Date | null;
            scanStorageKey: string | null;
            prescriberRef: string | null;
            prescriberId: string | null;
            refillsAllowed: number;
            refillsUsed: number;
            refillIntervalDays: number | null;
            nextRefillDueAt: Date | null;
            priority: string;
            verificationNotes: string | null;
            transferredOutAt: Date | null;
            clinicRef: string | null;
            validatedBy: string | null;
            validatedAt: Date | null;
            kiorexOrderId: string | null;
            rejectionReason: string | null;
            receivedBy: string | null;
        };
        refillNo: number;
        remaining: number;
    }>;
    history(orgId: string, id: string): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        createdBy: string;
        prescriptionId: string;
        refillNo: number;
        early: boolean;
        earlyReason: string | null;
    }[]>;
    due(orgId: string, q: {
        days: number;
        branchId?: string;
    }): Promise<{
        id: string;
        patient: {
            id: string;
            phone: string | null;
            displayName: string;
            consentMarketing: boolean;
        } | null;
        dueAt: Date | null;
        overdueDays: number;
        refillsLeft: number;
        items: (string | null)[];
        reminded: boolean;
        canRemind: boolean;
    }[]>;
    runReminders(user: AuthUser | {
        orgId: string;
        userId?: string;
    }, daysAhead?: number): Promise<{
        due: number;
        sent: number;
        skipped: number;
    }>;
}
