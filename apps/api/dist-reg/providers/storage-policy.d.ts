export declare class StorageValidationError extends Error {
    readonly code: "INVALID_DATA_URL" | "UNSUPPORTED_CONTENT_TYPE" | "CONTENT_MISMATCH" | "FILE_TOO_LARGE" | "INVALID_KEY";
    constructor(code: "INVALID_DATA_URL" | "UNSUPPORTED_CONTENT_TYPE" | "CONTENT_MISMATCH" | "FILE_TOO_LARGE" | "INVALID_KEY", message: string);
}
export declare const DEFAULT_MAX_BYTES: number;
export declare const ALLOWED_TYPES: Record<string, string>;
export declare const maxBytes: (env?: Record<string, string | undefined>) => number;
export declare function sniffType(b: Uint8Array): string | null;
export declare function validateUpload(bytes: Uint8Array, declared: string, env?: Record<string, string | undefined>): string;
export declare function parseDataUrl(dataUrl: string): {
    contentType: string;
    bytes: Buffer;
};
export declare function safeKey(key: string): string;
export declare const URL_TTL_DEFAULT_SEC = 300;
export declare const URL_TTL_MAX_SEC = 3600;
export declare const ttlSec: (env?: Record<string, string | undefined>, want?: number) => number;
export declare function signingSecret(env?: Record<string, string | undefined>): string | undefined;
export declare function signDownload(key: string, ttl?: number, env?: Record<string, string | undefined>, nowMs?: number): {
    path: string;
    expiresAt: Date;
};
export type DownloadCheck = {
    ok: true;
} | {
    ok: false;
    reason: "MISSING" | "EXPIRED" | "MISMATCH" | "NOT_CONFIGURED";
};
export declare function verifyDownload(key: string | undefined, exp: string | undefined, sig: string | undefined, env?: Record<string, string | undefined>, nowMs?: number): DownloadCheck;
