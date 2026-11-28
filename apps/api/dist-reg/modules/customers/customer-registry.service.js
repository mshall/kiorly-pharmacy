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
exports.CustomerRegistryService = exports.normPhone = void 0;
exports.nextCustomerNo = nextCustomerNo;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const tenant_mode_service_1 = require("../../tenancy/tenant-mode.service");
const consent_service_1 = require("../../platform/adapters/consent.service");
const loyalty_1 = require("../../common/loyalty");
async function nextCustomerNo(tx, orgId) {
    const [{ n }] = await tx.$queryRaw `SELECT COALESCE(MAX(CAST(SUBSTRING("customerNo" FROM 5) AS INTEGER)),0)::int + 1 AS n FROM "PatientRef" WHERE "orgId" = ${orgId} AND "customerNo" ~ '^CUS-[0-9]+$'`;
    return `CUS-${String(n).padStart(6, "0")}`;
}
const norm = (xs) => [...new Set((xs ?? []).map((x) => x.toLowerCase().trim()).filter(Boolean))];
const normPhone = (p) => (p ? p.replace(/[^\d+]/g, "") : null);
exports.normPhone = normPhone;
const nidHash = (orgId, nid) => (0, node_crypto_1.createHmac)("sha256", process.env.NATIONAL_ID_PEPPER ?? "dev-only-pepper").update(`${orgId}:${nid}`).digest("hex");
let CustomerRegistryService = class CustomerRegistryService {
    prisma;
    modes;
    consents;
    constructor(prisma, modes, consents) {
        this.prisma = prisma;
        this.modes = modes;
        this.consents = consents;
    }
    audit(tx, u, action, id, meta) {
        return tx.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action, entityType: "Customer", entityId: id, meta } });
    }
    view(p) { const { nationalIdHash: _h, ...rest } = p; return rest; }
    async create(u, d, opts = {}) {
        const phone = (0, exports.normPhone)(d.phone);
        if (phone && !opts.force) {
            const dup = await this.prisma.patientRef.findMany({ where: { orgId: u.orgId, active: true, phone }, select: { id: true, displayName: true, customerNo: true }, take: 5 });
            if (dup.length)
                throw (0, errors_1.conflict)("DUPLICATE_CUSTOMER", "A customer with this phone number already exists", { candidates: dup });
        }
        for (let attempt = 0; attempt < 5; attempt++) {
            try {
                return await this.prisma.$transaction(async (tx) => {
                    const p = await tx.patientRef.create({ data: this.data(u, d, { customerNo: await nextCustomerNo(tx, u.orgId), orgId: u.orgId }) });
                    await this.audit(tx, u, "customer.create", p.id, { customerNo: p.customerNo });
                    return this.view(p);
                });
            }
            catch (e) {
                if (!(e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002"))
                    throw e;
            }
        }
        throw new errors_1.DomainError("CUSTOMER_NO_CONFLICT", "Could not allocate a customer number, retry", 409);
    }
    data(u, d, extra = {}) {
        const consentChange = d.consentDataProcessing !== undefined || d.consentMarketing !== undefined;
        return {
            ...(d.displayName !== undefined ? { displayName: d.displayName.trim() } : {}),
            ...(d.phone !== undefined ? { phone: (0, exports.normPhone)(d.phone) } : {}), ...(d.email !== undefined ? { email: d.email?.toLowerCase().trim() || null } : {}),
            ...(d.gender !== undefined ? { gender: d.gender } : {}), ...(d.dateOfBirth !== undefined ? { dateOfBirth: d.dateOfBirth ? new Date(d.dateOfBirth) : null, birthYear: d.dateOfBirth ? new Date(d.dateOfBirth).getUTCFullYear() : null } : {}),
            ...(d.birthYear !== undefined && d.dateOfBirth === undefined ? { birthYear: d.birthYear } : {}), ...(d.address !== undefined ? { address: d.address } : {}),
            ...(d.allergies ? { allergies: norm(d.allergies) } : {}), ...(d.chronicConditions ? { chronicConditions: norm(d.chronicConditions) } : {}), ...(d.medicalNotes !== undefined ? { medicalNotes: d.medicalNotes } : {}),
            ...(d.pregnant !== undefined ? { pregnant: d.pregnant } : {}), ...(d.lactating !== undefined ? { lactating: d.lactating } : {}),
            ...(d.renalImpairment !== undefined ? { renalImpairment: d.renalImpairment } : {}), ...(d.hepaticImpairment !== undefined ? { hepaticImpairment: d.hepaticImpairment } : {}),
            ...(d.weightKg !== undefined ? { weightKg: d.weightKg } : {}), ...(d.active !== undefined ? { active: d.active } : {}),
            ...(d.nationalId ? { nationalIdHash: nidHash(u.orgId, d.nationalId), nationalIdLast4: d.nationalId.slice(-4) } : {}),
            ...(d.consentDataProcessing !== undefined ? { consentDataProcessing: d.consentDataProcessing } : {}), ...(d.consentMarketing !== undefined ? { consentMarketing: d.consentMarketing } : {}),
            ...(consentChange ? { consentRecordedAt: new Date(), consentRecordedBy: u.userId } : {}),
            ...extra,
        };
    }
    async update(u, id, d) {
        await this.mustGet(u.orgId, id);
        return this.prisma.$transaction(async (tx) => {
            const p = await tx.patientRef.update({ where: { id }, data: this.data(u, d) });
            await this.audit(tx, u, "customer.update", id, { fields: Object.keys(d).filter((k) => k !== "nationalId") });
            return this.view(p);
        });
    }
    async mustGet(orgId, id) {
        const p = await this.prisma.patientRef.findFirst({ where: { id, orgId } });
        if (!p)
            throw (0, errors_1.notFound)("Customer", id);
        return p;
    }
    async search(orgId, q) {
        const s = q.q?.trim();
        const digits = s ? s.replace(/[^\d+]/g, "") : "";
        const where = {
            orgId, mergedIntoId: null, ...(q.includeInactive ? {} : { active: true }),
            ...(q.withCredit ? { customerAccount: { isNot: null } } : {}), ...(q.withAllergies ? { NOT: { allergies: { isEmpty: true } } } : {}),
            ...(s ? { OR: [{ displayName: { contains: s, mode: "insensitive" } }, { customerNo: { contains: s, mode: "insensitive" } }, { email: { contains: s, mode: "insensitive" } }, ...(digits.length >= 3 ? [{ phone: { contains: digits } }] : []), ...(/^\d{4}$/.test(s) ? [{ nationalIdLast4: s }] : [])] } : {}),
        };
        const [rows, total] = await Promise.all([
            this.prisma.patientRef.findMany({ where, orderBy: [{ displayName: "asc" }], skip: (q.page - 1) * q.pageSize, take: q.pageSize, include: { customerAccount: { select: { id: true, balance: true, creditLimit: true } } } }),
            this.prisma.patientRef.count({ where }),
        ]);
        return { total, page: q.page, pageSize: q.pageSize, items: rows.map((r) => ({ ...this.view(r), customerAccount: r.customerAccount ? { id: r.customerAccount.id, balance: (0, money_1.money)(r.customerAccount.balance), creditLimit: (0, money_1.money)(r.customerAccount.creditLimit) } : null })) };
    }
    async profile(orgId, id) {
        const p = await this.prisma.patientRef.findFirst({ where: { id, orgId }, include: { customerAccount: true } });
        if (!p)
            throw (0, errors_1.notFound)("Customer", id);
        const [family, rxCount, saleAgg, lastVisit] = await Promise.all([
            this.family(orgId, id),
            this.prisma.prescription.count({ where: { orgId, patientId: id } }),
            this.prisma.sale.aggregate({ where: { orgId, status: { not: "VOIDED" }, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] }, _sum: { total: true }, _count: true }),
            this.prisma.sale.findFirst({ where: { orgId, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] }, orderBy: { soldAt: "desc" }, select: { soldAt: true } }),
        ]);
        const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(orgId));
        const { customerAccount, ...rest } = this.view(p);
        return {
            ...rest, customerAccount: customerAccount ? { ...customerAccount, balance: (0, money_1.money)(customerAccount.balance), creditLimit: (0, money_1.money)(customerAccount.creditLimit), available: (0, money_1.money)((0, money_1.D)(customerAccount.creditLimit).minus(customerAccount.balance)) } : null,
            family, stats: { prescriptions: rxCount, purchases: saleAgg._count, totalSpend: (0, money_1.money)(saleAgg._sum.total ?? 0), lastVisit: lastVisit?.soldAt ?? null },
            loyalty: { points: p.loyaltyPoints, tier: p.loyaltyTier, value: (0, money_1.money)((0, loyalty_1.pointsValue)(p.loyaltyPoints, cfg)), redeemValue: (0, money_1.money)(cfg.redeemValue), enabled: cfg.enabled },
        };
    }
    async history(orgId, id, take = 100) {
        await this.mustGet(orgId, id);
        const lines = await this.prisma.dispensingLine.findMany({ where: { dispensing: { orgId, patientId: id, status: "DISPENSED" } }, include: { dispensing: { select: { id: true, dispensedAt: true, prescriptionId: true } } }, orderBy: { dispensing: { dispensedAt: "desc" } }, take });
        const sl = await this.prisma.saleLine.findMany({ where: { sale: { orgId, status: { not: "VOIDED" }, dispensingId: null, OR: [{ patientId: id }, { customerAccount: { patientId: id } }] } }, include: { sale: { select: { id: true, soldAt: true, receiptNo: true } } }, orderBy: { sale: { soldAt: "desc" } }, take });
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...lines.map((l) => l.drugId), ...sl.map((l) => l.drugId)] } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, dosageForm: true, activeIngredient: true, rxOnly: true, controlledSchedule: true } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        const items = [
            ...lines.map((l) => ({ kind: "RX", at: l.dispensing.dispensedAt, drug: dm.get(l.drugId) ?? null, quantity: l.quantity, prescriptionId: l.dispensing.prescriptionId, dispensingId: l.dispensing.id, saleId: null, receiptNo: null })),
            ...sl.map((l) => ({ kind: "OTC", at: l.sale.soldAt, drug: dm.get(l.drugId) ?? null, quantity: l.quantity, prescriptionId: null, dispensingId: null, saleId: l.sale.id, receiptNo: l.sale.receiptNo })),
        ].sort((a, b) => (b.at?.getTime() ?? 0) - (a.at?.getTime() ?? 0)).slice(0, take);
        return { items };
    }
    async notes(orgId, id) { await this.mustGet(orgId, id); return this.prisma.customerNote.findMany({ where: { orgId, patientId: id }, orderBy: { createdAt: "desc" }, take: 200 }); }
    async addNote(u, id, d) {
        await this.mustGet(u.orgId, id);
        const n = await this.prisma.customerNote.create({ data: { orgId: u.orgId, patientId: id, kind: d.kind ?? "NOTE", body: d.body, createdBy: u.userId } });
        await this.audit(this.prisma, u, "customer.note", id, { kind: n.kind });
        return n;
    }
    async family(orgId, id) {
        const links = await this.prisma.familyLink.findMany({ where: { orgId, OR: [{ patientId: id }, { relatedPatientId: id }] } });
        const ids = links.map((l) => (l.patientId === id ? l.relatedPatientId : l.patientId));
        const people = await this.prisma.patientRef.findMany({ where: { id: { in: ids } }, select: { id: true, displayName: true, customerNo: true, phone: true, birthYear: true, allergies: true } });
        const pm = new Map(people.map((p) => [p.id, p]));
        return links.map((l) => { const other = l.patientId === id ? l.relatedPatientId : l.patientId; return { id: l.id, relation: l.patientId === id ? l.relation : `${l.relation}:inverse`, person: pm.get(other) ?? null }; });
    }
    async addFamily(u, id, d) {
        if (id === d.relatedPatientId)
            throw new errors_1.DomainError("SELF_LINK", "A customer cannot be linked to themselves", 400);
        await this.mustGet(u.orgId, id);
        await this.mustGet(u.orgId, d.relatedPatientId);
        const exists = await this.prisma.familyLink.findFirst({ where: { orgId: u.orgId, OR: [{ patientId: id, relatedPatientId: d.relatedPatientId }, { patientId: d.relatedPatientId, relatedPatientId: id }] } });
        if (exists)
            throw (0, errors_1.conflict)("ALREADY_LINKED", "These customers are already linked");
        const l = await this.prisma.familyLink.create({ data: { orgId: u.orgId, patientId: id, relatedPatientId: d.relatedPatientId, relation: d.relation, createdBy: u.userId } });
        await this.audit(this.prisma, u, "customer.family_link", id, { related: d.relatedPatientId, relation: d.relation });
        return l;
    }
    async removeFamily(u, id, linkId) {
        const l = await this.prisma.familyLink.findFirst({ where: { id: linkId, orgId: u.orgId, OR: [{ patientId: id }, { relatedPatientId: id }] } });
        if (!l)
            throw (0, errors_1.notFound)("Family link", linkId);
        await this.prisma.familyLink.delete({ where: { id: linkId } });
        await this.audit(this.prisma, u, "customer.family_unlink", id, { linkId });
        return { ok: true };
    }
    async setConsent(u, id, d) {
        await this.mustGet(u.orgId, id);
        const p = await this.prisma.patientRef.update({ where: { id }, data: { consentDataProcessing: d.dataProcessing, consentMarketing: d.marketing, consentRecordedAt: new Date(), consentRecordedBy: u.userId } });
        await this.audit(this.prisma, u, "customer.consent", id, { dataProcessing: d.dataProcessing, marketing: d.marketing });
        await this.consents.syncCustomerConsent(u.orgId, id, p.externalId ?? id, { DATA_PROCESSING: d.dataProcessing, MARKETING: d.marketing }, u.userId);
        return this.view(p);
    }
    async openCreditAccount(u, id, creditLimit) {
        await this.mustGet(u.orgId, id);
        if ((0, money_1.D)(creditLimit).isNeg())
            throw new errors_1.DomainError("INVALID_LIMIT", "Credit limit must be >= 0", 400);
        const ex = await this.prisma.customerAccount.findUnique({ where: { patientId: id } });
        const a = ex ? await this.prisma.customerAccount.update({ where: { id: ex.id }, data: { creditLimit } }) : await this.prisma.customerAccount.create({ data: { orgId: u.orgId, patientId: id, creditLimit } });
        await this.audit(this.prisma, u, "customer.credit_account", id, { creditLimit: (0, money_1.money)(creditLimit) });
        return { ...a, balance: (0, money_1.money)(a.balance), creditLimit: (0, money_1.money)(a.creditLimit) };
    }
    async loyalty(orgId, id) {
        const p = await this.mustGet(orgId, id);
        const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(orgId));
        const entries = await this.prisma.loyaltyEntry.findMany({ where: { orgId, patientId: id }, orderBy: { createdAt: "desc" }, take: 100 });
        const next = cfg.tiers.find((t) => t.minSpend.gt(p.lifetimeSpend));
        return { points: p.loyaltyPoints, tier: p.loyaltyTier, lifetimeSpend: (0, money_1.money)(p.lifetimeSpend), value: (0, money_1.money)((0, loyalty_1.pointsValue)(p.loyaltyPoints, cfg)), nextTier: next ? { name: next.name, remaining: (0, money_1.money)(next.minSpend.minus(p.lifetimeSpend)) } : null, entries };
    }
    async adjustLoyalty(u, id, d) {
        await this.mustGet(u.orgId, id);
        if (!Number.isInteger(d.points) || d.points === 0)
            throw new errors_1.DomainError("INVALID_POINTS", "Points must be a non-zero whole number", 400);
        const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(u.orgId));
        return this.prisma.$transaction(async (tx) => {
            const cur = await tx.patientRef.findUniqueOrThrow({ where: { id }, select: { loyaltyPoints: true } });
            if (cur.loyaltyPoints + d.points < 0)
                throw new errors_1.DomainError("INSUFFICIENT_POINTS", "Balance cannot go below zero", 409);
            const balance = await (0, loyalty_1.adjustPoints)(tx, { orgId: u.orgId, patientId: id, points: d.points, note: d.note, by: u.userId }, cfg);
            await this.audit(tx, u, "customer.loyalty_adjust", id, { points: d.points });
            return { balance };
        });
    }
    async duplicates(orgId) {
        const rows = await this.prisma.patientRef.findMany({ where: { orgId, active: true, mergedIntoId: null }, select: { id: true, displayName: true, phone: true, birthYear: true, customerNo: true, createdAt: true }, take: 5000 });
        const groups = new Map();
        const add = (k, r) => groups.set(k, [...(groups.get(k) ?? []), r]);
        for (const r of rows) {
            if (r.phone)
                add(`phone:${r.phone}`, r);
            add(`name:${r.displayName.toLowerCase().replace(/\s+/g, " ").trim()}|${r.birthYear ?? ""}`, r);
        }
        const seen = new Set();
        const out = [];
        for (const [k, g] of groups) {
            if (g.length < 2)
                continue;
            const sig = g.map((x) => x.id).sort().join(",");
            if (seen.has(sig))
                continue;
            seen.add(sig);
            out.push({ reason: k.startsWith("phone:") ? "SAME_PHONE" : "SAME_NAME_YOB", customers: g });
        }
        return { groups: out };
    }
    async merge(u, id, sourceId) {
        if (id === sourceId)
            throw new errors_1.DomainError("SAME_CUSTOMER", "Choose two different customers", 400);
        const cfg = (0, loyalty_1.loyaltyConfig)(await this.modes.settings(u.orgId));
        return this.prisma.$transaction(async (tx) => {
            const [t, s] = await Promise.all([tx.patientRef.findFirst({ where: { id, orgId: u.orgId } }), tx.patientRef.findFirst({ where: { id: sourceId, orgId: u.orgId } })]);
            if (!t)
                throw (0, errors_1.notFound)("Customer", id);
            if (!s)
                throw (0, errors_1.notFound)("Customer", sourceId);
            if (t.mergedIntoId || s.mergedIntoId)
                throw new errors_1.DomainError("ALREADY_MERGED", "A merged customer cannot be merged again", 409);
            const w = { patientId: sourceId };
            const to = { patientId: id };
            const counts = {
                prescriptions: (await tx.prescription.updateMany({ where: w, data: to })).count,
                dispensings: (await tx.dispensing.updateMany({ where: w, data: to })).count,
                sales: (await tx.sale.updateMany({ where: w, data: to })).count,
                notes: (await tx.customerNote.updateMany({ where: w, data: to })).count,
                loyalty: (await tx.loyaltyEntry.updateMany({ where: w, data: to })).count,
            };
            await tx.familyLink.updateMany({ where: { patientId: sourceId }, data: { patientId: id } });
            await tx.familyLink.updateMany({ where: { relatedPatientId: sourceId }, data: { relatedPatientId: id } });
            await tx.familyLink.deleteMany({ where: { patientId: id, relatedPatientId: id } });
            const links = await tx.familyLink.findMany({ where: { orgId: u.orgId, OR: [{ patientId: id }, { relatedPatientId: id }] }, orderBy: { createdAt: "asc" } });
            const keep = new Set();
            for (const l of links) {
                const k = [l.patientId, l.relatedPatientId].sort().join("|");
                if (keep.has(k))
                    await tx.familyLink.delete({ where: { id: l.id } });
                else
                    keep.add(k);
            }
            const [sa, ta] = await Promise.all([tx.customerAccount.findUnique({ where: { patientId: sourceId } }), tx.customerAccount.findUnique({ where: { patientId: id } })]);
            if (sa && !ta)
                await tx.customerAccount.update({ where: { id: sa.id }, data: { patientId: id } });
            else if (sa && ta) {
                await tx.sale.updateMany({ where: { customerAccountId: sa.id }, data: { customerAccountId: ta.id } });
                await tx.customerCreditEntry.updateMany({ where: { accountId: sa.id }, data: { accountId: ta.id } });
                await tx.customerAccount.update({ where: { id: ta.id }, data: { balance: { increment: sa.balance }, creditLimit: (0, money_1.D)(ta.creditLimit).gt(sa.creditLimit) ? ta.creditLimit : sa.creditLimit } });
                await tx.customerAccount.delete({ where: { id: sa.id } });
            }
            const points = s.loyaltyPoints;
            const spend = (0, money_1.D)(t.lifetimeSpend).plus(s.lifetimeSpend);
            await tx.patientRef.update({
                where: { id },
                data: {
                    phone: t.phone ?? s.phone, email: t.email ?? s.email, gender: t.gender ?? s.gender, dateOfBirth: t.dateOfBirth ?? s.dateOfBirth, birthYear: t.birthYear ?? s.birthYear, address: t.address ?? s.address,
                    nationalIdHash: t.nationalIdHash ?? s.nationalIdHash, nationalIdLast4: t.nationalIdLast4 ?? s.nationalIdLast4, externalId: t.externalId ?? s.externalId, weightKg: t.weightKg ?? s.weightKg,
                    allergies: norm([...t.allergies, ...s.allergies]), chronicConditions: norm([...t.chronicConditions, ...s.chronicConditions]), medicalNotes: [t.medicalNotes, s.medicalNotes].filter(Boolean).join("\n") || null,
                    pregnant: t.pregnant || s.pregnant, lactating: t.lactating || s.lactating, renalImpairment: t.renalImpairment || s.renalImpairment, hepaticImpairment: t.hepaticImpairment || s.hepaticImpairment,
                    consentMarketing: t.consentMarketing && s.consentMarketing, consentDataProcessing: t.consentDataProcessing || s.consentDataProcessing,
                },
            });
            await tx.patientRef.update({ where: { id: sourceId }, data: { active: false, mergedIntoId: id, loyaltyPoints: 0, phone: null, externalId: null } });
            if (points)
                await (0, loyalty_1.adjustPoints)(tx, { orgId: u.orgId, patientId: id, points, note: `Merged from ${s.customerNo ?? s.id}`, by: u.userId, kind: "MERGE" }, cfg);
            await tx.patientRef.update({ where: { id }, data: { lifetimeSpend: spend } });
            await this.audit(tx, u, "customer.merge", id, { sourceId, ...counts, points });
            return { mergedInto: id, source: sourceId, moved: counts };
        }, { timeout: 30_000 }).then(async (r) => ({ ...r, customer: await this.profile(u.orgId, id) }));
    }
};
exports.CustomerRegistryService = CustomerRegistryService;
exports.CustomerRegistryService = CustomerRegistryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(tenant_mode_service_1.TenantModeService)),
    __param(2, (0, common_1.Inject)(consent_service_1.ConsentService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, tenant_mode_service_1.TenantModeService, consent_service_1.ConsentService])
], CustomerRegistryService);
//# sourceMappingURL=customer-registry.service.js.map