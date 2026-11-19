import { Inject, Injectable } from "@nestjs/common";
import { Prisma, type PrismaClient, type StockMovementType, type StockLot } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";
import { DomainError } from "../../common/errors";
import { allocateFefo, assertSellable, type PickLine } from "./lot-guard/lot-guard";

type Tx = Prisma.TransactionClient;
type Db = PrismaClient | Tx;

const OUTBOUND: ReadonlySet<StockMovementType> = new Set(["SALE", "DISPENSE", "RESERVE", "TRANSFER_OUT"]);
const NEGATIVE_FIXED: ReadonlySet<StockMovementType> = new Set(["SALE", "DISPENSE", "TRANSFER_OUT", "RETURN_TO_SUPPLIER", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF"]);
const POSITIVE_FIXED: ReadonlySet<StockMovementType> = new Set(["RECEIPT", "RETURN_FROM_CUSTOMER", "TRANSFER_IN"]);

export interface PostMovement {
  orgId: string;
  branchId: string;
  lotId: string;
  type: StockMovementType;
  /** Magnitude (> 0) for typed movements; signed for ADJUSTMENT / COUNT_VARIANCE. */
  quantity: number;
  performedBy: string;
  reason?: string;
  refType?: string;
  refId?: string;
  /** Manager who approved going below zero / over-reserving (KPINV03). */
  approvedBy?: string;
  /** SALE/DISPENSE that consumes its own earlier reservation: skip the free-quantity check. */
  fromReservation?: boolean;
}

/**
 * The stock ledger (KPINV). StockMovement is append-only and is the ONLY way stock changes; qtyOnHand/qtyReserved are a projection
 * maintained by the `kx_stock_movement_apply` trigger. This service adds friendly pre-checks + row locking; the trigger is the last line.
 */
@Injectable()
export class StockLedger {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  /** SELECT ... FOR UPDATE on the lot row (serialises concurrent sales on the same lot). */
  async lockLot(tx: Tx, lotId: string, orgId: string): Promise<StockLot> {
    const rows = await tx.$queryRaw<StockLot[]>`SELECT * FROM "StockLot" WHERE id = ${lotId} AND "orgId" = ${orgId} FOR UPDATE`;
    if (!rows[0]) throw new DomainError("LOT_NOT_FOUND", `Lot ${lotId} not found`, 404);
    return rows[0];
  }

  async post(tx: Tx, m: PostMovement) {
    if (!Number.isInteger(m.quantity) || m.quantity === 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be a non-zero integer", 400);
    const signedFree = m.type === "ADJUSTMENT" || m.type === "COUNT_VARIANCE";
    if (!signedFree && m.quantity < 0) throw new DomainError("INVALID_QUANTITY", "Quantity must be positive", 400);
    const lot = await this.lockLot(tx, m.lotId, m.orgId);
    if (lot.branchId !== m.branchId) throw new DomainError("LOT_BRANCH_MISMATCH", "Lot belongs to another branch", 409);

    if (OUTBOUND.has(m.type)) assertSellable(lot); // SAFETY: expired / recalled / quarantined (service check; DB trigger is the backstop)

    let qtyDelta = m.quantity;
    if (NEGATIVE_FIXED.has(m.type)) qtyDelta = -Math.abs(m.quantity);
    else if (POSITIVE_FIXED.has(m.type)) qtyDelta = Math.abs(m.quantity);

    let usedApproval = false;
    const needsApproval = (violates: boolean, err: DomainError) => {
      if (!violates) return;
      if (!m.approvedBy) throw err;
      usedApproval = true;
    };
    if (m.type === "SALE" || m.type === "RESERVE" || m.type === "TRANSFER_OUT" || (m.type === "DISPENSE" && !m.fromReservation)) {
      const free = lot.qtyOnHand - lot.qtyReserved;
      needsApproval(Math.abs(qtyDelta) > free, new DomainError("INSUFFICIENT_STOCK", `Only ${Math.max(free, 0)} available on lot ${lot.lotNumber}`, 409, { lotId: lot.id, available: Math.max(free, 0), requested: Math.abs(qtyDelta) }));
    }
    if (m.type === "DISPENSE" && m.fromReservation) {
      needsApproval(lot.qtyOnHand + qtyDelta < 0, new DomainError("INSUFFICIENT_STOCK", `Lot ${lot.lotNumber} has insufficient stock`, 409, { lotId: lot.id }));
    }
    if (signedFree && qtyDelta < 0) {
      needsApproval(lot.qtyOnHand + qtyDelta < 0, new DomainError("NEGATIVE_STOCK_REQUIRES_APPROVAL", "Stock would go negative; manager approval required", 409, { lotId: lot.id }));
    }

    const row = await tx.stockMovement.create({
      data: {
        orgId: m.orgId, branchId: m.branchId, lotId: m.lotId, type: m.type, qtyDelta, reason: m.reason, refType: m.refType, refId: m.refId,
        managerApprovalBy: m.approvedBy, performedBy: m.performedBy,
      },
    });
    if (usedApproval) {
      await tx.auditLog.create({ data: { orgId: m.orgId, actorId: m.performedBy, action: "stock.negative_approved", entityType: "StockLot", entityId: m.lotId, meta: { approvedBy: m.approvedBy ?? null, movementId: row.id, qty: qtyDelta } } });
    }
    return row;
  }

  /** Sellable lots for (branch, drug) with free stock, FEFO ordered. */
  async candidateLots(db: Db, orgId: string, branchId: string, drugId: string) {
    return db.stockLot.findMany({ where: { orgId, branchId, drugId, status: { in: ["AVAILABLE", "RESERVED"] }, qtyOnHand: { gt: 0 } } });
  }

  /** KPINV02 suggested pick: earliest-expiry AVAILABLE lot(s). */
  async fefoPlan(db: Db, orgId: string, branchId: string, drugId: string, qty: number): Promise<{ picks: Array<PickLine & { lotNumber: string; expiryDate: Date }>; shortage: number }> {
    const lots = await this.candidateLots(db, orgId, branchId, drugId);
    const { picks, shortage } = allocateFefo(lots, qty);
    const by = new Map(lots.map((l) => [l.id, l]));
    return { picks: picks.map((p) => ({ ...p, lotNumber: by.get(p.lotId)!.lotNumber, expiryDate: by.get(p.lotId)!.expiryDate })), shortage };
  }
}
