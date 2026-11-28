export interface Gs1 {
    gtin?: string;
    expiry?: string;
    lot?: string;
    serial?: string;
}
export declare function parseGs1(code: string): Gs1;
