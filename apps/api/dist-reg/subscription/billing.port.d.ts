export type ChargeRequest = {
    orgId: string;
    tokenRef: string;
    amount: string;
    currency: string;
    invoiceId: string;
    idempotencyKey: string;
};
export type ChargeResult = {
    providerRef: string;
    status: "succeeded" | "failed";
};
export declare const BILLING_CHARGE: unique symbol;
export interface BillingChargePort {
    charge(req: ChargeRequest): Promise<ChargeResult>;
}
export declare class MockBillingCharge implements BillingChargePort {
    private readonly seen;
    charge(req: ChargeRequest): Promise<ChargeResult>;
}
export declare class UnwiredRealBillingCharge implements BillingChargePort {
    charge(): Promise<ChargeResult>;
}
export declare const billingChargeFromEnv: (env?: NodeJS.ProcessEnv) => BillingChargePort;
