import type { CanonicalEvent, MessageResult } from "../provider-types";
import type { ProviderConfig } from "../provider-env";
export declare const bearer: (cfg: ProviderConfig) => Record<string, string>;
export declare function genericMessageResponse(json: any): MessageResult;
export declare function genericEvents(json: any, allowed: "message" | "payment" | "consent"): CanonicalEvent[];
