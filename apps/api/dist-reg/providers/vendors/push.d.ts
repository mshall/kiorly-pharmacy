export interface PushMessage {
    token: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    channelId?: string;
}
export interface PushOutcome {
    ok: boolean;
    providerRef?: string;
    error?: string;
    invalidToken?: boolean;
}
export interface PushConfig {
    fcmServiceAccountJson?: string;
    fcmProjectId?: string;
    expoAccessToken?: string;
    androidChannelId?: string;
    fcmBase?: string;
    oauthUrl?: string;
    expoUrl?: string;
    timeoutMs?: number;
}
export type FetchFn = (url: string, init?: RequestInit) => Promise<Response>;
export interface ServiceAccount {
    project_id: string;
    client_email: string;
    private_key: string;
    token_uri?: string;
}
export declare const isExpoToken: (t: string) => boolean;
export declare function parseServiceAccount(raw: string | undefined): ServiceAccount | null;
export declare function pushProblems(env: Record<string, string | undefined>): string[];
export declare const pushConfigFromEnv: (env: Record<string, string | undefined>) => PushConfig;
export declare class PushSender {
    private readonly cfg;
    private readonly fetchImpl;
    private readonly now;
    private accessToken?;
    constructor(cfg: PushConfig, fetchImpl?: FetchFn, now?: () => number);
    private http;
    private fcmAccessToken;
    sendFcm(m: PushMessage): Promise<PushOutcome>;
    sendExpo(m: PushMessage): Promise<PushOutcome>;
    send(m: PushMessage): Promise<PushOutcome>;
}
