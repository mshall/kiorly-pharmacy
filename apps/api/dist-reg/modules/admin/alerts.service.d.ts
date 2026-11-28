import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class AlertsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private candidates;
    scan(orgId: string): Promise<{
        created: number;
        resolved: number;
        open: number;
    }>;
    feed(u: AuthUser, q: {
        unread?: boolean;
        includeResolved?: boolean;
        take: number;
    }): Promise<{
        unread: number;
        items: {
            read: boolean;
            readBy: undefined;
            link: string | null;
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string | null;
            kind: string;
            refType: string | null;
            refId: string | null;
            body: string | null;
            dedupeKey: string;
            resolvedAt: Date | null;
            severity: string;
            title: string;
        }[];
    }>;
    unreadCount(u: AuthUser): Promise<{
        unread: number;
        critical: number;
    }>;
    markRead(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    markAllRead(u: AuthUser): Promise<{
        marked: number;
    }>;
}
