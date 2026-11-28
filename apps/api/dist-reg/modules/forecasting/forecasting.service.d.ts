import { PrismaService } from "../../prisma/prisma.service";
import { ForecastAi } from "../../platform/adapters/ai.adapter";
export interface DemandRow {
    drugId: string;
    brandName: string;
    avgDailyDemand: number;
    expectedDemand: number;
    method: string;
    explanation: string;
    daily: number[];
}
export declare class ForecastingService {
    private readonly prisma;
    private readonly ai;
    constructor(prisma: PrismaService, ai: ForecastAi);
    dailySeries(orgId: string, branchId: string, days?: number, drugIds?: string[]): Promise<Map<string, number[]>>;
    forecast(orgId: string, branchId: string, horizonDays: number, drugIds?: string[]): Promise<DemandRow[]>;
    expiryRisk(orgId: string, branchId: string): Promise<{
        lotId: string;
        drugId: string;
        brandName: string;
        lotNumber: string;
        expiryDate: Date;
        qtyOnHand: number;
        expectedSellThrough: number;
        atRiskQty: number;
        daysLeft: number;
    }[]>;
}
