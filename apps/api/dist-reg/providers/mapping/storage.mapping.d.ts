import type { ProviderConfig } from "../provider-env";
export declare const storageMapping: {
    objectPath: (key: string) => string;
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    putHeaders: (contentType: string) => {
        "content-type": string;
    };
};
