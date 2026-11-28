import type { Prisma } from "../generated/prisma/client";
export interface DispenseCompletedContext {
    orgId: string;
    branchId: string;
    dispensingId: string;
    kiorexOrderRef: string | null;
    pharmacistId: string;
    signedOffAt: Date;
    dispensedAt: Date;
    saleId: string;
    saleTotal: string;
}
export type DispenseHook = (tx: Prisma.TransactionClient, ctx: DispenseCompletedContext) => Promise<void>;
export declare class DispenseHooks {
    private readonly hooks;
    register(h: DispenseHook): void;
    run(tx: Prisma.TransactionClient, ctx: DispenseCompletedContext): Promise<void>;
}
