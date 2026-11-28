import { CanActivate, ExecutionContext } from "@nestjs/common";
import { PermissionsService } from "../../auth/permissions.service";
import { MobileDevicesService } from "./mobile-devices.service";
import { MobileEntitlementService } from "./mobile-entitlement.service";
import { isEntitlementExempt } from "./mobile-gate";
export { isEntitlementExempt };
export declare class MobileClientGuard implements CanActivate {
    private readonly devices;
    private readonly ent;
    private readonly perms;
    constructor(devices: MobileDevicesService, ent: MobileEntitlementService, perms: PermissionsService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
