export interface SigV4Input {
    method: string;
    url: string;
    body: string;
    region: string;
    service: string;
    accessKeyId: string;
    secretAccessKey: string;
    sessionToken?: string;
    headers?: Record<string, string>;
    now?: Date;
}
export declare function signV4(i: SigV4Input): Record<string, string>;
export declare const awsRegionFromHost: (host: string) => string | undefined;
