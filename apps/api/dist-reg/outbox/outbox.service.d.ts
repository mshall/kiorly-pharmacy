import type { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
export interface EnqueueInput {
    orgId: string;
    type: "DispenseCompleted" | "OrderReady" | "OrderOutForDelivery" | "OrderRejected" | "ReferralLinkCreated" | "ReferralLinkRevoked";
    aggregateId: string;
    aggregateType?: string;
    data: Record<string, unknown>;
    dedupeKey: string;
}
export declare class OutboxService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    enqueue(input: EnqueueInput, db?: PrismaClient | Prisma.TransactionClient): Promise<{
        id: string;
        created: boolean;
    }>;
}
