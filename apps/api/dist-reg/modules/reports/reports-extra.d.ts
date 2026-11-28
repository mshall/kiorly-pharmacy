import { PrismaService } from "../../prisma/prisma.service";
import { FinanceService } from "../finance/finance.service";
import { PurchasingService } from "../purchasing/purchasing.service";
import { InventoryAnalyticsService } from "../inventory/inventory-analytics.service";
import { RefillsService } from "../prescriptions/refills.service";
import type { Report, ReportParams } from "./reports.service";
export declare const REPORT_CATALOGUE: ReadonlyArray<{
    name: string;
    group: "SALES" | "PROFIT" | "STOCK" | "CLINICAL" | "PURCHASING" | "RECEIVABLES";
}>;
export declare class ExtraReports {
    private readonly prisma;
    private readonly finance;
    private readonly purchasing;
    private readonly analytics;
    private readonly refills;
    constructor(prisma: PrismaService, finance: FinanceService, purchasing: PurchasingService, analytics: InventoryAnalyticsService, refills: RefillsService);
    has(name: string): boolean;
    run(name: string, p: ReportParams): Promise<Report | null>;
}
