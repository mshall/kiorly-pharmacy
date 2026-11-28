export type MessageChannelKind = "SMS" | "EMAIL" | "WHATSAPP";
export interface MessageRequest {
    channel: MessageChannelKind;
    to: string;
    from?: string;
    templateId: string;
    locale: "en" | "ar";
    subject?: string;
    text: string;
    html?: string;
    params?: Record<string, string | number>;
    reference?: string;
    idempotencyKey: string;
}
export interface MessageResult {
    providerMessageId: string;
    status: "SENT" | "QUEUED";
}
export interface ChargeRequest {
    amount: string;
    currency: string;
    method: string;
    reference: string;
    idempotencyKey: string;
    cardToken?: string;
    walletRef?: string;
    customer?: {
        name?: string;
        email?: string;
        phone?: string;
    };
}
export interface ChargeResult {
    status: "CAPTURED" | "DECLINED" | "PENDING";
    providerRef: string;
    declineReason?: string;
    payUrl?: string;
}
export interface PayLinkRequest {
    amount: string;
    currency: string;
    reference: string;
    description: string;
    idempotencyKey: string;
    expiresAt?: string;
    customer?: {
        name?: string;
        email?: string;
        phone?: string;
    };
}
export interface PayLinkResult {
    providerRef: string;
    payUrl: string;
    status: "PENDING";
}
export interface RefundRequest {
    providerRef: string;
    amount: string;
    currency: string;
    reason?: string;
    idempotencyKey: string;
}
export interface RefundResult {
    providerRef: string;
    status: "SUCCEEDED" | "PENDING";
}
export type CanonicalEventType = "message.sent" | "message.delivered" | "message.read" | "message.failed" | "payment.succeeded" | "payment.failed" | "payment.expired" | "refund.succeeded" | "refund.failed" | "consent.granted" | "consent.revoked" | "consent.expired";
export interface CanonicalEvent {
    eventId: string;
    type: CanonicalEventType;
    providerRef: string;
    occurredAt?: string;
    error?: string;
    amount?: string;
    currency?: string;
    reference?: string;
}
export type ConsentPurpose = "DATA_PROCESSING" | "MARKETING" | "DATA_SHARING" | "CONTROLLED_DRUG" | "ERX_DISPENSE";
export declare const CONSENT_PURPOSES: ConsentPurpose[];
export interface ConsentGrantRequest {
    subjectRef: string;
    purpose: ConsentPurpose;
    expiresAt?: string;
    reference: string;
    idempotencyKey: string;
    evidence?: {
        source: string;
        capturedBy?: string;
    };
}
export interface ConsentGrantResult {
    providerRef: string;
    status: "ACTIVE";
    expiresAt?: string;
}
export interface ConsentQueryResult {
    subjectRef: string;
    purpose: ConsentPurpose;
    consents: Array<{
        providerRef: string;
        status: "ACTIVE" | "REVOKED" | "EXPIRED";
        grantedAt?: string;
        expiresAt?: string;
        revokedAt?: string;
    }>;
}
export interface ConsentRevokeRequest {
    providerRef: string;
    reason?: string;
    idempotencyKey: string;
}
export interface ConsentRevokeResult {
    providerRef: string;
    status: "REVOKED";
}
export interface ConsentIntrospection {
    valid: boolean;
    reason?: "MISSING" | "MALFORMED" | "REVOKED" | "EXPIRED";
    expiresAt?: string;
}
export interface AiRequest {
    system?: string;
    prompt: string;
    maxOutputTokens: number;
    temperature?: number;
    idempotencyKey: string;
}
export interface AiResult {
    text: string;
    model: string;
    providerRef?: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
    };
}
