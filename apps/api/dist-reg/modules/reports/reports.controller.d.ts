import { StreamableFile } from "@nestjs/common";
import type { Response } from "express";
import type { AuthUser } from "../../auth/auth-user";
import { ReportsService, type Report } from "./reports.service";
import { PermissionsService } from "../../auth/permissions.service";
export declare class ReportsController {
    private readonly svc;
    private readonly perms;
    constructor(svc: ReportsService, perms: PermissionsService);
    list(): {
        reports: string[];
        catalogue: readonly {
            name: string;
            group: "SALES" | "PROFIT" | "STOCK" | "CLINICAL" | "PURCHASING" | "RECEIVABLES";
        }[];
    };
    run(u: AuthUser, name: string, q: {
        branchId?: string;
        from?: string;
        to?: string;
        format?: string;
    }, res: Response): Promise<string | StreamableFile | Report>;
}
