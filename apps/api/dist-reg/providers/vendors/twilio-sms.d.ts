export declare const twilioCreds: (apiKey: string) => {
    sid: string;
    token: string;
} | null;
export declare const twilioAuth: (apiKey: string) => Record<string, string>;
export declare const twilioPath: (apiKey: string) => string;
export declare function twilioForm(i: {
    to: string;
    from: string;
    body: string;
    statusCallback?: string;
}): Record<string, string>;
export declare function parseTwilioSend(json: any): {
    providerRef: string;
};
export declare function verifyTwilioSignature(authToken: string, publicUrl: string, rawBody: string, headers: Record<string, unknown>): boolean;
export declare const signTwilio: (authToken: string, publicUrl: string, rawBody: string) => string;
export declare function parseTwilioStatus(raw: string): Array<{
    providerRef: string;
    status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED';
    error?: string;
}>;
