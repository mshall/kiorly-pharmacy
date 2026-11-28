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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrescriptionsService = exports.DEFAULT_RX_VALIDITY_DAYS = void 0;
const common_1 = require("@nestjs/common");
const push_service_1 = require("../mobile/push.service");
const node_crypto_1 = require("node:crypto");
const client_1 = require("../../generated/prisma/client");
const contracts_1 = require("@kiorex/contracts");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const consent_adapter_1 = require("../../platform/adapters/consent.adapter");
const storage_adapter_1 = require("../../platform/adapters/storage.adapter");
const consent_service_1 = require("../../platform/adapters/consent.service");
const normalize_1 = require("../catalogue/normalize");
const price_service_1 = require("../catalogue/price.service");
const prescribers_service_1 = require("./prescribers.service");
const customer_registry_service_1 = require("../customers/customer-registry.service");
exports.DEFAULT_RX_VALIDITY_DAYS = 30;
let PrescriptionsService = class PrescriptionsService {
    prisma;
    consent;
    storage;
    consents;
    prescribers;
    prices;
    push;
    constructor(prisma, consent, storage, consents, prescribers, prices, push) {
        this.prisma = prisma;
        this.consent = consent;
        this.storage = storage;
        this.consents = consents;
        this.prescribers = prescribers;
        this.prices = prices;
        this.push = push;
    }
    notifyRxWaiting(orgId, rxId, branchId) {
        void this.push?.sendTemplate(orgId, "rx.awaiting", {}, { roles: ["PHARMACIST", "OWNER", "BRANCH_MANAGER"], branchId }, { rxId });
    }
    async upsertPatient(tx, orgId, p) {
        const phone = (0, customer_registry_service_1.normPhone)(p.phone);
        const existing = p.externalId ? await tx.patientRef.findFirst({ where: { orgId, externalId: p.externalId } }) : phone ? await tx.patientRef.findFirst({ where: { orgId, phone, active: true, mergedIntoId: null }, orderBy: { createdAt: "asc" } }) : null;
        if (existing) {
            const allergies = [...new Set([...existing.allergies, ...(p.allergies ?? []).map((a) => a.toLowerCase().trim())])];
            return tx.patientRef.update({ where: { id: existing.id }, data: { allergies } });
        }
        return tx.patientRef.create({ data: { orgId, customerNo: await (0, customer_registry_service_1.nextCustomerNo)(tx, orgId), externalId: p.externalId, displayName: p.displayName, phone, allergies: (p.allergies ?? []).map((a) => a.toLowerCase().trim()), birthYear: p.birthYear } });
    }
    async resolveDrug(tx, orgId, l) {
        if (l.drugId) {
            const d = await tx.drug.findFirst({ where: { id: l.drugId, OR: [{ orgId: null }, { orgId }] } });
            if (!d)
                throw (0, errors_1.notFound)("Drug", l.drugId);
            return d;
        }
        return null;
    }
    async intakePaper(user, input) {
        if (!input.lines.length)
            throw new errors_1.DomainError("NO_LINES", "A prescription needs at least one line", 400);
        if (!input.patientId && !input.patient)
            throw new errors_1.DomainError("PATIENT_REQUIRED", "Choose or enter a patient", 400);
        if (!input.prescriberId && !input.prescriberName)
            throw new errors_1.DomainError("PRESCRIBER_REQUIRED", "Choose a prescriber or enter the prescriber name", 400);
        const issued = input.issuedAt ? new Date(input.issuedAt) : new Date();
        if (issued.getTime() > Date.now() + 86_400_000)
            throw new errors_1.DomainError("ISSUED_IN_FUTURE", "Issue date cannot be in the future", 400);
        if ((input.refillsAllowed ?? 0) < 0 || (input.refillsAllowed ?? 0) > 12)
            throw new errors_1.DomainError("INVALID_REFILLS", "Refills must be between 0 and 12", 400);
        return this.prisma.$transaction(async (tx) => {
            const patient = input.patientId
                ? await tx.patientRef.findFirst({ where: { id: input.patientId, orgId: user.orgId, active: true } })
                : await this.upsertPatient(tx, user.orgId, input.patient);
            if (!patient)
                throw (0, errors_1.notFound)("Customer", input.patientId);
            const prescriber = input.prescriberId
                ? await tx.prescriber.findFirst({ where: { id: input.prescriberId, orgId: user.orgId, active: true } })
                : input.prescriberLicenceNo ? await this.prescribers.ensure(tx, user.orgId, { name: input.prescriberName, licenceNo: input.prescriberLicenceNo }) : null;
            if (input.prescriberId && !prescriber)
                throw (0, errors_1.notFound)("Prescriber", input.prescriberId);
            const rx = await tx.prescription.create({
                data: {
                    orgId: user.orgId, branchId: input.branchId, source: input.source ?? (input.scanDataUrl ? "PAPER_SCAN" : "MANUAL_ENTRY"), patientId: patient.id, prescriberId: prescriber?.id, prescriberName: prescriber?.name ?? input.prescriberName, prescriberLicenceNo: prescriber?.licenceNo,
                    prescriberVerifiedBadge: prescriber?.verified ?? false, issuedAt: issued, validUntil: new Date(issued.getTime() + (input.validDays ?? exports.DEFAULT_RX_VALIDITY_DAYS) * 86_400_000), receivedBy: user.userId,
                    refillsAllowed: input.refillsAllowed ?? 0, refillIntervalDays: input.refillIntervalDays ?? ((input.refillsAllowed ?? 0) > 0 ? 30 : null), priority: input.priority ?? "NORMAL",
                },
            });
            for (const l of input.lines) {
                const d = await this.resolveDrug(tx, user.orgId, l);
                await tx.prescriptionLine.create({
                    data: { prescriptionId: rx.id, drugId: d?.id, activeIngredient: l.activeIngredient ?? d?.activeIngredient, strength: l.strength ?? d?.strength, dosageForm: l.dosageForm ?? d?.dosageForm, drugName: l.drugName ?? d?.brandName, quantity: l.quantity, directions: l.directions, controlled: d ? d.controlledSchedule !== "NONE" : false },
                });
            }
            if (input.scanDataUrl) {
                const { key } = await this.storage.putDataUrl(`rx-scans/${user.orgId}/${rx.id}`, input.scanDataUrl);
                await tx.prescription.update({ where: { id: rx.id }, data: { scanStorageKey: key } });
            }
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.intake", entityType: "Prescription", entityId: rx.id, meta: { source: rx.source, lines: input.lines.length, refills: rx.refillsAllowed } } });
            return rx;
        }).then((rx) => { this.notifyRxWaiting(user.orgId, rx.id, rx.branchId); return this.get(user.orgId, rx.id); });
    }
    async intakeEvent(orgId, branchId, envelope) {
        const v = (0, contracts_1.validateEvent)("PrescriptionIssued", envelope);
        if (!v.valid)
            throw new errors_1.DomainError("EVENT_CONTRACT_VIOLATION", "PrescriptionIssued does not match @kiorex/contracts", 422, v.errors);
        const ev = v.event;
        const dup = await this.prisma.prescription.findUnique({ where: { orgId_sourceEventId: { orgId, sourceEventId: ev.eventId } } });
        if (dup)
            return { status: "duplicate", prescriptionId: dup.id };
        const consent = await this.consent.verify(ev.data.consentToken, { patientRef: ev.data.patientRef, clinicId: ev.data.clinicId });
        if (!consent.valid && consent.reason === "REGISTRY_UNAVAILABLE")
            throw new errors_1.DomainError("CONSENT_REGISTRY_UNAVAILABLE", "Consent registry unreachable: the e-Rx is not stored without verified consent; the clinic will retry", 503, { reason: consent.reason });
        if (!consent.valid)
            throw new errors_1.DomainError("CONSENT_INVALID", `Patient consent token rejected: ${consent.reason}`, 422, { reason: consent.reason });
        try {
            const rx = await this.prisma.$transaction(async (tx) => {
                await tx.inboundEvent.create({ data: { eventId: ev.eventId, type: "PrescriptionIssued", orgId } });
                const patient = await this.upsertPatient(tx, orgId, { displayName: `Patient ${ev.data.patientRef.slice(-6)}`, externalId: ev.data.patientRef });
                const issuedAt = new Date(ev.data.issuedAt);
                const created = await tx.prescription.create({
                    data: {
                        orgId, branchId, source: "KIORLY_E_RX", patientId: patient.id, sourceEventId: ev.eventId, sourceRxRef: ev.data.prescriptionId, clinicRef: ev.data.clinicId, prescriberRef: ev.data.prescriberId,
                        consentTokenHash: (0, node_crypto_1.createHash)("sha256").update(ev.data.consentToken).digest("hex"), consentVerifiedAt: new Date(), consentExpiresAt: consent.expiresAt,
                        prescriberName: `Clinic prescriber ${ev.data.prescriberId.slice(-6)}`, prescriberLicenceNo: `KIORLY:${ev.data.prescriberId}`, prescriberVerifiedBadge: true,
                        issuedAt, validUntil: new Date(issuedAt.getTime() + exports.DEFAULT_RX_VALIDITY_DAYS * 86_400_000),
                    },
                });
                for (const it of ev.data.items) {
                    const match = await tx.drug.findFirst({ where: { OR: [{ orgId: null }, { orgId }], activeIngredient: { equals: it.activeIngredient, mode: "insensitive" }, ...(it.strength ? { strength: { equals: it.strength, mode: "insensitive" } } : {}), active: true }, orderBy: { brandName: "asc" } });
                    await tx.prescriptionLine.create({ data: { prescriptionId: created.id, drugId: null, activeIngredient: it.activeIngredient, strength: it.strength ?? match?.strength, dosageForm: match?.dosageForm, drugName: it.drugName, quantity: Math.max(1, Math.ceil(it.quantity)), directions: it.dose, controlled: it.controlled ?? false } });
                }
                await tx.auditLog.create({ data: { orgId, action: "rx.intake", entityType: "Prescription", entityId: created.id, meta: { source: "KIORLY_E_RX", eventId: ev.eventId, items: ev.data.items.length } } });
                return created;
            });
            await this.consents.recordErxConsent(orgId, { patientRef: ev.data.patientRef, patientId: rx.patientId ?? undefined, token: ev.data.consentToken, expiresAt: consent.expiresAt });
            this.notifyRxWaiting(orgId, rx.id, branchId);
            return { status: "created", prescriptionId: rx.id };
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                const again = await this.prisma.prescription.findUnique({ where: { orgId_sourceEventId: { orgId, sourceEventId: ev.eventId } } });
                if (again)
                    return { status: "duplicate", prescriptionId: again.id };
            }
            throw e;
        }
    }
    async list(orgId, q) {
        const where = {
            orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status } : {}), ...(q.source ? { source: q.source } : {}), ...(q.prescriberId ? { prescriberId: q.prescriberId } : {}), ...(q.patientId ? { patientId: q.patientId } : {}),
            ...(q.q ? { OR: [{ patient: { displayName: { contains: q.q, mode: "insensitive" } } }, { patient: { phone: { contains: q.q } } }, { prescriberName: { contains: q.q, mode: "insensitive" } }, { id: { startsWith: q.q } }] } : {}),
        };
        const [items, total] = await Promise.all([
            this.prisma.prescription.findMany({ where, include: { lines: true, patient: { select: { id: true, displayName: true, customerNo: true } } }, orderBy: { receivedAt: "desc" }, skip: q.skip, take: q.take }),
            this.prisma.prescription.count({ where }),
        ]);
        return { items, total };
    }
    async verificationQueue(orgId, branchId) {
        const rows = await this.prisma.prescription.findMany({
            where: { orgId, status: { in: ["RECEIVED", "VALIDATING"] }, ...(branchId ? { branchId } : {}) },
            include: { lines: true, patient: { select: { id: true, displayName: true, allergies: true } } }, orderBy: { receivedAt: "asc" }, take: 200,
        });
        const now = Date.now();
        const items = rows.map((r) => ({
            id: r.id, status: r.status, priority: r.priority, source: r.source, receivedAt: r.receivedAt, ageMinutes: Math.floor((now - r.receivedAt.getTime()) / 60_000), patient: r.patient, prescriberName: r.prescriberName,
            prescriberVerified: r.prescriberVerifiedBadge, lines: r.lines.length, controlled: r.lines.some((l) => l.controlled), hasAllergyOnFile: !!r.patient?.allergies.length, refillsAllowed: r.refillsAllowed, verificationNotes: r.verificationNotes,
            expiresInDays: r.validUntil ? Math.floor((r.validUntil.getTime() - now) / 86_400_000) : null,
        })).sort((a, b) => Number(b.priority === "URGENT") - Number(a.priority === "URGENT") || b.ageMinutes - a.ageMinutes);
        return { total: items.length, urgent: items.filter((i) => i.priority === "URGENT").length, items };
    }
    async annotate(user, id, d) {
        await this.get(user.orgId, id);
        const r = await this.prisma.prescription.update({ where: { id }, data: { ...(d.priority ? { priority: d.priority } : {}), ...(d.verificationNotes !== undefined ? { verificationNotes: d.verificationNotes } : {}) } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.annotate", entityType: "Prescription", entityId: id, meta: { fields: Object.keys(d) } } });
        return r;
    }
    async balance(orgId, id) {
        const rx = await this.get(orgId, id);
        const lines = rx.lines.map((l) => ({ lineId: l.id, drugName: l.drug?.brandName ?? l.drugName ?? l.activeIngredient, prescribed: l.quantity, dispensed: l.qtyDispensed, remaining: Math.max(l.quantity - l.qtyDispensed, 0) }));
        return { prescriptionId: id, status: rx.status, lines, owed: lines.reduce((a, l) => a + l.remaining, 0), complete: lines.every((l) => l.remaining === 0), refillsAllowed: rx.refillsAllowed, refillsUsed: rx.refillsUsed, nextRefillDueAt: rx.nextRefillDueAt };
    }
    async partialFills(orgId, branchId) {
        const rows = await this.prisma.prescription.findMany({ where: { orgId, status: "PARTIALLY_DISPENSED", ...(branchId ? { branchId } : {}) }, include: { lines: true, patient: { select: { id: true, displayName: true, phone: true } } }, orderBy: { receivedAt: "asc" }, take: 200 });
        return rows.map((r) => ({ id: r.id, patient: r.patient, receivedAt: r.receivedAt, validUntil: r.validUntil, owed: r.lines.reduce((a, l) => a + Math.max(l.quantity - l.qtyDispensed, 0), 0) }));
    }
    async lineSubstitutes(user, id, lineId, branchId) {
        const rx = await this.get(user.orgId, id);
        const line = rx.lines.find((l) => l.id === lineId);
        if (!line)
            throw (0, errors_1.notFound)("Prescription line", lineId);
        const base = line.drug;
        const ingredient = (base?.activeIngredient ?? line.activeIngredient ?? "").trim();
        if (!ingredient)
            return [];
        const strength = base?.strength ?? line.strength;
        const form = base?.dosageForm ?? line.dosageForm;
        const drugs = await this.prisma.drug.findMany({ where: { active: true, OR: [{ orgId: null }, { orgId: user.orgId }], activeIngredient: { equals: ingredient, mode: "insensitive" }, ...(strength ? { strength: { equals: strength, mode: "insensitive" } } : {}), ...(form ? { dosageForm: { equals: form, mode: "insensitive" } } : {}) }, take: 40 });
        const stock = await this.prisma.stockLot.groupBy({ by: ["drugId"], where: { orgId: user.orgId, branchId, drugId: { in: drugs.map((d) => d.id) }, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } }, _sum: { qtyOnHand: true, qtyReserved: true } });
        const sm = new Map(stock.map((x) => [x.drugId, (x._sum.qtyOnHand ?? 0) - (x._sum.qtyReserved ?? 0)]));
        const prices = await this.prices.pricesAt(user.orgId, branchId, drugs.map((d) => d.id));
        const basePrice = base ? prices.get(base.id) : undefined;
        return drugs.map((d) => {
            const price = prices.get(d.id);
            return { drugId: d.id, brandName: d.brandName, brandNameAr: d.brandNameAr, strength: d.strength, dosageForm: d.dosageForm, available: Math.max(sm.get(d.id) ?? 0, 0), price: price?.toFixed(2) ?? null, isPrescribed: d.id === base?.id, saving: price && basePrice && d.id !== base?.id ? basePrice.minus(price).toFixed(2) : null };
        }).sort((a, b) => Number(b.available > 0) - Number(a.available > 0) || Number(a.price ?? 1e9) - Number(b.price ?? 1e9));
    }
    async get(orgId, id) {
        const rx = await this.prisma.prescription.findFirst({ where: { id, orgId }, include: { lines: { include: { drug: true } }, patient: true } });
        if (!rx)
            throw (0, errors_1.notFound)("Prescription", id);
        return rx;
    }
    async scanUrl(orgId, id, ttlSec) {
        const rx = await this.get(orgId, id);
        if (!rx.scanStorageKey)
            throw (0, errors_1.notFound)("Prescription scan", id);
        const u = this.storage.signedUrl(rx.scanStorageKey, ttlSec);
        return { url: u.path, expiresAt: u.expiresAt };
    }
    async validate(user, id) {
        const rx = await this.get(user.orgId, id);
        if (rx.status === "DISPENSED" || rx.status === "CANCELLED")
            throw new errors_1.DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
        const issues = [];
        if (!rx.prescriberName || !rx.prescriberLicenceNo)
            issues.push({ code: "PRESCRIBER_MISSING", severity: "ERROR", message: "Prescriber name and licence number are required" });
        else if (!rx.prescriberVerifiedBadge)
            issues.push({ code: "PRESCRIBER_UNVERIFIED", severity: "WARN", message: "Prescriber has no Kiorly-verified badge; verify the licence manually" });
        if (!rx.patientId)
            issues.push({ code: "PATIENT_MISSING", severity: "ERROR", message: "Patient is required" });
        if (rx.validUntil && rx.validUntil < new Date())
            issues.push({ code: "RX_EXPIRED", severity: "ERROR", message: "Prescription validity has passed" });
        if (rx.source === "KIORLY_E_RX" && (!rx.consentVerifiedAt || (rx.consentExpiresAt && rx.consentExpiresAt < new Date())))
            issues.push({ code: "CONSENT_INVALID", severity: "ERROR", message: "Patient consent token missing or expired" });
        if (!rx.lines.length)
            issues.push({ code: "NO_LINES", severity: "ERROR", message: "No prescription lines" });
        for (const l of rx.lines) {
            if (!Number.isInteger(l.quantity) || l.quantity <= 0)
                issues.push({ code: "QUANTITY_INVALID", severity: "ERROR", message: "Quantity must be a positive whole number", lineId: l.id });
            if (!l.directions)
                issues.push({ code: "DOSE_MISSING", severity: "WARN", message: "Directions (dose/frequency/duration) not stated", lineId: l.id });
            if (!l.drugId && !l.activeIngredient)
                issues.push({ code: "DRUG_MISSING", severity: "ERROR", message: "Drug or active ingredient required", lineId: l.id });
        }
        const hasError = issues.some((i) => i.severity === "ERROR");
        const status = hasError ? "VALIDATING" : "VALIDATED";
        const updated = await this.prisma.prescription.update({ where: { id }, data: hasError ? { status } : { status, validatedBy: user.userId, validatedAt: new Date() } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.validate", entityType: "Prescription", entityId: id, meta: { errors: issues.filter((i) => i.severity === "ERROR").length, warnings: issues.filter((i) => i.severity === "WARN").length } } });
        return { prescription: updated, issues, validated: !hasError };
    }
    async reject(user, id, reason) {
        const rx = await this.get(user.orgId, id);
        if (["DISPENSED", "PARTIALLY_DISPENSED", "CANCELLED"].includes(rx.status))
            throw new errors_1.DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.reject", entityType: "Prescription", entityId: id, meta: { reason } } });
        return this.prisma.prescription.update({ where: { id }, data: { status: "REJECTED", rejectionReason: reason } });
    }
    async setLineDrug(user, id, lineId, drugId) {
        const rx = await this.get(user.orgId, id);
        const line = rx.lines.find((l) => l.id === lineId);
        if (!line)
            throw (0, errors_1.notFound)("Prescription line", lineId);
        const d = await this.prisma.drug.findFirst({ where: { id: drugId, OR: [{ orgId: null }, { orgId: user.orgId }] } });
        if (!d)
            throw (0, errors_1.notFound)("Drug", drugId);
        if (line.activeIngredient && (0, normalize_1.groupKey)({ activeIngredient: d.activeIngredient, strength: d.strength, dosageForm: d.dosageForm }).activeIngredient !== (0, normalize_1.groupKey)({ activeIngredient: line.activeIngredient, strength: d.strength, dosageForm: d.dosageForm }).activeIngredient) {
            throw new errors_1.DomainError("INGREDIENT_MISMATCH", "Chosen product does not contain the prescribed active ingredient", 409);
        }
        return this.prisma.prescriptionLine.update({ where: { id: lineId }, data: { drugId, controlled: d.controlledSchedule !== "NONE", strength: line.strength ?? d.strength, dosageForm: line.dosageForm ?? d.dosageForm } });
    }
};
exports.PrescriptionsService = PrescriptionsService;
exports.PrescriptionsService = PrescriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(consent_adapter_1.ConsentVerifier)),
    __param(2, (0, common_1.Inject)(storage_adapter_1.StorageAdapter)),
    __param(3, (0, common_1.Inject)(consent_service_1.ConsentService)),
    __param(4, (0, common_1.Inject)(prescribers_service_1.PrescribersService)),
    __param(5, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(6, (0, common_1.Optional)()),
    __param(6, (0, common_1.Inject)(push_service_1.PushService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        consent_adapter_1.ConsentVerifier,
        storage_adapter_1.StorageAdapter,
        consent_service_1.ConsentService,
        prescribers_service_1.PrescribersService,
        price_service_1.PriceService,
        push_service_1.PushService])
], PrescriptionsService);
//# sourceMappingURL=prescriptions.service.js.map