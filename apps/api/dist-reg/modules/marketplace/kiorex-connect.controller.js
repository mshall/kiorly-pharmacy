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
exports.KiorexConnectController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const kiorex_connect_service_1 = require("./kiorex-connect.service");
class TermsDto {
    version;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TermsDto.prototype, "version", void 0);
class PayoutDto {
    label;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], PayoutDto.prototype, "label", void 0);
class UploadDto {
    name;
    contentBase64;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], UploadDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UploadDto.prototype, "contentBase64", void 0);
class BranchDto {
    optedIn;
    deliveryRadiusKm;
    openingHours;
    prepMinutes;
    latitude;
    longitude;
    licenceNo;
}
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], BranchDto.prototype, "optedIn", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "deliveryRadiusKm", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsObject)(),
    __metadata("design:type", Object)
], BranchDto.prototype, "openingHours", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(600),
    __metadata("design:type", Number)
], BranchDto.prototype, "prepMinutes", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "latitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumberString)(),
    __metadata("design:type", String)
], BranchDto.prototype, "longitude", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(60),
    __metadata("design:type", String)
], BranchDto.prototype, "licenceNo", void 0);
class RequestDto {
    rotate;
    contactEmail;
    enrolmentCode;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RequestDto.prototype, "rotate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RequestDto.prototype, "contactEmail", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], RequestDto.prototype, "enrolmentCode", void 0);
let KiorexConnectController = class KiorexConnectController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    get(u) { return this.svc.get(u.orgId); }
    branches(u) { return this.svc.branches(u.orgId); }
    branch(u, id, d) { return this.svc.setBranch(u, id, d); }
    terms(u, d) { return this.svc.acceptTerms(u, d.version); }
    payout(u, d) { return this.svc.setPayout(u, d.label); }
    licence(u, d) { return this.svc.uploadLicence(u, d.name, d.contentBase64); }
    request(u, d) { return this.svc.request(u, d); }
    refresh(u) { return this.svc.get(u.orgId); }
};
exports.KiorexConnectController = KiorexConnectController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "get", null);
__decorate([
    (0, common_1.Get)("branches"),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "branches", null);
__decorate([
    (0, common_1.Put)("branches/:id"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, BranchDto]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "branch", null);
__decorate([
    (0, common_1.Put)("terms"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TermsDto]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "terms", null);
__decorate([
    (0, common_1.Put)("payout"),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PayoutDto]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "payout", null);
__decorate([
    (0, common_1.Post)("licence"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UploadDto]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "licence", null);
__decorate([
    (0, common_1.Post)("request"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RequestDto]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "request", null);
__decorate([
    (0, common_1.Post)("refresh"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexConnectController.prototype, "refresh", null);
exports.KiorexConnectController = KiorexConnectController = __decorate([
    (0, swagger_1.ApiTags)("kiorex-connect"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("kiorex-connect"),
    __param(0, (0, common_1.Inject)(kiorex_connect_service_1.KiorexConnectService)),
    __metadata("design:paramtypes", [kiorex_connect_service_1.KiorexConnectService])
], KiorexConnectController);
//# sourceMappingURL=kiorex-connect.controller.js.map