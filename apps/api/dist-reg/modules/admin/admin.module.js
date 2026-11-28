"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const admin_controller_1 = require("./admin.controller");
const roles_service_1 = require("./roles.service");
const import_service_1 = require("./import.service");
const export_service_1 = require("./export.service");
const alerts_service_1 = require("./alerts.service");
const catalogue_module_1 = require("../catalogue/catalogue.module");
const inventory_module_1 = require("../inventory/inventory.module");
const customers_module_1 = require("../customers/customers.module");
const suppliers_module_1 = require("../suppliers/suppliers.module");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({ imports: [catalogue_module_1.CatalogueModule, inventory_module_1.InventoryModule, customers_module_1.CustomersModule, suppliers_module_1.SuppliersModule], controllers: [admin_controller_1.AdminController, admin_controller_1.NotificationsCentreController], providers: [roles_service_1.RolesService, import_service_1.ImportService, export_service_1.ExportService, alerts_service_1.AlertsService], exports: [alerts_service_1.AlertsService] })
], AdminModule);
//# sourceMappingURL=admin.module.js.map