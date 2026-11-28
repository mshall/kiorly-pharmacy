import { type Edition } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { AuditService } from "../audit/audit.service";
import { type PlansPort } from "../kernel-adapter/ports";
import type { AuthUser } from "../auth/auth-user";
import { type BillingChargePort } from "./billing.port";
import { type SubscriptionPolicy } from "./subscription-policy";
export type NoticeKind = "renewal_reminder" | "renewal_off_reminder" | "payment_method_missing" | "payment_failed" | "downgrade_warning" | "downgraded_to_lite" | "auto_renew_on" | "auto_renew_off" | "reactivated";
export declare class SubscriptionService {
    private readonly prisma;
    private readonly audit;
    private readonly plans;
    private readonly billing;
    private readonly log;
    constructor(prisma: PrismaService, audit: AuditService, plans: PlansPort, billing: BillingChargePort);
    policy(): SubscriptionPolicy;
    private shape;
    private assertManager;
    ensure(orgId: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        status: string;
        updatedAt: Date;
        interval: string;
        autoRenew: boolean;
        autoRenewForced: string | null;
        autoRenewChangedAt: Date | null;
        autoRenewChangedBy: string | null;
        currentPeriodStart: Date;
        currentPeriodEnd: Date;
        paymentTokenRef: string | null;
        paymentBrand: string | null;
        paymentLast4: string | null;
        paymentExpMonth: number | null;
        paymentExpYear: number | null;
        failedAttempts: number;
        firstFailedAt: Date | null;
        nextRetryAt: Date | null;
        downgradedToLiteAt: Date | null;
        downgradeReason: string | null;
        previousEdition: Edition | null;
        liteReadOnlyGraceUntil: Date | null;
    }>;
    private event;
    notify(orgId: string, kind: NoticeKind, payload: Record<string, unknown>, dedupeKey: string, notBefore?: Date): Promise<void>;
    usage(orgId: string): Promise<{
        users: number;
        branches: number;
    }>;
    impact(orgId: string, to?: Edition): Promise<import("./subscription-policy").DowngradeImpact>;
    priceFor(edition: Edition, marketCode: string, interval: string): Promise<{
        id: string;
        edition: Edition;
        marketCode: string;
        createdAt: Date;
        amount: import("@prisma/client-runtime-utils").Decimal;
        currency: string;
        interval: string;
        validFrom: Date;
        validTo: Date | null;
        priceVersion: number;
        proposalId: string | null;
        proposedBy: string | null;
        publishedBy: string | null;
    } | null>;
    state(u: AuthUser): Promise<{
        isOwner: boolean;
        edition: Edition;
        status: string;
        onFreePlan: boolean;
        autoRenew: boolean;
        autoRenewForced: "ON" | "OFF" | null;
        canChangeAutoRenew: boolean;
        willDowngradeAtPeriodEnd: boolean;
        currentPeriodEnd: string;
        renewsOn: string | null;
        endsOn: string | null;
        paymentMethod: {
            brand: string | null;
            last4: string;
            expMonth: number | null;
            expYear: number | null;
        } | null;
        downgradedToLiteAt: string | null;
        downgradeReason: string | null;
        liteReadOnlyGraceUntil: string | null;
        previousEdition: Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
    compare(u: AuthUser): Promise<{
        currentEdition: Edition;
        usage: {
            users: number;
            branches: number;
        };
        taxLine: {
            ratePercent: number;
        } | null;
        plans: {
            edition: Edition;
            relation: string;
            maxUsers: number | null;
            maxBranches: number | null;
            capabilities: import("../kernel-adapter/ports").Capability[];
            addOns: import("../kernel-adapter/ports").Capability[];
            prices: {
                interval: string;
                amount: string;
                currency: string;
            }[];
            priceNeedsHuman: boolean;
            downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        }[];
    }>;
    setAutoRenew(u: AuthUser, body: {
        enabled: boolean;
        confirmDowngrade?: boolean;
    }): Promise<{
        isOwner: boolean;
        edition: Edition;
        status: string;
        onFreePlan: boolean;
        autoRenew: boolean;
        autoRenewForced: "ON" | "OFF" | null;
        canChangeAutoRenew: boolean;
        willDowngradeAtPeriodEnd: boolean;
        currentPeriodEnd: string;
        renewsOn: string | null;
        endsOn: string | null;
        paymentMethod: {
            brand: string | null;
            last4: string;
            expMonth: number | null;
            expYear: number | null;
        } | null;
        downgradedToLiteAt: string | null;
        downgradeReason: string | null;
        liteReadOnlyGraceUntil: string | null;
        previousEdition: Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
    setPaymentMethod(u: AuthUser, body: {
        tokenRef: string;
        brand?: string;
        last4: string;
        expMonth?: number;
        expYear?: number;
    }): Promise<{
        isOwner: boolean;
        edition: Edition;
        status: string;
        onFreePlan: boolean;
        autoRenew: boolean;
        autoRenewForced: "ON" | "OFF" | null;
        canChangeAutoRenew: boolean;
        willDowngradeAtPeriodEnd: boolean;
        currentPeriodEnd: string;
        renewsOn: string | null;
        endsOn: string | null;
        paymentMethod: {
            brand: string | null;
            last4: string;
            expMonth: number | null;
            expYear: number | null;
        } | null;
        downgradedToLiteAt: string | null;
        downgradeReason: string | null;
        liteReadOnlyGraceUntil: string | null;
        previousEdition: Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
    forceAutoRenew(orgId: string, force: "ON" | "OFF" | null, reason: string, actorId: string): Promise<{
        orgId: string;
        autoRenewForced: "OFF" | "ON" | null;
    }>;
    downgradeToLite(orgId: string, reason: "auto_renew_off" | "payment_failed" | "platform_forced", actorId: string | null, now?: Date): Promise<boolean>;
    reactivate(u: AuthUser, body?: {
        edition?: Edition;
        interval?: "MONTHLY" | "ANNUAL";
    }): Promise<{
        reactivated: boolean;
        needsPaymentMethod: boolean;
        state: {
            isOwner: boolean;
            edition: Edition;
            status: string;
            onFreePlan: boolean;
            autoRenew: boolean;
            autoRenewForced: "ON" | "OFF" | null;
            canChangeAutoRenew: boolean;
            willDowngradeAtPeriodEnd: boolean;
            currentPeriodEnd: string;
            renewsOn: string | null;
            endsOn: string | null;
            paymentMethod: {
                brand: string | null;
                last4: string;
                expMonth: number | null;
                expYear: number | null;
            } | null;
            downgradedToLiteAt: string | null;
            downgradeReason: string | null;
            liteReadOnlyGraceUntil: string | null;
            previousEdition: Edition | null;
            canReactivate: boolean;
            downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
            policy: {
                downgradeAfterDays: number;
                renewalReminderDaysBefore: number[];
                liteReadOnlyGraceDays: number;
                retryDays: number[];
            };
        };
    }>;
    listInvoices(orgId: string): Promise<{
        id: string;
        number: string;
        periodKey: string;
        status: string;
        currency: string;
        subtotal: string;
        tax: string;
        total: string;
        issuedAt: string;
        paidAt: string | null;
    }[]>;
    listNotices(orgId: string): Promise<{
        id: string;
        kind: string;
        notBefore: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    runDaily(now?: Date): Promise<{
        downgraded: number;
        renewed: number;
        failed: number;
        retried: number;
        reminders: number;
    }>;
    private reminders;
    private renew;
    private dunning;
}
