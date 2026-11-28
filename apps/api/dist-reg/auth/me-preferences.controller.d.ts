import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "./auth-user";
export declare class MePreferencesController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    get(u: AuthUser): Promise<{
        keys: string[];
    }>;
    put(u: AuthUser, b: unknown): Promise<{
        keys: string[];
    }>;
}
