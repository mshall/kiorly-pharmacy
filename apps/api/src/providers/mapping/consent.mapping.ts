import { ProviderError } from "../http";
import type { ProviderConfig } from "../provider-env";
import type { CanonicalEvent, ConsentGrantRequest, ConsentGrantResult, ConsentIntrospection, ConsentPurpose, ConsentQueryResult, ConsentRevokeRequest, ConsentRevokeResult } from "../provider-types";
import { bearer, genericEvents } from "./generic";

const id = (json: any, what: string): string => {
  const v = json?.id;
  if (typeof v !== "string" || !v) throw new ProviderError("BAD_RESPONSE", `consent registry ${what} response has no id`);
  return v;
};
const status = (v: unknown): "ACTIVE" | "REVOKED" | "EXPIRED" => {
  const s = String(v ?? "").toLowerCase();
  return /revok|withdraw/.test(s) ? "REVOKED" : /expir/.test(s) ? "EXPIRED" : "ACTIVE";
};
const iso = (v: unknown) => (typeof v === "string" && !Number.isNaN(Date.parse(v)) ? v : undefined);

/**
 * Consent registry (Kiorex vault / consent service or any registry): the ONLY file to adapt for a concrete one. INTEGRATION.md documents no
 * registry wire contract (only consent TOKENS on events), so this is the generic gateway shape, all under {CONSENT_API_URL}:
 *   POST /consents                 { subjectRef, purpose, expiresAt?, reference, evidence? }  ->  { id, status: "active", expiresAt? }
 *   GET  /consents?subjectRef=&purpose=                                                         ->  { data: [{ id, status: active|revoked|expired, grantedAt?, expiresAt?, revokedAt? }] }
 *   POST /consents/{id}/revoke     { reason? }                                                  ->  { id, status: "revoked" }
 *   POST /consents/introspect      { token, patientRef, clinicId? }                             ->  { active: boolean, reason?: missing|malformed|revoked|expired, expiresAt? }
 * Revocations (and expiries) arrive by webhook: consent.granted | consent.revoked | consent.expired with data.id = the consent id.
 */
export const consentMapping = {
  paths: { grant: "/consents", query: "/consents", revoke: (providerRef: string) => `/consents/${encodeURIComponent(providerRef)}/revoke`, introspect: "/consents/introspect" },
  authHeaders: (cfg: ProviderConfig) => bearer(cfg),
  grantBody: (r: ConsentGrantRequest) => ({ subjectRef: r.subjectRef, purpose: r.purpose, expiresAt: r.expiresAt, reference: r.reference, evidence: r.evidence }),
  grantResult: (json: any): ConsentGrantResult => ({ providerRef: id(json, "grant"), status: "ACTIVE", expiresAt: iso(json?.expiresAt) }),
  queryPath: (subjectRef: string, purpose: ConsentPurpose) => `/consents?subjectRef=${encodeURIComponent(subjectRef)}&purpose=${encodeURIComponent(purpose)}`,
  queryResult: (json: any, subjectRef: string, purpose: ConsentPurpose): ConsentQueryResult => {
    const list: any[] = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    return { subjectRef, purpose, consents: list.map((c) => ({ providerRef: id(c, "query"), status: status(c.status), grantedAt: iso(c.grantedAt), expiresAt: iso(c.expiresAt), revokedAt: iso(c.revokedAt) })) };
  },
  revokeBody: (r: ConsentRevokeRequest) => ({ reason: r.reason }),
  revokeResult: (json: any, providerRef: string): ConsentRevokeResult => ({ providerRef: typeof json?.id === "string" ? json.id : providerRef, status: "REVOKED" }),
  introspectBody: (token: string, ctx: { patientRef: string; clinicId?: string }) => ({ token, patientRef: ctx.patientRef, clinicId: ctx.clinicId }),
  introspectResult: (json: any): ConsentIntrospection => {
    if (typeof json?.active !== "boolean") throw new ProviderError("BAD_RESPONSE", "consent registry introspection response has no `active`");
    if (json.active) return { valid: true, expiresAt: iso(json.expiresAt) };
    const r = String(json.reason ?? "").toUpperCase();
    return { valid: false, reason: r === "EXPIRED" ? "EXPIRED" : r === "MALFORMED" ? "MALFORMED" : r === "MISSING" ? "MISSING" : "REVOKED" };
  },
  parseWebhook: (json: unknown): CanonicalEvent[] => genericEvents(json, "consent"),
};
