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
exports.ForecastingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const ai_adapter_1 = require("../../platform/adapters/ai.adapter");
let ForecastingService = class ForecastingService {
    prisma;
    ai;
    constructor(prisma, ai) {
        this.prisma = prisma;
        this.ai = ai;
    }
    async dailySeries(orgId, branchId, days = 28, drugIds) {
        const rows = await this.prisma.$queryRaw `
      SELECT l."drugId", date_trunc('day', m."occurredAt")::date AS day, SUM(-m."qtyDelta") AS qty
      FROM "StockMovement" m JOIN "StockLot" l ON l.id = m."lotId"
      WHERE m."orgId" = ${orgId} AND m."branchId" = ${branchId} AND m.type IN ('SALE','DISPENSE') AND m."occurredAt" >= now() - (${days}::int * interval '1 day')
      GROUP BY l."drugId", day`;
        const out = new Map();
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);
        for (const r of rows) {
            if (drugIds && !drugIds.includes(r.drugId))
                continue;
            const arr = out.get(r.drugId) ?? new Array(days).fill(0);
            const idx = days - 1 - Math.round((today.getTime() - new Date(r.day).getTime()) / 86_400_000);
            if (idx >= 0 && idx < days)
                arr[idx] = (arr[idx] ?? 0) + Number(r.qty);
            out.set(r.drugId, arr);
        }
        return out;
    }
    async forecast(orgId, branchId, horizonDays, drugIds) {
        const series = await this.dailySeries(orgId, branchId, 28, drugIds);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...series.keys()] } }, select: { id: true, brandName: true } });
        const nm = new Map(drugs.map((d) => [d.id, d.brandName]));
        const out = [];
        for (const [drugId, daily] of series) {
            const f = await this.ai.forecast({ drugId, label: nm.get(drugId) ?? drugId, daily }, horizonDays, orgId);
            out.push({ drugId, brandName: nm.get(drugId) ?? drugId, avgDailyDemand: f.avgDailyDemand, expectedDemand: f.expectedDemand, method: f.method, explanation: f.explanation, daily });
        }
        return out.sort((a, b) => b.avgDailyDemand - a.avgDailyDemand);
    }
    async expiryRisk(orgId, branchId) {
        const lots = await this.prisma.stockLot.findMany({ where: { orgId, branchId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 }, expiryDate: { gte: new Date(), lte: new Date(Date.now() + 180 * 86_400_000) } }, include: { drug: { select: { brandName: true } } }, orderBy: { expiryDate: "asc" } });
        const series = await this.dailySeries(orgId, branchId, 28);
        const risk = [];
        for (const l of lots) {
            const daily = series.get(l.drugId) ?? [];
            const avg = daily.length ? daily.slice(-14).reduce((a, b) => a + b, 0) / Math.min(14, daily.length) : 0;
            const daysLeft = Math.max(Math.ceil((l.expiryDate.getTime() - Date.now()) / 86_400_000), 0);
            const sellable = Math.floor(avg * daysLeft);
            const atRisk = Math.max(l.qtyOnHand - sellable, 0);
            if (atRisk > 0)
                risk.push({ lotId: l.id, drugId: l.drugId, brandName: l.drug.brandName, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, expectedSellThrough: sellable, atRiskQty: atRisk, daysLeft });
        }
        return risk.sort((a, b) => b.atRiskQty - a.atRiskQty);
    }
};
exports.ForecastingService = ForecastingService;
exports.ForecastingService = ForecastingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(ai_adapter_1.ForecastAi)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, ai_adapter_1.ForecastAi])
], ForecastingService);
//# sourceMappingURL=forecasting.service.js.map