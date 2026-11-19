import { Injectable } from "@nestjs/common";
import type { Prisma } from "@prisma/client";

export interface DispenseCompletedContext {
  orgId: string; branchId: string; dispensingId: string; kiorexOrderRef: string | null; pharmacistId: string; signedOffAt: Date; dispensedAt: Date; saleId: string; saleTotal: string;
}
export type DispenseHook = (tx: Prisma.TransactionClient, ctx: DispenseCompletedContext) => Promise<void>;

/**
 * Lets the dispensing safety path notify other bounded contexts (Kiorex order events, settlement) WITHOUT importing them
 * or consulting any feature flag. Hooks run inside the dispensing transaction, so their outbox rows commit atomically with the dispense.
 */
@Injectable()
export class DispenseHooks {
  private readonly hooks: DispenseHook[] = [];
  register(h: DispenseHook) { this.hooks.push(h); }
  async run(tx: Prisma.TransactionClient, ctx: DispenseCompletedContext) { for (const h of this.hooks) await h(tx, ctx); }
}
