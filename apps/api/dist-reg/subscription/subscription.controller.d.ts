import type { AuthUser } from "../auth/auth-user";
import { SubscriptionService } from "./subscription.service";
declare class AutoRenewDto {
    enabled: boolean;
    confirmDowngrade?: boolean;
}
declare class ReactivateDto {
    edition?: "PRO" | "CHAIN" | "ENTERPRISE";
    interval?: "MONTHLY" | "ANNUAL";
}
declare class PaymentMethodDto {
    tokenRef: string;
    brand?: string;
    last4: string;
    expMonth?: number;
    expYear?: number;
}
export declare class SubscriptionController {
    private readonly svc;
    constructor(svc: SubscriptionService);
    state(u: AuthUser): Promise<{
        isOwner: boolean;
        edition: import("../generated/prisma/enums").Edition;
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
        previousEdition: import("../generated/prisma/enums").Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
    plans(u: AuthUser): Promise<{
        currentEdition: import("../generated/prisma/enums").Edition;
        usage: {
            users: number;
            branches: number;
        };
        taxLine: {
            ratePercent: number;
        } | null;
        plans: {
            edition: import("../generated/prisma/enums").Edition;
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
    impact(u: AuthUser, e?: string): Promise<import("./subscription-policy").DowngradeImpact>;
    invoices(u: AuthUser): Promise<{
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
    notices(u: AuthUser): Promise<{
        id: string;
        kind: string;
        notBefore: string;
        payload: import("@prisma/client/runtime/client").JsonValue;
    }[]>;
    autoRenew(u: AuthUser, b: AutoRenewDto): Promise<{
        isOwner: boolean;
        edition: import("../generated/prisma/enums").Edition;
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
        previousEdition: import("../generated/prisma/enums").Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
    reactivate(u: AuthUser, b: ReactivateDto): Promise<{
        reactivated: boolean;
        needsPaymentMethod: boolean;
        state: {
            isOwner: boolean;
            edition: import("../generated/prisma/enums").Edition;
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
            previousEdition: import("../generated/prisma/enums").Edition | null;
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
    paymentMethod(u: AuthUser, b: PaymentMethodDto): Promise<{
        isOwner: boolean;
        edition: import("../generated/prisma/enums").Edition;
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
        previousEdition: import("../generated/prisma/enums").Edition | null;
        canReactivate: boolean;
        downgradeImpact: import("./subscription-policy").DowngradeImpact | null;
        policy: {
            downgradeAfterDays: number;
            renewalReminderDaysBefore: number[];
            liteReadOnlyGraceDays: number;
            retryDays: number[];
        };
    }>;
}
export {};
