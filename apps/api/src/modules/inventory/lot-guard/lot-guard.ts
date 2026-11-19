import type { LotStatus } from "@prisma/client";
import { DomainError } from "../../../common/errors";

/**
 * SAFETY PATH (ADR-025; never behind a feature flag): expired, recalled and quarantined lots can never be sold or dispensed.
 * Service-level check — the DB trigger `kx_stock_movement_apply` / `kx_enforce_lot_sellable` is the independent last line.
 * Controls: safety.pharmacy.lot_expiry_block, lot_recall_block, lot_quarantine_block.
 */
export type LotBlockReason = "EXPIRED" | "RECALLED" | "QUARANTINE" | "NOT_AVAILABLE";

export interface LotLike { id: string; status: LotStatus; expiryDate: Date }

const dayStart = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

/** Returns why the lot may not be sold/dispensed, or null if sellable. `today` is injectable for tests. */
export function lotBlockReason(lot: LotLike, today: Date = new Date()): LotBlockReason | null {
  if (lot.status === "RECALLED") return "RECALLED";
  if (lot.status === "QUARANTINE") return "QUARANTINE";
  if (lot.status === "EXPIRED") return "EXPIRED";
  if (dayStart(lot.expiryDate) < dayStart(today)) return "EXPIRED";
  if (lot.status !== "AVAILABLE" && lot.status !== "RESERVED") return "NOT_AVAILABLE";
  return null;
}

export const isSellable = (lot: LotLike, today?: Date): boolean => lotBlockReason(lot, today) === null;

export function assertSellable(lot: LotLike, today?: Date): void {
  const reason = lotBlockReason(lot, today);
  if (reason) throw new DomainError("LOT_BLOCKED", `Lot cannot be sold or dispensed: ${reason}`, 409, { lotId: lot.id, reason });
}

export type PickCandidate = LotLike & { receivedAt: Date; qtyOnHand: number; qtyReserved: number };

/** KPINV02: FEFO order = earliest expiry first, ties by earliest received; only sellable lots with free quantity are candidates. */
export function fefoOrder<T extends PickCandidate>(lots: T[], today?: Date): T[] {
  return lots
    .filter((l) => isSellable(l, today) && l.qtyOnHand - l.qtyReserved > 0)
    .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime() || a.receivedAt.getTime() - b.receivedAt.getTime() || a.id.localeCompare(b.id));
}

export interface PickLine { lotId: string; quantity: number }
/** Allocates `qty` across FEFO-ordered lots. `shortage` > 0 when stock is insufficient. */
export function allocateFefo<T extends PickCandidate>(lots: T[], qty: number, today?: Date): { picks: PickLine[]; shortage: number } {
  let remaining = qty;
  const picks: PickLine[] = [];
  for (const l of fefoOrder(lots, today)) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, l.qtyOnHand - l.qtyReserved);
    picks.push({ lotId: l.id, quantity: take });
    remaining -= take;
  }
  return { picks, shortage: Math.max(remaining, 0) };
}
