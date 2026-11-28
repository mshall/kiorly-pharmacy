import { type FetchLike } from "../../providers/http";
import type { PayLinkRequest, PayLinkResult } from "../../providers/provider-types";
export type PspMethod = "CARD" | "INSTAPAY" | "FAWRY" | "WALLET";
export interface PspChargeInput {
    orgId: string;
    method: PspMethod;
    amount: string;
    idempotencyKey: string;
    walletRef?: string;
}
export interface PspChargeResult {
    status: "CAPTURED" | "DECLINED";
    reference: string;
    declineReason?: string;
}
export declare abstract class PspAdapter {
    abstract charge(input: PspChargeInput): Promise<PspChargeResult>;
    abstract refund(input: {
        orgId: string;
        reference: string;
        amount: string;
        idempotencyKey: string;
    }): Promise<{
        reference: string;
    }>;
    createPayLink(r: PayLinkRequest): Promise<PayLinkResult>;
    refundPayment(r: {
        providerRef: string;
        amount: string;
        currency: string;
        reason?: string;
        idempotencyKey: string;
    }): Promise<import("../../providers/provider-types").RefundResult>;
    static fetchImpl?: FetchLike;
}
export declare class MockPspAdapter extends PspAdapter {
    charge(i: PspChargeInput): Promise<PspChargeResult>;
    refund(i: {
        orgId: string;
        reference: string;
        amount: string;
        idempotencyKey: string;
    }): Promise<{
        reference: string;
    }>;
}
export declare class RealPspAdapter extends PspAdapter {
    private currency;
    charge(i: PspChargeInput): Promise<PspChargeResult>;
    refund(i: {
        orgId: string;
        reference: string;
        amount: string;
        idempotencyKey: string;
    }): Promise<{
        reference: string;
    }>;
}
export declare class SwitchingPspAdapter extends PspAdapter {
    private readonly mock;
    private readonly real;
    private pick;
    charge(i: PspChargeInput): Promise<PspChargeResult>;
    refund(i: {
        orgId: string;
        reference: string;
        amount: string;
        idempotencyKey: string;
    }): Promise<{
        reference: string;
    }>;
}
export declare const pspProvider: {
    provide: typeof PspAdapter;
    useFactory: () => SwitchingPspAdapter;
};
