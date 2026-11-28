import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { CommissionRateService } from "./commission-rate.service";
import { type StatementView } from "./commission-statement";
export declare class CommissionStatementService {
    private readonly prisma;
    private readonly rates;
    private readonly log;
    constructor(prisma: PrismaService, rates: CommissionRateService);
    private need;
    private target;
    private fetchKiorex;
    private ledgerFeesMinor;
    statement(user: AuthUser, period?: string): Promise<StatementView & {
        period: StatementView["period"] & {
            key: string;
        };
        feesSource: "KIOREX" | "PRODUCT_LEDGER" | null;
    }>;
    printHtml(user: AuthUser, period: string, o?: {
        lang?: string;
        print?: boolean;
    }): Promise<string>;
    exportCsv(user: AuthUser, period: string): Promise<{
        filename: string;
        body: string;
    }>;
}
