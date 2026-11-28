import type { Prisma, PrismaClient } from "../generated/prisma/client";
import type { AuthUser } from "../auth/auth-user";
type Db = PrismaClient | Prisma.TransactionClient;
export declare function resolveBranchId(db: Db, user: AuthUser, requested?: string | null): Promise<string>;
export declare function branchFilter(user: AuthUser, requested?: string | null): {
    branchId?: string;
};
export {};
