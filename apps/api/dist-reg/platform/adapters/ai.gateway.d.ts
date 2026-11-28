import { PrismaService } from "../../prisma/prisma.service";
import { type FetchLike } from "../../providers/http";
export interface AssistInput {
    orgId: string;
    actorId?: string;
    task: string;
    prompt: string;
    system?: string;
    names?: string[];
    maxOutputTokens?: number;
}
export interface AssistResult {
    text: string;
    label: string;
    provider: string;
    model: string;
    mode: "mock" | "real";
    sentPrompt: string;
    redactions: Record<string, number>;
    usage: {
        inputTokens: number;
        outputTokens: number;
        estimatedCostUsd: number | null;
    };
}
export declare class AiGateway {
    private readonly prisma;
    private readonly log;
    private static spent;
    static fetchImpl?: FetchLike;
    constructor(prisma: PrismaService);
    static resetBudget(): void;
    assist(i: AssistInput): Promise<AssistResult>;
}
