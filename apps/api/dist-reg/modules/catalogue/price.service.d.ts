import { Prisma, type PrismaClient } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
type Db = PrismaClient | Prisma.TransactionClient;
export interface PriceUpdate {
    drugId: string;
    price: string;
    branchId?: string | null;
}
export declare class PriceService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    priceAt(orgId: string, branchId: string | null, drugId: string, at?: Date, db?: Db): Promise<Prisma.Decimal | null>;
    pricesAt(orgId: string, branchId: string, drugIds: string[], at?: Date, db?: Db): Promise<Map<string, Prisma.Decimal>>;
    bulkUpdate(orgId: string, actorId: string, effectiveFrom: Date, items: PriceUpdate[]): Promise<{
        updated: number;
    }>;
    history(orgId: string, drugId: string): Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        orgId: string;
        branchId: string | null;
        drugId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        effectiveFrom: Date;
        effectiveTo: Date | null;
        createdBy: string | null;
    }[]>;
}
export {};
