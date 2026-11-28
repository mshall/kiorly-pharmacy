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
exports.FlagsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@kiorex/contracts");
const decorators_1 = require("../auth/decorators");
const feature_flags_service_1 = require("./feature-flags.service");
const feature_flag_keys_1 = require("./feature-flag-keys");
let FlagsController = class FlagsController {
    flags;
    constructor(flags) {
        this.flags = flags;
    }
    effective(u) {
        return Object.fromEntries(feature_flag_keys_1.FLAG_DEFINITIONS.map((f) => {
            const d = this.flags.evaluate(f.key, { orgId: u.orgId, market: u.market });
            return [f.key, { enabled: d.enabled, scope: d.scope ?? null }];
        }));
    }
    async changed(req, headers, _body) {
        const secret = process.env.KIOREX_FLAGS_WEBHOOK_SECRET ?? process.env.KIOREX_PRODUCT_SECRET ?? "ff_dev_secret_change_me";
        const raw = req.rawBody ?? Buffer.from(JSON.stringify(_body ?? {}));
        const v = (0, contracts_1.verifyWebhook)({ secret, body: raw, timestamp: headers["x-kiorly-timestamp"], signature: headers["x-kiorly-signature"] });
        if (!v.ok)
            throw new common_1.UnauthorizedException({ statusCode: 401, code: "BAD_SIGNATURE", message: v.reason });
        const result = await this.flags.refresh();
        return { accepted: true, refresh: result };
    }
};
exports.FlagsController = FlagsController;
__decorate([
    (0, common_1.Get)("effective"),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FlagsController.prototype, "effective", null);
__decorate([
    (0, common_1.Post)("kiorex/changed"),
    (0, decorators_1.Public)(),
    (0, common_1.HttpCode)(202),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Headers)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], FlagsController.prototype, "changed", null);
exports.FlagsController = FlagsController = __decorate([
    (0, swagger_1.ApiTags)("feature-flags"),
    (0, common_1.Controller)("feature-flags"),
    __param(0, (0, common_1.Inject)(feature_flags_service_1.FeatureFlagsService)),
    __metadata("design:paramtypes", [feature_flags_service_1.FeatureFlagsService])
], FlagsController);
//# sourceMappingURL=flags.controller.js.map