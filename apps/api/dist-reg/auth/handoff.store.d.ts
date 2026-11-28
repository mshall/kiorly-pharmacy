import { PrismaService } from "../prisma/prisma.service";
import type { HandoffEntry, HandoffStore } from "./handoff";
export declare class PrismaHandoffStore implements HandoffStore {
    private readonly prisma;
    constructor(prisma: PrismaService);
    insert(e: HandoffEntry): Promise<void>;
    consume(codeHash: string, now: Date): Promise<HandoffEntry | null>;
    purge(before: Date): Promise<void>;
}
