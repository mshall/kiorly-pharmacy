import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { TokenVerifier } from "./token-verifier";
import { PassportService } from "./passport.service";
import { PassportSessions } from "./passport-sessions.service";
import { PermissionsService } from "./permissions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";

@Global()
@Module({ controllers: [AuthController], providers: [TokenVerifier, PassportService, PassportSessions, PermissionsService, TenantModeService, { provide: APP_GUARD, useClass: AuthGuard }], exports: [TokenVerifier, PassportService, PassportSessions, PermissionsService, TenantModeService] })
export class AuthModule {}
