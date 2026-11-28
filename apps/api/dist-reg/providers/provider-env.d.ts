export type ProviderKind = "SMS" | "EMAIL" | "WHATSAPP" | "PAYMENT" | "PUSH" | "STORAGE" | "CONSENT" | "AI";
export type ProviderMode = "mock" | "real";
export declare const PROVIDER_KINDS: ProviderKind[];
export declare const WEBHOOK_KINDS: ProviderKind[];
type Env = Record<string, string | undefined>;
export declare const MOCK_WEBHOOK_SECRET = "mock-webhook-secret-not-a-credential";
export interface ProviderConfig {
    kind: ProviderKind;
    mode: ProviderMode;
    apiUrl?: string;
    apiKey?: string;
    webhookSecret?: string;
    senderId?: string;
    model?: string;
    timeoutMs: number;
    maxRetries: number;
    backoffMs: number;
}
export declare function providerMode(kind: ProviderKind, env?: Env): ProviderMode;
export declare function providerConfig(kind: ProviderKind, env?: Env): ProviderConfig;
export declare function webhookSecretFor(kind: ProviderKind, env?: Env): string | undefined;
export declare class ProviderConfigError extends Error {
    readonly problems: string[];
    constructor(problems: string[]);
}
export declare function validateProviderConfig(env?: Env, kinds?: ProviderKind[]): string[];
export declare function assertProviderConfig(env?: Env, kinds?: ProviderKind[]): void;
export interface ProviderStatus {
    provider: string;
    mode: ProviderMode;
    vendor: string;
    ready: boolean;
}
export declare function providerStatus(env?: Env, kinds?: ProviderKind[]): ProviderStatus[];
export declare function devToolsEnabled(env?: Env): boolean;
export {};
