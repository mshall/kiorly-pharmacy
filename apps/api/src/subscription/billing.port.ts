/**
 * Charge seam for subscription renewals. Same shape as Clinic's `billing-platform/payment-gateways` `chargeToken` so this migrates to the unified
 * Kiorex Pay adapter layer without touching the lifecycle. BILLING_MODE=mock (default): deterministic, no vendor call. `real` is a go-live task
 * (NEEDS_HUMAN LG-SUB-5) and refuses until wired.
 */
export type ChargeRequest = { orgId: string; tokenRef: string; amount: string; currency: string; invoiceId: string; idempotencyKey: string };
export type ChargeResult = { providerRef: string; status: "succeeded" | "failed" };
export const BILLING_CHARGE = Symbol("SUBSCRIPTION_BILLING_CHARGE");
export interface BillingChargePort { charge(req: ChargeRequest): Promise<ChargeResult>; }

/** Mock: a token containing "fail" is declined; same idempotency key => same result (replay safe). */
export class MockBillingCharge implements BillingChargePort {
  private readonly seen = new Map<string, ChargeResult>();
  async charge(req: ChargeRequest): Promise<ChargeResult> {
    const prev = this.seen.get(req.idempotencyKey);
    if (prev) return prev;
    const r: ChargeResult = { providerRef: `mock_${req.idempotencyKey}`, status: req.tokenRef.includes("fail") ? "failed" : "succeeded" };
    this.seen.set(req.idempotencyKey, r);
    return r;
  }
}
export class UnwiredRealBillingCharge implements BillingChargePort {
  async charge(): Promise<ChargeResult> { throw new Error("BILLING_MODE=real is not wired yet (NEEDS_HUMAN LG-SUB-5)"); }
}
export const billingChargeFromEnv = (env: NodeJS.ProcessEnv = process.env): BillingChargePort => (env.BILLING_MODE === "real" ? new UnwiredRealBillingCharge() : new MockBillingCharge());
