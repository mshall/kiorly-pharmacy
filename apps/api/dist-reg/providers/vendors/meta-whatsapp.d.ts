export interface MetaStatus {
    providerRef: string;
    status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
    error?: string;
    occurredAt?: string;
}
export interface MetaInbound {
    from: string;
    text?: string;
    buttonPayload?: string;
    providerRef?: string;
}
export declare const metaPhone: (e164: string) => string;
export declare function metaTemplateBody(i: {
    to: string;
    templateName: string;
    language: 'ar' | 'en';
    bodyParams: string[];
    urlButtonParam?: string;
}): {
    messaging_product: string;
    recipient_type: string;
    to: string;
    type: string;
    template: {
        components?: unknown[] | undefined;
        name: string;
        language: {
            code: "ar" | "en";
        };
    };
};
export declare function parseMetaSend(json: any): {
    providerRef: string;
};
export declare function verifyMetaSignature(appSecret: string, rawBody: string, headers: Record<string, unknown>): boolean;
export declare const signMetaBody: (appSecret: string, rawBody: string) => string;
export declare function metaVerifyChallenge(q: Record<string, unknown>, verifyToken: string): string | null;
export declare function parseMetaWebhook(raw: string): {
    statuses: MetaStatus[];
    inbound: MetaInbound[];
};
