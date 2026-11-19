import { createHash, createHmac } from "node:crypto";

/** Shape of GET /control/v1/flags/snapshot (INTEGRATION.md). The contract in kiorex-contracts wins when it lands. */
export interface SnapshotFlag {
  key: string;
  class?: string;
  scopes?: string[];
  dependsOn?: string[];
  launchLocked?: boolean;
  gateSatisfied?: boolean;
  values?: { global?: "ON" | "OFF"; markets?: Record<string, "ON" | "OFF">; orgs?: Record<string, "ON" | "OFF"> };
  expiresAt?: string;
}
export interface FlagSnapshot {
  product: string;
  version: number | string;
  generatedAt: string;
  flags: SnapshotFlag[];
  signature?: string;
}

/** Same scheme as the Kiorly marketplace HMAC (canonical string, base64url HMAC-SHA256). ASSUMPTION: header names to be confirmed against kiorex-contracts. */
export function signControlRequest(secret: string, input: { timestamp: string; nonce: string; method: string; path: string; body?: string }): string {
  const bodySha256 = createHash("sha256").update(input.body ?? "").digest("hex");
  const canonical = `${input.timestamp}\n${input.nonce}\n${input.method.toUpperCase()}\n${input.path}\n${bodySha256}`;
  return createHmac("sha256", secret).update(canonical).digest("base64url");
}
