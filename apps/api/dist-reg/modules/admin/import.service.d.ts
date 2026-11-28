import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { CatalogueService } from "../catalogue/catalogue.service";
import { ReceivingService } from "../inventory/receiving.service";
import { CustomerRegistryService } from "../customers/customer-registry.service";
import { SuppliersService } from "../suppliers/suppliers.service";
export declare const IMPORT_KINDS: readonly ["drugs", "stock", "customers", "suppliers"];
export type ImportKind = (typeof IMPORT_KINDS)[number];
export interface RowResult {
    row: number;
    status: "OK" | "SKIPPED" | "ERROR";
    message?: string;
}
export interface ImportReport {
    kind: ImportKind;
    dryRun: boolean;
    total: number;
    ok: number;
    skipped: number;
    errors: number;
    created?: number;
    updated?: number;
    rows: RowResult[];
}
export declare const importTemplate: (k: ImportKind) => string;
export declare function parseDate(v: string): string | null;
export declare class ImportService {
    private readonly prisma;
    private readonly catalogue;
    private readonly receiving;
    private readonly customers;
    private readonly suppliers;
    constructor(prisma: PrismaService, catalogue: CatalogueService, receiving: ReceivingService, customers: CustomerRegistryService, suppliers: SuppliersService);
    run(u: AuthUser, kind: ImportKind, csv: string, opts: {
        dryRun: boolean;
        branchId?: string;
    }): Promise<ImportReport>;
}
