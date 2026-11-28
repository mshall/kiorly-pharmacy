export declare function qrSvg(url: string, opts?: {
    color?: string;
    background?: string;
}): Promise<string>;
export declare function qrPng(url: string, width?: number): Promise<Buffer>;
