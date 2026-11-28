import type { ProviderConfig } from "../provider-env";
import type { AiRequest, AiResult } from "../provider-types";
export declare const aiMapping: {
    paths: {
        complete: string;
    };
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    body: (cfg: ProviderConfig, r: AiRequest) => {
        model: string | undefined;
        messages: {
            role: string;
            content: string;
        }[];
        max_tokens: number;
        temperature: number;
    };
    result: (cfg: ProviderConfig, json: any) => AiResult;
};
