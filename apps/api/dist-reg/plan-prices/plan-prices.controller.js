"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanPricesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const plan_prices_service_1 = require("./plan-prices.service");
const platform_admin_hmac_guard_1 = require("./platform-admin-hmac.guard");
let PlanPricesController = class PlanPricesController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    overview() { return this.svc.overview(); }
    price(body) { return this.svc.request(body); }
};
exports.PlanPricesController = PlanPricesController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PlanPricesController.prototype, "overview", null);
__decorate([
    (0, common_1.Post)("prices"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PlanPricesController.prototype, "price", null);
exports.PlanPricesController = PlanPricesController = __decorate([
    (0, swagger_1.ApiTags)("platform-plans"),
    (0, swagger_1.ApiExcludeController)(),
    (0, decorators_1.Public)(),
    (0, common_1.UseGuards)(platform_admin_hmac_guard_1.PlatformAdminHmacGuard),
    (0, common_1.Controller)("marketplace/v1/plans"),
    __param(0, (0, common_1.Inject)(plan_prices_service_1.PlanPricesService)),
    __metadata("design:paramtypes", [plan_prices_service_1.PlanPricesService])
], PlanPricesController);
//# sourceMappingURL=plan-prices.controller.js.map