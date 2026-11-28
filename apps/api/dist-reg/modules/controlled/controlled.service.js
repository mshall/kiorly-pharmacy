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
exports.ControlledService = void 0;
const common_1 = require("@nestjs/common");
const push_service_1 = require("../mobile/push.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const stock_ledger_service_1 = require("../inventory/stock-ledger.service");
let ControlledService = class ControlledService {
    prisma;
    ledger;
    push;
    constructor(prisma, ledger, push) {
        this.prisma = prisma;
        this.ledger = ledger;
        this.push = push;
    }
    async register(orgId, q) {
        const where = { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.drugId ? { drugId: q.drugId } : {}), ...(q.from || q.to ? { occurredAt: { ...(q.from ? { gte: q.from } : {}), ...(q.to ? { lte: q.to } : {}) } } : {}) };
        const [rows, total] = await Promise.all([this.prisma.controlledRegisterEntry.findMany({ where, orderBy: [{ occurredAt: "desc" }, { id: "desc" }], skip: q.skip, take: q.take }), this.prisma.controlledRegisterEntry.count({ where })]);
        const [drugs, lots, staff] = await Promise.all([
            this.prisma.drug.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.drugId))] } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, controlledSchedule: true } }),
            this.prisma.stockLot.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.lotId))] } }, select: { id: true, lotNumber: true } }),
            this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.performedBy))] } }, select: { id: true, displayName: true } }),
        ]);
        const dm = new Map(drugs.map((d) => [d.id, d])), lm = new Map(lots.map((l) => [l.id, l.lotNumber])), sm = new Map(staff.map((s) => [s.id, s.displayName]));
        return { total, items: rows.map((r) => ({ ...r, drug: dm.get(r.drugId) ?? null, lotNumber: lm.get(r.lotId) ?? null, performedByName: sm.get(r.performedBy) ?? null })) };
    }
    async balances(orgId, branchId) {
        const lots = await this.prisma.stockLot.groupBy({ by: ["branchId", "drugId"], where: { orgId, ...(branchId ? { branchId } : {}), drug: { controlledSchedule: { not: "NONE" } } }, _sum: { qtyOnHand: true } });
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: lots.map((l) => l.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true, controlledSchedule: true } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        const out = [];
        for (const l of lots) {
            const last = await this.prisma.controlledRegisterEntry.findFirst({ where: { orgId, branchId: l.branchId, drugId: l.drugId }, orderBy: [{ occurredAt: "desc" }, { id: "desc" }] });
            const onHand = l._sum.qtyOnHand ?? 0, register = last?.balanceAfter ?? 0;
            out.push({ branchId: l.branchId, drug: dm.get(l.drugId) ?? null, drugId: l.drugId, onHand, registerBalance: register, inSync: onHand === register, lastMovementAt: last?.occurredAt ?? null });
        }
        return out.sort((a, b) => (a.drug?.brandName ?? "").localeCompare(b.drug?.brandName ?? ""));
    }
    async audit(user, d) {
        const drug = await this.prisma.drug.findFirst({ where: { id: d.drugId, active: true, OR: [{ orgId: null }, { orgId: user.orgId }] } });
        if (!drug)
            throw (0, errors_1.notFound)("Drug", d.drugId);
        if (drug.controlledSchedule === "NONE")
            throw new errors_1.DomainError("NOT_CONTROLLED", "This drug is not a controlled medicine", 409);
        const last = await this.prisma.controlledRegisterEntry.findFirst({ where: { orgId: user.orgId, branchId: d.branchId, drugId: d.drugId }, orderBy: [{ occurredAt: "desc" }, { id: "desc" }] });
        const expected = last?.balanceAfter ?? 0;
        const diff = d.countedQty - expected;
        const r = await this.prisma.$transaction(async (tx) => {
            const disc = diff === 0 ? null : await tx.controlledDiscrepancy.create({ data: { orgId: user.orgId, branchId: d.branchId, drugId: d.drugId, expectedQty: expected, countedQty: d.countedQty, difference: diff, notes: d.notes, reportedBy: user.userId, witnessId: d.witness.id } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: diff === 0 ? "controlled.audit_ok" : "controlled.discrepancy", entityType: "Drug", entityId: d.drugId, meta: { branchId: d.branchId, expected, counted: d.countedQty, difference: diff, witnessId: d.witness.id } } });
            return disc;
        });
        if (r)
            void this.push?.sendTemplate(user.orgId, "controlled.discrepancy", { drug: drug.brandName, expected, counted: d.countedQty }, { roles: ["OWNER", "BRANCH_MANAGER", "PHARMACIST"], branchId: d.branchId }, { discrepancyId: r.id, alertId: `CONTROLLED_DRUG_DISCREPANCY:${r.id}` });
        return { match: diff === 0, expected, counted: d.countedQty, difference: diff, discrepancy: r };
    }
    async discrepancies(orgId, q) {
        const rows = await this.prisma.controlledDiscrepancy.findMany({ where: { orgId, ...(q.status ? { status: q.status } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) }, orderBy: { createdAt: "desc" }, take: 200 });
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: rows.map((r) => r.drugId) } }, select: { id: true, brandName: true, brandNameAr: true, strength: true } });
        const dm = new Map(drugs.map((x) => [x.id, x]));
        return rows.map((r) => ({ ...r, drug: dm.get(r.drugId) ?? null }));
    }
    async resolve(user, id, d) {
        const disc = await this.prisma.controlledDiscrepancy.findFirst({ where: { id, orgId: user.orgId } });
        if (!disc)
            throw (0, errors_1.notFound)("Discrepancy", id);
        if (disc.status !== "OPEN")
            throw new errors_1.DomainError("ALREADY_RESOLVED", "This discrepancy is already resolved", 409);
        return this.prisma.$transaction(async (tx) => {
            if (d.adjustLotId) {
                const lot = await this.ledger.lockLot(tx, d.adjustLotId, user.orgId);
                if (lot.branchId !== disc.branchId || lot.drugId !== disc.drugId)
                    throw new errors_1.DomainError("LOT_MISMATCH", "The lot must belong to the same branch and drug", 409);
                await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId: lot.id, type: "COUNT_VARIANCE", quantity: disc.difference, performedBy: user.userId, approvedBy: user.userId, reason: `Controlled discrepancy ${id}: ${d.resolution}`, refType: "ControlledDiscrepancy", refId: id, witness: d.witness });
            }
            const r = await tx.controlledDiscrepancy.update({ where: { id }, data: { status: "RESOLVED", resolution: d.resolution, resolvedBy: user.userId, resolvedAt: new Date() } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "controlled.discrepancy_resolved", entityType: "ControlledDiscrepancy", entityId: id, meta: { adjusted: !!d.adjustLotId } } });
            return r;
        });
    }
};
exports.ControlledService = ControlledService;
exports.ControlledService = ControlledService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __param(2, (0, common_1.Optional)()),
    __param(2, (0, common_1.Inject)(push_service_1.PushService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, stock_ledger_service_1.StockLedger, push_service_1.PushService])
], ControlledService);
//# sourceMappingURL=controlled.service.js.map