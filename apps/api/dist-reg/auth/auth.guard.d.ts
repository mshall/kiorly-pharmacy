import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../prisma/prisma.service";
import { TokenVerifier } from "./token-verifier";
import { PassportService } from "./passport.service";
import { PassportSessions } from "./passport-sessions.service";
import { PermissionsService } from "./permissions.service";
export declare class AuthGuard implements CanActivate {
    private readonly reflector;
    private readonly prisma;
    private readonly tokens;
    private readonly perms;
    private readonly passport?;
    private readonly sessions?;
    constructor(reflector: Reflector, prisma: PrismaService, tokens: TokenVerifier, perms: PermissionsService, passport?: PassportService | undefined, sessions?: PassportSessions | undefined);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
