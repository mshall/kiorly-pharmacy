"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleHas = exports.PRIVILEGED_ROLES = exports.ROLE_PERMISSIONS = exports.LOCKED_PERMISSIONS = exports.PERMISSIONS = void 0;
exports.effectivePermissions = effectivePermissions;
exports.PERMISSIONS = [
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
    "customer.read", "customer.write", "customer.merge", "loyalty.manage",
    "prescriber.manage", "rx.refill", "rx.transfer",
    "safety.kb.manage", "controlled.manage",
    "promo.manage", "pos.discount_override", "pos.cash_drawer",
    "expense.read", "expense.write", "finance.read",
    "roles.manage", "data.import", "data.export", "notifications.read",
];
const ALL = new Set(exports.PERMISSIONS);
const without = (...p) => new Set(exports.PERMISSIONS.filter((x) => !p.includes(x)));
exports.LOCKED_PERMISSIONS = ["dispense.signoff", "controlled.read", "controlled.manage", "roles.manage", "staff.manage"];
exports.ROLE_PERMISSIONS = {
    OWNER: ALL,
    PHARMACIST: new Set([
        "catalogue.read", "inventory.read", "inventory.receive", "inventory.adjust", "inventory.count", "inventory.quarantine",
        "recall.manage", "rx.read", "rx.intake", "rx.validate", "dispense.create", "dispense.signoff", "dispense.complete",
        "controlled.read", "pos.sell", "pos.shift", "pos.refund_approve", "customer.credit", "supplier.read", "orders.read", "orders.respond",
        "forecast.read", "reports.read",
        "customer.read", "customer.write", "rx.refill", "rx.transfer", "prescriber.manage", "controlled.manage", "pos.cash_drawer", "pos.discount_override", "promo.manage", "notifications.read", "expense.read", "finance.read",
    ]),
    CASHIER: new Set(["catalogue.read", "inventory.read", "pos.sell", "pos.shift", "customer.credit", "rx.read", "dispense.create", "dispense.complete", "customer.read", "customer.write", "pos.cash_drawer", "notifications.read"]),
    ASSISTANT: new Set(["catalogue.read", "inventory.read", "inventory.receive", "inventory.count", "pos.sell", "pos.shift", "customer.credit", "customer.read", "customer.write", "rx.read", "rx.intake", "dispense.create", "dispense.complete", "notifications.read"]),
    BRANCH_MANAGER: without("staff.manage", "settings.write", "dispense.signoff", "roles.manage", "safety.kb.manage"),
    CHAIN_OPS: new Set([
        "catalogue.read", "catalogue.write", "price.write", "inventory.read", "inventory.transfer", "supplier.read", "supplier.write", "po.write",
        "reports.read", "forecast.read", "settings.read", "orders.read", "audit.read", "customer.read", "promo.manage", "finance.read", "expense.read", "notifications.read",
    ]),
};
exports.PRIVILEGED_ROLES = ["OWNER", "BRANCH_MANAGER", "CHAIN_OPS", "PHARMACIST"];
const roleHas = (role, p) => exports.ROLE_PERMISSIONS[role].has(p);
exports.roleHas = roleHas;
function effectivePermissions(role, overrides = []) {
    const set = new Set(exports.ROLE_PERMISSIONS[role]);
    if (role === "OWNER")
        return set;
    for (const o of overrides) {
        if (o.role !== role || !exports.PERMISSIONS.includes(o.permission) || exports.LOCKED_PERMISSIONS.includes(o.permission))
            continue;
        if (o.granted)
            set.add(o.permission);
        else
            set.delete(o.permission);
    }
    return set;
}
//# sourceMappingURL=permissions.js.map