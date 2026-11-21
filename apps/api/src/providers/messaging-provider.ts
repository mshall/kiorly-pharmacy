import { createHash } from "node:crypto";
import { ProviderError, providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig, type ProviderKind } from "./provider-env";
import type { CanonicalEvent, MessageChannelKind, MessageRequest, MessageResult } from "./provider-types";
import { smsMapping } from "./mapping/sms.mapping";
import { emailMapping } from "./mapping/email.mapping";
import { whatsappMapping } from "./mapping/whatsapp.mapping";

/** Port: one provider per channel (SMS / EMAIL / WHATSAPP). */
export interface MessageProvider {
  readonly kind: MessageChannelKind;
  readonly mode: "mock" | "real";
  /** Value stored in the `provider` column. */
  readonly name: string;
  send(req: MessageRequest): Promise<MessageResult>;
  parseWebhook(json: unknown): CanonicalEvent[];
}

interface Mapping {
  sendPath: string;
  authHeaders(cfg: ProviderConfig): Record<string, string>;
  toRequest(r: MessageRequest, cfg: ProviderConfig): unknown;
  fromResponse(json: unknown): MessageResult;
  parseWebhook(json: unknown): CanonicalEvent[];
}
const MAPPINGS: Record<MessageChannelKind, Mapping> = { SMS: smsMapping, EMAIL: emailMapping, WHATSAPP: whatsappMapping };

/** Deterministic fake: same code path as real (validation, rendering, idempotency); recipients ending in "-fail" / "fail@..." are rejected. */
export class MockMessageProvider implements MessageProvider {
  readonly mode = "mock" as const;
  readonly name = "mock";
  constructor(readonly kind: MessageChannelKind) {}
  async send(req: MessageRequest): Promise<MessageResult> {
    if (/-fail$|^fail@/i.test(req.to)) throw new ProviderError("REJECTED", "mock provider rejected recipient", 422);
    return { providerMessageId: `mock_${this.kind.toLowerCase()}_${createHash("sha256").update(req.idempotencyKey).digest("hex").slice(0, 16)}`, status: "SENT" };
  }
  parseWebhook(json: unknown): CanonicalEvent[] { return MAPPINGS[this.kind].parseWebhook(json); }
}

/** Real HTTP provider driven only by <KIND>_* env; vendor specifics live in the mapping file. */
export class HttpMessageProvider implements MessageProvider {
  readonly mode = "real" as const;
  readonly name: string;
  constructor(readonly kind: MessageChannelKind, private readonly cfg: ProviderConfig, private readonly fetchImpl?: FetchLike) {
    this.name = kind.toLowerCase();
  }
  async send(req: MessageRequest): Promise<MessageResult> {
    const m = MAPPINGS[this.kind];
    const res = await providerRequest(this.cfg, { path: m.sendPath, body: m.toRequest({ ...req, from: req.from ?? this.cfg.senderId }, this.cfg), idempotencyKey: req.idempotencyKey }, m.authHeaders(this.cfg), this.fetchImpl);
    return m.fromResponse(res.json);
  }
  parseWebhook(json: unknown): CanonicalEvent[] { return MAPPINGS[this.kind].parseWebhook(json); }
}

export function messageProvider(kind: MessageChannelKind, env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): MessageProvider {
  const cfg = providerConfig(kind as ProviderKind, env);
  return cfg.mode === "real" ? new HttpMessageProvider(kind, cfg, fetchImpl) : new MockMessageProvider(kind);
}
