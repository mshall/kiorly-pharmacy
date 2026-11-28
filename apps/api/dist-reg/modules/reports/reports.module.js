"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsModule = void 0;
const common_1 = require("@nestjs/common");
const reports_controller_1 = require("./reports.controller");
const reports_service_1 = require("./reports.service");
const reports_extra_1 = require("./reports-extra");
const finance_module_1 = require("../finance/finance.module");
const purchasing_module_1 = require("../purchasing/purchasing.module");
const inventory_module_1 = require("../inventory/inventory.module");
const prescriptions_module_1 = require("../prescriptions/prescriptions.module");
let ReportsModule = class ReportsModule {
};
exports.ReportsModule = ReportsModule;
exports.ReportsModule = ReportsModule = __decorate([
    (0, common_1.Module)({ imports: [finance_module_1.FinanceModule, purchasing_module_1.PurchasingModule, inventory_module_1.InventoryModule, prescriptions_module_1.PrescriptionsModule], controllers: [reports_controller_1.ReportsController], providers: [reports_service_1.ReportsService, reports_extra_1.ExtraReports], exports: [reports_service_1.ReportsService] })
], ReportsModule);
//# sourceMappingURL=reports.module.js.map