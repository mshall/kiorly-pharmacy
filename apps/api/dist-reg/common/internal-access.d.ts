type Req = {
    headers?: Record<string, string | string[] | undefined>;
    socket?: {
        remoteAddress?: string;
    };
};
export declare function isPrivateAddress(raw: string | undefined): boolean;
export declare function hasInternalHealthAccess(req: Req, env?: Record<string, string | undefined>): boolean;
export {};
