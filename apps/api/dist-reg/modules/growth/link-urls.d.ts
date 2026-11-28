type Env = NodeJS.ProcessEnv;
export type LinkProduct = "PHARMACY" | "LAB";
export declare function shortLinkBase(env?: Env): string;
export declare function shortUrl(code: string, env?: Env): string;
export declare function kiorexWebBase(env?: Env): string;
export declare const PRODUCT_LANDING_PATH: Record<LinkProduct, string>;
export interface LandingTarget {
    product: LinkProduct;
    lt?: string | null;
    channelKind?: string;
    tags?: unknown;
}
export declare function kiorexLandingUrl(t: LandingTarget, env?: Env): string;
export declare function allowedRedirectHosts(env?: Env): Set<string>;
export declare function assertAllowedRedirect(url: string, env?: Env): string;
export {};
