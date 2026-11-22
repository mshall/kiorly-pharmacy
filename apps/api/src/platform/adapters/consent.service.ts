import { Inject, Injectable, Logger } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import type { ConsentRecord, Prisma } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError, notFound } from "../../common/errors";
import { ProviderError } from "../../providers/http";
import { consentRegistry } from "../../providers/consent-provider";
import { CONSENT_PURPOSES, type CanonicalEvent, type ConsentPurpose } from "../../providers/provider-types";
import { ConsentVerifier } from "./consent.adapter";

export interface GrantInput { subjectRef: string; patientId?: string; purpose: ConsentPurpose; source: "CUSTOMER_REGISTRY" | "ERX" | "API" | "DEV_DEMO"; expiresAt?: Date; tokenHash?: string; actorId?: string }

/**
 * Consent capture, query and revoke. The local `ConsentRecord` is the persisted truth the pharmacy enforces; the registry (CONSENT_MODE=real) is told about every grant / revoke,
 * and sends `consent.revoked|expired|granted` webhooks back (POST /webhooks/providers/consent, HMAC). Safe directions only:
 *  - grant: the registry must accept it first (no registry proof => no ACTIVE record; 503 CONSENT_REGISTRY_UNAVAILABLE);
 *  - revoke: applied locally at once (never blocked by an outage); the registry sync is retried later by hand and the error code kept in `syncError`.
 * Revocation effects: MARKETING => customer's marketing flag off (no refill reminders); any record with an e-Rx token => that Rx's consent expires now (dispensing is blocked).
 */
@Injectable()
export class ConsentService {
  private readonly log = new Logger(ConsentService.name);
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  static isPurpose(p: string): p is ConsentPurpose { return (CONSENT_PURPOSES as string[]).includes(p); }
  private registry() { return consentRegistry(process.env, ConsentVerifier.fetchImpl); }

  async grant(orgId: string, i: GrantInput): Promise<ConsentRecord> {
    const id = randomUUID();
    let providerRef: string | null = null, expiresAt = i.expiresAt ?? null;
    try {
      const r = await this.registry().grant({ subjectRef: i.subjectRef, purpose: i.purpose, expiresAt: i.expiresAt?.toISOString(), reference: id, idempotencyKey: `consent-${id}`, evidence: { source: i.source, capturedBy: i.actorId } });
      providerRef = r.providerRef;
      if (r.expiresAt) expiresAt = new Date(r.expiresAt);
    } catch (e) {
      if (e instanceof ProviderError) throw new DomainError("CONSENT_REGISTRY_UNAVAILABLE", `Consent registry did not accept the consent (${e.code})`, 503, { code: e.code });
      throw e;
    }
    return this.prisma.consentRecord.create({ data: { id, orgId, patientId: i.patientId, subjectRef: i.subjectRef, purpose: i.purpose, source: i.source, providerRef, tokenHash: i.tokenHash, expiresAt, createdBy: i.actorId } });
  }

  /** e-Rx intake: record the (already verified) token consent once per token. Never throws: the Rx intake must not fail on bookkeeping. */
  async recordErxConsent(orgId: string, p: { patientRef: string; patientId?: string; token: string; expiresAt?: Date }): Promise<void> {
    const tokenHash = createHash("sha256").update(p.token).digest("hex");
    try {
      if (await this.prisma.consentRecord.findFirst({ where: { orgId, tokenHash } })) return;
      await this.grant(orgId, { subjectRef: p.patientRef, patientId: p.patientId, purpose: "ERX_DISPENSE", source: "ERX", expiresAt: p.expiresAt, tokenHash });
    } catch (e) {
      this.log.warn(`e-Rx consent bookkeeping failed: ${(e as Error).message}`);
    }
  }

  /** Customer registry (data-processing + marketing toggles): mirrors each flag as a consent record; revoking one revokes the active record. Best-effort, never throws. */
  async syncCustomerConsent(orgId: string, patientId: string, subjectRef: string, flags: Partial<Record<"DATA_PROCESSING" | "MARKETING", boolean>>, actorId?: string): Promise<void> {
    for (const [purpose, on] of Object.entries(flags) as ["DATA_PROCESSING" | "MARKETING", boolean][]) {
      try {
        const active = await this.prisma.consentRecord.findFirst({ where: { orgId, patientId, purpose, status: "ACTIVE" }, orderBy: { createdAt: "desc" } });
        if (on && !active) await this.grant(orgId, { subjectRef, patientId, purpose, source: "CUSTOMER_REGISTRY", actorId });
        else if (!on && active) await this.revoke(orgId, active.id, "customer withdrew consent", actorId);
      } catch (e) {
        this.log.warn(`customer consent sync (${purpose}) failed: ${(e as Error).message}`);
      }
    }
  }

