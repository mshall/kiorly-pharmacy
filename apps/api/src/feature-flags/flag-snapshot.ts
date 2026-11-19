import { signControlPlaneRequest, type FlagSnapshotShape, type SnapshotFlag } from "@kiorex/contracts";

/** Snapshot shapes come from @kiorex/contracts (the contract wins over INTEGRATION.md). */
export type FlagSnapshot = FlagSnapshotShape;
export type { SnapshotFlag };

/** Control-plane request signing (X-Kiorex-Product-Key + canonical HMAC; secret never sent). Timestamp is epoch ms. */
export function signSnapshotRequest(productKey: string, productSecret: string, path: string, now = Date.now(), nonce?: string) {
  return signControlPlaneRequest({ productKey, productSecret, method: "GET", path, timestamp: now, nonce }).headers;
}
