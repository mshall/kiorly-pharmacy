import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, ChargeRequest, ChargeResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "../provider-types";
export declare const paymentMapping: {
    paths: {
        charge: string;
        payLink: string;
        refund: string;
    };
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    chargeBody: (r: ChargeRequest) => {
        amount: string;
        currency: string;
        method: string;
        reference: string;
        cardToken: string | undefined;
        walletRef: string | undefined;
        customer: {
            name?: string;
            email?: string;
            phone?: string;
        } | undefined;
    };
    chargeResult: (json: any) => ChargeResult;
    payLinkBody: (r: PayLinkRequest) => {
        amount: string;
        currency: string;
        reference: string;
        description: string;
        expiresAt: string | undefined;
        customer: {
            name?: string;
            email?: string;
            phone?: string;
        } | undefined;
    };
    payLinkResult: (json: any) => PayLinkResult;
    refundBody: (r: RefundRequest) => {
        chargeId: string;
        amount: string;
        currency: string;
        reason: string | undefined;
    };
    refundResult: (json: any) => RefundResult;
    parseWebhook: (json: unknown) => CanonicalEvent[];
};
