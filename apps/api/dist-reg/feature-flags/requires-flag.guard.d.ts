import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { FeatureFlagsService } from "./feature-flags.service";
export declare const REQUIRES_FLAG = "kx:requires-flag";
export declare const RequiresFlag: (key: string) => import("@nestjs/common").CustomDecorator<string>;
export declare class RequiresFlagGuard implements CanActivate {
    private readonly reflector;
    private readonly flags;
    constructor(reflector: Reflector, flags: FeatureFlagsService);
    canActivate(ctx: ExecutionContext): boolean;
}
