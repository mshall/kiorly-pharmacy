-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('REQUESTED', 'IN_TRANSIT', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "KiorexOrderStatus" AS ENUM ('RECEIVED', 'ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'READY', 'DISPENSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "SupplierLedgerType" AS ENUM ('INVOICE', 'PAYMENT', 'RETURN_CREDIT', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('WHATSAPP', 'SMS', 'EMAIL', 'PUSH');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('QUEUED', 'SENT', 'FAILED');

-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'KIOREX_PREPAID';

-- AlterTable
ALTER TABLE "Branch" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "code" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "receiptCounter" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ControlledSubstanceLogEntry" ADD COLUMN     "patientName" TEXT,
ADD COLUMN     "patientNationalIdHash" TEXT,
ADD COLUMN     "prescriptionId" TEXT;

-- AlterTable
ALTER TABLE "Dispensing" ADD COLUMN     "safetyChecksRunAt" TIMESTAMP(3),
ADD COLUMN     "saleId" TEXT;

-- AlterTable
ALTER TABLE "DispensingLine" ADD COLUMN     "unitPrice" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "vatRate" DECIMAL(5,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "sourceKey" TEXT,
ADD COLUMN     "vatRate" DECIMAL(5,4);

-- AlterTable
ALTER TABLE "OutboxEvent" ADD COLUMN     "dedupeKey" TEXT,
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3),
ADD COLUMN     "target" TEXT NOT NULL DEFAULT 'KIOREX';

-- AlterTable
ALTER TABLE "PatientRef" ADD COLUMN     "allergies" TEXT[],
ADD COLUMN     "birthYear" INTEGER;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "clinicRef" TEXT,
ADD COLUMN     "kiorexOrderId" TEXT,
ADD COLUMN     "prescriberRef" TEXT,
ADD COLUMN     "validatedAt" TIMESTAMP(3),
ADD COLUMN     "validatedBy" TEXT;

-- AlterTable
ALTER TABLE "PrescriptionLine" ADD COLUMN     "controlled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "drugName" TEXT,
ADD COLUMN     "qtyDispensed" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "PurchaseOrder" ADD COLUMN     "expectedAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "poNumber" TEXT,
ADD COLUMN     "sentVia" TEXT,
ADD COLUMN     "totalCost" DECIMAL(14,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "RecallNotice" ADD COLUMN     "affectedLots" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "clientCreatedAt" TIMESTAMP(3),
ADD COLUMN     "discountTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "offline" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "subtotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "vatTotal" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "voidReason" TEXT,
ADD COLUMN     "voidedAt" TIMESTAMP(3),
ADD COLUMN     "voidedBy" TEXT;

-- AlterTable
ALTER TABLE "SaleLine" ADD COLUMN     "vatAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "vatRate" DECIMAL(5,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "SalePayment" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'CAPTURED';

-- AlterTable
ALTER TABLE "SaleReturn" ADD COLUMN     "refundMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "saleLineId" TEXT;

-- AlterTable
ALTER TABLE "Shift" ADD COLUMN     "varianceAlerted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "zReport" JSONB;

-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN     "branchId" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "mfaEnrolled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "passwordHash" TEXT;

-- AlterTable
ALTER TABLE "StockLot" ADD COLUMN     "statusBeforeBlock" "LotStatus";

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "leadTimeDays" INTEGER NOT NULL DEFAULT 2;

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "onboardedAt" TIMESTAMP(3),
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "subscriptionStatus" TEXT NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "CustomerCreditEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "saleId" TEXT,
    "note" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerCreditEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReorderPolicy" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "minQty" INTEGER NOT NULL,
    "maxQty" INTEGER NOT NULL,
    "leadTimeDays" INTEGER NOT NULL DEFAULT 2,
    "supplierId" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReorderPolicy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierLedgerEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "type" "SupplierLedgerType" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "note" TEXT,
    "idempotencyKey" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierLedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceipt" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "supplierId" TEXT,
    "purchaseOrderId" TEXT,
    "invoiceNo" TEXT,
    "invoiceTotal" DECIMAL(14,2),
    "idempotencyKey" TEXT,
    "receivedBy" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoodsReceipt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoodsReceiptLine" (
    "id" TEXT NOT NULL,
    "receiptId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitCost" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "GoodsReceiptLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupplierReturn" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "creditAmount" DECIMAL(14,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SupplierReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExpiryAlert" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "thresholdDays" INTEGER NOT NULL,
    "notifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExpiryAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransfer" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "fromBranchId" TEXT NOT NULL,
    "toBranchId" TEXT NOT NULL,
    "status" "TransferStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedBy" TEXT NOT NULL,
    "dispatchedBy" TEXT,
    "receivedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispatchedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),

    CONSTRAINT "StockTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockTransferLine" (
    "id" TEXT NOT NULL,
    "transferId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "StockTransferLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BranchMarketplaceSetting" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "optedIn" BOOLEAN NOT NULL DEFAULT false,
    "deliveryRadiusKm" DECIMAL(5,2) NOT NULL DEFAULT 5,
    "openingHours" JSONB,
    "prepMinutes" INTEGER NOT NULL DEFAULT 30,
    "slaMinutes" INTEGER NOT NULL DEFAULT 10,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BranchMarketplaceSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KiorexOrder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "externalOrderId" TEXT NOT NULL,
    "status" "KiorexOrderStatus" NOT NULL DEFAULT 'RECEIVED',
    "hasRx" BOOLEAN NOT NULL DEFAULT false,
    "prescriptionId" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "deliveryAddress" TEXT,
    "prepaid" BOOLEAN NOT NULL DEFAULT true,
    "orderValue" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "slaDueAt" TIMESTAMP(3) NOT NULL,
    "respondedAt" TIMESTAMP(3),
    "respondedBy" TEXT,
    "rejectionReason" TEXT,
    "rejectionCode" TEXT,
    "readyAt" TIMESTAMP(3),
    "dispensingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KiorexOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KiorexOrderLine" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "qtyRequested" INTEGER NOT NULL,
    "qtyAccepted" INTEGER NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "KiorexOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InboundEvent" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "orgId" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InboundEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "recipient" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "body" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'QUEUED',
    "refType" TEXT,
    "refId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurerClaim" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "saleId" TEXT,
    "insurerName" TEXT NOT NULL,
    "memberRef" TEXT NOT NULL,
    "policyNo" TEXT,
    "amountClaimed" DECIMAL(14,2) NOT NULL,
    "patientCopay" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "status" "ClaimStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "resolvedAt" TIMESTAMP(3),
    "responseNote" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InsurerClaim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncConflict" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolvedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SyncConflict_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "kind" TEXT NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SettlementEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "orderRef" TEXT NOT NULL,
    "orderValue" DECIMAL(14,2) NOT NULL,
    "feeRate" DECIMAL(6,4) NOT NULL,
    "feeAmount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SettlementEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerCreditEntry_orgId_accountId_createdAt_idx" ON "CustomerCreditEntry"("orgId", "accountId", "createdAt");

-- CreateIndex
CREATE INDEX "ReorderPolicy_orgId_branchId_idx" ON "ReorderPolicy"("orgId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "ReorderPolicy_branchId_drugId_key" ON "ReorderPolicy"("branchId", "drugId");

-- CreateIndex
CREATE INDEX "SupplierLedgerEntry_orgId_supplierId_createdAt_idx" ON "SupplierLedgerEntry"("orgId", "supplierId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierLedgerEntry_orgId_idempotencyKey_key" ON "SupplierLedgerEntry"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "GoodsReceipt_orgId_branchId_receivedAt_idx" ON "GoodsReceipt"("orgId", "branchId", "receivedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GoodsReceipt_orgId_idempotencyKey_key" ON "GoodsReceipt"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "GoodsReceiptLine_receiptId_idx" ON "GoodsReceiptLine"("receiptId");

-- CreateIndex
CREATE INDEX "SupplierReturn_orgId_supplierId_idx" ON "SupplierReturn"("orgId", "supplierId");

-- CreateIndex
CREATE INDEX "ExpiryAlert_orgId_idx" ON "ExpiryAlert"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpiryAlert_lotId_thresholdDays_key" ON "ExpiryAlert"("lotId", "thresholdDays");

-- CreateIndex
CREATE INDEX "StockTransfer_orgId_status_idx" ON "StockTransfer"("orgId", "status");

-- CreateIndex
CREATE INDEX "StockTransferLine_transferId_idx" ON "StockTransferLine"("transferId");

-- CreateIndex
CREATE UNIQUE INDEX "BranchMarketplaceSetting_branchId_key" ON "BranchMarketplaceSetting"("branchId");

-- CreateIndex
CREATE INDEX "BranchMarketplaceSetting_orgId_idx" ON "BranchMarketplaceSetting"("orgId");

-- CreateIndex
CREATE INDEX "KiorexOrder_orgId_branchId_status_idx" ON "KiorexOrder"("orgId", "branchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "KiorexOrder_orgId_externalOrderId_key" ON "KiorexOrder"("orgId", "externalOrderId");

-- CreateIndex
CREATE INDEX "KiorexOrderLine_orderId_idx" ON "KiorexOrderLine"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "InboundEvent_eventId_key" ON "InboundEvent"("eventId");

-- CreateIndex
CREATE INDEX "Notification_orgId_createdAt_idx" ON "Notification"("orgId", "createdAt");

-- CreateIndex
CREATE INDEX "InsurerClaim_orgId_status_idx" ON "InsurerClaim"("orgId", "status");

-- CreateIndex
CREATE INDEX "SyncConflict_orgId_resolved_idx" ON "SyncConflict"("orgId", "resolved");

-- CreateIndex
CREATE UNIQUE INDEX "SyncConflict_orgId_idempotencyKey_key" ON "SyncConflict"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "WalletEntry_orgId_createdAt_idx" ON "WalletEntry"("orgId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WalletEntry_orgId_idempotencyKey_key" ON "WalletEntry"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "SettlementEntry_orgId_createdAt_idx" ON "SettlementEntry"("orgId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SettlementEntry_orgId_orderRef_key" ON "SettlementEntry"("orgId", "orderRef");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_orgId_code_key" ON "Branch"("orgId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "Drug_sourceKey_key" ON "Drug"("sourceKey");

-- CreateIndex
CREATE UNIQUE INDEX "OutboxEvent_orgId_dedupeKey_key" ON "OutboxEvent"("orgId", "dedupeKey");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseOrder_orgId_poNumber_key" ON "PurchaseOrder"("orgId", "poNumber");

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_email_key" ON "StaffUser"("email");

-- AddForeignKey
ALTER TABLE "CustomerCreditEntry" ADD CONSTRAINT "CustomerCreditEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "CustomerAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReorderPolicy" ADD CONSTRAINT "ReorderPolicy_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupplierLedgerEntry" ADD CONSTRAINT "SupplierLedgerEntry_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoodsReceiptLine" ADD CONSTRAINT "GoodsReceiptLine_receiptId_fkey" FOREIGN KEY ("receiptId") REFERENCES "GoodsReceipt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExpiryAlert" ADD CONSTRAINT "ExpiryAlert_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "StockLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockTransferLine" ADD CONSTRAINT "StockTransferLine_transferId_fkey" FOREIGN KEY ("transferId") REFERENCES "StockTransfer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KiorexOrderLine" ADD CONSTRAINT "KiorexOrderLine_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "KiorexOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- =============================================================================
-- FROZEN-v1 invariants (hand-written). ADR-025 safety controls enforced in the DB
-- as the last line of defence; services ALSO check.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX "Drug_brandName_trgm" ON "Drug" USING gin (lower("brandName") gin_trgm_ops);
CREATE INDEX "Drug_activeIngredient_trgm" ON "Drug" USING gin (lower("activeIngredient") gin_trgm_ops);
CREATE INDEX "Drug_brandNameAr_trgm" ON "Drug" USING gin (lower(coalesce("brandNameAr", '')) gin_trgm_ops);

-- Audit log is append-only.
CREATE TRIGGER audit_log_append_only BEFORE UPDATE OR DELETE ON "AuditLog"
  FOR EACH ROW EXECUTE FUNCTION kx_forbid_mutation();
-- Controlled-substance log is append-only (KPRX05).
CREATE TRIGGER controlled_log_append_only BEFORE UPDATE OR DELETE ON "ControlledSubstanceLogEntry"
  FOR EACH ROW EXECUTE FUNCTION kx_forbid_mutation();

-- Price history is retained: rows may only be closed (effectiveTo set once), never edited or deleted (KPCAT03).
CREATE OR REPLACE FUNCTION kx_price_book_history() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    RAISE EXCEPTION 'PriceBookEntry history is retained (DELETE not allowed)' USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  IF OLD."effectiveTo" IS NOT NULL
     OR NEW.price <> OLD.price OR NEW."effectiveFrom" <> OLD."effectiveFrom"
     OR NEW."drugId" <> OLD."drugId" OR NEW."orgId" <> OLD."orgId"
     OR NEW."branchId" IS DISTINCT FROM OLD."branchId" THEN
    RAISE EXCEPTION 'PriceBookEntry history is retained (only closing an open row is allowed)' USING ERRCODE = 'integrity_constraint_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER price_book_history BEFORE UPDATE OR DELETE ON "PriceBookEntry"
  FOR EACH ROW EXECUTE FUNCTION kx_price_book_history();

-- Rx safety checks must have run before a dispensing can be signed off / dispensed (KPRX03, never switchable).
ALTER TABLE "Dispensing" ADD CONSTRAINT dispensing_requires_safety_checks
  CHECK (status NOT IN ('SIGNED_OFF', 'DISPENSED') OR "safetyChecksRunAt" IS NOT NULL);

-- StockMovement is the ONLY way stock changes. The BEFORE INSERT trigger
--  * blocks outbound movements (SALE, DISPENSE, RESERVE, TRANSFER_OUT) on expired / recalled / quarantined lots (KPINV03),
--  * blocks DISPENSE without a signed-off dispensing (KPRX06),
--  * blocks negative stock unless a manager approver is recorded (KPINV03),
--  * maintains StockLot.qtyOnHand / qtyReserved atomically (projection of the ledger).
-- RESERVE / RELEASE_RESERVATION carry a POSITIVE qtyDelta = quantity reserved / released (qtyOnHand untouched).
CREATE OR REPLACE FUNCTION kx_stock_movement_apply() RETURNS trigger AS $$
DECLARE
  lot RECORD;
  new_on_hand integer;
  new_reserved integer;
  signed RECORD;
BEGIN
  SELECT id, status, "expiryDate", "qtyOnHand", "qtyReserved" INTO lot FROM "StockLot" WHERE id = NEW."lotId" FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'lot % not found', NEW."lotId" USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NEW.type IN ('SALE', 'DISPENSE', 'RESERVE', 'TRANSFER_OUT') THEN
    IF lot.status NOT IN ('AVAILABLE', 'RESERVED') THEN
      RAISE EXCEPTION 'lot % is % and cannot be sold or dispensed', NEW."lotId", lot.status USING ERRCODE = 'check_violation';
    END IF;
    IF lot."expiryDate" < CURRENT_DATE THEN
      RAISE EXCEPTION 'lot % expired on %', NEW."lotId", lot."expiryDate" USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.type = 'DISPENSE' THEN
    SELECT "pharmacistId", "signedOffAt" INTO signed FROM "Dispensing" WHERE id = NEW."refId";
    IF NOT FOUND OR signed."pharmacistId" IS NULL OR signed."signedOffAt" IS NULL THEN
      RAISE EXCEPTION 'DISPENSE movement requires a pharmacist-signed dispensing (pharmacist sign-off missing)' USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.type IN ('RESERVE', 'RELEASE_RESERVATION') THEN
    IF NEW."qtyDelta" <= 0 THEN
      RAISE EXCEPTION 'reservation movements carry a positive quantity' USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.type = 'RESERVE' THEN new_reserved := lot."qtyReserved" + NEW."qtyDelta"; ELSE new_reserved := lot."qtyReserved" - NEW."qtyDelta"; END IF;
    IF new_reserved < 0 THEN
      RAISE EXCEPTION 'reservation underflow on lot %', NEW."lotId" USING ERRCODE = 'check_violation';
    END IF;
    IF new_reserved > lot."qtyOnHand" AND NEW."managerApprovalBy" IS NULL THEN
      RAISE EXCEPTION 'cannot reserve more than on hand on lot %', NEW."lotId" USING ERRCODE = 'check_violation';
    END IF;
    UPDATE "StockLot" SET "qtyReserved" = new_reserved WHERE id = NEW."lotId";
    RETURN NEW;
  END IF;

  IF NEW.type IN ('SALE', 'DISPENSE', 'TRANSFER_OUT', 'RETURN_TO_SUPPLIER', 'EXPIRY_WRITE_OFF', 'RECALL_WRITE_OFF') AND NEW."qtyDelta" >= 0 THEN
    RAISE EXCEPTION '% movements must be negative', NEW.type USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.type IN ('RECEIPT', 'RETURN_FROM_CUSTOMER', 'TRANSFER_IN') AND NEW."qtyDelta" <= 0 THEN
    RAISE EXCEPTION '% movements must be positive', NEW.type USING ERRCODE = 'check_violation';
  END IF;

  new_on_hand := lot."qtyOnHand" + NEW."qtyDelta";
  IF new_on_hand < 0 AND NEW."managerApprovalBy" IS NULL THEN
    RAISE EXCEPTION 'negative stock on lot % requires manager approval', NEW."lotId" USING ERRCODE = 'check_violation';
  END IF;
  UPDATE "StockLot" SET "qtyOnHand" = new_on_hand WHERE id = NEW."lotId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movement_apply BEFORE INSERT ON "StockMovement"
  FOR EACH ROW EXECUTE FUNCTION kx_stock_movement_apply();

-- Rx-only / controlled drugs can only be sold through a signed-off dispensing (KPRX06).
CREATE OR REPLACE FUNCTION kx_sale_line_rx_rule() RETURNS trigger AS $$
DECLARE
  d RECORD;
  s RECORD;
  disp RECORD;
BEGIN
  SELECT "rxOnly", "controlledSchedule" INTO d FROM "Drug" WHERE id = NEW."drugId";
  IF d."rxOnly" OR d."controlledSchedule" <> 'NONE' THEN
    SELECT "dispensingId" INTO s FROM "Sale" WHERE id = NEW."saleId";
    IF s."dispensingId" IS NULL THEN
      RAISE EXCEPTION 'Rx-only drug cannot be sold without a pharmacist-signed dispensing (pharmacist sign-off missing)' USING ERRCODE = 'check_violation';
    END IF;
    SELECT "pharmacistId", "signedOffAt" INTO disp FROM "Dispensing" WHERE id = s."dispensingId";
    IF NOT FOUND OR disp."pharmacistId" IS NULL OR disp."signedOffAt" IS NULL THEN
      RAISE EXCEPTION 'Rx-only drug cannot be sold without pharmacist sign-off' USING ERRCODE = 'check_violation';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER sale_line_rx_rule BEFORE INSERT ON "SaleLine"
  FOR EACH ROW EXECUTE FUNCTION kx_sale_line_rx_rule();

-- A dispensing that contains a controlled-schedule drug cannot reach DISPENSED without a controlled-substance log entry (KPRX05).
-- Deferred so the service can insert the log row in the same transaction.
CREATE OR REPLACE FUNCTION kx_controlled_log_required() RETURNS trigger AS $$
BEGIN
  IF NEW.status = 'DISPENSED' AND EXISTS (
       SELECT 1 FROM "DispensingLine" dl JOIN "Drug" d ON d.id = dl."drugId"
       WHERE dl."dispensingId" = NEW.id AND d."controlledSchedule" <> 'NONE'
     ) AND NOT EXISTS (SELECT 1 FROM "ControlledSubstanceLogEntry" c WHERE c."dispensingId" = NEW.id) THEN
    RAISE EXCEPTION 'controlled-substance log entry required before DISPENSED' USING ERRCODE = 'check_violation';
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
CREATE CONSTRAINT TRIGGER dispensing_controlled_log_required
  AFTER INSERT OR UPDATE ON "Dispensing" DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION kx_controlled_log_required();
