"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PosModule = void 0;
const common_1 = require("@nestjs/common");
const pos_controller_1 = require("./pos.controller");
const pos_service_1 = require("./pos.service");
const sales_service_1 = require("./sales.service");
const shifts_service_1 = require("./shifts.service");
const customers_service_1 = require("./customers.service");
const promotions_service_1 = require("./promotions.service");
const held_carts_service_1 = require("./held-carts.service");
const cash_service_1 = require("./cash.service");
const paylinks_service_1 = require("./paylinks.service");
const inventory_module_1 = require("../inventory/inventory.module");
const catalogue_module_1 = require("../catalogue/catalogue.module");
let PosModule = class PosModule {
};
exports.PosModule = PosModule;
exports.PosModule = PosModule = __decorate([
    (0, common_1.Module)({ imports: [inventory_module_1.InventoryModule, catalogue_module_1.CatalogueModule], controllers: [pos_controller_1.PosController], providers: [pos_service_1.PosService, sales_service_1.SalesService, shifts_service_1.ShiftsService, customers_service_1.CustomersService, promotions_service_1.PromotionsService, held_carts_service_1.HeldCartsService, cash_service_1.CashService, paylinks_service_1.PayLinksService], exports: [sales_service_1.SalesService, pos_service_1.PosService, cash_service_1.CashService, shifts_service_1.ShiftsService, paylinks_service_1.PayLinksService] })
], PosModule);
//# sourceMappingURL=pos.module.js.map