import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare function readPlansAdminCredential(env?: NodeJS.ProcessEnv): {
    key: string;
    secret: string;
} | null;
export declare class PlatformAdminHmacGuard implements CanActivate {
    private static readonly nonces;
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
