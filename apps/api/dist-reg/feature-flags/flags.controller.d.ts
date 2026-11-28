import type { AuthUser } from "../auth/auth-user";
import { FeatureFlagsService } from "./feature-flags.service";
export declare class FlagsController {
    private readonly flags;
    constructor(flags: FeatureFlagsService);
    effective(u: AuthUser): {
        [k: string]: {
            enabled: boolean;
            scope: "global" | "market" | "org" | "dependency" | "launch-locked" | "entitlement" | null;
        };
    };
    changed(req: {
        rawBody?: Buffer;
    }, headers: Record<string, string>, _body: unknown): Promise<{
        accepted: boolean;
        refresh: "updated" | "not-modified" | "failed";
    }>;
}
