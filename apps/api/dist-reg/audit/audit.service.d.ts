import type { Prisma, PrismaClient } from "../generated/prisma/client";
import { PrismaService } from "../prisma/prisma.service";
export interface AuditEntry {
    orgId: string;
    actorId?: string | null;
    action: string;
    entityType: string;
    entityId: string;
    meta?: Prisma.InputJsonValue;
}
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    record(entry: AuditEntry, db?: PrismaClient | Prisma.TransactionClient): Promise<void>;
}
export declare function scrub(meta: unknown): unknown;
