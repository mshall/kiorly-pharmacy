export declare const BOUNDED_CONTEXTS: readonly [{
    readonly dir: "catalogue";
    readonly name: "CatalogueModule";
    readonly prefix: "KPCAT";
    readonly title: "Catalogue";
    readonly safetyPath: false;
}, {
    readonly dir: "inventory";
    readonly name: "InventoryModule";
    readonly prefix: "KPINV";
    readonly title: "Inventory, lots, FEFO and stock movements";
    readonly safetyPath: false;
}, {
    readonly dir: "prescriptions";
    readonly name: "PrescriptionsModule";
    readonly prefix: "KPRX";
    readonly title: "Rx intake and validation";
    readonly safetyPath: false;
}, {
    readonly dir: "dispensing";
    readonly name: "DispensingModule";
    readonly prefix: "KPRX";
    readonly title: "Dispensing and pharmacist sign-off";
    readonly safetyPath: true;
}, {
    readonly dir: "pos";
    readonly name: "PosModule";
    readonly prefix: "KPPOS";
    readonly title: "POS and money";
    readonly safetyPath: false;
}, {
    readonly dir: "suppliers";
    readonly name: "SuppliersModule";
    readonly prefix: "KPSUP";
    readonly title: "Suppliers, purchase orders and recalls";
    readonly safetyPath: false;
}, {
    readonly dir: "marketplace";
    readonly name: "MarketplaceModule";
    readonly prefix: "KPMKT";
    readonly title: "Kiorex orders (phase 2)";
    readonly safetyPath: false;
}];
