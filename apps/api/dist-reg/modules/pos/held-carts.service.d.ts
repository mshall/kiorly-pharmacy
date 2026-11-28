import type { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class HeldCartsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    hold(u: AuthUser, branchId: string, d: {
        label?: string;
        patientId?: string;
        payload: Prisma.InputJsonValue;
    }): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }>;
    list(orgId: string, branchId: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }[]>;
    resume(u: AuthUser, id: string): Promise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string;
        status: string;
        patientId: string | null;
        payload: import("@prisma/client/runtime/client").JsonValue;
        resolvedAt: Date | null;
        userId: string;
        label: string;
    }>;
    discard(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
