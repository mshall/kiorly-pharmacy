import { type FetchLike } from "./http";
import { type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, ConsentGrantRequest, ConsentGrantResult, ConsentIntrospection, ConsentPurpose, ConsentQueryResult, ConsentRevokeRequest, ConsentRevokeResult } from "./provider-types";
export interface ConsentRegistry {
    readonly mode: "mock" | "real";
    readonly name: string;
    grant(r: ConsentGrantRequest): Promise<ConsentGrantResult>;
    query(subjectRef: string, purpose: ConsentPurpose): Promise<ConsentQueryResult>;
    revoke(r: ConsentRevokeRequest): Promise<ConsentRevokeResult>;
    introspect(token: string | undefined | null, ctx: {
        patientRef: string;
        clinicId?: string;
    }): Promise<ConsentIntrospection>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class MockConsentRegistry implements ConsentRegistry {
    readonly mode: "mock";
    readonly name = "mock";
    grant(r: ConsentGrantRequest): Promise<ConsentGrantResult>;
    query(subjectRef: string, purpose: ConsentPurpose): Promise<ConsentQueryResult>;
    revoke(r: ConsentRevokeRequest): Promise<ConsentRevokeResult>;
    introspect(token: string | undefined | null, _ctx?: {
        patientRef: string;
        clinicId?: string;
    }): Promise<ConsentIntrospection>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare class HttpConsentRegistry implements ConsentRegistry {
    private readonly cfg;
    private readonly fetchImpl?;
    readonly mode: "real";
    readonly name = "consent";
    constructor(cfg: ProviderConfig, fetchImpl?: FetchLike | undefined);
    private call;
    grant(r: ConsentGrantRequest): Promise<ConsentGrantResult>;
    query(subjectRef: string, purpose: ConsentPurpose): Promise<ConsentQueryResult>;
    revoke(r: ConsentRevokeRequest): Promise<ConsentRevokeResult>;
    introspect(token: string | undefined | null, ctx: {
        patientRef: string;
        clinicId?: string;
    }): Promise<ConsentIntrospection>;
    parseWebhook(json: unknown): CanonicalEvent[];
}
export declare function consentRegistry(env?: Record<string, string | undefined>, fetchImpl?: FetchLike): ConsentRegistry;
