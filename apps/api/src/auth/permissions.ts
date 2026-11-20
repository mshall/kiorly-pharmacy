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
  // standalone suite
  "customer.read", "customer.write", "customer.merge", "loyalty.manage",
  "prescriber.manage", "rx.refill", "rx.transfer",
  "safety.kb.manage", "controlled.manage",
  "promo.manage", "pos.discount_override", "pos.cash_drawer",
  "expense.read", "expense.write", "finance.read",
  "roles.manage", "data.import", "data.export", "notifications.read",
] as const;
export type Permission = (typeof PERMISSIONS)[number];

const ALL = new Set<Permission>(PERMISSIONS);
const without = (...p: Permission[]) => new Set<Permission>(PERMISSIONS.filter((x) => !p.includes(x)));

/** Safety-critical permissions: never overridable per tenant (ADR-025) — pharmacist sign-off stays licence-bound. */
export const LOCKED_PERMISSIONS: readonly Permission[] = ["dispense.signoff", "controlled.read", "controlled.manage", "roles.manage", "staff.manage"];

export const ROLE_PERMISSIONS: Record<StaffRole, ReadonlySet<Permission>> = {
  OWNER: ALL,
  /** Pharmacist on shift: clinical + counter; cannot manage staff/settings or approve cash refunds by default. */
  PHARMACIST: new Set<Permission>([
    "catalogue.read", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.quarantine",
    "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete",
    "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "orders.read", "orders.respond",
    "forecast.read", "reports.read",
    "customer.read", "customer.write", "rx.refill", "rx.transfer", "prescriber.manage", "controlled.manage", "pos.cash_drawer", "notifications.read", "expense.read", "finance.read",
  ]),
  CASHIER: new Set<Permission>(["catalogue.read", "inventory.read", "pos.sell", "pos.shift", "customer.credit", "rx.read", "dispense.create", "dispense.complete", "customer.read", "customer.write", "pos.cash_drawer", "notifications.read"]),
  ASSISTANT: new Set<Permission>(["catalogue.read", "inventory.read", "inventory.receive", "inventory.count", "pos.sell", "pos.shift", "customer.credit", "customer.read", "customer.write", "rx.read", "rx.intake", "dispense.create", "dispense.complete", "notifications.read"]),
  /** Branch manager approves negative stock, refunds, count variances. Not a dispensing signer unless also licensed (service check). */
  BRANCH_MANAGER: without("staff.manage", "settings.write", "dispense.signoff", "roles.manage", "safety.kb.manage"),
  CHAIN_OPS: new Set<Permission>([
    "catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.transfer", "supplier.read", "supplier.write", "po.write",
    "reports.read", "forecast.read", "settings.read", "orders.read", "audit.read", "customer.read", "promo.manage", "finance.read", "expense.read", "notifications.read",
  ]),
};

/** Roles that must present an MFA claim in production (KX-08 §09 privileged MFA). */
export const PRIVILEGED_ROLES: readonly StaffRole[] = ["OWNER", "BRANCH_MANAGER", "CHAIN_OPS", "PHARMACIST"];

export const roleHas = (role: StaffRole, p: Permission): boolean => ROLE_PERMISSIONS[role].has(p);

/** Effective permission set for a role in a tenant: built-in defaults + the tenant's overrides (never for OWNER or LOCKED permissions). */
export function effectivePermissions(role: StaffRole, overrides: ReadonlyArray<{ role: StaffRole; permission: string; granted: boolean }> = []): Set<Permission> {
  const set = new Set<Permission>(ROLE_PERMISSIONS[role]);
  if (role === "OWNER") return set;
  for (const o of overrides) {
    if (o.role !== role || !(PERMISSIONS as readonly string[]).includes(o.permission) || (LOCKED_PERMISSIONS as readonly string[]).includes(o.permission)) continue;
    if (o.granted) set.add(o.permission as Permission); else set.delete(o.permission as Permission);
  }
  return set;
}
