import { ProviderError } from "../http";
import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, ChargeRequest, ChargeResult, PayLinkRequest, PayLinkResult, RefundRequest, RefundResult } from "../provider-types";
import { bearer, genericEvents } from "./generic";

const id = (json: any, what: string): string => {
  const v = json?.id;
  if (typeof v !== "string" || !v) throw new ProviderError("BAD_RESPONSE", `provider ${what} response has no id`);
  return v;
};

/**
 * Payments (PSP): the ONLY file to adapt for a concrete PSP (Paymob, Fawry, Stripe, InstaPay gateway...).
 * Default = generic gateway shape, all under {PAYMENT_API_URL}:
 *   POST /charges    { amount, currency, method, reference, cardToken?, walletRef?, customer? }  ->  { id, status: captured|declined|pending, declineReason?, payUrl? }
 *   POST /pay-links  { amount, currency, reference, description, expiresAt?, customer? }          ->  { id, payUrl, status: "pending" }
 *   POST /refunds    { chargeId, amount, currency, reason? }                                       ->  { id, status: succeeded|pending }
 * Payment status then arrives by webhook: payment.succeeded | payment.failed | payment.expired | refund.succeeded | refund.failed.
 */
export const paymentMapping = {
  paths: { charge: "/charges", payLink: "/pay-links", refund: "/refunds" },
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  chargeBody: (r: ChargeRequest) => ({ amount: r.amount, currency: r.currency, method: r.method, reference: r.reference, cardToken: r.cardToken, walletRef: r.walletRef, customer: r.customer }),
  chargeResult: (json: any): ChargeResult => {
    const s = String(json?.status ?? "").toLowerCase();
    return { providerRef: id(json, "charge"), status: /captur|succe|paid/.test(s) ? "CAPTURED" : /declin|fail/.test(s) ? "DECLINED" : "PENDING", declineReason: typeof json?.declineReason === "string" ? json.declineReason : undefined, payUrl: typeof json?.payUrl === "string" ? json.payUrl : undefined };
  },
  payLinkBody: (r: PayLinkRequest) => ({ amount: r.amount, currency: r.currency, reference: r.reference, description: r.description, expiresAt: r.expiresAt, customer: r.customer }),
  payLinkResult: (json: any): PayLinkResult => {
    if (typeof json?.payUrl !== "string" || !/^https?:\/\//.test(json.payUrl)) throw new ProviderError("BAD_RESPONSE", "provider pay-link response has no payUrl");
    return { providerRef: id(json, "pay-link"), payUrl: json.payUrl, status: "PENDING" };
  },
  refundBody: (r: RefundRequest) => ({ chargeId: r.providerRef, amount: r.amount, currency: r.currency, reason: r.reason }),
  refundResult: (json: any): RefundResult => ({ providerRef: id(json, "refund"), status: /succe|done|complete/i.test(String(json?.status ?? "")) ? "SUCCEEDED" : "PENDING" }),
  parseWebhook: (json: unknown): CanonicalEvent[] => genericEvents(json, "payment"),
};
