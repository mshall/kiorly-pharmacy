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
exports.ProviderWebhooksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const decorators_1 = require("../auth/decorators");
const provider_events_service_1 = require("./provider-events.service");
const provider_env_1 = require("./provider-env");
const webhook_signature_1 = require("./webhook-signature");
const provider_env_2 = require("./provider-env");
const vendor_kit_1 = require("./vendor-kit");
let ProviderWebhooksController = class ProviderWebhooksController {
    events;
    constructor(events) {
        this.events = events;
    }
    receive(kindParam, req, signature, query = {}) {
        const kind = kindParam.toUpperCase();
        if (!provider_env_1.WEBHOOK_KINDS.includes(kind))
            throw new common_1.NotFoundException();
        return this.events.ingest(kind, req.rawBody?.toString("utf8") ?? "", signature, { headers: req.headers ?? {}, query });
    }
    handshake(kindParam, query) {
        const kind = kindParam.toUpperCase();
        const vendor = (0, provider_env_2.providerConfig)(kind).mode === "real" ? (0, vendor_kit_1.vendorOf)(kind) : undefined;
        const challenge = vendor ? vendor_kit_1.VENDOR_WEBHOOKS[vendor].challenge?.(query, process.env.WHATSAPP_VERIFY_TOKEN ?? "") : null;
        if (challenge === null || challenge === undefined)
            throw new common_1.ForbiddenException({ code: "INVALID_VERIFY_TOKEN" });
        return challenge;
    }
};
exports.ProviderWebhooksController = ProviderWebhooksController;
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Post)(":kind"),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Param)("kind")),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Headers)(webhook_signature_1.SIGNATURE_HEADER)),
    __param(3, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String, Object]),
    __metadata("design:returntype", void 0)
], ProviderWebhooksController.prototype, "receive", null);
__decorate([
    (0, decorators_1.Public)(),
    (0, common_1.Get)(":kind"),
    __param(0, (0, common_1.Param)("kind")),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ProviderWebhooksController.prototype, "handshake", null);
exports.ProviderWebhooksController = ProviderWebhooksController = __decorate([
    (0, swagger_1.ApiTags)("provider-webhooks"),
    (0, common_1.Controller)("webhooks/providers"),
    __param(0, (0, common_1.Inject)(provider_events_service_1.ProviderEventsService)),
    __metadata("design:paramtypes", [provider_events_service_1.ProviderEventsService])
], ProviderWebhooksController);
//# sourceMappingURL=provider-webhooks.controller.js.map