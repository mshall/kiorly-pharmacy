import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, ConsentGrantRequest, ConsentGrantResult, ConsentIntrospection, ConsentPurpose, ConsentQueryResult, ConsentRevokeRequest, ConsentRevokeResult } from "../provider-types";
export declare const consentMapping: {
    paths: {
        grant: string;
        query: string;
        revoke: (providerRef: string) => string;
        introspect: string;
    };
    authHeaders: (cfg: ProviderConfig) => Record<string, string>;
    grantBody: (r: ConsentGrantRequest) => {
        subjectRef: string;
        purpose: ConsentPurpose;
        expiresAt: string | undefined;
        reference: string;
        evidence: {
            source: string;
            capturedBy?: string;
        } | undefined;
    };
    grantResult: (json: any) => ConsentGrantResult;
    queryPath: (subjectRef: string, purpose: ConsentPurpose) => string;
    queryResult: (json: any, subjectRef: string, purpose: ConsentPurpose) => ConsentQueryResult;
    revokeBody: (r: ConsentRevokeRequest) => {
        reason: string | undefined;
    };
    revokeResult: (json: any, providerRef: string) => ConsentRevokeResult;
    introspectBody: (token: string, ctx: {
        patientRef: string;
        clinicId?: string;
    }) => {
        token: string;
        patientRef: string;
        clinicId: string | undefined;
    };
    introspectResult: (json: any) => ConsentIntrospection;
    parseWebhook: (json: unknown) => CanonicalEvent[];
};
