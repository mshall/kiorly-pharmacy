import type { LotStatus } from "../../../generated/prisma/client";
export type LotBlockReason = "EXPIRED" | "RECALLED" | "QUARANTINE" | "NOT_AVAILABLE";
export interface LotLike {
    id: string;
    status: LotStatus;
    expiryDate: Date;
}
export declare function lotBlockReason(lot: LotLike, today?: Date): LotBlockReason | null;
export declare const isSellable: (lot: LotLike, today?: Date) => boolean;
export declare function assertSellable(lot: LotLike, today?: Date): void;
export type PickCandidate = LotLike & {
    receivedAt: Date;
    qtyOnHand: number;
    qtyReserved: number;
};
export declare function fefoOrder<T extends PickCandidate>(lots: T[], today?: Date): T[];
export interface PickLine {
    lotId: string;
    quantity: number;
}
export declare function allocateFefo<T extends PickCandidate>(lots: T[], qty: number, today?: Date): {
    picks: PickLine[];
    shortage: number;
};
