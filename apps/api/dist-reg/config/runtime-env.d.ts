type Env = Record<string, string | undefined>;
export declare const DEFAULT_API_PREFIX = "api/v1";
export declare function apiPrefix(env?: Env): string;
export declare function corsOrigins(env?: Env, localDefault?: string): string[];
export declare function corsNotice(env?: Env): string | null;
export declare function storageDirIsEphemeral(env?: Env, cwd?: string): boolean;
export declare function ephemeralStorageWarning(env?: Env, cwd?: string): string | null;
export declare function warnStartupConfig(log?: (message: string) => void, env?: Env): void;
export {};
