import { createHash } from "node:crypto";
import { providerRequest, type FetchLike } from "./http";
import { providerConfig, type ProviderConfig } from "./provider-env";
import type { CanonicalEvent, ConsentGrantRequest, ConsentGrantResult, ConsentIntrospection, ConsentPurpose, ConsentQueryResult, ConsentRevokeRequest, ConsentRevokeResult } from "./provider-types";
import { consentMapping as M } from "./mapping/consent.mapping";

/** Port: external consent registry. */
export interface ConsentRegistry {
  readonly mode: "mock" | "real";
  readonly name: string;
  grant(r: ConsentGrantRequest): Promise<ConsentGrantResult>;
  /** Registry view of a subject's consents for one purpose. The mock has no registry state (local rows are the truth) and returns none. */
  query(subjectRef: string, purpose: ConsentPurpose): Promise<ConsentQueryResult>;
  revoke(r: ConsentRevokeRequest): Promise<ConsentRevokeResult>;
  /** Introspect the consent token delivered with a PrescriptionIssued event. */
  introspect(token: string | undefined | null, ctx: { patientRef: string; clinicId?: string }): Promise<ConsentIntrospection>;
  parseWebhook(json: unknown): CanonicalEvent[];
}

const h = (s: string) => createHash("sha256").update(s).digest("hex").slice(0, 16);

/**
 * Deterministic fake. Tokens look like `ct_<id>`; `ct_revoked*` are revoked, `ct_expired*` are expired. Grants get a stable id from the idempotency key.
 */
export class MockConsentRegistry implements ConsentRegistry {
  readonly mode = "mock" as const;
  readonly name = "mock";
  async grant(r: ConsentGrantRequest): Promise<ConsentGrantResult> { return { providerRef: `mockconsent_${h(r.idempotencyKey)}`, status: "ACTIVE", expiresAt: r.expiresAt }; }
  async query(subjectRef: string, purpose: ConsentPurpose): Promise<ConsentQueryResult> { return { subjectRef, purpose, consents: [] }; }
  async revoke(r: ConsentRevokeRequest): Promise<ConsentRevokeResult> { return { providerRef: r.providerRef, status: "REVOKED" }; }
  async introspect(token: string | undefined | null, _ctx?: { patientRef: string; clinicId?: string }): Promise<ConsentIntrospection> {
    if (!token) return { valid: false, reason: "MISSING" };
    if (!/^ct_[A-Za-z0-9_-]{4,}$/.test(token)) return { valid: false, reason: "MALFORMED" };
    if (token.startsWith("ct_revoked")) return { valid: false, reason: "REVOKED" };
    if (token.startsWith("ct_expired")) return { valid: false, reason: "EXPIRED" };
    return { valid: true, expiresAt: new Date(Date.now() + 30 * 86_400_000).toISOString() };
  }
  parseWebhook(json: unknown): CanonicalEvent[] { return M.parseWebhook(json); }
}

export class HttpConsentRegistry implements ConsentRegistry {
  readonly mode = "real" as const;
  readonly name = "consent";
  constructor(private readonly cfg: ProviderConfig, private readonly fetchImpl?: FetchLike) {}
  private call(req: Parameters<typeof providerRequest>[1]) { return providerRequest(this.cfg, req, M.authHeaders(this.cfg), this.fetchImpl); }
  async grant(r: ConsentGrantRequest) { return M.grantResult((await this.call({ path: M.paths.grant, body: M.grantBody(r), idempotencyKey: r.idempotencyKey })).json); }
  async query(subjectRef: string, purpose: ConsentPurpose) { return M.queryResult((await this.call({ method: "GET", path: M.queryPath(subjectRef, purpose) })).json, subjectRef, purpose); }
  async revoke(r: ConsentRevokeRequest) { return M.revokeResult((await this.call({ path: M.paths.revoke(r.providerRef), body: M.revokeBody(r), idempotencyKey: r.idempotencyKey })).json, r.providerRef); }
  async introspect(token: string | undefined | null, ctx: { patientRef: string; clinicId?: string }): Promise<ConsentIntrospection> {
    if (!token) return { valid: false, reason: "MISSING" };
    return M.introspectResult((await this.call({ path: M.paths.introspect, body: M.introspectBody(token, ctx) })).json);
  }
  parseWebhook(json: unknown): CanonicalEvent[] { return M.parseWebhook(json); }
}

export function consentRegistry(env: Record<string, string | undefined> = process.env, fetchImpl?: FetchLike): ConsentRegistry {
  const cfg = providerConfig("CONSENT", env);
  return cfg.mode === "real" ? new HttpConsentRegistry(cfg, fetchImpl) : new MockConsentRegistry();
}
