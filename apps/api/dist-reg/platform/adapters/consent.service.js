"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var ConsentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsentService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const http_1 = require("../../providers/http");
const consent_provider_1 = require("../../providers/consent-provider");
const provider_types_1 = require("../../providers/provider-types");
const consent_adapter_1 = require("./consent.adapter");
let ConsentService = ConsentService_1 = class ConsentService {
    prisma;
    log = new common_1.Logger(ConsentService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    static isPurpose(p) { return provider_types_1.CONSENT_PURPOSES.includes(p); }
    registry() { return (0, consent_provider_1.consentRegistry)(process.env, consent_adapter_1.ConsentVerifier.fetchImpl); }
    async grant(orgId, i) {
        const id = (0, node_crypto_1.randomUUID)();
        let providerRef = null, expiresAt = i.expiresAt ?? null;
        try {
            const r = await this.registry().grant({ subjectRef: i.subjectRef, purpose: i.purpose, expiresAt: i.expiresAt?.toISOString(), reference: id, idempotencyKey: `consent-${id}`, evidence: { source: i.source, capturedBy: i.actorId } });
            providerRef = r.providerRef;
            if (r.expiresAt)
                expiresAt = new Date(r.expiresAt);
        }
        catch (e) {
            if (e instanceof http_1.ProviderError)
                throw new errors_1.DomainError("CONSENT_REGISTRY_UNAVAILABLE", `Consent registry did not accept the consent (${e.code})`, 503, { code: e.code });
            throw e;
        }
        return this.prisma.consentRecord.create({ data: { id, orgId, patientId: i.patientId, subjectRef: i.subjectRef, purpose: i.purpose, source: i.source, providerRef, tokenHash: i.tokenHash, expiresAt, createdBy: i.actorId } });
    }
    async recordErxConsent(orgId, p) {
        const tokenHash = (0, node_crypto_1.createHash)("sha256").update(p.token).digest("hex");
        try {
            if (await this.prisma.consentRecord.findFirst({ where: { orgId, tokenHash } }))
                return;
            await this.grant(orgId, { subjectRef: p.patientRef, patientId: p.patientId, purpose: "ERX_DISPENSE", source: "ERX", expiresAt: p.expiresAt, tokenHash });
        }
        catch (e) {
            this.log.warn(`e-Rx consent bookkeeping failed: ${e.message}`);
        }
    }
    async syncCustomerConsent(orgId, patientId, subjectRef, flags, actorId) {
        for (const [purpose, on] of Object.entries(flags)) {
            try {
                const active = await this.prisma.consentRecord.findFirst({ where: { orgId, patientId, purpose, status: "ACTIVE" }, orderBy: { createdAt: "desc" } });
                if (on && !active)
                    await this.grant(orgId, { subjectRef, patientId, purpose, source: "CUSTOMER_REGISTRY", actorId });
                else if (!on && active)
                    await this.revoke(orgId, active.id, "customer withdrew consent", actorId);
            }
            catch (e) {
                this.log.warn(`customer consent sync (${purpose}) failed: ${e.message}`);
            }
        }
    }
    async list(orgId, q = {}) {
        return this.prisma.consentRecord.findMany({
            where: { orgId, ...(q.subjectRef ? { subjectRef: q.subjectRef } : {}), ...(q.patientId ? { patientId: q.patientId } : {}), ...(q.purpose ? { purpose: q.purpose } : {}), ...(q.status ? { status: q.status } : {}) },
            orderBy: { createdAt: "desc" }, take: Math.min(q.limit ?? 100, 200),
        });
    }
    async status(orgId, subjectRef, purpose) {
        const rows = await this.prisma.consentRecord.findMany({ where: { orgId, subjectRef, purpose }, orderBy: { createdAt: "desc" }, take: 20 });
        const now = new Date();
        const active = rows.find((r) => r.status === "ACTIVE" && (!r.expiresAt || r.expiresAt > now));
        let registry = null;
        if (this.registry().mode === "real") {
            try {
                registry = (await this.registry().query(subjectRef, purpose)).consents;
            }
            catch (e) {
                registry = { error: e instanceof http_1.ProviderError ? e.code : "ERROR" };
            }
        }
        return { subjectRef, purpose, valid: !!active, active: active ?? null, history: rows, registry };
    }
    async revoke(orgId, id, reason, actorId) {
        const rec = await this.prisma.consentRecord.findFirst({ where: { id, orgId } });
        if (!rec)
            throw (0, errors_1.notFound)("Consent", id);
        if (rec.status === "REVOKED")
            return rec;
        let row = await this.applyRevocation(rec, "REVOKED", reason, new Date(), actorId);
        let syncError = null;
        if (rec.providerRef) {
            try {
                await this.registry().revoke({ providerRef: rec.providerRef, reason, idempotencyKey: `consent-revoke-${rec.id}` });
            }
            catch (e) {
                syncError = e instanceof http_1.ProviderError ? e.code : "ERROR";
            }
        }
        if (syncError !== row.syncError)
            row = await this.prisma.consentRecord.update({ where: { id }, data: { syncError } });
        return row;
    }
    async onEvent(e) {
        const rec = await this.prisma.consentRecord.findFirst({ where: { providerRef: e.providerRef } });
        if (!rec)
            return false;
        if (e.type === "consent.revoked")
            await this.applyRevocation(rec, "REVOKED", e.error ?? "revoked at the consent registry", e.occurredAt ? new Date(e.occurredAt) : new Date());
        else if (e.type === "consent.expired")
            await this.applyRevocation(rec, "EXPIRED", "expired at the consent registry", e.occurredAt ? new Date(e.occurredAt) : new Date());
        else if (rec.status !== "ACTIVE" && rec.status !== "REVOKED")
            await this.prisma.consentRecord.update({ where: { id: rec.id }, data: { status: "ACTIVE", revokedAt: null } });
        return true;
    }
    async applyRevocation(rec, status, reason, at, actorId) {
        return this.prisma.$transaction(async (tx) => {
            const row = rec.status === "ACTIVE" ? await tx.consentRecord.update({ where: { id: rec.id }, data: { status, revokedAt: at, revokeReason: reason?.slice(0, 200) } }) : rec;
            if (rec.purpose === "MARKETING" && rec.patientId)
                await tx.patientRef.updateMany({ where: { id: rec.patientId, orgId: rec.orgId }, data: { consentMarketing: false } });
            if (rec.purpose === "DATA_PROCESSING" && rec.patientId)
                await tx.patientRef.updateMany({ where: { id: rec.patientId, orgId: rec.orgId }, data: { consentDataProcessing: false } });
            if (rec.tokenHash)
                await tx.prescription.updateMany({ where: { orgId: rec.orgId, consentTokenHash: rec.tokenHash }, data: { consentExpiresAt: at } });
            await tx.auditLog.create({ data: { orgId: rec.orgId, actorId: actorId ?? "system", action: `consent.${status.toLowerCase()}`, entityType: "ConsentRecord", entityId: rec.id, meta: { purpose: rec.purpose, reason: reason?.slice(0, 200) } } });
            return row;
        });
    }
};
exports.ConsentService = ConsentService;
exports.ConsentService = ConsentService = ConsentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ConsentService);
//# sourceMappingURL=consent.service.js.map