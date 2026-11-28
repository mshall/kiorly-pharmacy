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
exports.KiorexFrontDoorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const decorators_1 = require("../../auth/decorators");
const kiorex_front_door_service_1 = require("./kiorex-front-door.service");
class TalkDto {
    contactName;
    contactRole;
    phone;
    email;
    preferredTime;
    note;
    consent;
}
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(120),
    __metadata("design:type", String)
], TalkDto.prototype, "contactName", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(80),
    __metadata("design:type", String)
], TalkDto.prototype, "contactRole", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(24),
    __metadata("design:type", String)
], TalkDto.prototype, "phone", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(160),
    __metadata("design:type", String)
], TalkDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(12),
    __metadata("design:type", String)
], TalkDto.prototype, "preferredTime", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], TalkDto.prototype, "note", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], TalkDto.prototype, "consent", void 0);
class PauseDto {
    reason;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], PauseDto.prototype, "reason", void 0);
let KiorexFrontDoorController = class KiorexFrontDoorController {
    svc;
    constructor(svc) {
        this.svc = svc;
    }
    get(u) { return this.svc.get(u.orgId); }
    interest(u) { return this.svc.interest(u.orgId); }
    start(u) { return this.svc.start(u); }
    pause(u, d) { return this.svc.pauseListing(u, d?.reason); }
    resume(u) { return this.svc.resumeListing(u); }
    talk(u, d) { return this.svc.talk(u, d); }
};
exports.KiorexFrontDoorController = KiorexFrontDoorController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "get", null);
__decorate([
    (0, common_1.Post)("interest"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "interest", null);
__decorate([
    (0, common_1.Post)("start"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "start", null);
__decorate([
    (0, common_1.Post)("listing/pause"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, PauseDto]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "pause", null);
__decorate([
    (0, common_1.Post)("listing/resume"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "resume", null);
__decorate([
    (0, common_1.Post)("talk"),
    (0, common_1.HttpCode)(200),
    (0, decorators_1.Perm)("settings.write"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, TalkDto]),
    __metadata("design:returntype", void 0)
], KiorexFrontDoorController.prototype, "talk", null);
exports.KiorexFrontDoorController = KiorexFrontDoorController = __decorate([
    (0, swagger_1.ApiTags)("kiorex-connect"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("kiorex-connect/front-door"),
    __param(0, (0, common_1.Inject)(kiorex_front_door_service_1.KiorexFrontDoorService)),
    __metadata("design:paramtypes", [kiorex_front_door_service_1.KiorexFrontDoorService])
], KiorexFrontDoorController);
//# sourceMappingURL=kiorex-front-door.controller.js.map