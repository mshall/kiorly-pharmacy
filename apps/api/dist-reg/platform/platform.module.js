"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatformModule = void 0;
const common_1 = require("@nestjs/common");
const psp_adapter_1 = require("./adapters/psp.adapter");
const consent_adapter_1 = require("./adapters/consent.adapter");
const ai_adapter_1 = require("./adapters/ai.adapter");
const notifications_service_1 = require("./adapters/notifications.service");
const storage_adapter_1 = require("./adapters/storage.adapter");
const ai_gateway_1 = require("./adapters/ai.gateway");
const consent_service_1 = require("./adapters/consent.service");
const consent_controller_1 = require("./consent.controller");
const files_controller_1 = require("./files.controller");
let PlatformModule = class PlatformModule {
};
exports.PlatformModule = PlatformModule;
exports.PlatformModule = PlatformModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        controllers: [consent_controller_1.ConsentController, files_controller_1.FilesController],
        providers: [psp_adapter_1.pspProvider, consent_adapter_1.consentProvider, ai_gateway_1.AiGateway, ai_adapter_1.aiProvider, consent_service_1.ConsentService, notifications_service_1.NotificationsService, storage_adapter_1.StorageAdapter],
        exports: [psp_adapter_1.pspProvider, consent_adapter_1.consentProvider, ai_gateway_1.AiGateway, ai_adapter_1.aiProvider, consent_service_1.ConsentService, notifications_service_1.NotificationsService, storage_adapter_1.StorageAdapter],
    })
], PlatformModule);
//# sourceMappingURL=platform.module.js.map