import { PrismaService } from "../../../prisma/prisma.service";
import type { AuthUser } from "../../../auth/auth-user";
import { NotificationsService } from "../../../platform/adapters/notifications.service";
export declare class RecallService {
    private readonly prisma;
    private readonly notify;
    constructor(prisma: PrismaService, notify: NotificationsService);
    enter(user: AuthUser, input: {
        drugId: string;
        lotNumbers: string[];
        reason: string;
        source?: string;
    }): Promise<{
        blockedWithinMs: number;
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }>;
    list(orgId: string): import("../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }[]>;
    lift(user: AuthUser, id: string): Promise<{
        id: string;
        orgId: string;
        drugId: string;
        status: import("../../../generated/prisma/enums").RecallStatus;
        lotNumbers: string[];
        affectedLots: number;
        reason: string;
        source: string | null;
        enteredBy: string;
        enteredAt: Date;
        liftedBy: string | null;
        liftedAt: Date | null;
    }>;
}
