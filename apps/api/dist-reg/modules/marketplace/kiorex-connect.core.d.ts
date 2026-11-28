import { deriveIntakeSigningKey, enrolmentIdOf, newIntakeNonce } from "@kiorex/contracts";
export { deriveIntakeSigningKey, enrolmentIdOf, newIntakeNonce };
export type StepStatus = "done" | "action_needed" | "waiting_kiorex" | "blocked";
export type ConnectStatus = "STANDALONE" | "CONSENTED" | "REQUESTED" | "CHANGES_REQUESTED" | "REJECTED" | "APPROVED" | "PAUSED";
export interface ConnectStep {
    key: string;
    status: StepStatus;
    optional?: boolean;
    link?: string;
    detail?: Record<string, unknown>;
}
export declare const KIOREX_TERMS_VERSION = "2026-11";
export declare const isEnrolmentCode: (code: unknown) => code is string;
export declare const intakeHeaders: (secret: string, ts: number, body: string, enrolmentCode?: string) => Record<string, string>;
export declare const deriveStatusToken: (kek: string, orgId: string) => string;
export declare const newClientKey: (prefix: string) => string;
export declare const newSecret: () => string;
export declare const kiorexHost: (env?: Record<string, string | undefined>) => string;
export declare const intakeUrl: (host: string) => string;
export declare const publicApiBase: (env?: Record<string, string | undefined>) => string;
export declare function validatePayoutLabel(label: unknown): {
    ok: true;
    value: string;
} | {
    ok: false;
    code: "PAYOUT_LABEL_INVALID" | "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER";
};
export declare const progressPct: (steps: ConnectStep[]) => number;
export declare const canRequest: (steps: ConnectStep[], status: ConnectStatus) => boolean;
