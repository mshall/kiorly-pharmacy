export declare function fawryCheckoutUrl(i: {
    apiUrl: string;
    merchantCode: string;
    secureKey: string;
    paymentId: string;
    amountMinor: number;
    returnUrl: string;
    webhookUrl: string;
    language?: 'ar-eg' | 'en-gb';
}): {
    pspRef: string;
    checkoutUrl: string;
};
export declare const fawryCallbackSignature: (secureKey: string, b: any) => string;
export declare function verifyFawryCallback(secureKey: string, raw: string): any | null;
export declare function parseFawryCallback(b: any): {
    eventId: string;
    type: 'payment.captured' | 'payment.failed' | 'refund.settled';
    pspRef: string;
    paymentId: string;
    amountMinor: number;
    feeMinor?: number;
    occurredAt: string;
} | null;
export declare const fawryStatusUrl: (apiUrl: string, merchantCode: string, secureKey: string, merchantRefNumber: string) => string;
export declare const fawryRefundBody: (i: {
    merchantCode: string;
    secureKey: string;
    fawryRefNumber: string;
    amountMinor: number;
    reason?: string;
}) => {
    merchantCode: string;
    referenceNumber: string;
    refundAmount: number;
    reason: string;
    signature: string;
};
