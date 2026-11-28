export type LapseAction = "DOWNGRADE_TO_LITE";
export type SubscriptionPolicy = {
    autoRenewDefault: boolean;
    orgMayDisableAutoRenew: boolean;
    renewalReminderDaysBefore: number[];
    retryDays: number[];
    downgradeAfterDays: number;
    liteReadOnlyGraceDays: number;
    taxRatePercent: number;
    reminderQuietHours: {
        start: number;
        end: number;
    };
};
export declare const DEFAULT_SUBSCRIPTION_POLICY: SubscriptionPolicy;
export declare function parseSubscriptionPolicy(raw: unknown): SubscriptionPolicy;
export declare function loadPolicy(env?: NodeJS.ProcessEnv): SubscriptionPolicy;
export declare const effectiveAutoRenew: (s: {
    autoRenew: boolean;
    autoRenewForced: string | null;
}) => boolean;
export declare const FREE_EDITION = "LITE";
export declare const isFree: (edition: string) => edition is "LITE";
export type PeriodEndDecision = "RENEW" | "DOWNGRADE_AUTO_RENEW_OFF" | "NONE";
export declare function decidePeriodEnd(i: {
    edition: string;
    autoRenew: boolean;
    currentPeriodEnd: Date;
    now: Date;
}): PeriodEndDecision;
export declare function reminderOffsetsDue(i: {
    currentPeriodEnd: Date;
    now: Date;
    offsets: readonly number[];
    alreadySent: readonly number[];
}): number[];
export declare function nextOutsideQuietHours(now: Date, quiet: {
    start: number;
    end: number;
}, tz?: number): Date;
export type PlanShape = {
    edition: string;
    maxUsers: number | null;
    maxBranches: number | null;
    capabilities: readonly string[];
};
export type DowngradeImpact = {
    fromEdition: string;
    toEdition: string;
    lostFeatures: string[];
    reducedLimits: {
        key: "users" | "branches";
        from: number | null;
        to: number | null;
        current: number;
        overBy: number;
    }[];
    dataRetained: true;
    readOnlyGraceDays: number;
    restoredOnUpgrade: true;
};
export declare function computeDowngradeImpact(from: PlanShape, to: PlanShape, usage: {
    users: number;
    branches: number;
}, readOnlyGraceDays: number): DowngradeImpact;
export declare const liteGraceActive: (s: {
    downgradedToLiteAt: Date | null;
    liteReadOnlyGraceUntil: Date | null;
}, now: Date) => boolean;
