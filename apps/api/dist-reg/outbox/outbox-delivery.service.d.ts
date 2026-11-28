import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { WEBHOOK_HEADERS } from "@kiorex/contracts";
import { PrismaService } from "../prisma/prisma.service";
export type KiorexMode = "mock" | "real";
export declare const kiorexMode: () => KiorexMode;
export declare class OutboxDeliveryService implements OnModuleInit, OnModuleDestroy {
    private readonly prisma;
    private readonly log;
    private timer;
    readonly mockInbox: Array<{
        eventId: string;
        type: string;
        body: string;
    }>;
    constructor(prisma: PrismaService);
    onModuleInit(): void;
    private announceMode;
    onModuleDestroy(): void;
    private target;
    deliverDue(limit?: number): Promise<{
        sent: number;
        failed: number;
    }>;
}
export { WEBHOOK_HEADERS };
