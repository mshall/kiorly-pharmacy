import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { TokenVerifier } from "./token-verifier";
import { PermissionsService } from "./permissions.service";
import { TenantModeService } from "../tenancy/tenant-mode.service";

@Global()
@Module({ controllers: [AuthController], providers: [TokenVerifier, PermissionsService, TenantModeService, { provide: APP_GUARD, useClass: AuthGuard }], exports: [TokenVerifier, PermissionsService, TenantModeService] })
export class AuthModule {}
