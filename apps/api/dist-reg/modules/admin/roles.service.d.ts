import { StaffRole } from "../../generated/prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import type { AuthUser } from "../../auth/auth-user";
import { PermissionsService } from "../../auth/permissions.service";
export declare class RolesService {
    private readonly prisma;
    private readonly perms;
    constructor(prisma: PrismaService, perms: PermissionsService);
    matrix(orgId: string): Promise<{
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
    set(u: AuthUser, role: StaffRole, permission: string, granted: boolean): Promise<{
        role: "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS" | "ASSISTANT";
        permission: string;
        granted: boolean;
    }>;
    reset(u: AuthUser, role: StaffRole): Promise<{
        role: "PHARMACIST" | "CASHIER" | "BRANCH_MANAGER" | "CHAIN_OPS" | "ASSISTANT";
        removed: number;
    }>;
}
