import { createHash } from "node:crypto";
import { providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, ChargeRequest, ChargeResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "./provider-types";
import { paymentMapping as M } from "./mapping/payment.mapping";

/** Port: payment service provider. */
export interface PaymentProvider {
  readonly mode: "mock" | "real";
  readonly name: string;
  charge(r: ChargeRequest): Promise<ChargeResult>;
  createPayLink(r: PayLinkRequest): Promise<PayLinkResult>;
  refund(r: RefundRequest): Promise<RefundResult>;
  parseWebhook(json: unknown): CanonicalEvent[];
}

const h = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);

/**
 * Deterministic fake. Amounts ending `.13` are declined; a wallet charge needs `walletRef`; token `tok_decline` declines.
 * Pay links get a local mock URL; their outcome is driven by the dev webhook simulator.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly mode = "mock" as const;
  readonly name = "mock";
  constructor(private readonly publicBaseUrl = "http://localhost:5191") {}
  async charge(r: ChargeRequest): Promise<ChargeResult> {
    const providerRef = `mockpsp_${h(`${r.idempotencyKey}:${r.method}`)}`;
    if (r.amount.endsWith(".13") || r.cardToken === "tok_decline") return { status: "DECLINED", providerRef, declineReason: r.cardToken === "tok_decline" ? "card_declined" : "MOCK_DECLINED" };
    if (r.method === "WALLET" && !r.walletRef) return { status: "DECLINED", providerRef, declineReason: "WALLET_REF_REQUIRED" };
    return { status: "CAPTURED", providerRef };
  }
  async createPayLink(r: PayLinkRequest): Promise<PayLinkResult> {
    const providerRef = `mocklink_${h(r.idempotencyKey)}`;
    return { providerRef, payUrl: `${this.publicBaseUrl}/mock-pay/${providerRef}`, status: "PENDING" };
  }
  async refund(r: RefundRequest): Promise<RefundResult> {
    return { providerRef: `mockrefund_${h(`${r.providerRef}:${r.idempotencyKey}`)}`, status: "SUCCEEDED" };
  }
  parseWebhook(json: unknown): CanonicalEvent[] { return M.parseWebhook(json); }
}

export class HttpPaymentProvider implements PaymentProvider {
  readonly mode = "real" as const;
  readonly name = "payment";
  constructor(private readonly cfg: ProviderConfig, private readonly fetchImpl?: FetchLike) {}
  private call(path: string, body: unknown, key: string) { return providerRequest(this.cfg, { path, body, idempotencyKey: key }, M.authHeaders(this.cfg), this.fetchImpl); }
  async charge(r: ChargeRequest) { return M.chargeResult((await this.call(M.paths.charge, M.chargeBody(r), r.idempotencyKey)).json); }
  async createPayLink(r: PayLinkRequest) { return M.payLinkResult((await this.call(M.paths.payLink, M.payLinkBody(r), r.idempotencyKey)).json); }
  async refund(r: RefundRequest) { return M.refundResult((await this.call(M.paths.refund, M.refundBody(r), r.idempotencyKey)).json); }
  parseWebhook(json: unknown): CanonicalEvent[] { return M.parseWebhook(json); }
}

export function paymentProvider(env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): PaymentProvider {
  const cfg = providerConfig("PAYMENT", env);
  return cfg.mode === "real" ? new HttpPaymentProvider(cfg, fetchImpl) : new MockPaymentProvider(env.PUBLIC_BASE_URL?.replace(/\/+$/, ""));
}
