/** Generic request/response shapes shared by Clinic, Pharmacy and Lab. Vendors are adapted ONLY in mapping/<kind>.mapping.ts. */
export type MessageChannelKind = "SMS" | "EMAIL" | "WHATSAPP";

export interface MessageRequest {
  channel: MessageChannelKind;
  /** E.164 phone (SMS/WhatsApp) or email address. */
  to: string;
  /** Sender id / from address (SMS_SENDER_ID, EMAIL_FROM, WHATSAPP_SENDER_ID). */
  from?: string;
  templateId: string;
  locale: "en" | "ar";
  subject?: string;
  text: string;
  html?: string;
  params?: Record<string, string | number>;
  /** Our own correlation id (notification row id / related entity). */
  reference?: string;
  /** Stable per logical message: retries and replays never double-send. */
  idempotencyKey: string;
}
export interface MessageResult { providerMessageId: string; status: "SENT" | "QUEUED" }

export interface ChargeRequest {
  amount: string;
  currency: string;
  method: string;
  reference: string;
  idempotencyKey: string;
  cardToken?: string;
  walletRef?: string;
  customer?: { name?: string; email?: string; phone?: string };
}
export interface ChargeResult { status: "CAPTURED" | "DECLINED" | "PENDING"; providerRef: string; declineReason?: string; payUrl?: string }

export interface PayLinkRequest {
  amount: string;
  currency: string;
  reference: string;
  description: string;
  idempotencyKey: string;
  expiresAt?: string;
  customer?: { name?: string; email?: string; phone?: string };
}
export interface PayLinkResult { providerRef: string; payUrl: string; status: "PENDING" }

export interface RefundRequest { providerRef: string; amount: string; currency: string; reason?: string; idempotencyKey: string }
export interface RefundResult { providerRef: string; status: "SUCCEEDED" | "PENDING" }

/** What every webhook is normalised to, whatever the vendor sends. */
export type CanonicalEventType =
  | "message.sent" | "message.delivered" | "message.read" | "message.failed"
  | "payment.succeeded" | "payment.failed" | "payment.expired" | "refund.succeeded" | "refund.failed"
  | "consent.granted" | "consent.revoked" | "consent.expired";
export interface CanonicalEvent {
  /** Provider event id: the dedupe key (a replayed event is a no-op). */
  eventId: string;
  type: CanonicalEventType;
  /** message id / payment (charge or link) id / refund id at the provider. */
  providerRef: string;
  occurredAt?: string;
  error?: string;
  amount?: string;
  currency?: string;
  reference?: string;
}

/** Consent registry (patient/customer consent, KPRX01 consent_enforcement). Same shapes in Clinic, Pharmacy and Lab. */
export type ConsentPurpose = "DATA_PROCESSING" | "MARKETING" | "DATA_SHARING" | "CONTROLLED_DRUG" | "ERX_DISPENSE";
export const CONSENT_PURPOSES: ConsentPurpose[] = ["DATA_PROCESSING", "MARKETING", "DATA_SHARING", "CONTROLLED_DRUG", "ERX_DISPENSE"];
export interface ConsentGrantRequest { subjectRef: string; purpose: ConsentPurpose; expiresAt?: string; /** Our correlation id (record id). */ reference: string; idempotencyKey: string; evidence?: { source: string; capturedBy?: string } }
export interface ConsentGrantResult { providerRef: string; status: "ACTIVE"; expiresAt?: string }
export interface ConsentQueryResult { subjectRef: string; purpose: ConsentPurpose; /** Newest first. */ consents: Array<{ providerRef: string; status: "ACTIVE" | "REVOKED" | "EXPIRED"; grantedAt?: string; expiresAt?: string; revokedAt?: string }> }
export interface ConsentRevokeRequest { providerRef: string; reason?: string; idempotencyKey: string }
export interface ConsentRevokeResult { providerRef: string; status: "REVOKED" }
export interface ConsentIntrospection { valid: boolean; reason?: "MISSING" | "MALFORMED" | "REVOKED" | "EXPIRED"; expiresAt?: string }

/** AI gateway (LLM). Prompts reaching a provider are ALWAYS PHI-redacted first (src/providers/phi-redaction.ts). */
export interface AiRequest { system?: string; prompt: string; maxOutputTokens: number; temperature?: number; idempotencyKey: string }
export interface AiResult { text: string; model: string; providerRef?: string; usage: { inputTokens: number; outputTokens: number } }
