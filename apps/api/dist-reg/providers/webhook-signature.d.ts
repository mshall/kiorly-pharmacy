export declare const SIGNATURE_HEADER = "x-kiorex-signature";
export declare const SIGNATURE_TOLERANCE_SEC = 300;
export declare function signWebhook(secret: string, rawBody: string, nowSec?: number): string;
export type SignatureCheck = {
    ok: true;
} | {
    ok: false;
    reason: "MISSING" | "MALFORMED" | "STALE" | "MISMATCH";
};
export declare function verifyWebhookSignature(secret: string, rawBody: string, header: string | undefined, nowSec?: number, toleranceSec?: number): SignatureCheck;
