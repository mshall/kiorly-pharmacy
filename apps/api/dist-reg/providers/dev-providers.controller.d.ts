import type { AuthUser } from "../auth/auth-user";
import { NotificationsService } from "../platform/adapters/notifications.service";
import { PayLinksService } from "../modules/pos/paylinks.service";
import { PrismaService } from "../prisma/prisma.service";
import { ProviderEventsService } from "./provider-events.service";
import { type ProviderKind } from "./provider-env";
import type { CanonicalEventType } from "./provider-types";
import { AiGateway } from "../platform/adapters/ai.gateway";
import { ConsentService } from "../platform/adapters/consent.service";
import { StorageAdapter } from "../platform/adapters/storage.adapter";
export declare class DevProvidersController {
    private readonly prisma;
    private readonly notify;
    private readonly payLinks;
    private readonly events;
    private readonly consents;
    private readonly ai;
    private readonly storage;
    constructor(prisma: PrismaService, notify: NotificationsService, payLinks: PayLinksService, events: ProviderEventsService, consents: ConsentService, ai: AiGateway, storage: StorageAdapter);
    status(): {
        modelSet?: boolean | undefined;
        kind: ProviderKind;
        mode: import("./provider-env").ProviderMode;
        apiUrlSet: boolean;
        apiKeySet: boolean;
        webhookSecretSet: boolean;
        senderIdSet: boolean;
    }[];
    messages(u: AuthUser, q: {
        channel?: string;
        limit?: string;
    }): Promise<{
        subject: string | undefined;
        id: string;
        createdAt: Date;
        orgId: string;
        status: import("../generated/prisma/enums").NotificationStatus;
        sentAt: Date | null;
        refType: string | null;
        refId: string | null;
        body: string;
        channel: import("../generated/prisma/enums").NotificationChannel;
        recipient: string;
        template: string;
        locale: string;
        provider: string;
        providerMessageId: string | null;
        error: string | null;
        deliveredAt: Date | null;
    }[]>;
    payLinkList(u: AuthUser): Promise<({
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        createdBy: string;
        status: import("../generated/prisma/enums").PayLinkStatus;
        updatedAt: Date;
        idempotencyKey: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        accountId: string;
        currency: string;
        providerRef: string | null;
        payUrl: string | null;
        entryId: string | null;
        failureReason: string | null;
        refundedAmount: import("@prisma/client-runtime-utils").Decimal;
        refundRef: string | null;
        refundAmount: import("@prisma/client-runtime-utils").Decimal | null;
    } & {
        amount: string;
        refundedAmount: string;
        refundAmount: string | null;
    })[]>;
    simulate(b: {
        kind: string;
        type: CanonicalEventType;
        providerRef: string;
        error?: string;
        amount?: string;
        eventId?: string;
    }): Promise<{
        accepted: number;
        applied: number;
        duplicates: number;
        unmatched: number;
        simulated: CanonicalEventType;
        providerRef: string;
    }>;
    private simulateEvent;
    consentDemo(u: AuthUser): Promise<{
        purposes: import("./provider-types").ConsentPurpose[];
        customerId: string;
        consentId: string;
        providerRef: string | null;
        validAfterGrant: boolean;
        revoke: unknown;
        validAfterRevoke: boolean;
        customerMarketingFlag: boolean;
        record: {
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
        };
    }>;
    private runConsentDemo;
    aiSample(u: AuthUser, b?: {
        prompt?: string;
        names?: string[];
    }): Promise<import("../platform/adapters/ai.gateway").AssistResult>;
    storageRoundtrip(u: AuthUser): Promise<{
        key: string;
        bytes: number;
        contentType: string;
        readBack: {
            bytes: number | null;
            identical: boolean;
            contentType: string | undefined;
        };
        signedUrl: string;
        expiresAt: Date;
        tamperedSignature: import("./storage-policy").DownloadCheck;
        afterExpiry: import("./storage-policy").DownloadCheck;
    }>;
    demo(u: AuthUser, b?: {
        payments?: boolean;
        consent?: boolean;
        ai?: boolean;
        storage?: boolean;
    }): Promise<{
        messages: unknown[];
        payments: Record<string, unknown>;
    }>;
}
