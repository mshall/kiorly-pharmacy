"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPricesModule = void 0;
const common_1 = require("@nestjs/common");
const plan_prices_controller_1 = require("./plan-prices.controller");
const plan_prices_service_1 = require("./plan-prices.service");
const platform_admin_hmac_guard_1 = require("./platform-admin-hmac.guard");
let PlanPricesModule = class PlanPricesModule {
};
exports.PlanPricesModule = PlanPricesModule;
exports.PlanPricesModule = PlanPricesModule = __decorate([
    (0, common_1.Module)({ controllers: [plan_prices_controller_1.PlanPricesController], providers: [plan_prices_service_1.PlanPricesService, platform_admin_hmac_guard_1.PlatformAdminHmacGuard] })
], PlanPricesModule);
//# sourceMappingURL=plan-prices.module.js.map