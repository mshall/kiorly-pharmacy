"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const inventory_controller_1 = require("./inventory.controller");
const inventory_suite_controller_1 = require("./inventory-suite.controller");
const inventory_service_1 = require("./inventory.service");
const receiving_service_1 = require("./receiving.service");
const counts_service_1 = require("./counts.service");
const transfers_service_1 = require("./transfers.service");
const stock_ledger_service_1 = require("./stock-ledger.service");
const locations_service_1 = require("./locations.service");
const uom_service_1 = require("./uom.service");
const inventory_analytics_service_1 = require("./inventory-analytics.service");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        controllers: [inventory_controller_1.InventoryController, inventory_suite_controller_1.InventorySuiteController],
        providers: [stock_ledger_service_1.StockLedger, inventory_service_1.InventoryService, receiving_service_1.ReceivingService, counts_service_1.CountsService, transfers_service_1.TransfersService, locations_service_1.LocationsService, uom_service_1.UomService, inventory_analytics_service_1.InventoryAnalyticsService],
        exports: [stock_ledger_service_1.StockLedger, inventory_service_1.InventoryService, receiving_service_1.ReceivingService, uom_service_1.UomService, locations_service_1.LocationsService, inventory_analytics_service_1.InventoryAnalyticsService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map