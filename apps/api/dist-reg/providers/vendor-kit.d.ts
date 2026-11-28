import type { ProviderConfig, ProviderKind } from "./provider-env";
import type { CanonicalEvent, ChargeRequest, MessageRequest, MessageResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "./provider-types";
import { fawryRefundBody, fawryStatusUrl } from "./vendors/fawry";
import { paymobRefundBody, paymobTransactionIdFromInquiry } from "./vendors/paymob";
type Env = Record<string, string | undefined>;
export declare const VENDORS: Partial<Record<ProviderKind, string[]>>;
export declare const VENDOR_DEFAULT_URL: Record<string, string>;
export declare function vendorOf(kind: ProviderKind, env?: Env): string | undefined;
export declare function derivedWebhookSecret(kind: ProviderKind, env?: Env): string | undefined;
export declare function vendorProblems(kind: ProviderKind, env?: Env): string[];
export declare const vendorApiUrl: (kind: ProviderKind, env?: Env) => string | undefined;
export interface VendorSend {
    path: string;
    body?: unknown;
    form?: Record<string, string>;
    sign?: (r: {
        method: string;
        url: string;
        body: string;
    }) => Record<string, string>;
}
export declare function vendorSend(vendor: string, r: MessageRequest, cfg: ProviderConfig, env?: Env): VendorSend;
export declare const vendorAuthHeaders: (vendor: string, cfg: ProviderConfig) => Record<string, string>;
export declare function vendorParseSend(vendor: string, json: unknown): MessageResult;
export interface WebhookInput {
    secret: string;
    rawBody: string;
    headers: Record<string, unknown>;
    query: Record<string, unknown>;
    publicUrl?: string;
}
export interface VendorWebhook {
    verify(i: WebhookInput): boolean;
    parse(raw: string): CanonicalEvent[];
    confirmUrl?(raw: string): string | null;
    challenge?(q: Record<string, unknown>, token: string): string | null;
}
export declare const VENDOR_WEBHOOKS: Record<string, VendorWebhook>;
export interface PspCall {
    path: string;
    body?: unknown;
    method?: "GET" | "POST";
    absoluteUrl?: string;
    idempotencyKey: string;
}
export declare function vendorPayLinkCall(vendor: string, r: PayLinkRequest, env?: Env): PspCall;
export declare function vendorPayLinkResult(vendor: string, r: PayLinkRequest, json: unknown, cfg: ProviderConfig, env?: Env): PayLinkResult;
export declare function fawryPayLink(r: PayLinkRequest, cfg: ProviderConfig, env?: Env): PayLinkResult;
export { fawryRefundBody, fawryStatusUrl, paymobRefundBody, paymobTransactionIdFromInquiry };
export type { ChargeRequest, RefundRequest, RefundResult };
