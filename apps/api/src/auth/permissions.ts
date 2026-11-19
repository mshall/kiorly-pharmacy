import type { StaffRole } from "@prisma/client";

/** Fine-grained permissions. Roles map to sets below; guards check permissions, never roles (RBAC, KX-08 §09). */
export const PERMISSIONS = [
  "catalogue.read", "catalogue.write", "price.write",
  "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.count.approve",
  "inventory.transfer", "inventory.quarantine", "inventory.negative_stock",
  "recall.manage",
  "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete", "controlled.read",
  "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit",
  "supplier.read", "supplier.write", "po.write",
  "orders.read", "orders.respond",
  "claims.manage", "forecast.read",
  "reports.read", "audit.read",
  "settings.read", "settings.write", "staff.manage",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = new Set<Permission>(PERMISSIONS);
const without = (...p: Permission[]) => new Set<Permission>(PERMISSIONS.filter((x) => !p.includes(x)));

export const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>> = {
  OWNER: ALL,
  /** Pharmacist on shift: clinical + counter; cannot manage staff/settings or approve cash refunds by default. */
  PHARMACIST: new Set<Permission>([
    "catalogue.read", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.quarantine",
    "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete",
    "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "orders.read", "orders.respond",
    "forecast.read", "reports.read",
  ]),
  CASHIER: new Set<Permission>(["catalogue.read", "inventory.read", "pos.sell", "pos.shift", "customer.credit", "rx.read", "dispense.create", "dispense.complete"]),
  /** Branch manager approves negative stock, refunds, count variances. Not a dispensing signer unless also licensed (service check). */
  BRANCH_MANAGER: without("staff.manage", "settings.write", "dispense.signoff"),
  CHAIN_OPS: new Set<Permission>([
    "catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.transfer", "supplier.read", "supplier.write", "po.write",
    "reports.read", "forecast.read", "settings.read", "orders.read", "audit.read",
  ]),
};

/** Roles that must present an MFA claim in production (KX-08 §09 privileged MFA). */
export const PRIVILEGED_ROLES: readonly StaffRole[] = ["OWNER", "BRANCH_MANAGER", "CHAIN_OPS", "PHARMACIST"];

export const roleHas = (role: StaffRole, p: Permission): boolean => ROLE_PERMISSIONS[role].has(p);
