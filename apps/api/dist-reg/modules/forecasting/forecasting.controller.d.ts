import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { ForecastingService } from "./forecasting.service";
export declare class ForecastingController {
    private readonly svc;
    private readonly prisma;
    constructor(svc: ForecastingService, prisma: PrismaService);
    demand(u: AuthUser, q: {
        branchId?: string;
        horizonDays?: string;
    }): Promise<import("./forecasting.service").DemandRow[]>;
    expiryRisk(u: AuthUser, branchId?: string): Promise<{
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
