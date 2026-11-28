import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, MessageRequest, MessageResult } from "../provider-types";
export declare const emailMapping: {
    sendPath: string;
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    toRequest: (r: MessageRequest, cfg: ProviderConfig) => {
        to: string;
        from: string | undefined;
        subject: string;
        text: string;
        html: string | undefined;
        reference: string | undefined;
        templateId: string;
        locale: "ar" | "en";
    };
    fromResponse: (json: unknown) => MessageResult;
    parseWebhook: (json: unknown) => CanonicalEvent[];
};
