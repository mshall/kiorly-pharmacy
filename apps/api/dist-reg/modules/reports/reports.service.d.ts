import { PrismaService } from "../../prisma/prisma.service";
import { ExtraReports, REPORT_CATALOGUE } from "./reports-extra";
export interface ReportColumn {
    key: string;
    label: string;
}
export interface Report {
    name: string;
    title: string;
    note?: string;
    columns: ReportColumn[];
    rows: Array<Record<string, string | number | null>>;
}
export interface ReportParams {
    orgId: string;
    branchId?: string;
    from: Date;
    to: Date;
}
export declare const REPORT_NAMES: string[];
export { REPORT_CATALOGUE };
export declare class ReportsService {
    private readonly prisma;
    private readonly extra;
    constructor(prisma: PrismaService, extra: ExtraReports);
    run(name: string, p: ReportParams): Promise<Report>;
    private salesDaily;
    private topSellers;
    private stockValuation;
    private expiry;
    private controlled;
    private supplierBalances;
    private vatLines;
    private dispensingLog;
}
export declare function toCsv(r: Report): string;
