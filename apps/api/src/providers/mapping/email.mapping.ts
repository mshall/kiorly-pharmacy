import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, MessageRequest, MessageResult } from "../provider-types";
import { bearer, genericEvents, genericMessageResponse } from "./generic";

/**
 * Email: the ONLY file to adapt for a concrete email vendor (SES, SendGrid, Postmark...).
 * Default = generic gateway shape: POST {EMAIL_API_URL}/messages  { to, from, subject, text, html?, reference, templateId, locale }  ->  { id, status }.
 */
export const emailMapping = {
  sendPath: "/messages",
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  toRequest: (r: MessageRequest, cfg: ProviderConfig) => ({ to: r.to, from: r.from ?? cfg.senderId, subject: r.subject ?? "Kiorly", text: r.text, html: r.html, reference: r.reference, templateId: r.templateId, locale: r.locale }),
  fromResponse: (json: unknown): MessageResult => genericMessageResponse(json),
  parseWebhook: (json: unknown): CanonicalEvent[] => genericEvents(json, "message"),
};
