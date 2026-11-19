import { Global, Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";
import { AuthController } from "./auth.controller";
import { AuthGuard } from "./auth.guard";
import { TokenVerifier } from "./token-verifier";

@Global()
@Module({ controllers: [AuthController], providers: [TokenVerifier, { provide: APP_GUARD, useClass: AuthGuard }], exports: [TokenVerifier] })
export class AuthModule {}
