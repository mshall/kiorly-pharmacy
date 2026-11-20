import type { Role } from "@/lib/types";

/** Read-only reference of the server's role matrix (apps/api/src/auth/permissions.ts) for the Settings > Roles screen. The API stays the source of truth. */
export const PERMISSION_GROUPS: Array<{ id: string; perms: string[] }> = [
  { id: "catalogue", perms: ["catalogue.read", "catalogue.write", "price.write"] },
  { id: "inventory", perms: ["inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.count.approve", "inventory.transfer", "inventory.quarantine", "inventory.negative_stock", "recall.manage"] },
  { id: "dispensing", perms: ["rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete", "controlled.read"] },
  { id: "sales", perms: ["pos.sell", "pos.shift", "pos.refund_approve", "customer.credit"] },
  { id: "purchasing", perms: ["supplier.read", "supplier.write", "po.write"] },
  { id: "marketplace", perms: ["orders.read", "orders.respond", "claims.manage", "forecast.read"] },
  { id: "admin", perms: ["reports.read", "audit.read", "settings.read", "settings.write", "staff.manage"] },
];
const ALL = PERMISSION_GROUPS.flatMap((g) => g.perms);
const without = (...p: string[]) => ALL.filter((x) => !p.includes(x));
export const ROLE_PERMS: Record<Role, string[]> = {
  OWNER: ALL,
  PHARMACIST: ["catalogue.read", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.quarantine", "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete", "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "orders.read", "orders.respond", "forecast.read", "reports.read"],
  CASHIER: ["catalogue.read", "inventory.read", "pos.sell", "pos.shift", "customer.credit", "rx.read", "dispense.create", "dispense.complete"],
  BRANCH_MANAGER: without("staff.manage", "settings.write", "dispense.signoff"),
  CHAIN_OPS: ["catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.transfer", "supplier.read", "supplier.write", "po.write", "reports.read", "forecast.read", "settings.read", "orders.read", "audit.read"],
};
