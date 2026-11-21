import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { adapterMode } from "./adapter-mode";
import { ProviderError, type FetchLike } from "../../providers/http";
import { paymentProvider } from "../../providers/payment-provider";
import type { PayLinkRequest, PayLinkResult } from "../../providers/provider-types";

export type PspMethod = "CARD" | "INSTAPAY" | "FAWRY" | "WALLET";
export interface PspChargeInput { orgId: string; method: PspMethod; amount: string; idempotencyKey: string; walletRef?: string }
export interface PspChargeResult { status: "CAPTURED" | "DECLINED"; reference: string; declineReason?: string }

/**
 * PSP adapter (Paymob / Fawry / InstaPay / wallet). PAYMENT_MODE=mock|real (legacy PSP_MODE is the default).
 * mock (default): deterministic fake, same code path, no network. real: generic HTTP PSP driven by PAYMENT_API_URL / PAYMENT_API_KEY
 * (src/providers/mapping/payment.mapping.ts is the only vendor-specific file). Till charges must be synchronous: a PENDING provider answer is treated as
 * declined (PAYMENT_PENDING); asynchronous settlement uses pay-by-link, whose status arrives by the signed webhook (POST /webhooks/providers/payment).
 */
export abstract class PspAdapter {
  abstract charge(input: PspChargeInput): Promise<PspChargeResult>;
  abstract refund(input: { orgId: string; reference: string; amount: string; idempotencyKey: string }): Promise<{ reference: string }>;
  /** Pay-by-link (mock and real alike go through the payment provider port). */
  createPayLink(r: PayLinkRequest): Promise<PayLinkResult> { return paymentProvider(process.env, PspAdapter.fetchImpl).createPayLink(r); }
  /** Provider refund of a pay-link payment (returns the provider refund id + whether it is already final). */
  refundPayment(r: { providerRef: string; amount: string; currency: string; reason?: string; idempotencyKey: string }) { return paymentProvider(process.env, PspAdapter.fetchImpl).refund(r); }
  /** Test seam for the real HTTP provider. */
  static fetchImpl?: FetchLike;
}

/** Deterministic mock: amounts whose cents are `.13` are declined (so tests/demos can exercise the failure path); wallet needs a walletRef. */
@Injectable()
export class MockPspAdapter extends PspAdapter {
  async charge(i: PspChargeInput): Promise<PspChargeResult> {
    const reference = `mockpsp_${createHash("sha256").update(`${i.orgId}:${i.idempotencyKey}:${i.method}`).digest("hex").slice(0, 16)}`;
    if (i.amount.endsWith(".13")) return { status: "DECLINED", reference, declineReason: "MOCK_DECLINED" };
    if (i.method === "WALLET" && !i.walletRef) return { status: "DECLINED", reference, declineReason: "WALLET_REF_REQUIRED" };
    return { status: "CAPTURED", reference };
  }
  async refund(i: { orgId: string; reference: string; amount: string; idempotencyKey: string }) {
    return { reference: `mockrefund_${createHash("sha256").update(`${i.orgId}:${i.reference}:${i.idempotencyKey}`).digest("hex").slice(0, 16)}` };
  }
}

/** Real PSP over HTTP (generic gateway contract; adapt payment.mapping.ts per vendor). */
@Injectable()
export class RealPspAdapter extends PspAdapter {
  private currency(): string { return process.env.PAYMENT_CURRENCY?.trim() || "EGP"; }
  async charge(i: PspChargeInput): Promise<PspChargeResult> {
    try {
      const r = await paymentProvider(process.env, PspAdapter.fetchImpl).charge({ amount: i.amount, currency: this.currency(), method: i.method, reference: i.idempotencyKey, idempotencyKey: i.idempotencyKey, walletRef: i.walletRef });
      if (r.status === "CAPTURED") return { status: "CAPTURED", reference: r.providerRef };
      return { status: "DECLINED", reference: r.providerRef, declineReason: r.status === "PENDING" ? "PAYMENT_PENDING" : r.declineReason ?? "DECLINED" };
    } catch (e) {
      if (e instanceof ProviderError) return { status: "DECLINED", reference: `psp_error_${createHash("sha256").update(i.idempotencyKey).digest("hex").slice(0, 12)}`, declineReason: `PSP_${e.code}` };
      throw e;
    }
  }
  async refund(i: { orgId: string; reference: string; amount: string; idempotencyKey: string }) {
    const r = await paymentProvider(process.env, PspAdapter.fetchImpl).refund({ providerRef: i.reference, amount: i.amount, currency: this.currency(), idempotencyKey: i.idempotencyKey });
    return { reference: r.providerRef };
  }
}

/** Picks mock or real PER CALL from PAYMENT_MODE (so a mode change is picked up without rebuilding the container). */
@Injectable()
export class SwitchingPspAdapter extends PspAdapter {
  private readonly mock = new MockPspAdapter();
  private readonly real = new RealPspAdapter();
  private pick(): PspAdapter { return adapterMode("PSP") === "real" ? this.real : this.mock; }
  charge(i: PspChargeInput) { return this.pick().charge(i); }
  refund(i: { orgId: string; reference: string; amount: string; idempotencyKey: string }) { return this.pick().refund(i); }
}

export const pspProvider = { provide: PspAdapter, useFactory: () => new SwitchingPspAdapter() };
