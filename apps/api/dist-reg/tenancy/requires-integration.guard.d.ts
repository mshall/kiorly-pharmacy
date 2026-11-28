import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TenantModeService } from "./tenant-mode.service";
export declare class RequiresIntegrationGuard implements CanActivate {
    private readonly mode;
    constructor(mode: TenantModeService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