  async list(orgId: string, q: { subjectRef?: string; patientId?: string; purpose?: string; status?: string; limit?: number } = {}) {
    return this.prisma.consentRecord.findMany({
      where: { orgId, ...(q.subjectRef ? { subjectRef: q.subjectRef } : {}), ...(q.patientId ? { patientId: q.patientId } : {}), ...(q.purpose ? { purpose: q.purpose } : {}), ...(q.status ? { status: q.status as never } : {}) },
      orderBy: { createdAt: "desc" }, take: Math.min(q.limit ?? 100, 200),
    });
  }

  /** Current status of a subject's consent for one purpose: local record (expiry applied) plus, in real mode, the registry's own view. */
  async status(orgId: string, subjectRef: string, purpose: ConsentPurpose) {
    const rows = await this.prisma.consentRecord.findMany({ where: { orgId, subjectRef, purpose }, orderBy: { createdAt: "desc" }, take: 20 });
    const now = new Date();
    const active = rows.find((r) => r.status === "ACTIVE" && (!r.expiresAt || r.expiresAt > now));
    let registry: unknown = null;
    if (this.registry().mode === "real") {
      try { registry = (await this.registry().query(subjectRef, purpose)).consents; } catch (e) { registry = { error: e instanceof ProviderError ? e.code : "ERROR" }; }
    }
    return { subjectRef, purpose, valid: !!active, active: active ?? null, history: rows, registry };
  }

  async revoke(orgId: string, id: string, reason?: string, actorId?: string): Promise<ConsentRecord> {
    const rec = await this.prisma.consentRecord.findFirst({ where: { id, orgId } });
    if (!rec) throw notFound("Consent", id);
    if (rec.status === "REVOKED") return rec;
    let row = await this.applyRevocation(rec, "REVOKED", reason, new Date(), actorId);
    let syncError: string | null = null;
    if (rec.providerRef) {
      try { await this.registry().revoke({ providerRef: rec.providerRef, reason, idempotencyKey: `consent-revoke-${rec.id}` }); } catch (e) { syncError = e instanceof ProviderError ? e.code : "ERROR"; }
    }
    if (syncError !== row.syncError) row = await this.prisma.consentRecord.update({ where: { id }, data: { syncError } });
    return row;
  }

  /** Registry callback (already HMAC-verified and deduped). Returns false when the consent is unknown here. */
  async onEvent(e: CanonicalEvent): Promise<boolean> {
    const rec = await this.prisma.consentRecord.findFirst({ where: { providerRef: e.providerRef } });
    if (!rec) return false;
    if (e.type === "consent.revoked") await this.applyRevocation(rec, "REVOKED", e.error ?? "revoked at the consent registry", e.occurredAt ? new Date(e.occurredAt) : new Date());
    else if (e.type === "consent.expired") await this.applyRevocation(rec, "EXPIRED", "expired at the consent registry", e.occurredAt ? new Date(e.occurredAt) : new Date());
    else if (rec.status !== "ACTIVE" && rec.status !== "REVOKED") await this.prisma.consentRecord.update({ where: { id: rec.id }, data: { status: "ACTIVE", revokedAt: null } });
    return true;
  }

  private async applyRevocation(rec: ConsentRecord, status: "REVOKED" | "EXPIRED", reason: string | undefined, at: Date, actorId?: string): Promise<ConsentRecord> {
    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const row = rec.status === "ACTIVE" ? await tx.consentRecord.update({ where: { id: rec.id }, data: { status, revokedAt: at, revokeReason: reason?.slice(0, 200) } }) : rec;
      if (rec.purpose === "MARKETING" && rec.patientId) await tx.patientRef.updateMany({ where: { id: rec.patientId, orgId: rec.orgId }, data: { consentMarketing: false } });
      if (rec.purpose === "DATA_PROCESSING" && rec.patientId) await tx.patientRef.updateMany({ where: { id: rec.patientId, orgId: rec.orgId }, data: { consentDataProcessing: false } });
      if (rec.tokenHash) await tx.prescription.updateMany({ where: { orgId: rec.orgId, consentTokenHash: rec.tokenHash }, data: { consentExpiresAt: at } });
      await tx.auditLog.create({ data: { orgId: rec.orgId, actorId: actorId ?? "system", action: `consent.${status.toLowerCase()}`, entityType: "ConsentRecord", entityId: rec.id, meta: { purpose: rec.purpose, reason: reason?.slice(0, 200) } } });
      return row;
    });
  }
}
