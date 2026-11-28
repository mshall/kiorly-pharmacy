import type { INestApplication } from "@nestjs/common";
type Env = Record<string, string | undefined>;
export declare function swaggerEnabled(env?: Env): boolean;
export declare function trustedProxyHops(env?: Env): number;
export declare function securityHeaderMap(env?: Env): Record<string, string>;
export declare function securityHeaders(env?: Env): (req: {
    path?: string;
    url?: string;
}, res: {
    setHeader(k: string, v: string): void;
    removeHeader?(k: string): void;
}, next: () => void) => void;
export declare function applyHttpHardening(app: INestApplication, env?: Env): void;
export declare function secretsEqual(a: string | undefined, b: string | undefined): boolean;
export {};
