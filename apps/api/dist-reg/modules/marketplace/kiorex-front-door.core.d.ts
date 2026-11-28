import type { ConnectStatus } from "./kiorex-connect.core";
export type FrontDoorState = "NOT_CONNECTED" | "IN_PROGRESS" | "WAITING" | "LIVE" | "ATTENTION";
export declare function frontDoorState(input: {
    legacy: boolean;
    status: ConnectStatus;
    started: boolean;
}): FrontDoorState;
export declare const LEAD_TIMES: readonly ["MORNING", "AFTERNOON", "EVENING", "ANYTIME"];
export interface TalkToUsInput {
    contactName?: unknown;
    contactRole?: unknown;
    phone?: unknown;
    email?: unknown;
    preferredTime?: unknown;
    note?: unknown;
    consent?: unknown;
}
export interface TalkToUsClean {
    contactName: string;
    contactRole?: string;
    phone?: string;
    email?: string;
    preferredTime?: (typeof LEAD_TIMES)[number];
    note?: string;
}
export declare class LeadInputError extends Error {
    readonly code: string;
    readonly field?: string | undefined;
    constructor(code: string, field?: string | undefined);
}
export declare function cleanTalkToUs(i: TalkToUsInput): TalkToUsClean;
export declare function leadSigningSecret(env?: Record<string, string | undefined>): string | null;
export declare function leadHeaders(secret: string, ts: number, body: string): Record<string, string>;
export declare const newLeadNonce: () => string;
export interface ListingPause {
    pausedAt: string;
    by: string;
    reason?: string;
}
export declare const LISTING_KEY = "kiorexListing";
export declare function listingPause(settings: unknown): ListingPause | null;
export declare const cleanPauseReason: (r: unknown) => string | undefined;
