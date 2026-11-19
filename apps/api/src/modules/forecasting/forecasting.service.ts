import { Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ForecastAi } from "../../platform/adapters/ai.adapter";

export interface DemandRow { drugId: string; brandName: string; avgDailyDemand: number; expectedDemand: number; method: string; explanation: string; daily: number[] }

/** pharmacy.forecasting: moving-average demand (28-day history, 14-day window via the AI adapter, mock by default). No PHI: unit counts only. */
@Injectable()
export class ForecastingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(ForecastAi) private readonly ai: ForecastAi) {}

  /** Daily outbound units (SALE + DISPENSE) per drug for the last `days` days; oldest first. */
  async dailySeries(orgId: string, branchId: string, days = 28, drugIds?: string[]): Promise<Map<string, number[]>> {
    const rows = await this.prisma.$queryRaw<Array<{ drugId: string; day: Date; qty: bigint }>>`
      SELECT l."drugId", date_trunc('day', m."occurredAt")::date AS day, SUM(-m."qtyDelta") AS qty
      FROM "StockMovement" m JOIN "StockLot" l ON l.id = m."lotId"
      WHERE m."orgId" = ${orgId} AND m."branchId" = ${branchId} AND m.type IN ('SALE','DISPENSE') AND m."occurredAt" >= now() - (${days}::int * interval '1 day')
      GROUP BY l."drugId", day`;
    const out = new Map<string, number[]>();
    const today = new Date(); today.setUTCHours(0, 0, 0, 0);
    for (const r of rows) {
      if (drugIds && !drugIds.includes(r.drugId)) continue;
      const arr = out.get(r.drugId) ?? new Array<number>(days).fill(0);
      const idx = days - 1 - Math.round((today.getTime() - new Date(r.day).getTime()) / 86_400_000);
      if (idx >= 0 && idx < days) arr[idx] = (arr[idx] ?? 0) + Number(r.qty);
      out.set(r.drugId, arr);
    }
    return out;
  }

  async forecast(orgId: string, branchId: string, horizonDays: number, drugIds?: string[]): Promise<DemandRow[]> {
    const series = await this.dailySeries(orgId, branchId, 28, drugIds);
    const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...series.keys()] } }, select: { id: true, brandName: true } });
    const nm = new Map(drugs.map((d) => [d.id, d.brandName]));
    const out: DemandRow[] = [];
    for (const [drugId, daily] of series) {
      const f = await this.ai.forecast({ drugId, label: nm.get(drugId) ?? drugId, daily }, horizonDays);
      out.push({ drugId, brandName: nm.get(drugId) ?? drugId, avgDailyDemand: f.avgDailyDemand, expectedDemand: f.expectedDemand, method: f.method, explanation: f.explanation, daily });
    }
    return out.sort((a, b) => b.avgDailyDemand - a.avgDailyDemand);
  }

  /** Expiry forecasting: lots whose on-hand exceeds expected demand until their expiry (write-off risk). */
  async expiryRisk(orgId: string, branchId: string) {
    const lots = await this.prisma.stockLot.findMany({ where: { orgId, branchId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 }, expiryDate: { gte: new Date(), lte: new Date(Date.now() + 180 * 86_400_000) } }, include: { drug: { select: { brandName: true } } }, orderBy: { expiryDate: "asc" } });
    const series = await this.dailySeries(orgId, branchId, 28);
    const risk = [];
    for (const l of lots) {
      const daily = series.get(l.drugId) ?? [];
      const avg = daily.length ? daily.slice(-14).reduce((a, b) => a + b, 0) / Math.min(14, daily.length) : 0;
      const daysLeft = Math.max(Math.ceil((l.expiryDate.getTime() - Date.now()) / 86_400_000), 0);
      const sellable = Math.floor(avg * daysLeft);
      const atRisk = Math.max(l.qtyOnHand - sellable, 0);
      if (atRisk > 0) risk.push({ lotId: l.id, drugId: l.drugId, brandName: l.drug.brandName, lotNumber: l.lotNumber, expiryDate: l.expiryDate, qtyOnHand: l.qtyOnHand, expectedSellThrough: sellable, atRiskQty: atRisk, daysLeft });
    }
    return risk.sort((a, b) => b.atRiskQty - a.atRiskQty);
  }
}
