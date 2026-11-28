import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/auth-user";
export declare class AuditController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(u: AuthUser, q: {
        entityType?: string;
        entityId?: string;
        action?: string;
        actorId?: string;
        from?: string;
        to?: string;
        page?: string;
        pageSize?: string;
    }): Promise<{
        items: {
            at: Date;
            id: string;
            orgId: string;
            actorId: string | null;
            action: string;
            entityType: string;
            entityId: string;
            meta: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    csv(u: AuthUser, q: {
        entityType?: string;
        action?: string;
        from?: string;
        to?: string;
    }): Promise<string>;
}
