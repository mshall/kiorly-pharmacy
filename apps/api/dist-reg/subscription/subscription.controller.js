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
exports.SubscriptionController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../auth/decorators");
const subscription_service_1 = require("./subscription.service");
class AutoRenewDto {
    enabled;
    confirmDowngrade;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoRenewDto.prototype, "enabled", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AutoRenewDto.prototype, "confirmDowngrade", void 0);
class ReactivateDto {
    edition;
    interval;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["PRO", "CHAIN", "ENTERPRISE"]),
    __metadata("design:type", String)
], ReactivateDto.prototype, "edition", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["MONTHLY", "ANNUAL"]),
    __metadata("design:type", String)
], ReactivateDto.prototype, "interval", void 0);
class PaymentMethodDto {
    tokenRef;
    brand;
    last4;
    expMonth;
    expYear;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^[A-Za-z0-9_\-]{6,80}$/),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "tokenRef", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "brand", void 0);
__decorate([
    (0, class_validator_1.Matches)(/^\d{4}$/),
    __metadata("design:type", String)
], PaymentMethodDto.prototype, "last4", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.Max)(12),
    __metadata("design:type", Number)
], PaymentMethodDto.prototype, "expMonth", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(2024),
    (0, class_validator_1.Max)(2100),
    __metadata("design:type", Number)
], PaymentMethodDto.prototype, "expYear", void 0);
let SubscriptionController = class SubscriptionController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    state(u) { return this.svc.state(u); }
    plans(u) { return this.svc.compare(u); }
    impact(u, e) { return this.svc.impact(u.orgId, e === "PRO" || e === "CHAIN" ? e : undefined); }
    invoices(u) { return this.svc.listInvoices(u.orgId); }
    notices(u) { return this.svc.listNotices(u.orgId); }
    autoRenew(u, b) { return this.svc.setAutoRenew(u, b); }
    reactivate(u, b) { return this.svc.reactivate(u, b); }
    paymentMethod(u, b) { return this.svc.setPaymentMethod(u, b); }
};
exports.SubscriptionController = SubscriptionController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "state", null);
__decorate([
    (0, common_1.Get)("plans"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "plans", null);
__decorate([
    (0, common_1.Get)("downgrade-impact"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("edition")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "impact", null);
__decorate([
    (0, common_1.Get)("invoices"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "invoices", null);
__decorate([
    (0, common_1.Get)("notices"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "notices", null);
__decorate([
    (0, common_1.Post)("auto-renew"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AutoRenewDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "autoRenew", null);
__decorate([
    (0, common_1.Post)("reactivate"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, ReactivateDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "reactivate", null);
__decorate([
    (0, common_1.Put)("payment-method"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PaymentMethodDto]),
    __metadata("design:returntype", void 0)
], SubscriptionController.prototype, "paymentMethod", null);
exports.SubscriptionController = SubscriptionController = __decorate([
    (0, swagger_1.ApiTags)("subscription"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("subscription"),
    __param(0, (0, common_1.Inject)(subscription_service_1.SubscriptionService)),
    __metadata("design:paramtypes", [subscription_service_1.SubscriptionService])
], SubscriptionController);
//# sourceMappingURL=subscription.controller.js.map