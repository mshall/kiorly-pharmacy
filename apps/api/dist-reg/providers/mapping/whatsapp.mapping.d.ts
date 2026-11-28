import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, MessageRequest, MessageResult } from "../provider-types";
export declare const whatsappMapping: {
    sendPath: string;
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    toRequest: (r: MessageRequest, cfg: ProviderConfig) => {
        to: string;
        from: string | undefined;
        template: {
            name: string;
            language: "ar" | "en";
            params: Record<string, string | number>;
        };
        text: string;
        reference: string | undefined;
    };
    fromResponse: (json: unknown) => MessageResult;
    parseWebhook: (json: unknown) => CanonicalEvent[];
};
