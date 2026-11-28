"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceModule = void 0;
const common_1 = require("@nestjs/common");
const marketplace_controller_1 = require("./marketplace.controller");
const marketplace_service_1 = require("./marketplace.service");
const marketplace_hmac_guard_1 = require("./marketplace-hmac.guard");
const kiorex_connect_controller_1 = require("./kiorex-connect.controller");
const kiorex_connect_service_1 = require("./kiorex-connect.service");
const kiorex_front_door_controller_1 = require("./kiorex-front-door.controller");
const kiorex_front_door_service_1 = require("./kiorex-front-door.service");
const catalogue_module_1 = require("../catalogue/catalogue.module");
const dispensing_module_1 = require("../dispensing/dispensing.module");
const inventory_module_1 = require("../inventory/inventory.module");
const growth_module_1 = require("../growth/growth.module");
let MarketplaceModule = class MarketplaceModule {
};
exports.MarketplaceModule = MarketplaceModule;
exports.MarketplaceModule = MarketplaceModule = __decorate([
    (0, common_1.Module)({ imports: [dispensing_module_1.DispensingModule, inventory_module_1.InventoryModule, catalogue_module_1.CatalogueModule, growth_module_1.GrowthModule], controllers: [marketplace_controller_1.KiorexOrdersController, marketplace_controller_1.MarketplaceMachineController, kiorex_connect_controller_1.KiorexConnectController, kiorex_front_door_controller_1.KiorexFrontDoorController], providers: [marketplace_service_1.MarketplaceService, marketplace_hmac_guard_1.MarketplaceHmacGuard, kiorex_connect_service_1.KiorexConnectService, kiorex_front_door_service_1.KiorexFrontDoorService], exports: [marketplace_service_1.MarketplaceService] })
], MarketplaceModule);
//# sourceMappingURL=marketplace.module.js.map