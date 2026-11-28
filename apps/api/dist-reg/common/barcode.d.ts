export declare function code128Modules(text: string): number[];
export declare function code128Svg(text: string, opts?: {
    height?: number;
    module?: number;
    label?: boolean;
}): string;
export declare const ean13Check: (d12: string) => number;
export declare const isEan13: (c: string) => boolean;
export declare function ean13Bits(code: string): string;
export declare function ean13Svg(code: string, opts?: {
    height?: number;
    module?: number;
}): string;
export declare const barcodeSvg: (code: string, o?: {
    height?: number;
}) => string;
