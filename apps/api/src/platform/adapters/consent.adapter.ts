import { Injectable } from "@nestjs/common";
import { adapterMode, ProviderNotWiredError } from "./adapter-mode";

export interface ConsentCheck { valid: boolean; reason?: "MISSING" | "MALFORMED" | "REVOKED" | "EXPIRED"; expiresAt?: Date }

/**
 * Verifies the patient consent token delivered with a PrescriptionIssued event (KPRX01, safety.pharmacy.consent_enforcement).
 * Mock: tokens look like `ct_<id>`; `ct_revoked*` are revoked and `ct_expired*` are expired. Real: introspects with Kiorex consent service.
 */
export abstract class ConsentVerifier {
  abstract verify(token: string | undefined | null, ctx: { patientRef: string; clinicId?: string }): Promise<ConsentCheck>;
}

@Injectable()
export class MockConsentVerifier extends ConsentVerifier {
  async verify(token: string | undefined | null): Promise<ConsentCheck> {
    if (!token) return { valid: false, reason: "MISSING" };
    if (!/^ct_[A-Za-z0-9_-]{4,}$/.test(token)) return { valid: false, reason: "MALFORMED" };
    if (token.startsWith("ct_revoked")) return { valid: false, reason: "REVOKED" };
    if (token.startsWith("ct_expired")) return { valid: false, reason: "EXPIRED" };
    return { valid: true, expiresAt: new Date(Date.now() + 30 * 86_400_000) };
  }
}
@Injectable()
export class RealConsentVerifier extends ConsentVerifier {
  async verify(): Promise<ConsentCheck> { throw new ProviderNotWiredError("consent"); }
}
export const consentProvider = { provide: ConsentVerifier, useFactory: () => (adapterMode("CONSENT") === "real" ? new RealConsentVerifier() : new MockConsentVerifier()) };
