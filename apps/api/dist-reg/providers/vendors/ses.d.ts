export interface SesCreds {
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
}
export declare function parseSesCreds(apiKey: string): SesCreds | null;
export declare function sesSendBody(i: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
    configurationSet?: string;
    reference?: string;
}): {
    EmailTags?: {
        Name: string;
        Value: string;
    }[] | undefined;
    ConfigurationSetName?: string | undefined;
    FromEmailAddress: string;
    Destination: {
        ToAddresses: string[];
    };
    Content: {
        Simple: {
            Subject: {
                Data: string;
                Charset: string;
            };
            Body: {
                Html?: {
                    Data: string;
                    Charset: string;
                } | undefined;
                Text: {
                    Data: string;
                    Charset: string;
                };
            };
        };
    };
};
export declare const sesSigner: (apiUrl: string, apiKey: string) => ((r: {
    method: string;
    url: string;
    body: string;
}) => Record<string, string>) | undefined;
export declare function parseSesSend(json: any): {
    providerRef: string;
};
export declare function verifySnsBasicAuth(secret: string, headers: Record<string, unknown>): boolean;
export declare function snsConfirmUrl(raw: string): string | null;
export declare function parseSesEvents(raw: string): Array<{
    providerRef: string;
    status: 'SENT' | 'DELIVERED' | 'FAILED';
    error?: string;
    occurredAt?: string;
}>;
