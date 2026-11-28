import { PrismaPg } from "@prisma/adapter-pg";
export declare const DEFAULT_POOL_MAX = 10;
export declare function resolvePoolMax(connectionLimit: number): number;
export declare function createPgAdapter(databaseUrl?: string | undefined): PrismaPg;
