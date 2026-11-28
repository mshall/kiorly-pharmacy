"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKnownFlagKey = exports.FLAG_KEYS = exports.FLAG_DEFINITIONS = void 0;
exports.FLAG_DEFINITIONS = [
    { key: "pharmacy.module", cls: "Module", dependsOn: [], launchLocked: false, offBehaviour: "No new sign-ups; existing tenants read-only with export" },
    { key: "pharmacy.kiorex_orders", cls: "Module", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Order inbox hidden; stock not exposed to Kiorex" },
    { key: "pharmacy.forecasting", cls: "AI", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Min/max reorder only" },
    { key: "mobile_staff_app", cls: "Module", dependsOn: [], launchLocked: false, offBehaviour: "Kiorly shows the upgrade screen; the read-only safety-alert inbox stays available" },
    { key: "growth.provider_links", cls: "Module", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "No new links, QR codes or counter cards; existing links keep resolving and counting" },
    { key: "pharmacy.insurer_claims", cls: "Module", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Cash/self-pay only" },
];
exports.FLAG_KEYS = exports.FLAG_DEFINITIONS.map((f) => f.key);
const isKnownFlagKey = (key) => exports.FLAG_KEYS.includes(key);
exports.isKnownFlagKey = isKnownFlagKey;
//# sourceMappingURL=feature-flag-keys.js.map