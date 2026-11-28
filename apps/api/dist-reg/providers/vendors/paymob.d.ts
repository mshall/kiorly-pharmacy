export declare const PAYMOB_HMAC_FIELDS: readonly ["amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction", "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded", "is_standalone_payment", "is_voided", "order.id", "owner", "pending", "source_data.pan", "source_data.sub_type", "source_data.type", "success"];
export declare const paymobHmacString: (obj: any) => string;
export declare const paymobHmac: (secret: string, obj: any) => string;
export declare function verifyPaymobHmac(secret: string, obj: any, given: string): boolean;
export declare const paymobAuth: (secretKey: string) => {
    authorization: string;
};
export declare function paymobIntentionBody(i: {
    paymentId: string;
    amountMinor: number;
    currency: string;
    integrationIds: number[];
    notificationUrl: string;
    redirectionUrl: string;
}): {
    amount: number;
    currency: string;
    payment_methods: number[];
    special_reference: string;
    items: {
        name: string;
        amount: number;
        description: string;
        quantity: number;
    }[];
    billing_data: {
        first_name: string;
        last_name: string;
        email: string;
        phone_number: string;
        apartment: string;
        floor: string;
        street: string;
        building: string;
        shipping_method: string;
        postal_code: string;
        city: string;
        country: string;
        state: string;
    };
    notification_url: string;
    redirection_url: string;
};
export declare function parsePaymobIntention(json: any, apiUrl: string, publicKey: string): {
    pspRef: string;
    checkoutUrl: string;
};
export interface PspEvent {
    eventId: string;
    type: 'payment.captured' | 'payment.failed' | 'refund.settled';
    pspRef: string;
    paymentId?: string;
    amountMinor: number;
    feeMinor?: number;
    occurredAt: string;
}
export declare function parsePaymobCallback(raw: string): PspEvent | null;
export declare const paymobRefundBody: (transactionId: string, amountMinor: number) => {
    transaction_id: number;
    amount_cents: number;
};
export declare function paymobTransactionIdFromInquiry(json: any): string;
