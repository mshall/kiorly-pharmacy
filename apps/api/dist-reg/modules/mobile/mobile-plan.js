"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_DEFS = exports.planIncludesMobile = exports.MOBILE_FLAG = void 0;
exports.normalisePlan = normalisePlan;
exports.modulesFor = modulesFor;
exports.MOBILE_FLAG = "mobile_staff_app";
function normalisePlan(edition) {
    if (edition === "PRO")
        return "PRO";
    if (edition === "CHAIN" || edition === "ENTERPRISE")
        return "ENTERPRISE";
    return "BASIC";
}
const planIncludesMobile = (edition, subscriptionStatus = "ACTIVE") => normalisePlan(edition) !== "BASIC" && subscriptionStatus !== "SUSPENDED";
exports.planIncludesMobile = planIncludesMobile;
exports.MODULE_DEFS = [
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
    { key: "pharmacy.growth", perms: [], screens: ["growth.links"], extra: "growth" },
];
function modulesFor(perms, kiorexOrders, growth = "none") {
    return exports.MODULE_DEFS.map((m) => {
        let enabled = m.perms.every((p) => perms.has(p));
        if (m.extra === "kiorex_orders" && !kiorexOrders)
            enabled = false;
        if (m.extra === "growth")
            enabled = growth !== "none";
        const screens = [...m.screens];
        if (m.key === "pharmacy.rx" && perms.has("rx.validate"))
            screens.push("rx.validate");
        if (m.key === "pharmacy.rx" && perms.has("dispense.signoff"))
            screens.push("rx.override");
        if (m.key === "pharmacy.growth" && growth === "admin")
            screens.push("growth.create");
        return { key: m.key, enabled, screens: enabled ? screens : [] };
    });
}
//# sourceMappingURL=mobile-plan.js.map