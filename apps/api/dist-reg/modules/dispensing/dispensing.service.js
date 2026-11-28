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
exports.DispensingService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const stock_ledger_service_1 = require("../inventory/stock-ledger.service");
const lot_guard_1 = require("../inventory/lot-guard/lot-guard");
const price_service_1 = require("../catalogue/price.service");
const normalize_1 = require("../catalogue/normalize");
const sales_service_1 = require("../pos/sales.service");
const psp_adapter_1 = require("../../platform/adapters/psp.adapter");
const ports_1 = require("../../kernel-adapter/ports");
const dispense_hooks_1 = require("../../common/dispense-hooks");
const rx_safety_engine_1 = require("../prescriptions/safety/rx-safety-engine");
const permissions_1 = require("../../auth/permissions");
const rx_label_template_1 = require("./rx-label-template");
const knowledge_1 = require("../clinical/knowledge");
const isPharmacist = (u) => (0, permissions_1.roleHas)(u.role, "dispense.signoff") && !!u.pharmacistLicenceNo;
const nidHash = (orgId, nid) => (0, node_crypto_1.createHmac)("sha256", process.env.NATIONAL_ID_PEPPER ?? "dev-only-pepper").update(`${orgId}:${nid}`).digest("hex");
let DispensingService = class DispensingService {
    prisma;
    ledger;
    prices;
    sales;
    psp;
    packs;
    hooks;
    kb;
    constructor(prisma, ledger, prices, sales, psp, packs, hooks, kb) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.prices = prices;
        this.sales = sales;
        this.psp = psp;
        this.packs = packs;
        this.hooks = hooks;
        this.kb = kb;
    }
    async create(user, input) {
        if (!input.items.length)
            throw new errors_1.DomainError("NO_ITEMS", "Nothing to dispense", 400);
        const orgId = user.orgId;
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const pack = this.packs.get(tenant.marketCode);
        const rx = input.prescriptionId
            ? await this.prisma.prescription.findFirst({ where: { id: input.prescriptionId, orgId }, include: { lines: true } })
            : null;
        if (input.prescriptionId && !rx)
            throw (0, errors_1.notFound)("Prescription", input.prescriptionId);
        if (rx) {
            if (!["VALIDATED", "PARTIALLY_DISPENSED"].includes(rx.status))
                throw new errors_1.DomainError("RX_NOT_VALIDATED", `Prescription must be validated by a pharmacist first (status ${rx.status})`, 409);
            if (rx.source === "KIORLY_E_RX" && (!rx.consentVerifiedAt || (rx.consentExpiresAt && rx.consentExpiresAt < new Date())))
                throw new errors_1.DomainError("CONSENT_INVALID", "Patient consent for this e-Rx is missing or expired", 409);
        }
        const rxDrugIds = (rx?.lines ?? []).map((l) => l.drugId).filter((x) => !!x);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...new Set([...input.items.map((i) => i.drugId), ...rxDrugIds])] }, active: true, OR: [{ orgId: null }, { orgId }] } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        for (const it of input.items) {
            const d = dm.get(it.drugId);
            if (!d)
                throw (0, errors_1.notFound)("Drug", it.drugId);
            if ((d.rxOnly || d.controlledSchedule !== "NONE") && !rx)
                throw new errors_1.DomainError("RX_REQUIRED", `${d.brandName} requires a validated prescription`, 409, { drugId: d.id });
            if (!Number.isInteger(it.quantity) || it.quantity <= 0)
                throw new errors_1.DomainError("INVALID_QUANTITY", "Quantity must be a positive whole number", 400);
        }
        const bound = input.items.map((it) => {
            const drug = dm.get(it.drugId);
            let line = it.prescriptionLineId ? rx?.lines.find((l) => l.id === it.prescriptionLineId) : undefined;
            if (it.prescriptionLineId && !line)
                throw new errors_1.DomainError("LINE_NOT_IN_RX", "Prescription line not found on this prescription", 409);
            if (rx && !line) {
                line = rx.lines.find((l) => l.drugId === it.drugId)
                    ?? rx.lines.find((l) => l.drugId && drugs.find((d) => d.id === l.drugId)?.substitutionGroupId && drugs.find((d) => d.id === l.drugId).substitutionGroupId === drug.substitutionGroupId && (!it.substitution || it.substitution.fromDrugId === l.drugId))
                    ?? rx.lines.find((l) => !l.drugId && l.activeIngredient && (0, normalize_1.groupKey)({ activeIngredient: l.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient === (0, normalize_1.groupKey)(drug).activeIngredient);
            }
            if (rx && !line)
                throw new errors_1.DomainError("DRUG_NOT_PRESCRIBED", `${drug.brandName} does not match any prescription line`, 409, { drugId: drug.id });
            let substitution = null;
            if (line) {
                if (line.quantity - line.qtyDispensed < it.quantity)
                    throw new errors_1.DomainError("EXCEEDS_PRESCRIBED", `Only ${line.quantity - line.qtyDispensed} remaining on the prescription line`, 409, { lineId: line.id });
                if (line.activeIngredient && (0, normalize_1.groupKey)({ activeIngredient: drug.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient !== (0, normalize_1.groupKey)({ activeIngredient: line.activeIngredient, strength: drug.strength, dosageForm: drug.dosageForm }).activeIngredient)
                    throw new errors_1.DomainError("INGREDIENT_MISMATCH", `${drug.brandName} does not contain the prescribed ingredient`, 409);
            }
            const prescribedDrugId = line?.drugId ?? undefined;
            if (prescribedDrugId && prescribedDrugId !== it.drugId) {
                const prescribed = drugs.find((d) => d.id === prescribedDrugId);
                const sameGroup = prescribed && prescribed.substitutionGroupId && prescribed.substitutionGroupId === drug.substitutionGroupId;
                if (!sameGroup)
                    throw new errors_1.DomainError("SUBSTITUTION_NOT_EQUIVALENT", "Substitute must have the same active ingredient, strength and form", 409);
                if (!isPharmacist(user))
                    throw new errors_1.DomainError("SUBSTITUTION_REQUIRES_PHARMACIST", "Only a pharmacist can decide a substitution", 403);
                if (!it.substitution?.consent)
                    throw new errors_1.DomainError("SUBSTITUTION_CONSENT_REQUIRED", "Patient consent for the substitution is required", 422);
                substitution = { fromDrugId: prescribedDrugId, consent: true, decidedBy: user.userId };
            }
            return { it, drug, line, substitution };
        });
        const patientId = input.patientId ?? rx?.patientId ?? undefined;
        const patient = patientId ? await this.prisma.patientRef.findFirst({ where: { id: patientId, orgId } }) : null;
        if (patientId && !patient)
            throw (0, errors_1.notFound)("Patient", patientId);
        const recentRows = patient
            ? await this.prisma.dispensingLine.findMany({ where: { dispensing: { orgId, patientId: patient.id, status: "DISPENSED", dispensedAt: { gte: new Date(Date.now() - 30 * 86_400_000) } } }, include: { dispensing: { select: { dispensedAt: true } } } })
            : [];
        const recentDrugs = recentRows.length ? await this.prisma.drug.findMany({ where: { id: { in: recentRows.map((r) => r.drugId) } }, select: { id: true, activeIngredient: true } }) : [];
        const rd = new Map(recentDrugs.map((d) => [d.id, d.activeIngredient]));
        const engineItems = bound.map((b) => ({ drugId: b.drug.id, activeIngredient: b.drug.activeIngredient, quantity: b.it.quantity, controlledSchedule: b.drug.controlledSchedule, label: b.drug.brandName, strength: b.drug.strength, directions: b.line?.directions ?? null }));
        const snapshot = await this.kb.snapshot(orgId);
        const ageYears = patient?.dateOfBirth ? Math.floor((Date.now() - patient.dateOfBirth.getTime()) / 31_557_600_000) : patient?.birthYear ? new Date().getUTCFullYear() - patient.birthYear : null;
        const results = (0, rx_safety_engine_1.runSafetyChecks)(engineItems, { allergies: patient?.allergies ?? [], pregnant: patient?.pregnant, lactating: patient?.lactating, renalImpairment: patient?.renalImpairment, hepaticImpairment: patient?.hepaticImpairment, ageYears, weightKg: patient?.weightKg ? Number(patient.weightKg) : null, recent: recentRows.map((r) => ({ ingredient: rd.get(r.drugId) ?? "", dispensedAt: r.dispensing.dispensedAt ?? new Date() })).filter((r) => r.ingredient) }, { hasRx: !!rx, prescriberName: rx?.prescriberName, prescriberLicenceNo: rx?.prescriberLicenceNo, prescriberVerifiedBadge: rx?.prescriberVerifiedBadge, validUntil: rx?.validUntil }, { controlledQuantityLimit: pack.controlledQuantityLimit, kb: snapshot });
        const at = new Date();
        return this.prisma.$transaction(async (tx) => {
            const disp = await tx.dispensing.create({ data: { orgId, branchId: input.branchId, prescriptionId: rx?.id, patientId: patient?.id, status: "VALIDATED", createdBy: user.userId, kiorexOrderRef: input.kiorexOrderId, safetyChecksRunAt: at, partialReason: input.partialReason } });
            await tx.safetyCheckResult.createMany({ data: results.map((r) => ({ dispensingId: disp.id, kind: r.kind, outcome: r.outcome, detail: r.detail, overridable: r.overridable })) });
            const takenByLot = new Map();
            for (const b of bound) {
                const lots = (await tx.stockLot.findMany({ where: { orgId, branchId: input.branchId, drugId: b.drug.id, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } })).map((l) => ({ ...l, qtyReserved: l.qtyReserved + (takenByLot.get(l.id) ?? 0) }));
                const { picks, shortage } = (0, lot_guard_1.allocateFefo)(lots, b.it.quantity);
                if (shortage > 0)
                    throw new errors_1.DomainError("INSUFFICIENT_STOCK", `Not enough sellable stock for ${b.drug.brandName} (short by ${shortage})`, 409, { drugId: b.drug.id, shortage });
                const price = (await this.prices.priceAt(orgId, input.branchId, b.drug.id, at, tx)) ?? (0, money_1.D)(0);
                const vatRate = await this.sales.vatRateFor(orgId, b.drug);
                for (const p of picks) {
                    takenByLot.set(p.lotId, (takenByLot.get(p.lotId) ?? 0) + p.quantity);
                    await this.ledger.post(tx, { orgId, branchId: input.branchId, lotId: p.lotId, type: "RESERVE", quantity: p.quantity, performedBy: user.userId, refType: "Dispensing", refId: disp.id });
                    await tx.dispensingLine.create({
                        data: {
                            dispensingId: disp.id, drugId: b.drug.id, lotId: p.lotId, quantity: p.quantity, prescriptionLineId: b.line?.id, unitPrice: price, vatRate,
                            substitutedFromDrugId: b.substitution?.fromDrugId, substitutionConsent: !!b.substitution, substitutionDecidedBy: b.substitution?.decidedBy,
                        },
                    });
                }
            }
            await tx.dispensing.update({ where: { id: disp.id }, data: { status: "RESERVED" } });
            await tx.auditLog.create({ data: { orgId, actorId: user.userId, action: "dispense.create", entityType: "Dispensing", entityId: disp.id, meta: { prescriptionId: rx?.id ?? null, items: bound.length, blocks: results.filter((r) => r.outcome === "BLOCK").length, substitutions: bound.filter((b) => b.substitution).length } } });
            return disp.id;
        }, { timeout: 30_000 }).then((id) => this.get(orgId, id));
    }
    async get(orgId, id) {
        const d = await this.prisma.dispensing.findFirst({ where: { id, orgId }, include: { lines: { include: { lot: { select: { lotNumber: true, expiryDate: true, status: true } } } }, safetyChecks: { orderBy: { checkedAt: "asc" } }, controlledLog: true, prescription: { include: { patient: { select: { id: true, displayName: true } } } } } });
        if (!d)
            throw (0, errors_1.notFound)("Dispensing", id);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: d.lines.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, controlledSchedule: true, rxOnly: true } });
        const dm = new Map(drugs.map((x) => [x.id, x]));
        return { ...d, lines: d.lines.map((l) => ({ ...l, drug: dm.get(l.drugId) })), unresolvedBlocks: d.safetyChecks.filter((c) => c.outcome === "BLOCK").length };
    }
    async list(orgId, q) {
        const where = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status } : {}) };
        const [items, total] = await Promise.all([this.prisma.dispensing.findMany({ where, include: { lines: true, safetyChecks: true, prescription: { select: { id: true, source: true } } }, orderBy: { createdAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.dispensing.count({ where })]);
        return { items, total };
    }
    async override(user, id, checkId, reason) {
        if (!isPharmacist(user))
            throw new errors_1.DomainError("PHARMACIST_REQUIRED", "Only a licensed pharmacist can override a safety check", 403);
        const d = await this.get(user.orgId, id);
        if (!["RESERVED", "VALIDATED"].includes(d.status))
            throw new errors_1.DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
        const c = d.safetyChecks.find((x) => x.id === checkId);
        if (!c)
            throw (0, errors_1.notFound)("Safety check", checkId);
        if (c.outcome !== "BLOCK")
            throw new errors_1.DomainError("NOT_BLOCKED", "Only BLOCK results are overridden", 409);
        if (c.kind === "CONTROLLED_LIMIT" || c.kind === "PRESCRIBER" || c.kind === "DOSE_QUANTITY" || !c.overridable)
            throw new errors_1.DomainError("NOT_OVERRIDABLE", `${c.kind} blocks are regulatory hard stops and cannot be overridden`, 403);
        await this.prisma.safetyCheckResult.update({ where: { id: checkId }, data: { outcome: "OVERRIDDEN_BY_PHARMACIST", overriddenBy: user.userId, overrideReason: reason } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.safety_override", entityType: "Dispensing", entityId: id, meta: { kind: c.kind, reason, detail: c.detail ?? null } } });
        return this.get(user.orgId, id);
    }
    async captureControlledId(user, id, input) {
        if (!/^\d{14}$/.test(input.nationalId))
            throw new errors_1.DomainError("INVALID_NATIONAL_ID", "National ID must be 14 digits", 400);
        const d = await this.get(user.orgId, id);
        if (!["RESERVED", "VALIDATED", "SIGNED_OFF"].includes(d.status))
            throw new errors_1.DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
        const patientId = d.patientId;
        if (!patientId)
            throw new errors_1.DomainError("PATIENT_REQUIRED", "A controlled dispensing needs a patient record", 409);
        await this.prisma.$transaction(async (tx) => {
            await tx.patientRef.update({ where: { id: patientId }, data: { nationalIdHash: nidHash(user.orgId, input.nationalId), nationalIdLast4: input.nationalId.slice(-4), displayName: input.patientName } });
            await tx.dispensing.update({ where: { id }, data: { controlledIdCaptured: true } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.controlled_id", entityType: "Dispensing", entityId: id } });
        });
        return this.get(user.orgId, id);
    }
    async signOff(user, id, counsellingNotes) {
        if (!isPharmacist(user))
            throw new errors_1.DomainError("PHARMACIST_REQUIRED", "Only a licensed pharmacist can sign off a dispensing", 403);
        const d = await this.get(user.orgId, id);
        if (d.status !== "RESERVED")
            throw new errors_1.DomainError("BAD_STATE", `Dispensing must be RESERVED to sign off (is ${d.status})`, 409);
        if (!d.safetyChecksRunAt)
            throw new errors_1.DomainError("SAFETY_CHECKS_NOT_RUN", "Safety checks have not run", 409);
        const kinds = new Set(d.safetyChecks.map((c) => c.kind));
        for (const k of ["INTERACTION", "ALLERGY", "DUPLICATE_THERAPY", "DOSE_QUANTITY", "PRESCRIBER", "CONTROLLED_LIMIT", "DOSE_RANGE", "PREGNANCY_LACTATION", "RENAL_HEPATIC"])
            if (!kinds.has(k))
                throw new errors_1.DomainError("SAFETY_CHECKS_INCOMPLETE", `Safety check ${k} is missing`, 409);
        if ((0, rx_safety_engine_1.hasUnresolvedBlock)(d.safetyChecks))
            throw new errors_1.DomainError("SAFETY_BLOCK_UNRESOLVED", "Resolve or override every BLOCK before sign-off", 409, { blocks: d.safetyChecks.filter((c) => c.outcome === "BLOCK").map((c) => ({ id: c.id, kind: c.kind, detail: c.detail })) });
        const controlled = d.lines.some((l) => l.drug && l.drug.controlledSchedule !== "NONE");
        if (controlled && !d.controlledIdCaptured)
            throw new errors_1.DomainError("CONTROLLED_ID_REQUIRED", "Capture the patient ID before signing off a controlled medicine", 409);
        const blocked = [];
        for (const l of d.lines) {
            try {
                (0, lot_guard_1.assertSellable)({ id: l.lotId, status: l.lot.status, expiryDate: l.lot.expiryDate });
            }
            catch (e) {
                blocked.push({ lotId: l.lotId, reason: e.message });
            }
        }
        if (blocked.length)
            throw new errors_1.DomainError("LOT_BLOCKED", "A reserved lot has been blocked since reservation; re-pick the lots", 409, { blocked, repick: true });
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            await tx.dispensing.update({ where: { id }, data: { status: "SIGNED_OFF", pharmacistId: user.userId, signedOffAt: now, counsellingNotes } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.signoff", entityType: "Dispensing", entityId: id, meta: { signedOffAt: now.toISOString() } } });
        });
        return this.get(user.orgId, id);
    }
    async repick(user, id) {
        await this.prisma.$transaction(async (tx) => {
            const d = await tx.dispensing.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
            if (!d)
                throw (0, errors_1.notFound)("Dispensing", id);
            if (!["RESERVED", "SIGNED_OFF"].includes(d.status))
                throw new errors_1.DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
            const byDrug = new Map();
            for (const l of d.lines) {
                await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
                const e = byDrug.get(l.drugId) ?? { qty: 0, lines: [] };
                e.qty += l.quantity;
                e.lines.push(l);
                byDrug.set(l.drugId, e);
            }
            await tx.dispensing.update({ where: { id }, data: { status: "VALIDATED", pharmacistId: null, signedOffAt: null } });
            await tx.dispensingLine.deleteMany({ where: { dispensingId: id } });
            for (const [drugId, e] of byDrug) {
                const lots = await tx.stockLot.findMany({ where: { orgId: user.orgId, branchId: d.branchId, drugId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } });
                const { picks, shortage } = (0, lot_guard_1.allocateFefo)(lots, e.qty);
                if (shortage > 0)
                    throw new errors_1.DomainError("INSUFFICIENT_STOCK", `Not enough sellable stock after re-pick (short by ${shortage})`, 409, { drugId });
                const template = e.lines[0];
                for (const p of picks) {
                    await this.ledger.post(tx, { orgId: user.orgId, branchId: d.branchId, lotId: p.lotId, type: "RESERVE", quantity: p.quantity, performedBy: user.userId, refType: "Dispensing", refId: id });
                    await tx.dispensingLine.create({ data: { dispensingId: id, drugId, lotId: p.lotId, quantity: p.quantity, prescriptionLineId: template.prescriptionLineId, unitPrice: template.unitPrice, vatRate: template.vatRate, substitutedFromDrugId: template.substitutedFromDrugId, substitutionConsent: template.substitutionConsent, substitutionDecidedBy: template.substitutionDecidedBy } });
                }
            }
            await tx.dispensing.update({ where: { id }, data: { status: "RESERVED" } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.repick", entityType: "Dispensing", entityId: id } });
        });
        return this.get(user.orgId, id);
    }
    async releaseReservation(tx, user, branchId, lotId, quantity, dispensingId) {
        await this.ledger.post(tx, { orgId: user.orgId, branchId, lotId, type: "RELEASE_RESERVATION", quantity, performedBy: user.userId, refType: "Dispensing", refId: dispensingId });
    }
    async cancel(user, id, reason) {
        await this.prisma.$transaction(async (tx) => {
            const d = await tx.dispensing.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
            if (!d)
                throw (0, errors_1.notFound)("Dispensing", id);
            if (!["VALIDATED", "RESERVED", "SIGNED_OFF", "DRAFT"].includes(d.status))
                throw new errors_1.DomainError("BAD_STATE", `Dispensing is ${d.status}`, 409);
            if (d.status !== "VALIDATED" && d.status !== "DRAFT")
                for (const l of d.lines)
                    await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
            await tx.dispensing.update({ where: { id }, data: { status: "CANCELLED", counsellingNotes: d.counsellingNotes } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.cancel", entityType: "Dispensing", entityId: id, meta: { reason } } });
        });
        return this.get(user.orgId, id);
    }
    async complete(user, id, input) {
        const d = await this.get(user.orgId, id);
        if (d.status === "DISPENSED") {
            const sale = d.saleId ? await this.sales.getSale(user.orgId, d.saleId) : null;
            return { dispensing: d, sale, replayed: true };
        }
        if (d.status !== "SIGNED_OFF" || !d.pharmacistId || !d.signedOffAt)
            throw new errors_1.DomainError("SIGNOFF_REQUIRED", "A pharmacist must sign off before dispensing", 409);
        const controlledLines = d.lines.filter((l) => l.drug && l.drug.controlledSchedule !== "NONE");
        if (controlledLines.length && !d.controlledIdCaptured)
            throw new errors_1.DomainError("CONTROLLED_ID_REQUIRED", "Controlled medicine: patient ID capture required", 409);
        const priced = d.lines.map((l) => ({ drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, unitPrice: l.unitPrice, discount: (0, money_1.D)(0), vatRate: l.vatRate, vatAmount: this.vat(l.unitPrice.mul(l.quantity), l.vatRate), negative: false }));
        const totals = this.sales.totals(priced);
        const prepaid = !!input.prepaid || !!d.kiorexOrderRef;
        let payments;
        let change = (0, money_1.D)(0);
        if (prepaid)
            payments = [{ method: "KIOREX_PREPAID", amount: totals.total, status: "CAPTURED" }];
        else {
            if (!input.payments?.length)
                throw new errors_1.DomainError("PAYMENT_REQUIRED", "Payment is required to complete a dispensing", 402);
            const cap = await this.sales.capturePayments(user, `${input.idempotencyKey}`, totals.total, input.payments, input.customerAccountId, false, d.patientId ?? undefined);
            payments = cap.payments;
            change = cap.change;
        }
        const shift = await this.prisma.shift.findFirst({ where: { orgId: user.orgId, branchId: d.branchId, status: "OPEN" } });
        const credit = (0, money_1.sum)(payments.filter((p) => p.method === "CUSTOMER_CREDIT").map((p) => p.amount));
        try {
            const out = await this.prisma.$transaction(async (tx) => {
                const fresh = await tx.dispensing.findUniqueOrThrow({ where: { id } });
                if (fresh.status !== "SIGNED_OFF")
                    throw new errors_1.DomainError("BAD_STATE", `Dispensing is ${fresh.status}`, 409);
                for (const l of d.lines) {
                    await this.releaseReservation(tx, user, d.branchId, l.lotId, l.quantity, id);
                    await this.ledger.post(tx, { orgId: user.orgId, branchId: d.branchId, lotId: l.lotId, type: "DISPENSE", quantity: l.quantity, performedBy: user.userId, refType: "Dispensing", refId: id });
                }
                if (credit.gt(0)) {
                    const [acct] = await tx.$queryRaw `SELECT balance, "creditLimit" FROM "CustomerAccount" WHERE id = ${input.customerAccountId} AND "orgId" = ${user.orgId} FOR UPDATE`;
                    if (!acct || (0, money_1.D)(acct.balance).plus(credit).gt(acct.creditLimit))
                        throw new errors_1.DomainError("CREDIT_LIMIT_EXCEEDED", "Customer credit limit would be exceeded", 402);
                }
                const sale = await this.sales.persist(tx, { user, branchId: d.branchId, shiftId: shift?.id ?? null, idempotencyKey: `rx:${id}`, lines: priced, payments, customerAccountId: input.customerAccountId, patientId: d.patientId ?? undefined, dispensingId: id, stockAlreadyPosted: true, channel: d.kiorexOrderRef ? "KIOREX_ORDER" : "POS" });
                if (credit.gt(0)) {
                    await tx.customerCreditEntry.create({ data: { orgId: user.orgId, accountId: input.customerAccountId, kind: "CHARGE", amount: credit, saleId: sale.id, createdBy: user.userId } });
                    await tx.customerAccount.update({ where: { id: input.customerAccountId }, data: { balance: { increment: credit } } });
                }
                if (controlledLines.length) {
                    const patient = await tx.patientRef.findUniqueOrThrow({ where: { id: d.patientId } });
                    if (!patient.nationalIdLast4)
                        throw new errors_1.DomainError("CONTROLLED_ID_REQUIRED", "Patient ID not on file", 409);
                    for (const l of controlledLines) {
                        await tx.controlledRegisterEntry.updateMany({ where: { refType: "Dispensing", refId: id, lotId: l.lotId, kind: "DISPENSE" }, data: { patientName: patient.displayName, patientIdLast4: patient.nationalIdLast4, prescriptionId: d.prescriptionId, prescriberLicenceNo: d.prescription?.prescriberLicenceNo } });
                        await tx.controlledSubstanceLogEntry.create({
                            data: { orgId: user.orgId, branchId: d.branchId, dispensingId: id, drugId: l.drugId, lotId: l.lotId, quantity: l.quantity, patientNationalIdLast4: patient.nationalIdLast4, patientNationalIdHash: patient.nationalIdHash, patientName: patient.displayName, prescriptionId: d.prescriptionId, prescriberLicenceNo: d.prescription?.prescriberLicenceNo, pharmacistId: d.pharmacistId },
                        });
                    }
                }
                if (d.prescriptionId) {
                    for (const l of d.lines)
                        if (l.prescriptionLineId)
                            await tx.prescriptionLine.update({ where: { id: l.prescriptionLineId }, data: { qtyDispensed: { increment: l.quantity } } });
                    const lines = await tx.prescriptionLine.findMany({ where: { prescriptionId: d.prescriptionId } });
                    const done = lines.every((x) => x.qtyDispensed >= x.quantity);
                    const rxNow = await tx.prescription.findUniqueOrThrow({ where: { id: d.prescriptionId }, select: { refillsAllowed: true, refillsUsed: true, refillIntervalDays: true } });
                    await tx.prescription.update({ where: { id: d.prescriptionId }, data: { status: done ? "DISPENSED" : "PARTIALLY_DISPENSED", ...(done && rxNow.refillsUsed < rxNow.refillsAllowed ? { nextRefillDueAt: new Date(Date.now() + (rxNow.refillIntervalDays ?? 30) * 86_400_000) } : {}) } });
                }
                const dispensedAt = new Date();
                await tx.dispensing.update({ where: { id }, data: { status: "DISPENSED", dispensedAt, saleId: sale.id } });
                await this.hooks.run(tx, { orgId: user.orgId, branchId: d.branchId, dispensingId: id, kiorexOrderRef: d.kiorexOrderRef, pharmacistId: d.pharmacistId, signedOffAt: d.signedOffAt, dispensedAt, saleId: sale.id, saleTotal: (0, money_1.money)(totals.total) });
                await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.complete", entityType: "Dispensing", entityId: id, meta: { saleId: sale.id, controlled: controlledLines.length, total: (0, money_1.money)(totals.total) } } });
                return sale.id;
            }, { timeout: 30_000 });
            return { dispensing: await this.get(user.orgId, id), sale: await this.sales.getSale(user.orgId, out), change: (0, money_1.money)(change), replayed: false };
        }
        catch (e) {
            for (const p of payments)
                if (p.reference && p.method !== "CASH")
                    await this.psp.refund({ orgId: user.orgId, reference: p.reference, amount: (0, money_1.money)(p.amount), idempotencyKey: `${input.idempotencyKey}:compensate` }).catch(() => undefined);
            throw e;
        }
    }
    vat(gross, rate) {
        return rate.isZero() ? (0, money_1.D)(0) : gross.mul(rate).div(rate.plus(1)).toDecimalPlaces(2);
    }
    async setCounselling(user, id, d) {
        if (!isPharmacist(user))
            throw new errors_1.DomainError("PHARMACIST_REQUIRED", "Only a licensed pharmacist records counselling", 403);
        const disp = await this.get(user.orgId, id);
        if (disp.status === "CANCELLED")
            throw new errors_1.DomainError("BAD_STATE", "Dispensing is cancelled", 409);
        await this.prisma.$transaction(async (tx) => {
            await tx.dispensing.update({ where: { id }, data: { counsellingNotes: d.notes, counsellingTopics: d.topics ?? [] } });
            if (disp.patientId)
                await tx.customerNote.create({ data: { orgId: user.orgId, patientId: disp.patientId, kind: "COUNSELLING", body: d.notes, refType: "Dispensing", refId: id, createdBy: user.userId } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "dispense.counselling", entityType: "Dispensing", entityId: id, meta: { topics: d.topics ?? [] } } });
        });
        return this.get(user.orgId, id);
    }
    async labelsHtml(orgId, id, lang) {
        const d = await this.get(orgId, id);
        if (!["SIGNED_OFF", "DISPENSED"].includes(d.status))
            throw new errors_1.DomainError("LABELS_NOT_READY", "Labels print after the pharmacist signs off", 409);
        const [tenant, branch, pharm, rx, rxLines, drugs] = await Promise.all([
            this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }), this.prisma.branch.findUnique({ where: { id: d.branchId } }), d.pharmacistId ? this.prisma.staffUser.findUnique({ where: { id: d.pharmacistId } }) : null,
            d.prescriptionId ? this.prisma.prescription.findUnique({ where: { id: d.prescriptionId }, include: { patient: { select: { displayName: true } } } }) : null,
            this.prisma.prescriptionLine.findMany({ where: { id: { in: d.lines.map((l) => l.prescriptionLineId).filter((x) => !!x) } } }),
            this.prisma.drug.findMany({ where: { id: { in: d.lines.map((l) => l.drugId) } } }),
        ]);
        const patient = rx?.patient?.displayName ?? (d.patientId ? (await this.prisma.patientRef.findUnique({ where: { id: d.patientId } }))?.displayName : null) ?? "—";
        const dm = new Map(drugs.map((x) => [x.id, x])), rl = new Map(rxLines.map((x) => [x.id, x]));
        return (0, rx_label_template_1.renderRxLabelsHtml)({
            pharmacy: tenant.name, branch: branch?.name ?? "", branchPhone: branch?.phone ?? null, licenceNo: branch?.licenceNo ?? null, rxNo: (d.prescriptionId ?? d.id).slice(-8).toUpperCase(), dispensedAt: d.dispensedAt ?? d.signedOffAt ?? new Date(),
            patient, refillsLeft: rx ? rx.refillsAllowed - rx.refillsUsed : null, prescriber: rx?.prescriberName ?? null, pharmacist: pharm?.displayName ?? null, pharmacistLicence: pharm?.pharmacistLicenceNo ?? null, counselling: d.counsellingNotes ?? null,
            lines: d.lines.map((l) => { const dr = dm.get(l.drugId); return { name: dr?.brandName ?? "", nameAr: dr?.brandNameAr ?? null, strength: dr?.strength ?? null, quantity: l.quantity, directions: l.prescriptionLineId ? rl.get(l.prescriptionLineId)?.directions ?? null : null, lotNumber: l.lot.lotNumber, expiryDate: l.lot.expiryDate, coldChain: !!dr?.coldChain, controlled: dr?.controlledSchedule !== "NONE", substituted: !!l.substitutedFromDrugId }; }),
        }, lang);
    }
    async controlledRegister(orgId, q) {
        const where = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.from || q.to ? { loggedAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) };
        const [items, total] = await Promise.all([this.prisma.controlledSubstanceLogEntry.findMany({ where, orderBy: { loggedAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.controlledSubstanceLogEntry.count({ where })]);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: items.map((i) => i.drugId) } }, select: { id: true, brandName: true, controlledSchedule: true } });
        const dm = new Map(drugs.map((x) => [x.id, x]));
        return { total, items: items.map((i) => ({ ...i, drug: dm.get(i.drugId) })) };
    }
};
exports.DispensingService = DispensingService;
exports.DispensingService = DispensingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(3, (0, common_1.Inject)(sales_service_1.SalesService)),
    __param(4, (0, common_1.Inject)(psp_adapter_1.PspAdapter)),
    __param(5, (0, common_1.Inject)(ports_1.KERNEL.marketPacks)),
    __param(6, (0, common_1.Inject)(dispense_hooks_1.DispenseHooks)),
    __param(7, (0, common_1.Inject)(knowledge_1.ClinicalKnowledge)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stock_ledger_service_1.StockLedger,
        price_service_1.PriceService,
        sales_service_1.SalesService,
        psp_adapter_1.PspAdapter, Object, dispense_hooks_1.DispenseHooks,
        knowledge_1.ClinicalKnowledge])
], DispensingService);
//# sourceMappingURL=dispensing.service.js.map