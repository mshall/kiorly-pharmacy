import type { Edition } from "../../generated/prisma/client";

/** Kiorly Work (mobile staff app) entitlement key. Commercial entitlement, never a safety control (ADR-025). */
export const MOBILE_FLAG = "mobile_staff_app";
export type MobilePlan = "BASIC" | "PRO" | "ENTERPRISE";

/** Pharmacy editions -> the cross-product plan names: LITE = BASIC; PRO = PRO; CHAIN and ENTERPRISE = ENTERPRISE. */
export function normalisePlan(edition: Edition | string): MobilePlan {
  if (edition === "PRO") return "PRO";
  if (edition === "CHAIN" || edition === "ENTERPRISE") return "ENTERPRISE";
  return "BASIC";
}
/** Plan check only (the flag layer is evaluated on top of it). A SUSPENDED subscription loses the app but keeps safety alerts. */
export const planIncludesMobile = (edition: Edition | string, subscriptionStatus = "ACTIVE"): boolean => normalisePlan(edition) !== "BASIC" && subscriptionStatus !== "SUSPENDED";

export interface ModuleDef { key: string; perms: string[]; screens: string[]; extra?: "kiorex_orders" }
/** Per-role module catalogue: a module is enabled when the role's effective permissions include ALL of `perms`. */
export const MODULE_DEFS: readonly ModuleDef[] = [
  { key: "pharmacy.rx", perms: ["rx.read"], screens: ["rx.queue", "rx.detail", "rx.safety"] },
  { key: "pharmacy.barcode", perms: ["catalogue.read", "inventory.read"], screens: ["barcode.lookup"] },
  { key: "pharmacy.receiving", perms: ["inventory.receive"], screens: ["receiving.po", "receiving.scan"] },
  { key: "pharmacy.stockcount", perms: ["inventory.count"], screens: ["count.list", "count.scan"] },
  { key: "pharmacy.expiry", perms: ["inventory.read"], screens: ["expiry.dashboard", "lowstock.dashboard"] },
  { key: "pharmacy.controlled", perms: ["controlled.read"], screens: ["controlled.balances", "controlled.countersign"] },
  { key: "pharmacy.shift", perms: ["pos.sell"], screens: ["shift.summary"] },
  { key: "pharmacy.customers", perms: ["customer.read"], screens: ["customer.lookup"] },
  { key: "pharmacy.orders", perms: ["orders.read"], screens: ["orders.inbox"], extra: "kiorex_orders" },
  { key: "pharmacy.search", perms: ["catalogue.read"], screens: ["search.global"] },
];

export function modulesFor(perms: ReadonlySet<string>, kiorexOrders: boolean) {
  return MODULE_DEFS.map((m) => {
    let enabled = m.perms.every((p) => perms.has(p));
    if (m.extra === "kiorex_orders" && !kiorexOrders) enabled = false;
    const screens = [...m.screens];
    if (m.key === "pharmacy.rx" && perms.has("rx.validate")) screens.push("rx.validate");
    if (m.key === "pharmacy.rx" && perms.has("dispense.signoff")) screens.push("rx.override");
    return { key: m.key, enabled, screens: enabled ? screens : [] };
  });
}
