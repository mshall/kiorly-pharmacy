import { type FlagSnapshotShape, type SnapshotFlag } from "@kiorex/contracts";
export type FlagSnapshot = FlagSnapshotShape;
export type { SnapshotFlag };
export declare function signSnapshotRequest(productKey: string, productSecret: string, path: string, now?: number, nonce?: string): Record<string, string>;
