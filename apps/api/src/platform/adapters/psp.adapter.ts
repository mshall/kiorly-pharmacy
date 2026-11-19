import { Injectable } from "@nestjs/common";
import { createHash } from "node:crypto";
import { adapterMode, ProviderNotWiredError } from "./adapter-mode";

export type PspMethod = "CARD" | "INSTAPAY" | "FAWRY" | "WALLET";
export interface PspChargeInput { orgId: string; method: PspMethod; amount: string; idempotencyKey: string; walletRef?: string }
export interface PspChargeResult { status: "CAPTURED" | "DECLINED"; reference: string; declineReason?: string }

/** PSP adapter (Paymob / Fawry / InstaPay / wallet). `PSP_MODE=mock` (default): deterministic fake — same code path, no network. */
export abstract class PspAdapter {
  abstract charge(input: PspChargeInput): Promise<PspChargeResult>;
  abstract refund(input: { orgId: string; reference: string; amount: string; idempotencyKey: string }): Promise<{ reference: string }>;
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

@Injectable()
export class RealPspAdapter extends PspAdapter {
  async charge(): Promise<PspChargeResult> { throw new ProviderNotWiredError("psp"); }
  async refund(): Promise<{ reference: string }> { throw new ProviderNotWiredError("psp"); }
}

export const pspProvider = { provide: PspAdapter, useFactory: () => (adapterMode("PSP") === "real" ? new RealPspAdapter() : new MockPspAdapter()) };
