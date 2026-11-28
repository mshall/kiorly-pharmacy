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
exports.MobilePharmacyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const permissions_service_1 = require("../../auth/permissions.service");
const errors_1 = require("../../common/errors");
const mobile_pharmacy_service_1 = require("./mobile-pharmacy.service");
class CountersignDto {
    discrepancyId;
    note;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], CountersignDto.prototype, "discrepancyId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CountersignDto.prototype, "note", void 0);
let MobilePharmacyController = class MobilePharmacyController {
    svc;
    perms;
    constructor(svc, perms) {
        this.svc = svc;
        this.perms = perms;
    }
    barcode(u, code, branchId) { return this.svc.barcode(u, decodeURIComponent(code), branchId); }
    expiry(u, branchId) { return this.svc.expiryLowStock(u, branchId); }
    shift(u, branchId) { return this.svc.shiftSummary(u, branchId); }
    pending(u) { return this.svc.pendingWitness(u); }
    countersign(u, d) { return this.svc.countersign(u, d.discrepancyId, d.note); }
    async search(u, q) {
        if (!q || q.trim().length < 2)
            throw (0, errors_1.badRequest)("QUERY_TOO_SHORT", "q must be at least 2 characters");
        const p = await this.perms.forRole(u.orgId, u.role);
        return this.svc.search(u, q, { catalogue: p.has("catalogue.read"), customers: p.has("customer.read"), rx: p.has("rx.read") });
    }
};
exports.MobilePharmacyController = MobilePharmacyController;
__decorate([
    (0, common_1.Get)("barcode/:code"),
    (0, decorators_1.Perm)("catalogue.read", "inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("code")),
    __param(2, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", void 0)
], MobilePharmacyController.prototype, "barcode", null);
__decorate([
    (0, common_1.Get)("expiry-lowstock"),
    (0, decorators_1.Perm)("inventory.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MobilePharmacyController.prototype, "expiry", null);
__decorate([
    (0, common_1.Get)("shift-summary"),
    (0, decorators_1.Perm)("pos.sell"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("branchId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], MobilePharmacyController.prototype, "shift", null);
__decorate([
    (0, common_1.Get)("controlled/pending-witness"),
    (0, decorators_1.Perm)("controlled.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MobilePharmacyController.prototype, "pending", null);
__decorate([
    (0, common_1.Post)("controlled/countersign"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("controlled.manage"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CountersignDto]),
    __metadata("design:returntype", void 0)
], MobilePharmacyController.prototype, "countersign", null);
__decorate([
    (0, common_1.Get)("search"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)("q")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], MobilePharmacyController.prototype, "search", null);
exports.MobilePharmacyController = MobilePharmacyController = __decorate([
    (0, swagger_1.ApiTags)("mobile"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("mobile/pharmacy"),
    __param(0, (0, common_1.Inject)(mobile_pharmacy_service_1.MobilePharmacyService)),
    __param(1, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [mobile_pharmacy_service_1.MobilePharmacyService, permissions_service_1.PermissionsService])
], MobilePharmacyController);
//# sourceMappingURL=mobile-pharmacy.controller.js.map