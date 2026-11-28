import type { Prisma } from "../../generated/prisma/client";
export declare function utcDay(d: Date): Date;
type Client = Pick<Prisma.TransactionClient, "$executeRaw">;
export type LinkCounter = "visits" | "orders" | "completed";
export declare function bumpLinkCounter(db: Client, link: {
    id: string;
    orgId: string;
}, counter: LinkCounter, at?: Date, by?: number): Promise<void>;
export declare function isLikelyBot(headers: Record<string, string | string[] | undefined>): boolean;
export {};
