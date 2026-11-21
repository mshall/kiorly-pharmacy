import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, MessageRequest, MessageResult } from "../provider-types";
import { bearer, genericEvents, genericMessageResponse } from "./generic";

/**
 * SMS: the ONLY file to adapt for a concrete SMS vendor (Twilio, Vonage, local Egyptian aggregator...).
 * Default = the generic Kiorex gateway shape: POST {SMS_API_URL}/messages  { to, from, text, reference, templateId, locale }  ->  { id, status }.
 */
export const smsMapping = {
  sendPath: "/messages",
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  toRequest: (r: MessageRequest, cfg: ProviderConfig) => ({ to: r.to, from: r.from ?? cfg.senderId, text: r.text, reference: r.reference, templateId: r.templateId, locale: r.locale }),
  fromResponse: (json: unknown): MessageResult => genericMessageResponse(json),
  parseWebhook: (json: unknown): CanonicalEvent[] => genericEvents(json, "message"),
};
