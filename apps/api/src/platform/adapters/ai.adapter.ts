import { Inject, Injectable } from "@nestjs/common";
import { AiGateway } from "./ai.gateway";
import { adapterMode } from "./adapter-mode";

export interface DemandSeries { drugId: string; label: string; daily: number[] }
export interface DemandForecast { drugId: string; avgDailyDemand: number; horizonDays: number; expectedDemand: number; method: string; explanation: string }

/**
 * Forecasting AI adapter (pharmacy.forecasting, KX-11). `AI_MODE=mock` (default): deterministic moving-average "model".
 * `AI_MODE=real`: the numbers stay the deterministic moving average (auditable, never an LLM guess); the AI gateway (AI_API_URL / AI_API_KEY / AI_MODEL)
 * only writes the labelled explanation, and an AI outage falls back to the mock explanation. No PHI crosses this boundary: only drug ids/labels and aggregate daily unit counts
 * (and the gateway redacts anyway).
 */
export abstract class ForecastAi {
  abstract forecast(series: DemandSeries, horizonDays: number, orgId?: string): Promise<DemandForecast>;
}

function movingAverage(series: DemandSeries, horizonDays: number): DemandForecast {
  const w = series.daily.slice(-14);
  const avg = w.length ? w.reduce((a, b) => a + b, 0) / w.length : 0;
  const a = Math.round(avg * 100) / 100;
  return { drugId: series.drugId, avgDailyDemand: a, horizonDays, expectedDemand: Math.ceil(a * horizonDays), method: "mock-moving-average-14d", explanation: `AI (mock): ${series.label} averaged ${a}/day over the last ${w.length} days.` };
}

@Injectable()
export class MockForecastAi extends ForecastAi {
  async forecast(series: DemandSeries, horizonDays: number): Promise<DemandForecast> { return movingAverage(series, horizonDays); }
}
@Injectable()
export class RealForecastAi extends ForecastAi {
  constructor(@Inject(AiGateway) private readonly gateway: AiGateway) { super(); }
  async forecast(series: DemandSeries, horizonDays: number, orgId = "system"): Promise<DemandForecast> {
    const base = movingAverage(series, horizonDays);
    if (base.avgDailyDemand <= 0) return base; // nothing to explain: no tokens spent
    try {
      const r = await this.gateway.assist({ orgId, task: "forecast.explain", system: "You are a pharmacy inventory analyst. Reply with ONE short sentence.", prompt: `Explain this demand forecast to a pharmacy manager. Drug: ${series.label}. Daily units sold (oldest first): ${series.daily.slice(-14).join(", ")}. Forecast: ${base.avgDailyDemand}/day, ${base.expectedDemand} units over ${horizonDays} days.`, maxOutputTokens: 80 });
      return { ...base, method: "moving-average-14d+llm-explanation", explanation: r.text };
    } catch {
      return base;
    }
  }
}
export const aiProvider = { provide: ForecastAi, useFactory: (gw: AiGateway) => (adapterMode("AI") === "real" ? new RealForecastAi(gw) : new MockForecastAi()), inject: [AiGateway] };
