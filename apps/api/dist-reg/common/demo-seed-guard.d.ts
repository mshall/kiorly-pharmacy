export type SeedEnv = Record<string, string | undefined>;
export declare class DemoSeedRefusedError extends Error {
    readonly reason: string;
    constructor(reason: string);
}
export declare function declaredEnvironment(env?: SeedEnv): string | null;
export declare function checkDemoSeedAllowed(env?: SeedEnv): string;
export declare function assertDemoSeedAllowed(label: string, env?: SeedEnv, log?: (m: string) => void): string;
