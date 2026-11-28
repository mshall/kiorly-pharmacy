"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MobileModule = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mobile_controller_1 = require("./mobile.controller");
const mobile_pharmacy_controller_1 = require("./mobile-pharmacy.controller");
const mobile_pharmacy_service_1 = require("./mobile-pharmacy.service");
const mobile_entitlement_service_1 = require("./mobile-entitlement.service");
const mobile_devices_service_1 = require("./mobile-devices.service");
const mobile_upgrade_service_1 = require("./mobile-upgrade.service");
const mobile_alerts_service_1 = require("./mobile-alerts.service");
const mobile_client_guard_1 = require("./mobile-client.guard");
const push_service_1 = require("./push.service");
const catalogue_module_1 = require("../catalogue/catalogue.module");
const inventory_module_1 = require("../inventory/inventory.module");
const pos_module_1 = require("../pos/pos.module");
let MobileModule = class MobileModule {
};
exports.MobileModule = MobileModule;
exports.MobileModule = MobileModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [catalogue_module_1.CatalogueModule, inventory_module_1.InventoryModule, pos_module_1.PosModule],
        controllers: [mobile_controller_1.MobileController, mobile_pharmacy_controller_1.MobilePharmacyController],
        providers: [mobile_entitlement_service_1.MobileEntitlementService, mobile_upgrade_service_1.MobileUpgradeService, mobile_devices_service_1.MobileDevicesService, mobile_alerts_service_1.MobileAlertsService, mobile_pharmacy_service_1.MobilePharmacyService, push_service_1.PushService, { provide: core_1.APP_GUARD, useClass: mobile_client_guard_1.MobileClientGuard }],
        exports: [push_service_1.PushService, mobile_entitlement_service_1.MobileEntitlementService],
    })
], MobileModule);
//# sourceMappingURL=mobile.module.js.map