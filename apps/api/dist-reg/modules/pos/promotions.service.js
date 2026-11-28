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
exports.PromotionsService = exports.PROMO_KINDS = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../../generated/prisma/client");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
exports.PROMO_KINDS = ["PERCENT_OFF", "AMOUNT_OFF", "BUY_X_GET_Y", "BUNDLE_PRICE"];
function validateParams(d) {
    const p = d.params;
    const bad = (m) => new errors_1.DomainError("INVALID_PROMOTION", m, 400);
    if (d.kind === "PERCENT_OFF" && !(typeof p.percent === "number" && p.percent > 0 && p.percent <= 100))
        throw bad("percent must be between 0 and 100");
    if (d.kind === "AMOUNT_OFF" && !((0, money_1.D)(p.amount ?? 0).gt(0)))
        throw bad("amount must be positive");
    if (d.kind === "BUY_X_GET_Y" && !((p.buy ?? 0) >= 1 && (p.get ?? 0) >= 1))
        throw bad("buy and get must be at least 1");
    if (d.kind === "BUY_X_GET_Y" && !(d.drugIds?.length))
        throw bad("choose the products for a buy-X-get-Y deal");
    if (d.kind === "BUNDLE_PRICE" && !(p.items?.length && p.price != null && (0, money_1.D)(p.price).gt(0) && p.items.every((i) => i.drugId && i.qty >= 1)))
        throw bad("a bundle needs items (drug + quantity) and a price");
}
let PromotionsService = class PromotionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    view(p) { return { ...p, minSubtotal: p.minSubtotal ? (0, money_1.money)(p.minSubtotal) : null }; }
    async list(orgId, q) {
        const rows = await this.prisma.promotion.findMany({ where: { orgId, ...(q.active !== undefined ? { active: q.active } : {}), ...(q.q ? { OR: [{ name: { contains: q.q, mode: "insensitive" } }, { couponCode: { contains: q.q, mode: "insensitive" } }] } : {}) }, orderBy: [{ active: "desc" }, { createdAt: "desc" }], take: 200 });
        const sums = await this.prisma.promotionRedemption.groupBy({ by: ["promotionId"], where: { orgId, promotionId: { in: rows.map((r) => r.id) } }, _sum: { discountAmount: true } });
        const sm = new Map(sums.map((s) => [s.promotionId, s._sum.discountAmount]));
        const now = Date.now();
        return rows.map((r) => ({ ...this.view(r), totalDiscount: (0, money_1.money)(sm.get(r.id) ?? 0), state: !r.active ? "OFF" : r.startsAt.getTime() > now ? "SCHEDULED" : r.endsAt && r.endsAt.getTime() < now ? "ENDED" : r.maxUses != null && r.usedCount >= r.maxUses ? "EXHAUSTED" : "LIVE" }));
    }
    async create(u, d) {
        validateParams(d);
        if (d.endsAt && d.startsAt && new Date(d.endsAt) <= new Date(d.startsAt))
            throw new errors_1.DomainError("INVALID_PROMOTION", "End must be after start", 400);
        if (d.drugIds?.length) {
            const n = await this.prisma.drug.count({ where: { id: { in: d.drugIds }, OR: [{ orgId: null }, { orgId: u.orgId }] } });
            if (n !== d.drugIds.length)
                throw (0, errors_1.notFound)("Drug");
        }
        try {
            const p = await this.prisma.promotion.create({ data: { orgId: u.orgId, branchId: d.branchId, name: d.name, nameAr: d.nameAr, kind: d.kind, couponCode: d.couponCode?.trim() || null, drugIds: d.drugIds ?? [], params: d.params, startsAt: d.startsAt ? new Date(d.startsAt) : new Date(), endsAt: d.endsAt ? new Date(d.endsAt) : null, minSubtotal: d.minSubtotal, maxUses: d.maxUses, priority: d.priority ?? 0, stackable: d.stackable ?? false, active: d.active ?? true, createdBy: u.userId } });
            await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "promotion.create", entityType: "Promotion", entityId: p.id, meta: { kind: d.kind, coupon: !!d.couponCode } } });
            return this.view(p);
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002")
                throw (0, errors_1.conflict)("COUPON_EXISTS", "A promotion with this coupon code already exists");
            throw e;
        }
    }
    async update(u, id, d) {
        const cur = await this.prisma.promotion.findFirst({ where: { id, orgId: u.orgId } });
        if (!cur)
            throw (0, errors_1.notFound)("Promotion", id);
        if (d.params || d.kind)
            validateParams({ kind: d.kind ?? cur.kind, params: d.params ?? cur.params, drugIds: d.drugIds ?? cur.drugIds });
        const p = await this.prisma.promotion.update({ where: { id }, data: { ...(d.name !== undefined ? { name: d.name } : {}), ...(d.nameAr !== undefined ? { nameAr: d.nameAr } : {}), ...(d.kind ? { kind: d.kind } : {}), ...(d.params ? { params: d.params } : {}), ...(d.drugIds ? { drugIds: d.drugIds } : {}), ...(d.endsAt !== undefined ? { endsAt: d.endsAt ? new Date(d.endsAt) : null } : {}), ...(d.minSubtotal !== undefined ? { minSubtotal: d.minSubtotal } : {}), ...(d.maxUses !== undefined ? { maxUses: d.maxUses } : {}), ...(d.priority !== undefined ? { priority: d.priority } : {}), ...(d.stackable !== undefined ? { stackable: d.stackable } : {}), ...(d.active !== undefined ? { active: d.active } : {}) } });
        await this.prisma.auditLog.create({ data: { orgId: u.orgId, actorId: u.userId, action: "promotion.update", entityType: "Promotion", entityId: id, meta: { fields: Object.keys(d) } } });
        return this.view(p);
    }
};
exports.PromotionsService = PromotionsService;
exports.PromotionsService = PromotionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PromotionsService);
//# sourceMappingURL=promotions.service.js.map