import { Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare class UomService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(orgId: string, drugId: string): Prisma.PrismaPromise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        drugId: string;
        factor: number;
        barcode: string | null;
    }[]>;
    create(u: AuthUser, drugId: string, d: {
        name: string;
        factor: number;
        barcode?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        orgId: string;
        active: boolean;
        drugId: string;
        factor: number;
        barcode: string | null;
    }>;
    remove(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
    factor(orgId: string, drugId: string, uom?: string | null): Promise<number>;
}
