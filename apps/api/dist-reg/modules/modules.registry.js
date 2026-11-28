"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOUNDED_CONTEXTS = void 0;
exports.BOUNDED_CONTEXTS = [
    { dir: "catalogue", name: "CatalogueModule", prefix: "KPCAT", title: "Catalogue", safetyPath: false },
    { dir: "inventory", name: "InventoryModule", prefix: "KPINV", title: "Inventory, lots, FEFO and stock movements", safetyPath: false },
    { dir: "prescriptions", name: "PrescriptionsModule", prefix: "KPRX", title: "Rx intake and validation", safetyPath: false },
    { dir: "dispensing", name: "DispensingModule", prefix: "KPRX", title: "Dispensing and pharmacist sign-off", safetyPath: true },
    { dir: "pos", name: "PosModule", prefix: "KPPOS", title: "POS and money", safetyPath: false },
    { dir: "suppliers", name: "SuppliersModule", prefix: "KPSUP", title: "Suppliers, purchase orders and recalls", safetyPath: false },
    { dir: "marketplace", name: "MarketplaceModule", prefix: "KPMKT", title: "Kiorex orders (phase 2)", safetyPath: false },
];
//# sourceMappingURL=modules.registry.js.map