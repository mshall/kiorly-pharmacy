import assert from "node:assert/strict";
import type { Prisma, PrismaClient } from "@prisma/client";
import { rollbackTx } from "./tx";

/** FROZEN-v1 schema expectations (KX-06, PH-D02). Changes need a new named migration. */
export const schemaSmoke = {
  models: [
    "Drug", "SubstitutionGroup", "PriceBookEntry", "StockLot", "StockMovement", "RecallNotice", "ColdChainReading",
    "Supplier", "PurchaseOrder", "Prescription", "PrescriptionLine", "Dispensing", "DispensingLine", "SafetyCheckResult",
    "ControlledSubstanceLogEntry", "Shift", "Sale", "SaleLine", "SalePayment", "SaleReturn", "OutboxEvent", "AuditLog",
    "ReorderPolicy", "SupplierLedgerEntry", "GoodsReceipt", "SupplierReturn", "ExpiryAlert", "StockTransfer", "BranchMarketplaceSetting",
    "KiorexOrder", "InboundEvent", "Notification", "InsurerClaim", "SyncConflict", "WalletEntry", "SettlementEntry", "CustomerCreditEntry",
  ],
  /** Child/reference tables that inherit tenancy through a parent FK. */
  unscoped: [
    "Tenant", "SubstitutionGroup", "PurchaseOrderLine", "StockCountLine", "PrescriptionLine", "DispensingLine",
    "SafetyCheckResult", "SaleLine", "SalePayment", "SaleReturn", "FlagSnapshotCache", "GoodsReceiptLine", "StockTransferLine", "KiorexOrderLine", "InboundEvent",
  ],
  async invariants(prisma: PrismaClient) {
    const seed = async (tx: Prisma.TransactionClient, lot: { status?: "AVAILABLE" | "QUARANTINE" | "RECALLED"; expiry: Date }) => {
      const tenant = await tx.tenant.create({ data: { name: "t" } });
      const branch = await tx.branch.create({ data: { orgId: tenant.id, name: "b" } });
      const drug = await tx.drug.create({ data: { brandName: "X", activeIngredient: "ing", strength: "10mg", dosageForm: "tab", packSize: "10" } });
      const stockLot = await tx.stockLot.create({
        data: { orgId: tenant.id, branchId: branch.id, drugId: drug.id, lotNumber: "L1", expiryDate: lot.expiry, status: lot.status ?? "AVAILABLE", qtyOnHand: 10, unitCost: 5 },
      });
      const sale = await tx.sale.create({ data: { orgId: tenant.id, branchId: branch.id, idempotencyKey: "k1", soldBy: "u" } });
      return { tenant, branch, drug, stockLot, sale };
    };
    const day = 86_400_000;
    const line = (s: { sale: { id: string }; drug: { id: string }; stockLot: { id: string } }) => ({
      data: { saleId: s.sale.id, drugId: s.drug.id, lotId: s.stockLot.id, quantity: 1, unitPrice: 9 },
    });

    // expired lot cannot be sold (stop-ship: expired lot sale attempt fails)
    await assert.rejects(
      rollbackTx(prisma, async (tx) => { const s = await seed(tx, { expiry: new Date(Date.now() - day) }); await tx.saleLine.create(line(s)); }),
      /expired/,
    );
    // quarantined and recalled lots cannot be sold even if in date
    for (const status of ["QUARANTINE", "RECALLED"] as const) {
      await assert.rejects(
        rollbackTx(prisma, async (tx) => { const s = await seed(tx, { status, expiry: new Date(Date.now() + 30 * day) }); await tx.saleLine.create(line(s)); }),
        new RegExp(status),
      );
    }
    // an in-date AVAILABLE lot is sellable
    await rollbackTx(prisma, async (tx) => { const s = await seed(tx, { expiry: new Date(Date.now() + 30 * day) }); await tx.saleLine.create(line(s)); });

    // dispensing cannot reach SIGNED_OFF without pharmacist + timestamp (stop-ship: no sign-off fails)
    await assert.rejects(
      rollbackTx(prisma, async (tx) => {
        const s = await seed(tx, { expiry: new Date(Date.now() + 30 * day) });
        await tx.dispensing.create({ data: { orgId: s.tenant.id, branchId: s.branch.id, status: "SIGNED_OFF", createdBy: "u", safetyChecksRunAt: new Date() } });
      }),
      /dispensing_requires_signoff/,
    );
    await rollbackTx(prisma, async (tx) => {
      const s = await seed(tx, { expiry: new Date(Date.now() + 30 * day) });
      await tx.dispensing.create({ data: { orgId: s.tenant.id, branchId: s.branch.id, status: "SIGNED_OFF", pharmacistId: "p1", signedOffAt: new Date(), createdBy: "u", safetyChecksRunAt: new Date() } });
    });

    // stock ledger is append-only
    await assert.rejects(
      rollbackTx(prisma, async (tx) => {
        const s = await seed(tx, { expiry: new Date(Date.now() + 30 * day) });
        const m = await tx.stockMovement.create({ data: { orgId: s.tenant.id, branchId: s.branch.id, lotId: s.stockLot.id, type: "RECEIPT", qtyDelta: 10, performedBy: "u" } });
        await tx.stockMovement.update({ where: { id: m.id }, data: { qtyDelta: 999 } });
      }),
      /append-only/,
    );
  },
};
