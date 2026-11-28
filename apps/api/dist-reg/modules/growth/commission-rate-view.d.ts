import type { CommissionRateSpec } from "@kiorex/contracts";
export declare function rateViewProblems(b: unknown): string[];
export type RateParams = {
    graceDays: number | null;
    retryDays: number[] | null;
    invoiceDueDays: number | null;
    reminderDays: number[] | null;
    disputeWindowDays: number | null;
    savedMethodChargeAllowed: boolean | null;
};
export declare const NO_RATE_PARAMS: RateParams;
export declare function rateParamsOf(spec: CommissionRateSpec | null | undefined): RateParams;
export type DisclosureView = {
    rateDisclosure: {
        en: string;
        ar: string;
    };
    termsSummary: {
        en: string;
        ar: string;
    };
    showOverrideReason: boolean;
    wordingSet: boolean;
};
export type CounselStatusView = "NOT_REVIEWED" | "APPROVED_WITH_CONDITIONS" | "APPROVED" | "REJECTED";
export declare function parseDisclosure(raw: unknown): DisclosureView | null;
export declare function parseCounselStatus(raw: unknown): {
    status: CounselStatusView;
    reviewedOn: string | null;
} | null;
