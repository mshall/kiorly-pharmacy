import { ProviderError } from "../http";
import type { CanonicalEvent, CanonicalEventType, MessageResult } from "../provider-types";
import type { ProviderConfig } from "../provider-env";

export const bearer = (cfg: ProviderConfig): Record<string, string> => (cfg.apiKey ? { authorization: `Bearer ${cfg.apiKey}` } : {});

const MESSAGE_TYPES = new Set<string>(["message.sent", "message.delivered", "message.read", "message.failed"]);
const CONSENT_TYPES = new Set<string>(["consent.granted", "consent.revoked", "consent.expired"]);
const PAYMENT_TYPES = new Set<string>(["payment.succeeded", "payment.failed", "payment.expired", "refund.succeeded", "refund.failed"]);

/** Generic send response: `{ id, status }` (also accepts `messageId`). */
export function genericMessageResponse(json: any): MessageResult {
  const id = json?.id ?? json?.messageId ?? json?.message_id;
  if (typeof id !== "string" || !id) throw new ProviderError("BAD_RESPONSE", "provider send response has no message id");
  return { providerMessageId: id, status: /queued|pending|accepted/i.test(String(json?.status ?? "")) ? "QUEUED" : "SENT" };
}

/** Generic webhook body: `{ id, type, createdAt, data: { id, error?, amount?, currency?, reference? } }`, or an array / `{ events: [...] }` of them. */
export function genericEvents(json: any, allowed: "message" | "payment" | "consent"): CanonicalEvent[] {
  const list: any[] = Array.isArray(json) ? json : Array.isArray(json?.events) ? json.events : json ? [json] : [];
  const set = allowed === "message" ? MESSAGE_TYPES : allowed === "consent" ? CONSENT_TYPES : PAYMENT_TYPES;
  const out: CanonicalEvent[] = [];
  for (const e of list) {
    if (typeof e?.id !== "string" || !set.has(e?.type) || typeof e?.data?.id !== "string") throw new ProviderError("BAD_RESPONSE", "malformed webhook event");
    out.push({ eventId: e.id, type: e.type as CanonicalEventType, providerRef: e.data.id, occurredAt: typeof e.createdAt === "string" ? e.createdAt : undefined, error: typeof e.data.error === "string" ? e.data.error.slice(0, 200) : undefined, amount: e.data.amount != null ? String(e.data.amount) : undefined, currency: e.data.currency, reference: e.data.reference });
  }
  return out;
}
