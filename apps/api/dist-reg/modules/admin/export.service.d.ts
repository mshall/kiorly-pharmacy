import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
export declare const EXPORT_ENTITIES: readonly ["customers", "drugs", "stock", "sales", "prescriptions", "suppliers", "expenses", "audit", "controlled-register"];
export type ExportEntity = (typeof EXPORT_ENTITIES)[number];
export declare class ExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private rows;
    csv(u: AuthUser, entity: string): Promise<string>;
    bundle(u: AuthUser): Promise<{
        app: string;
        format: number;
        exportedAt: string;
        tenant: {
            id: string;
            name: string;
            market: string;
            edition: import("../../generated/prisma/enums").Edition;
            settings: import("@prisma/client/runtime/client").JsonValue;
        };
        counts: {
            [k: string]: number;
        };
        data: Record<string, {
            headers: string[];
            rows: unknown[][];
        }>;
    }>;
}
