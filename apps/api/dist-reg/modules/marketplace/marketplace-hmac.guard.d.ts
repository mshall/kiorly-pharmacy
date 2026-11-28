import { CanActivate, ExecutionContext } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
export declare class MarketplaceHmacGuard implements CanActivate {
    private readonly prisma;
    private static readonly nonces;
    constructor(prisma: PrismaService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
