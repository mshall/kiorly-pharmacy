"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const me_preferences_controller_1 = require("./me-preferences.controller");
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_controller_1 = require("./auth.controller");
const auth_guard_1 = require("./auth.guard");
const token_verifier_1 = require("./token-verifier");
const passport_service_1 = require("./passport.service");
const passport_sessions_service_1 = require("./passport-sessions.service");
const handoff_store_1 = require("./handoff.store");
const permissions_service_1 = require("./permissions.service");
const tenant_mode_service_1 = require("../tenancy/tenant-mode.service");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({ controllers: [auth_controller_1.AuthController, me_preferences_controller_1.MePreferencesController], providers: [handoff_store_1.PrismaHandoffStore, token_verifier_1.TokenVerifier, passport_service_1.PassportService, passport_sessions_service_1.PassportSessions, permissions_service_1.PermissionsService, tenant_mode_service_1.TenantModeService, { provide: core_1.APP_GUARD, useClass: auth_guard_1.AuthGuard }], exports: [token_verifier_1.TokenVerifier, passport_service_1.PassportService, passport_sessions_service_1.PassportSessions, permissions_service_1.PermissionsService, tenant_mode_service_1.TenantModeService] })
], AuthModule);
//# sourceMappingURL=auth.module.js.map