import type { Prisma } from "../../generated/prisma/client";
import { bumpLinkCounter } from "./link-counters";

/**
 * Partner side of the Kiorex product acquisition block (GRW-P4-B2, contracts 1.12.0 schema `ProductAcquisitionBlock`, copied from the Clinic convention, never imported across products).
 * The block is OPTIONAL and informational: a partner that gets none, or a malformed one, behaves exactly as before. It can only describe how Kiorex attributed the order; it never
 * changes the order, its price or its handling, and it carries no patient data. Counters: `orders` when the order is stored, `completed` when it is dispensed, once each per order,
 * and only for a PROVIDER_LED decision that cites a code of THIS organisation (another organisation's code is never credited).
 */
export type AcquisitionOrigin = "PROVIDER_LED" | "MARKETPLACE" | "UNATTRIBUTED";
export interface AcquisitionBlock { origin: AcquisitionOrigin; decisionId: string; policyVersion: string; reason: string; evidenceHash: string; linkCode?: string; product?: string }

const ORIGINS: readonly string[] = ["PROVIDER_LED", "MARKETPLACE", "UNATTRIBUTED"];
const LINK_CODE = /^[0-9A-HJKMNP-TV-Z]{8}$/;

/** Total function: a valid block or null (ignored, never an error: the contract says a partner that does not know the block ignores it). */
export function parseAcquisitionBlock(raw: unknown, product: "PHARMACY" | "LAB"): AcquisitionBlock | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const b = raw as Record<string, unknown>;
  if (typeof b.origin !== "string" || !ORIGINS.includes(b.origin)) return null;
  if (typeof b.decisionId !== "string" || b.decisionId.length < 1 || b.decisionId.length > 128) return null;
  if (typeof b.policyVersion !== "string" || b.policyVersion.length < 1 || b.policyVersion.length > 64) return null;
  if (typeof b.reason !== "string" || !/^[A-Z][A-Z0-9_]{2,63}$/.test(b.reason)) return null;
  if (typeof b.evidenceHash !== "string" || !/^[0-9a-f]{64}$/.test(b.evidenceHash)) return null;
  if (b.product !== undefined && b.product !== product) return null; // a block for another product is not for this partner
  if (b.linkCode !== undefined && (typeof b.linkCode !== "string" || !LINK_CODE.test(b.linkCode))) return null;
  return { origin: b.origin as AcquisitionOrigin, decisionId: b.decisionId, policyVersion: b.policyVersion, reason: b.reason, evidenceHash: b.evidenceHash, ...(b.linkCode ? { linkCode: b.linkCode as string } : {}), product };
}

export interface StoredAcquisition { acquisitionOrigin: string; acquisitionDecisionRef: string; acquisitionReason: string; acquisitionLinkId: string | null }

/** The columns to store with the order, and the link the decision cites when (and only when) that link belongs to this organisation. */
export async function acquisitionColumns(db: Pick<Prisma.TransactionClient, "providerReferralLink">, orgId: string, block: AcquisitionBlock): Promise<StoredAcquisition> {
  const link = block.origin === "PROVIDER_LED" && block.linkCode ? await db.providerReferralLink.findFirst({ where: { code: block.linkCode, orgId }, select: { id: true } }) : null;
  return { acquisitionOrigin: block.origin, acquisitionDecisionRef: block.decisionId, acquisitionReason: block.reason, acquisitionLinkId: link?.id ?? null };
}

type Counter = "orders" | "completed";
/** Idempotent: the order row is claimed with a conditional update, so a replay or a concurrent call counts once. Returns whether this call counted. */
export async function creditLinkOnce(tx: Prisma.TransactionClient, orgId: string, orderRowId: string, counter: Counter, at: Date = new Date()): Promise<boolean> {
  const field = counter === "orders" ? "acquisitionOrderCountedAt" : "acquisitionCompletedCountedAt";
  const o = await tx.kiorexOrder.findFirst({ where: { id: orderRowId, orgId }, select: { acquisitionLinkId: true, acquisitionOrigin: true } });
  if (!o || o.acquisitionOrigin !== "PROVIDER_LED" || !o.acquisitionLinkId) return false;
  const claimed = await tx.kiorexOrder.updateMany({ where: { id: orderRowId, orgId, [field]: null }, data: { [field]: at } });
  if (claimed.count !== 1) return false;
  await bumpLinkCounter(tx, { id: o.acquisitionLinkId, orgId }, counter, at);
  return true;
}
