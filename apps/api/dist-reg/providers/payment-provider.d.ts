import { type FetchLike } from "./http";
import { type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, ChargeRequest, ChargeResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "./provider-types";
export interface PaymentProvider {
    readonly mode: "mock" | "real";
    readonly name: string;
    charge(r: ChargeRequest): Promise<ChargeResult>;
    createPayLink(r: PayLinkRequest): Promise<PayLinkResult>;
    refund(r: RefundRequest): Promise<RefundResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class MockPaymentProvider implements PaymentProvider {
    private readonly publicBaseUrl;
    readonly mode: "mock";
    readonly name = "mock";
    constructor(publicBaseUrl?: string);
    charge(r: ChargeRequest): Promise<ChargeResult>;
    createPayLink(r: PayLinkRequest): Promise<PayLinkResult>;
    refund(r: RefundRequest): Promise<RefundResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class HttpPaymentProvider implements PaymentProvider {
    private readonly cfg;
    private readonly fetchImpl?;
    readonly mode: "real";
    readonly name = "payment";
    constructor(cfg: ProviderConfig, fetchImpl?: FetchLike | undefined);
    private call;
    private get vendor();
    charge(r: ChargeRequest): Promise<ChargeResult>;
    createPayLink(r: PayLinkRequest): Promise<PayLinkResult>;
    refund(r: RefundRequest): Promise<RefundResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare function paymentProvider(env?: Record<string, string | undefined>, fetchImpl?: FetchLike): PaymentProvider;
