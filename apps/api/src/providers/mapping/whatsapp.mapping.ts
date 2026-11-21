import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, MessageRequest, MessageResult } from "../provider-types";
import { bearer, genericEvents, genericMessageResponse } from "./generic";

/**
 * WhatsApp Business: the ONLY file to adapt for a concrete vendor (Meta Cloud API, Twilio, 360dialog...).
 * Default = generic gateway shape: POST {WHATSAPP_API_URL}/messages
 *   { to, from, template: { name, language, params }, text, reference }  ->  { id, status }.
 * `template.name` is the approved Meta template name (NEEDS_HUMAN: approved EN + AR templates); `text` is the rendered fallback body.
 */
export const whatsappMapping = {
  sendPath: "/messages",
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  toRequest: (r: MessageRequest, cfg: ProviderConfig) => ({ to: r.to, from: r.from ?? cfg.senderId, template: { name: r.templateId, language: r.locale, params: r.params ?? {} }, text: r.text, reference: r.reference }),
  fromResponse: (json: unknown): MessageResult => genericMessageResponse(json),
  parseWebhook: (json: unknown): CanonicalEvent[] => genericEvents(json, "message"),
};
