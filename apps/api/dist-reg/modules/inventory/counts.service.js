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
exports.CountsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const stock_ledger_service_1 = require("./stock-ledger.service");
let CountsService = class CountsService {
    prisma;
    ledger;
    constructor(prisma, ledger) {
        this.prisma = prisma;
        this.ledger = ledger;
    }
    async start(user, branchId, type, drugIds) {
        if (type === "CYCLE" && !drugIds?.length)
            throw new errors_1.DomainError("SCOPE_REQUIRED", "A cycle count needs at least one drug", 400);
        const open = await this.prisma.stockCount.findFirst({ where: { orgId: user.orgId, branchId, status: { in: ["OPEN", "PENDING_APPROVAL"] } } });
        if (open)
            throw new errors_1.DomainError("COUNT_IN_PROGRESS", "Another count is open for this branch", 409, { countId: open.id });
        const lots = await this.prisma.stockLot.findMany({ where: { orgId: user.orgId, branchId, ...(type === "CYCLE" ? { drugId: { in: drugIds } } : {}), OR: [{ qtyOnHand: { not: 0 } }, { status: { in: ["AVAILABLE", "QUARANTINE"] } }] } });
        return this.prisma.$transaction(async (tx) => {
            const c = await tx.stockCount.create({ data: { orgId: user.orgId, branchId, type, startedBy: user.userId, lines: { create: lots.map((l) => ({ lotId: l.id, qtyExpected: l.qtyOnHand })) } }, include: { lines: true } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "count.start", entityType: "StockCount", entityId: c.id, meta: { type, lots: lots.length } } });
            return c;
        });
    }
    async get(orgId, id) {
        const c = await this.prisma.stockCount.findFirst({ where: { id, orgId }, include: { lines: true } });
        if (!c)
            throw (0, errors_1.notFound)("Stock count", id);
        const lots = await this.prisma.stockLot.findMany({ where: { id: { in: c.lines.map((l) => l.lotId) } }, include: { drug: { select: { brandName: true, brandNameAr: true } } } });
        const lm = new Map(lots.map((l) => [l.id, l]));
        return { ...c, lines: c.lines.map((l) => ({ ...l, lotNumber: lm.get(l.lotId)?.lotNumber, brandName: lm.get(l.lotId)?.drug.brandName, brandNameAr: lm.get(l.lotId)?.drug.brandNameAr, expiryDate: lm.get(l.lotId)?.expiryDate, variance: l.qtyCounted == null ? null : l.qtyCounted - l.qtyExpected })) };
    }
    list(orgId, branchId) {
        return this.prisma.stockCount.findMany({ where: { orgId, ...(branchId ? { branchId } : {}) }, orderBy: { startedAt: "desc" }, take: 50 });
    }
    async record(user, id, lines) {
        const c = await this.prisma.stockCount.findFirst({ where: { id, orgId: user.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Stock count", id);
        if (c.status !== "OPEN")
            throw new errors_1.DomainError("COUNT_NOT_OPEN", "Count is not open", 409);
        for (const l of lines) {
            if (!Number.isInteger(l.qtyCounted) || l.qtyCounted < 0)
                throw new errors_1.DomainError("INVALID_QUANTITY", "Counted quantity must be >= 0", 400);
            const r = await this.prisma.stockCountLine.updateMany({ where: { stockCountId: id, lotId: l.lotId }, data: { qtyCounted: l.qtyCounted } });
            if (!r.count)
                throw new errors_1.DomainError("LOT_NOT_IN_COUNT", `Lot ${l.lotId} is not part of this count`, 409);
        }
        return this.get(user.orgId, id);
    }
    async submit(user, id) {
        const c = await this.get(user.orgId, id);
        if (c.status !== "OPEN")
            throw new errors_1.DomainError("COUNT_NOT_OPEN", "Count is not open", 409);
        const missing = c.lines.filter((l) => l.qtyCounted == null).length;
        if (missing && c.type === "FULL")
            throw new errors_1.DomainError("UNCOUNTED_LINES", `${missing} lot(s) have not been counted`, 409, { missing });
        await this.prisma.stockCount.update({ where: { id }, data: { status: "PENDING_APPROVAL" } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "count.submit", entityType: "StockCount", entityId: id } });
        return this.get(user.orgId, id);
    }
    async approve(user, id, witness) {
        const c = await this.get(user.orgId, id);
        if (c.status !== "PENDING_APPROVAL")
            throw new errors_1.DomainError("COUNT_NOT_PENDING", "Count is not awaiting approval", 409);
        if (c.startedBy === user.userId && user.role !== "OWNER")
            throw new errors_1.DomainError("SELF_APPROVAL", "Variance must be approved by someone other than the counter", 403);
        await this.prisma.$transaction(async (tx) => {
            let posted = 0;
            for (const l of c.lines) {
                if (l.qtyCounted == null)
                    continue;
                const variance = l.qtyCounted - l.qtyExpected;
                if (variance === 0)
                    continue;
                const lot = await this.ledger.lockLot(tx, l.lotId, user.orgId);
                await this.ledger.post(tx, { orgId: user.orgId, branchId: lot.branchId, lotId: l.lotId, type: "COUNT_VARIANCE", quantity: variance, performedBy: user.userId, approvedBy: user.userId, reason: `Count ${c.type} variance`, witness, refType: "StockCount", refId: id });
                posted++;
            }
            await tx.stockCount.update({ where: { id }, data: { status: "APPROVED", approvedBy: user.userId, closedAt: new Date() } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "count.approve", entityType: "StockCount", entityId: id, meta: { variancesPosted: posted } } });
        });
        return this.get(user.orgId, id);
    }
    async reject(user, id) {
        const c = await this.prisma.stockCount.findFirst({ where: { id, orgId: user.orgId } });
        if (!c)
            throw (0, errors_1.notFound)("Stock count", id);
        if (c.status !== "PENDING_APPROVAL" && c.status !== "OPEN")
            throw new errors_1.DomainError("COUNT_NOT_PENDING", "Count cannot be rejected", 409);
        await this.prisma.stockCount.update({ where: { id }, data: { status: "REJECTED", closedAt: new Date(), approvedBy: user.userId } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "count.reject", entityType: "StockCount", entityId: id } });
        return this.get(user.orgId, id);
    }
};
exports.CountsService = CountsService;
exports.CountsService = CountsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(stock_ledger_service_1.StockLedger)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, stock_ledger_service_1.StockLedger])
], CountsService);
//# sourceMappingURL=counts.service.js.map