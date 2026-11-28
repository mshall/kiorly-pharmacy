import { AiGateway } from "./ai.gateway";
export interface DemandSeries {
    drugId: string;
    label: string;
    daily: number[];
}
export interface DemandForecast {
    drugId: string;
    avgDailyDemand: number;
    horizonDays: number;
    expectedDemand: number;
    method: string;
    explanation: string;
}
export declare abstract class ForecastAi {
    abstract forecast(series: DemandSeries, horizonDays: number, orgId?: string): Promise<DemandForecast>;
}
export declare class MockForecastAi extends ForecastAi {
    forecast(series: DemandSeries, horizonDays: number): Promise<DemandForecast>;
}
export declare class RealForecastAi extends ForecastAi {
    private readonly gateway;
    constructor(gateway: AiGateway);
    forecast(series: DemandSeries, horizonDays: number, orgId?: string): Promise<DemandForecast>;
}
export declare const aiProvider: {
    provide: typeof ForecastAi;
    useFactory: (gw: AiGateway) => MockForecastAi | RealForecastAi;
    inject: (typeof AiGateway)[];
};
