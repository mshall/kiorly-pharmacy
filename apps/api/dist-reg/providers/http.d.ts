import type { ProviderConfig } from "./provider-env";
export type ProviderErrorCode = "TIMEOUT" | "NETWORK" | "AUTH" | "RATE_LIMITED" | "REJECTED" | "PROVIDER_5XX" | "BAD_RESPONSE" | "NOT_CONFIGURED" | "UNSUPPORTED";
export declare class ProviderError extends Error {
    readonly code: ProviderErrorCode;
    readonly httpStatus?: number | undefined;
    readonly retryable: boolean;
    constructor(code: ProviderErrorCode, message: string, httpStatus?: number | undefined, retryable?: boolean);
}
export interface ProviderRequest {
    method?: "POST" | "GET" | "PUT";
    path: string;
    body?: unknown;
    headers?: Record<string, string>;
    idempotencyKey?: string;
    rawBody?: Uint8Array;
    binary?: boolean;
    form?: Record<string, string>;
    absoluteUrl?: string;
    sign?: (r: {
        method: string;
        url: string;
        body: string;
    }) => Record<string, string>;
}
export interface ProviderResponse {
    status: number;
    json: any;
    raw: Uint8Array;
}
export type FetchLike = (url: string, init: {
    method: string;
    headers: Record<string, string>;
    body?: any;
    signal: AbortSignal;
}) => Promise<{
    status: number;
    headers: {
        get(n: string): string | null;
    };
    arrayBuffer(): Promise<ArrayBuffer>;
}>;
export declare function mapStatus(status: number): ProviderError | null;
export declare function providerRequest(cfg: ProviderConfig, req: ProviderRequest, authHeaders: Record<string, string>, fetchImpl?: FetchLike): Promise<ProviderResponse>;
