import type { StaffRole } from "../generated/prisma/client";
export declare const PERMISSIONS: readonly ["catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.count.approve", "inventory.transfer", "inventory.quarantine", "inventory.negative_stock", "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete", "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "supplier.write", "po.write", "orders.read", "orders.respond", "claims.manage", "forecast.read", "reports.read", "audit.read", "settings.read", "settings.write", "staff.manage", "customer.read", "customer.write", "customer.merge", "loyalty.manage", "prescriber.manage", "rx.refill", "rx.transfer", "safety.kb.manage", "controlled.manage", "promo.manage", "pos.discount_override", "pos.cash_drawer", "expense.read", "expense.write", "finance.read", "roles.manage", "data.import", "data.export", "notifications.read"];
export type Permission = (typeof PERMISSIONS)[number];
export declare const LOCKED_PERMISSIONS: readonly Permission[];
export declare const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>>;
export declare const PRIVILEGED_ROLES: readonly StaffRole[];
export declare const roleHas: (role: StaffRole, p: Permission) => boolean;
export declare function effectivePermissions(role: StaffRole, overrides?: ReadonlyArray<{
    role: StaffRole;
    permission: string;
    granted: boolean;
}>): Set<Permission>;
