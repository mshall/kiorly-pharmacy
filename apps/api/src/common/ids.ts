import { randomBytes } from "node:crypto";

/** cuid-like sortable id (time prefix + random) for ids generated in app code (outbox event ids). */
export function createId(): string {
  return `c${Date.now().toString(36)}${randomBytes(9).toString("hex")}`;
}
