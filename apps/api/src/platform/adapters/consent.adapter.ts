import { Injectable } from "@nestjs/common";
import { ProviderError, type FetchLike } from "../../providers/http";
import { consentRegistry } from "../../providers/consent-provider";

export interface ConsentCheck { valid: boolean; reason?: "MISSING" | "MALFORMED" | "REVOKED" | "EXPIRED" | "REGISTRY_UNAVAILABLE"; expiresAt?: Date }

/**
 * Verifies the patient consent token delivered with a PrescriptionIssued event (KPRX01, safety.pharmacy.consent_enforcement). CONSENT_MODE=mock|real.
 * Mock: tokens look like `ct_<id>`; `ct_revoked*` are revoked and `ct_expired*` are expired. Real: introspects with the consent registry
 * (CONSENT_API_URL / CONSENT_API_KEY; src/providers/mapping/consent.mapping.ts). Registry outage FAILS CLOSED (REGISTRY_UNAVAILABLE): no consent proof => nothing is stored.
 */
@Injectable()
export class ConsentVerifier {
  /** Test seam for the real HTTP registry. */
  static fetchImpl?: FetchLike;
  async verify(token: string | undefined | null, ctx: { patientRef: string; clinicId?: string }): Promise<ConsentCheck> {
    try {
      const r = await consentRegistry(process.env, ConsentVerifier.fetchImpl).introspect(token, ctx);
      return { valid: r.valid, reason: r.reason, expiresAt: r.expiresAt ? new Date(r.expiresAt) : undefined };
    } catch (e) {
      if (e instanceof ProviderError) return { valid: false, reason: "REGISTRY_UNAVAILABLE" };
      throw e;
    }
  }
}
export const consentProvider = ConsentVerifier;
