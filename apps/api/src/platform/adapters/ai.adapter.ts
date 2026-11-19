import { Injectable } from "@nestjs/common";
import { adapterMode, ProviderNotWiredError } from "./adapter-mode";

export interface DemandSeries { drugId: string; label: string; daily: number[] }
export interface DemandForecast { drugId: string; avgDailyDemand: number; horizonDays: number; expectedDemand: number; method: string; explanation: string }

/**
 * Forecasting AI adapter (pharmacy.forecasting, KX-11). `AI_MODE=mock` (default): deterministic moving-average "model".
 * No PHI crosses this boundary: only drug ids/labels and aggregate daily unit counts.
 */
export abstract class ForecastAi {
  abstract forecast(series: DemandSeries, horizonDays: number): Promise<DemandForecast>;
}

@Injectable()
export class MockForecastAi extends ForecastAi {
  async forecast(series: DemandSeries, horizonDays: number): Promise<DemandForecast> {
    const w = series.daily.slice(-14);
    const avg = w.length ? w.reduce((a, b) => a + b, 0) / w.length : 0;
    const a = Math.round(avg * 100) / 100;
    return { drugId: series.drugId, avgDailyDemand: a, horizonDays, expectedDemand: Math.ceil(a * horizonDays), method: "mock-moving-average-14d", explanation: `AI (mock): ${series.label} averaged ${a}/day over the last ${w.length} days.` };
  }
}
@Injectable()
export class RealForecastAi extends ForecastAi {
  async forecast(): Promise<DemandForecast> { throw new ProviderNotWiredError("ai"); }
}
export const aiProvider = { provide: ForecastAi, useFactory: () => (adapterMode("AI") === "real" ? new RealForecastAi() : new MockForecastAi()) };
