import { type FetchLike } from "./http";
export interface PushMessage {
    to: string;
    title: string;
    body: string;
    data?: Record<string, unknown>;
    channelId?: string;
}
export declare function sendPush(msgs: PushMessage[], env?: Record<string, string | undefined>, fetchImpl?: FetchLike): Promise<{
    accepted: number;
    invalid: string[];
}>;
