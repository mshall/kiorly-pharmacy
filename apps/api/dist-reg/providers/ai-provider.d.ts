import { type FetchLike } from "./http";
import { type ProviderConfig } from "./provider-env";
import type { AiRequest, AiResult } from "./provider-types";
export interface AiProvider {
    readonly mode: "mock" | "real";
    readonly name: string;
    complete(r: AiRequest): Promise<AiResult>;
}
export declare const estimateTokens: (s: string) => number;
export declare class MockAiProvider implements AiProvider {
    readonly mode: "mock";
    readonly name = "fake";
    complete(r: AiRequest): Promise<AiResult>;
}
export declare class HttpAiProvider implements AiProvider {
    private readonly cfg;
    private readonly fetchImpl?;
    readonly mode: "real";
    readonly name = "ai";
    constructor(cfg: ProviderConfig, fetchImpl?: FetchLike | undefined);
    complete(r: AiRequest): Promise<AiResult>;
}
export declare function aiProvider(env?: Record<string, string | undefined>, fetchImpl?: FetchLike): AiProvider;
