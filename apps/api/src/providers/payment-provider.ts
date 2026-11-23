import { createHash } from "node:crypto";
import { ProviderError, providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, ChargeRequest, ChargeResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "./provider-types";
import { paymentMapping as M } from "./mapping/payment.mapping";
import { fawryPayLink, fawryRefundBody, fawryStatusUrl, paymobRefundBody, paymobTransactionIdFromInquiry, vendorAuthHeaders, vendorOf, vendorPayLinkCall, vendorPayLinkResult } from "./vendor-kit";

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
  private get vendor() { return vendorOf("PAYMENT"); }
  async charge(r: ChargeRequest) {
    if (this.vendor) throw new ProviderError("UNSUPPORTED", `${this.vendor} is a hosted-checkout PSP: use pay links (no direct card charge)`);
    return M.chargeResult((await this.call(M.paths.charge, M.chargeBody(r), r.idempotencyKey)).json); }
  async createPayLink(r: PayLinkRequest) {
    const v = this.vendor;
    if (v === "fawry") return fawryPayLink(r, this.cfg);
    if (v === "paymob") { const c = vendorPayLinkCall(v, r); const res = await providerRequest(this.cfg, { path: c.path, body: c.body, idempotencyKey: c.idempotencyKey }, vendorAuthHeaders(v, this.cfg), this.fetchImpl); return vendorPayLinkResult(v, r, res.json, this.cfg); }
    return M.payLinkResult((await this.call(M.paths.payLink, M.payLinkBody(r), r.idempotencyKey)).json); }
  async refund(r: RefundRequest) {
    const v = this.vendor; const minor = Math.round(Number(r.amount) * 100);
    if (v === "paymob") { // refund needs the transaction id of the order
      const auth = vendorAuthHeaders(v, this.cfg);
      const inq = await providerRequest(this.cfg, { path: "/api/ecommerce/orders/transaction_inquiry", body: { order_id: r.providerRef } }, auth, this.fetchImpl);
      const ref = await providerRequest(this.cfg, { path: "/api/acceptance/void_refund/refund", body: paymobRefundBody(paymobTransactionIdFromInquiry(inq.json), minor), idempotencyKey: r.idempotencyKey }, auth, this.fetchImpl);
      if (ref.json?.id === undefined) throw new ProviderError("BAD_RESPONSE", "provider refund response has no id");
      return { providerRef: String(ref.json.id), status: "SUCCEEDED" as const };
    }
    if (v === "fawry") {
      const code = process.env.PAYMENT_MERCHANT_CODE ?? ""; const key = this.cfg.apiKey ?? "";
      const st = await providerRequest(this.cfg, { method: "GET", path: "", absoluteUrl: fawryStatusUrl(this.cfg.apiUrl ?? "", code, key, r.providerRef) }, {}, this.fetchImpl);
      if (!st.json?.fawryRefNumber) throw new ProviderError("BAD_RESPONSE", "provider status has no fawryRefNumber");
      const rr = await providerRequest(this.cfg, { path: "/ECommerceWeb/Fawry/payments/refund", body: fawryRefundBody({ merchantCode: code, secureKey: key, fawryRefNumber: String(st.json.fawryRefNumber), amountMinor: minor, reason: r.reason ?? "refund" }), idempotencyKey: r.idempotencyKey }, {}, this.fetchImpl);
      if (Number(rr.json?.statusCode) !== 200) throw new ProviderError("REJECTED", "provider rejected the refund");
      return { providerRef: String(st.json.fawryRefNumber), status: "SUCCEEDED" as const };
    }
    return M.refundResult((await this.call(M.paths.refund, M.refundBody(r), r.idempotencyKey)).json); }
  parseWebhook(json: unknown): CanonicalEvent[] { return M.parseWebhook(json); }
}

export function paymentProvider(env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): PaymentProvider {
  const cfg = providerConfig("PAYMENT", env);
  return cfg.mode === "real" ? new HttpPaymentProvider(cfg, fetchImpl) : new MockPaymentProvider(env.PUBLIC_BASE_URL?.replace(/\/+$/, ""));
}
