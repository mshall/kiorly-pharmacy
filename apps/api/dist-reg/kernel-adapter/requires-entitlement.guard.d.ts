import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { type Capability, type EntitlementsPort } from "./ports";
export declare const REQUIRES_ENTITLEMENT = "kx:entitlement";
export declare const RequiresEntitlement: (cap: Capability) => import("@nestjs/common").CustomDecorator<string>;
export declare class RequiresEntitlementGuard implements CanActivate {
    private readonly reflector;
    private readonly ent;
    constructor(reflector: Reflector, ent: EntitlementsPort);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
