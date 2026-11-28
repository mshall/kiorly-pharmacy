import { type FetchLike } from "../../providers/http";
export interface ConsentCheck {
    valid: boolean;
    reason?: "MISSING" | "MALFORMED" | "REVOKED" | "EXPIRED" | "REGISTRY_UNAVAILABLE";
    expiresAt?: Date;
}
export declare class ConsentVerifier {
    static fetchImpl?: FetchLike;
    verify(token: string | undefined | null, ctx: {
        patientRef: string;
        clinicId?: string;
    }): Promise<ConsentCheck>;
}
export declare const consentProvider: typeof ConsentVerifier;
