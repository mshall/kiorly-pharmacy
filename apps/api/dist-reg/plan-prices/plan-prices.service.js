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
var PlanPricesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPricesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const errors_1 = require("../common/errors");
const plan_price_logic_1 = require("./plan-price-logic");
const row = (r) => ({
    id: r.id, edition: r.edition, marketCode: r.marketCode, interval: r.interval, currency: r.currency, amount: r.amount.toFixed(2),
    validFrom: r.validFrom.toISOString(), validTo: r.validTo?.toISOString() ?? null, priceVersion: r.priceVersion, proposalId: r.proposalId, proposedBy: r.proposedBy, publishedBy: r.publishedBy, createdAt: r.createdAt.toISOString(),
});
const seg = (r) => ({ id: r.id, priceVersion: r.priceVersion, validFrom: r.validFrom, validTo: r.validTo, amount: r.amount.toFixed(2), currency: r.currency });
let PlanPricesService = PlanPricesService_1 = class PlanPricesService {
    prisma;
    log = new common_1.Logger(PlanPricesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async overview() {
        const [rows, tenants] = await Promise.all([
            this.prisma.planPrice.findMany({ orderBy: [{ edition: "asc" }, { marketCode: "asc" }, { interval: "asc" }, { priceVersion: "desc" }] }),
            this.prisma.tenant.groupBy({ by: ["edition", "marketCode"], _count: { _all: true } }),
        ]);
        return {
            editions: [...plan_price_logic_1.PRICE_EDITIONS],
            prices: rows.map(row),
            organisations: tenants.filter((t) => plan_price_logic_1.PRICE_EDITIONS.includes(t.edition)).map((t) => ({ edition: t.edition, marketCode: t.marketCode, count: t._count._all })),
        };
    }
    async request(body, now = new Date()) {
        const q = (0, plan_price_logic_1.parsePriceRequest)(body, now);
        const edition = q.edition;
        const segWhere = { edition, marketCode: q.marketCode, interval: q.interval };
        if (q.preview) {
            const rows = (await this.prisma.planPrice.findMany({ where: segWhere })).map(seg);
            const { priceVersion, supersedes } = (0, plan_price_logic_1.planNextVersion)(rows, q.validFrom);
            const count = await this.prisma.tenant.count({ where: { edition, marketCode: q.marketCode } });
            const current = supersedes[0] ?? null;
            return { preview: true, priceVersion, supersedes: supersedes.length > 0, validFrom: q.validFrom.toISOString(), impact: { organisationsAffected: count, from: current ? { amount: current.amount, currency: current.currency, priceVersion: current.priceVersion } : null, to: { amount: q.amount, currency: q.currency } } };
        }
        const approval = q.approval;
        const existing = await this.prisma.planPrice.findUnique({ where: { proposalId: approval.proposalId } });
        if (existing)
            return { published: true, idempotent: true, price: row(existing) };
        try {
            const created = await this.prisma.$transaction(async (tx) => {
                await tx.$executeRaw `SELECT pg_advisory_xact_lock(hashtext(${`planprice:${q.edition}:${q.marketCode}:${q.interval}`}))`;
                const rows = (await tx.planPrice.findMany({ where: segWhere })).map(seg);
                const { priceVersion, supersedes } = (0, plan_price_logic_1.planNextVersion)(rows, q.validFrom);
                for (const r of supersedes)
                    await tx.planPrice.update({ where: { id: r.id }, data: { validTo: q.validFrom } });
                return tx.planPrice.create({ data: { edition, marketCode: q.marketCode, interval: q.interval, currency: q.currency, amount: new client_1.Prisma.Decimal(q.amount), validFrom: q.validFrom, priceVersion, proposalId: approval.proposalId, proposedBy: approval.proposedBy, publishedBy: q.actorId } });
            });
            this.log.log(`plan price published: ${q.edition} ${q.marketCode} ${q.interval} v${created.priceVersion} (proposal ${approval.proposalId})`);
            return { published: true, idempotent: false, price: row(created) };
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                const again = await this.prisma.planPrice.findUnique({ where: { proposalId: approval.proposalId } });
                if (again)
                    return { published: true, idempotent: true, price: row(again) };
                throw new errors_1.DomainError("PRICE_VERSION_CONFLICT", "Another price version was published at the same time: preview again", 409);
            }
            throw e;
        }
    }
};
exports.PlanPricesService = PlanPricesService;
exports.PlanPricesService = PlanPricesService = PlanPricesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlanPricesService);
//# sourceMappingURL=plan-prices.service.js.map