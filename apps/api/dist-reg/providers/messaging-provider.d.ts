import { type FetchLike } from "./http";
import { type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, MessageChannelKind, MessageRequest, MessageResult } from "./provider-types";
export interface MessageProvider {
    readonly kind: MessageChannelKind;
    readonly mode: "mock" | "real";
    readonly name: string;
    send(req: MessageRequest): Promise<MessageResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class MockMessageProvider implements MessageProvider {
    readonly kind: MessageChannelKind;
    readonly mode: "mock";
    readonly name = "mock";
    constructor(kind: MessageChannelKind);
    send(req: MessageRequest): Promise<MessageResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class HttpMessageProvider implements MessageProvider {
    readonly kind: MessageChannelKind;
    private readonly cfg;
    private readonly fetchImpl?;
    readonly mode: "real";
    readonly name: string;
    constructor(kind: MessageChannelKind, cfg: ProviderConfig, fetchImpl?: FetchLike | undefined);
    send(req: MessageRequest): Promise<MessageResult>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare function messageProvider(kind: MessageChannelKind, env?: Record<string, string | undefined>, fetchImpl?: FetchLike): MessageProvider;
