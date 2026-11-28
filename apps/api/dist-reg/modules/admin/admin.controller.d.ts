import type { Response } from "express";
import type { AuthUser } from "../../auth/auth-user";
import { PrismaService } from "../../prisma/prisma.service";
import { RolesService } from "./roles.service";
import { ImportService } from "./import.service";
import { ExportService } from "./export.service";
import { AlertsService } from "./alerts.service";
import { TenantModeService } from "../../tenancy/tenant-mode.service";
declare class RolePermDto {
    permission: string;
    granted: boolean;
}
declare class ImportDto {
    csv: string;
    dryRun?: boolean;
    branchId?: string;
}
export declare class AdminController {
    private readonly roles;
    private readonly imports;
    private readonly exports;
    private readonly modes;
    private readonly prisma;
    constructor(roles: RolesService, imports: ImportService, exports: ExportService, modes: TenantModeService, prisma: PrismaService);
    matrix(u: AuthUser): Promise<{
        roles: ("OWNER" | "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS" | "ASSISTANT")[];
        permissions: readonly ["catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.count.approve", "inventory.transfer", "inventory.quarantine", "inventory.negative_stock", "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete", "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "supplier.write", "po.write", "orders.read", "orders.respond", "claims.manage", "forecast.read", "reports.read", "audit.read", "settings.read", "settings.write", "staff.manage", "customer.read", "customer.write", "customer.merge", "loyalty.manage", "prescriber.manage", "rx.refill", "rx.transfer", "safety.kb.manage", "controlled.manage", "promo.manage", "pos.discount_override", "pos.cash_drawer", "expense.read", "expense.write", "finance.read", "roles.manage", "data.import", "data.export", "notifications.read"];
        locked: readonly ("catalogue.read" | "catalogue.write" | "price.write" | "inventory.read" | "inventory.receive" | "inventory.adjust" | "inventory.count" | "inventory.count.approve" | "inventory.transfer" | "inventory.quarantine" | "inventory.negative_stock" | "recall.manage" | "rx.read" | "rx.intake" | "rx.validate" | "dispense.create" | "dispense.signoff" | "dispense.complete" | "controlled.read" | "pos.sell" | "pos.shift" | "pos.refund_approve" | "customer.credit" | "supplier.read" | "supplier.write" | "po.write" | "orders.read" | "orders.respond" | "claims.manage" | "forecast.read" | "reports.read" | "audit.read" | "settings.read" | "settings.write" | "staff.manage" | "customer.read" | "customer.write" | "customer.merge" | "loyalty.manage" | "prescriber.manage" | "rx.refill" | "rx.transfer" | "safety.kb.manage" | "controlled.manage" | "promo.manage" | "pos.discount_override" | "pos.cash_drawer" | "expense.read" | "expense.write" | "finance.read" | "roles.manage" | "data.import" | "data.export" | "notifications.read")[];
        matrix: Record<string, Record<string, {
            granted: boolean;
            default: boolean;
            overridden: boolean;
            locked: boolean;
        }>>;
    }>;
    setPerm(u: AuthUser, role: string, d: RolePermDto): Promise<{
        role: "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS" | "ASSISTANT";
        permission: string;
        granted: boolean;
    }>;
    reset(u: AuthUser, role: string): Promise<{
        role: "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS" | "ASSISTANT";
        removed: number;
    }>;
    private role;
    mode(u: AuthUser): Promise<{
        mode: import("../../tenancy/tenant-mode.service").OperatingMode;
        integrationClients: number;
        external: {
            kiorex: boolean;
            clinicalKb: string;
            messaging: string;
            payments: string;
        };
        standaloneNote: string;
    }>;
    template(k: string, res: Response): string;
    import(u: AuthUser, k: string, d: ImportDto): Promise<import("./import.service").ImportReport>;
    bundle(u: AuthUser, res: Response): Promise<{
        app: string;
        format: number;
        exportedAt: string;
        tenant: {
            id: string;
            name: string;
            market: string;
            edition: import("../../generated/prisma/enums").Edition;
            settings: import("@prisma/client/runtime/client").JsonValue;
        };
        counts: {
            [k: string]: number;
        };
        data: Record<string, {
            headers: string[];
            rows: unknown[][];
        }>;
    }>;
    entities(): {
        entities: readonly ["customers", "drugs", "stock", "sales", "prescriptions", "suppliers", "expenses", "audit", "controlled-register"];
    };
    csv(u: AuthUser, entity: string, res: Response): Promise<string>;
}
export declare class NotificationsCentreController {
    private readonly alerts;
    constructor(alerts: AlertsService);
    feed(u: AuthUser, q: {
        unread?: string;
        resolved?: string;
        pageSize?: string;
    }): Promise<{
        unread: number;
        items: {
            read: boolean;
            readBy: undefined;
            link: string | null;
            id: string;
            createdAt: Date;
            orgId: string;
            branchId: string | null;
            kind: string;
            refType: string | null;
            refId: string | null;
            body: string | null;
            dedupeKey: string;
            resolvedAt: Date | null;
            severity: string;
            title: string;
        }[];
    }>;
    unread(u: AuthUser): Promise<{
        unread: number;
        critical: number;
    }>;
    scan(u: AuthUser): Promise<{
        created: number;
        resolved: number;
        open: number;
    }>;
    readAll(u: AuthUser): Promise<{
        marked: number;
    }>;
    read(u: AuthUser, id: string): Promise<{
        ok: boolean;
    }>;
}
export {};
