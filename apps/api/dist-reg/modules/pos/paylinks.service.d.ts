import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { type MarketPackPort } from "../../kernel-adapter/ports";
import { NotificationsService } from "../../platform/adapters/notifications.service";
import { PspAdapter } from "../../platform/adapters/psp.adapter";
import { PosService } from "./pos.service";
type Via = {
    channel: "SMS" | "EMAIL" | "WHATSAPP";
    to?: string;
};
export declare class PayLinksService {
    private readonly prisma;
    private readonly psp;
    private readonly notify;
    private readonly packs;
    private readonly pos;
    private readonly log;
    constructor(prisma: PrismaService, psp: PspAdapter, notify: NotificationsService, packs: MarketPackPort, pos: PosService);
    private view;
    private ctx;
    create(user: AuthUser, accountId: string, b: {
        amount?: string;
        sendVia?: Via;
        expiresInHours?: number;
    }, idemKey?: string): Promise<{
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
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
        };
        replayed: boolean;
        notification?: undefined;
    } | {
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
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
        };
        replayed: boolean;
        notification: {
            id: string;
            status: string;
        } | undefined;
    }>;
    list(orgId: string, accountId?: string): Promise<({
        id: string;
        createdAt: Date;
        orgId: string;
        expiresAt: Date | null;
        createdBy: string;
        status: import("../../generated/prisma/enums").PayLinkStatus;
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
    onPaid(providerRef: string, amount?: string): Promise<boolean>;
    onNotPaid(providerRef: string, status: "FAILED" | "EXPIRED", reason?: string): Promise<boolean>;
    refund(user: AuthUser, id: string, b: {
        amount?: string;
        reason?: string;
    }): Promise<{
        link: {
            id: string;
            createdAt: Date;
            orgId: string;
            expiresAt: Date | null;
            createdBy: string;
            status: import("../../generated/prisma/enums").PayLinkStatus;
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
        };
        pending: boolean;
    }>;
    private bookRefund;
    onRefundSucceeded(refundRef: string): Promise<boolean>;
    onRefundFailed(refundRef: string, reason?: string): Promise<boolean>;
    sendReceipt(user: AuthUser, saleId: string, b: {
        channel: "SMS" | "EMAIL" | "WHATSAPP";
        to?: string;
    }): Promise<{
        id: string;
        status: import("../../generated/prisma/enums").NotificationStatus;
    }>;
}
export {};
