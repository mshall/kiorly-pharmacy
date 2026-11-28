import type { AuthUser } from "../../auth/auth-user";
import { SetupService } from "./setup.service";
declare class SkipDto {
    action: "skip" | "complete";
    entityId?: string;
}
export declare class SetupController {
    private readonly svc;
    constructor(svc: SetupService);
    get(u: AuthUser): Promise<import("./setup-plan").PlanDto>;
    step(u: AuthUser, key: string, b: SkipDto): Promise<import("./setup-plan").PlanDto>;
    dismiss(u: AuthUser): Promise<import("./setup-plan").PlanDto>;
}
export {};
