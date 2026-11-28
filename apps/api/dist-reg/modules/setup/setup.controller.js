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
exports.SetupController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const errors_1 = require("../../common/errors");
const setup_service_1 = require("./setup.service");
class SkipDto {
    action;
    entityId;
}
__decorate([
    (0, class_validator_1.IsIn)(["skip", "complete"]),
    __metadata("design:type", String)
], SkipDto.prototype, "action", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(64),
    __metadata("design:type", String)
], SkipDto.prototype, "entityId", void 0);
let SetupController = class SetupController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    get(u) { return this.svc.get(u); }
    step(u, key, b) {
        if (b.action === "complete")
            throw new errors_1.DomainError("AUTO_STEP", "This step completes automatically when the work is done; it cannot be ticked by hand", 400);
        return this.svc.skip(u, key, b.entityId);
    }
    dismiss(u) { return this.svc.dismiss(u); }
};
exports.SetupController = SetupController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SetupController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)("steps/:key"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("key")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, SkipDto]),
    __metadata("design:returntype", void 0)
], SetupController.prototype, "step", null);
__decorate([
    (0, common_1.Post)("dismiss"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SetupController.prototype, "dismiss", null);
exports.SetupController = SetupController = __decorate([
    (0, swagger_1.ApiTags)("setup"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("setup"),
    __param(0, (0, common_1.Inject)(setup_service_1.SetupService)),
    __metadata("design:paramtypes", [setup_service_1.SetupService])
], SetupController);
//# sourceMappingURL=setup.controller.js.map