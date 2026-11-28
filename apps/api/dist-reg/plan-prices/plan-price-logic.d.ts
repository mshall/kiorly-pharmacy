export declare const PRICE_EDITIONS: readonly ["LITE", "PRO", "CHAIN"];
export type PriceEdition = (typeof PRICE_EDITIONS)[number];
export declare const PRICE_INTERVALS: readonly ["MONTHLY", "ANNUAL"];
export type PriceInterval = (typeof PRICE_INTERVALS)[number];
export interface PriceRequest {
    edition: PriceEdition;
    marketCode: string;
    interval: PriceInterval;
    currency: string;
    amount: string;
    validFrom: Date;
    preview: boolean;
    actorId: string;
    approval: {
        proposalId: string;
        proposedBy: string;
    } | null;
}
export declare function parsePriceRequest(raw: unknown, now: Date): PriceRequest;
export interface SegmentRow {
    id: string;
    priceVersion: number;
    validFrom: Date;
    validTo: Date | null;
    amount: string;
    currency: string;
}
export declare const activeAt: (rows: readonly SegmentRow[], at: Date) => SegmentRow[];
export declare function planNextVersion(rows: readonly SegmentRow[], validFrom: Date): {
    priceVersion: number;
    supersedes: SegmentRow[];
};
