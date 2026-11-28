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
exports.PriceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const money_1 = require("../../common/money");
const errors_1 = require("../../common/errors");
let PriceService = class PriceService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async priceAt(orgId, branchId, drugId, at = new Date(), db = this.prisma) {
        return (await this.pricesAt(orgId, branchId ?? "", [drugId], at, db)).get(drugId) ?? null;
    }
    async pricesAt(orgId, branchId, drugIds, at = new Date(), db = this.prisma) {
        const out = new Map();
        if (!drugIds.length)
            return out;
        const rows = await db.priceBookEntry.findMany({
            where: { orgId, drugId: { in: drugIds }, effectiveFrom: { lte: at }, OR: [{ effectiveTo: null }, { effectiveTo: { gt: at } }], AND: [{ OR: [{ branchId }, { branchId: null }] }] },
            orderBy: { effectiveFrom: "asc" },
        });
        const central = new Map(), branch = new Map();
        for (const r of rows)
            (r.branchId ? branch : central).set(r.drugId, r.price);
        for (const id of drugIds) {
            const p = branch.get(id) ?? central.get(id);
            if (p)
                out.set(id, p);
        }
        return out;
    }
    async bulkUpdate(orgId, actorId, effectiveFrom, items) {
        if (!items.length)
            return { updated: 0 };
        return this.prisma.$transaction(async (tx) => {
            let updated = 0;
            for (const it of items) {
                if ((0, money_1.D)(it.price).lt(0))
                    throw new errors_1.DomainError("INVALID_PRICE", "Price must be >= 0", 400);
                const drug = await tx.drug.findFirst({ where: { id: it.drugId, OR: [{ orgId: null }, { orgId }] }, select: { id: true } });
                if (!drug)
                    throw new errors_1.DomainError("DRUG_NOT_FOUND", `Drug ${it.drugId} not found`, 404);
                const branchId = it.branchId ?? null;
                const later = await tx.priceBookEntry.findFirst({ where: { orgId, drugId: it.drugId, branchId, effectiveFrom: { gte: effectiveFrom } } });
                if (later)
                    throw new errors_1.DomainError("PRICE_CONFLICT", `A price effective ${later.effectiveFrom.toISOString()} already exists; choose a later effective date`, 409, { drugId: it.drugId });
                const open = await tx.priceBookEntry.findFirst({ where: { orgId, drugId: it.drugId, branchId, effectiveTo: null } });
                if (open && open.price.equals(it.price))
                    continue;
                if (open)
                    await tx.priceBookEntry.update({ where: { id: open.id }, data: { effectiveTo: effectiveFrom } });
                await tx.priceBookEntry.create({ data: { orgId, drugId: it.drugId, branchId, price: it.price, effectiveFrom, createdBy: actorId } });
                updated++;
            }
            await tx.auditLog.create({ data: { orgId, actorId, action: "price.bulk_update", entityType: "PriceBookEntry", entityId: "bulk", meta: { count: updated, effectiveFrom: effectiveFrom.toISOString() } } });
            return { updated };
        });
    }
    history(orgId, drugId) {
        return this.prisma.priceBookEntry.findMany({ where: { orgId, drugId }, orderBy: [{ effectiveFrom: "desc" }] });
    }
};
exports.PriceService = PriceService;
exports.PriceService = PriceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PriceService);
//# sourceMappingURL=price.service.js.map