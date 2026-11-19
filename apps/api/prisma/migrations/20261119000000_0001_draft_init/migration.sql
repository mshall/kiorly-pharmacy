-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Edition" AS ENUM ('LITE', 'PRO', 'CHAIN', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "StaffRole" AS ENUM ('OWNER', 'PHARMACIST', 'CASHIER', 'BRANCH_MANAGER', 'CHAIN_OPS');

-- CreateEnum
CREATE TYPE "ControlledSchedule" AS ENUM ('NONE', 'SCHEDULE_1', 'SCHEDULE_2', 'SCHEDULE_3', 'SCHEDULE_4');

-- CreateEnum
CREATE TYPE "LotStatus" AS ENUM ('RECEIVED', 'AVAILABLE', 'RESERVED', 'DISPENSED', 'QUARANTINE', 'EXPIRED', 'RECALLED');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('RECEIPT', 'SALE', 'DISPENSE', 'RETURN_FROM_CUSTOMER', 'RETURN_TO_SUPPLIER', 'ADJUSTMENT', 'EXPIRY_WRITE_OFF', 'RECALL_WRITE_OFF', 'TRANSFER_OUT', 'TRANSFER_IN', 'RESERVE', 'RELEASE_RESERVATION', 'COUNT_VARIANCE');

-- CreateEnum
CREATE TYPE "PurchaseOrderStatus" AS ENUM ('DRAFT', 'SENT', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RecallStatus" AS ENUM ('ACTIVE', 'LIFTED');

-- CreateEnum
CREATE TYPE "StockCountType" AS ENUM ('CYCLE', 'FULL');

-- CreateEnum
CREATE TYPE "StockCountStatus" AS ENUM ('OPEN', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RxSource" AS ENUM ('PAPER_SCAN', 'KIORLY_E_RX', 'KIOREX_UPLOAD');

-- CreateEnum
CREATE TYPE "RxStatus" AS ENUM ('RECEIVED', 'VALIDATING', 'VALIDATED', 'REJECTED', 'PARTIALLY_DISPENSED', 'DISPENSED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "DispensingStatus" AS ENUM ('DRAFT', 'VALIDATED', 'RESERVED', 'SIGNED_OFF', 'DISPENSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "SafetyCheckKind" AS ENUM ('INTERACTION', 'ALLERGY', 'DUPLICATE_THERAPY', 'DOSE_QUANTITY', 'PRESCRIBER', 'CONTROLLED_LIMIT');

-- CreateEnum
CREATE TYPE "SafetyCheckOutcome" AS ENUM ('PASS', 'WARN', 'BLOCK', 'OVERRIDDEN_BY_PHARMACIST');

-- CreateEnum
CREATE TYPE "ShiftStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "SaleStatus" AS ENUM ('OPEN', 'COMPLETED', 'VOIDED', 'PARTIALLY_RETURNED', 'RETURNED');

-- CreateEnum
CREATE TYPE "SaleChannel" AS ENUM ('POS', 'KIOREX_ORDER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD', 'INSTAPAY', 'FAWRY', 'WALLET', 'CUSTOMER_CREDIT');

-- CreateEnum
CREATE TYPE "OutboxStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "externalOrgId" TEXT,
    "name" TEXT NOT NULL,
    "edition" "Edition" NOT NULL DEFAULT 'LITE',
    "marketCode" TEXT NOT NULL DEFAULT 'EG',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenceNo" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StaffUser" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "subject" TEXT,
    "displayName" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "pharmacistLicenceNo" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StaffUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Drug" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "brandName" TEXT NOT NULL,
    "brandNameAr" TEXT,
    "activeIngredient" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "dosageForm" TEXT NOT NULL,
    "packSize" TEXT NOT NULL,
    "gtin" TEXT,
    "manufacturer" TEXT,
    "rxOnly" BOOLEAN NOT NULL DEFAULT false,
    "controlledSchedule" "ControlledSchedule" NOT NULL DEFAULT 'NONE',
    "coldChain" BOOLEAN NOT NULL DEFAULT false,
    "otc" BOOLEAN NOT NULL DEFAULT false,
    "marketCodes" JSONB,
    "substitutionGroupId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Drug_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubstitutionGroup" (
    "id" TEXT NOT NULL,
    "activeIngredient" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "dosageForm" TEXT NOT NULL,

    CONSTRAINT "SubstitutionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceBookEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "branchId" TEXT,
    "price" DECIMAL(14,2) NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PriceBookEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Supplier" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "paymentTerms" TEXT,
    "creditLimit" DECIMAL(14,2),
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Supplier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "status" "PurchaseOrderStatus" NOT NULL DEFAULT 'DRAFT',
    "origin" TEXT NOT NULL DEFAULT 'MANUAL',
    "createdBy" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PurchaseOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseOrderLine" (
    "id" TEXT NOT NULL,
    "purchaseOrderId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "qtyOrdered" INTEGER NOT NULL,
    "qtyReceived" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(14,2) NOT NULL,

    CONSTRAINT "PurchaseOrderLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecallNotice" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotNumbers" TEXT[],
    "reason" TEXT NOT NULL,
    "source" TEXT,
    "status" "RecallStatus" NOT NULL DEFAULT 'ACTIVE',
    "enteredBy" TEXT NOT NULL,
    "enteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "liftedBy" TEXT,
    "liftedAt" TIMESTAMP(3),

    CONSTRAINT "RecallNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockLot" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotNumber" TEXT NOT NULL,
    "expiryDate" DATE NOT NULL,
    "status" "LotStatus" NOT NULL DEFAULT 'RECEIVED',
    "qtyOnHand" INTEGER NOT NULL DEFAULT 0,
    "qtyReserved" INTEGER NOT NULL DEFAULT 0,
    "unitCost" DECIMAL(14,2) NOT NULL,
    "supplierId" TEXT,
    "purchaseOrderId" TEXT,
    "supplierInvoiceNo" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "blockedReason" TEXT,
    "blockedAt" TIMESTAMP(3),
    "recallNoticeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockLot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockMovement" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "qtyDelta" INTEGER NOT NULL,
    "reason" TEXT,
    "refType" TEXT,
    "refId" TEXT,
    "managerApprovalBy" TEXT,
    "performedBy" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ColdChainReading" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "temperatureC" DECIMAL(5,2) NOT NULL,
    "excursion" BOOLEAN NOT NULL DEFAULT false,
    "recordedBy" TEXT NOT NULL,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ColdChainReading_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCount" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "type" "StockCountType" NOT NULL,
    "status" "StockCountStatus" NOT NULL DEFAULT 'OPEN',
    "startedBy" TEXT NOT NULL,
    "approvedBy" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "StockCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockCountLine" (
    "id" TEXT NOT NULL,
    "stockCountId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "qtyExpected" INTEGER NOT NULL,
    "qtyCounted" INTEGER NOT NULL,

    CONSTRAINT "StockCountLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientRef" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "externalId" TEXT,
    "displayName" TEXT NOT NULL,
    "phone" TEXT,
    "nationalIdHash" TEXT,
    "nationalIdLast4" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientRef_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "source" "RxSource" NOT NULL,
    "status" "RxStatus" NOT NULL DEFAULT 'RECEIVED',
    "patientId" TEXT,
    "sourceEventId" TEXT,
    "sourceRxRef" TEXT,
    "consentTokenHash" TEXT,
    "consentVerifiedAt" TIMESTAMP(3),
    "consentExpiresAt" TIMESTAMP(3),
    "prescriberName" TEXT,
    "prescriberLicenceNo" TEXT,
    "prescriberVerifiedBadge" BOOLEAN NOT NULL DEFAULT false,
    "issuedAt" TIMESTAMP(3),
    "validUntil" TIMESTAMP(3),
    "scanStorageKey" TEXT,
    "rejectionReason" TEXT,
    "receivedBy" TEXT,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionLine" (
    "id" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "drugId" TEXT,
    "activeIngredient" TEXT,
    "strength" TEXT,
    "dosageForm" TEXT,
    "quantity" INTEGER NOT NULL,
    "directions" TEXT,

    CONSTRAINT "PrescriptionLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dispensing" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "prescriptionId" TEXT,
    "patientId" TEXT,
    "status" "DispensingStatus" NOT NULL DEFAULT 'DRAFT',
    "pharmacistId" TEXT,
    "signedOffAt" TIMESTAMP(3),
    "counsellingNotes" TEXT,
    "kiorexOrderRef" TEXT,
    "controlledIdCaptured" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dispensedAt" TIMESTAMP(3),

    CONSTRAINT "Dispensing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DispensingLine" (
    "id" TEXT NOT NULL,
    "dispensingId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "substitutedFromDrugId" TEXT,
    "substitutionConsent" BOOLEAN NOT NULL DEFAULT false,
    "substitutionDecidedBy" TEXT,

    CONSTRAINT "DispensingLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SafetyCheckResult" (
    "id" TEXT NOT NULL,
    "dispensingId" TEXT NOT NULL,
    "kind" "SafetyCheckKind" NOT NULL,
    "outcome" "SafetyCheckOutcome" NOT NULL,
    "detail" TEXT,
    "overriddenBy" TEXT,
    "overrideReason" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SafetyCheckResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlledSubstanceLogEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "dispensingId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "patientNationalIdLast4" TEXT NOT NULL,
    "prescriberLicenceNo" TEXT,
    "pharmacistId" TEXT NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlledSubstanceLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "openedBy" TEXT NOT NULL,
    "closedBy" TEXT,
    "status" "ShiftStatus" NOT NULL DEFAULT 'OPEN',
    "openingFloat" DECIMAL(14,2) NOT NULL,
    "countedCash" DECIMAL(14,2),
    "expectedCash" DECIMAL(14,2),
    "variance" DECIMAL(14,2),
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sale" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "shiftId" TEXT,
    "channel" "SaleChannel" NOT NULL DEFAULT 'POS',
    "status" "SaleStatus" NOT NULL DEFAULT 'OPEN',
    "idempotencyKey" TEXT NOT NULL,
    "receiptNo" TEXT,
    "customerAccountId" TEXT,
    "dispensingId" TEXT,
    "total" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "soldBy" TEXT NOT NULL,
    "soldAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Sale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleLine" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(14,2) NOT NULL,
    "discount" DECIMAL(14,2) NOT NULL DEFAULT 0,

    CONSTRAINT "SaleLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalePayment" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reference" TEXT,
    "paidAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SalePayment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleReturn" (
    "id" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refund" DECIMAL(14,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "approvedBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAccount" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "creditLimit" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "balance" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OutboxEvent" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "aggregateType" TEXT NOT NULL,
    "aggregateId" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "OutboxStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "meta" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlagSnapshotCache" (
    "product" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "etag" TEXT,
    "body" JSONB NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlagSnapshotCache_pkey" PRIMARY KEY ("product")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_externalOrgId_key" ON "Tenant"("externalOrgId");

-- CreateIndex
CREATE INDEX "Branch_orgId_idx" ON "Branch"("orgId");

-- CreateIndex
CREATE INDEX "StaffUser_orgId_role_idx" ON "StaffUser"("orgId", "role");

-- CreateIndex
CREATE UNIQUE INDEX "StaffUser_orgId_subject_key" ON "StaffUser"("orgId", "subject");

-- CreateIndex
CREATE INDEX "Drug_orgId_activeIngredient_idx" ON "Drug"("orgId", "activeIngredient");

-- CreateIndex
CREATE INDEX "Drug_gtin_idx" ON "Drug"("gtin");

-- CreateIndex
CREATE UNIQUE INDEX "SubstitutionGroup_activeIngredient_strength_dosageForm_key" ON "SubstitutionGroup"("activeIngredient", "strength", "dosageForm");

-- CreateIndex
CREATE INDEX "PriceBookEntry_orgId_drugId_effectiveFrom_idx" ON "PriceBookEntry"("orgId", "drugId", "effectiveFrom");

-- CreateIndex
CREATE INDEX "Supplier_orgId_idx" ON "Supplier"("orgId");

-- CreateIndex
CREATE INDEX "PurchaseOrder_orgId_branchId_status_idx" ON "PurchaseOrder"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "PurchaseOrderLine_purchaseOrderId_idx" ON "PurchaseOrderLine"("purchaseOrderId");

-- CreateIndex
CREATE INDEX "RecallNotice_orgId_status_idx" ON "RecallNotice"("orgId", "status");

-- CreateIndex
CREATE INDEX "StockLot_branchId_drugId_status_expiryDate_idx" ON "StockLot"("branchId", "drugId", "status", "expiryDate");

-- CreateIndex
CREATE UNIQUE INDEX "StockLot_branchId_drugId_lotNumber_key" ON "StockLot"("branchId", "drugId", "lotNumber");

-- CreateIndex
CREATE INDEX "StockMovement_orgId_branchId_occurredAt_idx" ON "StockMovement"("orgId", "branchId", "occurredAt");

-- CreateIndex
CREATE INDEX "StockMovement_lotId_occurredAt_idx" ON "StockMovement"("lotId", "occurredAt");

-- CreateIndex
CREATE INDEX "StockMovement_refType_refId_idx" ON "StockMovement"("refType", "refId");

-- CreateIndex
CREATE INDEX "ColdChainReading_lotId_recordedAt_idx" ON "ColdChainReading"("lotId", "recordedAt");

-- CreateIndex
CREATE INDEX "StockCount_orgId_branchId_status_idx" ON "StockCount"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "StockCountLine_stockCountId_idx" ON "StockCountLine"("stockCountId");

-- CreateIndex
CREATE INDEX "PatientRef_orgId_phone_idx" ON "PatientRef"("orgId", "phone");

-- CreateIndex
CREATE INDEX "PatientRef_orgId_externalId_idx" ON "PatientRef"("orgId", "externalId");

-- CreateIndex
CREATE INDEX "Prescription_orgId_branchId_status_idx" ON "Prescription"("orgId", "branchId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Prescription_orgId_sourceEventId_key" ON "Prescription"("orgId", "sourceEventId");

-- CreateIndex
CREATE INDEX "PrescriptionLine_prescriptionId_idx" ON "PrescriptionLine"("prescriptionId");

-- CreateIndex
CREATE INDEX "Dispensing_orgId_branchId_status_idx" ON "Dispensing"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "Dispensing_prescriptionId_idx" ON "Dispensing"("prescriptionId");

-- CreateIndex
CREATE INDEX "DispensingLine_dispensingId_idx" ON "DispensingLine"("dispensingId");

-- CreateIndex
CREATE INDEX "DispensingLine_lotId_idx" ON "DispensingLine"("lotId");

-- CreateIndex
CREATE INDEX "SafetyCheckResult_dispensingId_idx" ON "SafetyCheckResult"("dispensingId");

-- CreateIndex
CREATE INDEX "ControlledSubstanceLogEntry_orgId_branchId_loggedAt_idx" ON "ControlledSubstanceLogEntry"("orgId", "branchId", "loggedAt");

-- CreateIndex
CREATE INDEX "Shift_orgId_branchId_status_idx" ON "Shift"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "Sale_orgId_branchId_soldAt_idx" ON "Sale"("orgId", "branchId", "soldAt");

-- CreateIndex
CREATE UNIQUE INDEX "Sale_orgId_idempotencyKey_key" ON "Sale"("orgId", "idempotencyKey");

-- CreateIndex
CREATE INDEX "SaleLine_saleId_idx" ON "SaleLine"("saleId");

-- CreateIndex
CREATE INDEX "SaleLine_lotId_idx" ON "SaleLine"("lotId");

-- CreateIndex
CREATE INDEX "SalePayment_saleId_idx" ON "SalePayment"("saleId");

-- CreateIndex
CREATE INDEX "SaleReturn_saleId_idx" ON "SaleReturn"("saleId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount_patientId_key" ON "CustomerAccount"("patientId");

-- CreateIndex
CREATE INDEX "CustomerAccount_orgId_idx" ON "CustomerAccount"("orgId");

-- CreateIndex
CREATE INDEX "OutboxEvent_status_occurredAt_idx" ON "OutboxEvent"("status", "occurredAt");

-- CreateIndex
CREATE INDEX "OutboxEvent_orgId_idx" ON "OutboxEvent"("orgId");

-- CreateIndex
CREATE INDEX "AuditLog_orgId_at_idx" ON "AuditLog"("orgId", "at");

-- CreateIndex
CREATE INDEX "AuditLog_entityType_entityId_idx" ON "AuditLog"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StaffUser" ADD CONSTRAINT "StaffUser_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Drug" ADD CONSTRAINT "Drug_substitutionGroupId_fkey" FOREIGN KEY ("substitutionGroupId") REFERENCES "SubstitutionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PriceBookEntry" ADD CONSTRAINT "PriceBookEntry_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrder" ADD CONSTRAINT "PurchaseOrder_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseOrderLine" ADD CONSTRAINT "PurchaseOrderLine_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLot" ADD CONSTRAINT "StockLot_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLot" ADD CONSTRAINT "StockLot_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockLot" ADD CONSTRAINT "StockLot_purchaseOrderId_fkey" FOREIGN KEY ("purchaseOrderId") REFERENCES "PurchaseOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockMovement" ADD CONSTRAINT "StockMovement_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "StockLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ColdChainReading" ADD CONSTRAINT "ColdChainReading_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "StockLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockCountLine" ADD CONSTRAINT "StockCountLine_stockCountId_fkey" FOREIGN KEY ("stockCountId") REFERENCES "StockCount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientRef"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionLine" ADD CONSTRAINT "PrescriptionLine_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionLine" ADD CONSTRAINT "PrescriptionLine_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dispensing" ADD CONSTRAINT "Dispensing_prescriptionId_fkey" FOREIGN KEY ("prescriptionId") REFERENCES "Prescription"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensingLine" ADD CONSTRAINT "DispensingLine_dispensingId_fkey" FOREIGN KEY ("dispensingId") REFERENCES "Dispensing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DispensingLine" ADD CONSTRAINT "DispensingLine_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "StockLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SafetyCheckResult" ADD CONSTRAINT "SafetyCheckResult_dispensingId_fkey" FOREIGN KEY ("dispensingId") REFERENCES "Dispensing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ControlledSubstanceLogEntry" ADD CONSTRAINT "ControlledSubstanceLogEntry_dispensingId_fkey" FOREIGN KEY ("dispensingId") REFERENCES "Dispensing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_customerAccountId_fkey" FOREIGN KEY ("customerAccountId") REFERENCES "CustomerAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleLine" ADD CONSTRAINT "SaleLine_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleLine" ADD CONSTRAINT "SaleLine_lotId_fkey" FOREIGN KEY ("lotId") REFERENCES "StockLot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalePayment" ADD CONSTRAINT "SalePayment_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleReturn" ADD CONSTRAINT "SaleReturn_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "Sale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccount" ADD CONSTRAINT "CustomerAccount_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "PatientRef"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- =============================================================================
-- DRAFT invariants (hand-written; ADR-025 safety controls enforced in the DB as
-- defence in depth. Services must ALSO check — these are the last line.)
-- =============================================================================

-- Stock ledger is append-only (corrections are new compensating movements).
CREATE OR REPLACE FUNCTION kx_forbid_mutation() RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION '% is append-only (% not allowed)', TG_TABLE_NAME, TG_OP USING ERRCODE = 'integrity_constraint_violation';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER stock_movement_append_only
  BEFORE UPDATE OR DELETE ON "StockMovement"
  FOR EACH ROW EXECUTE FUNCTION kx_forbid_mutation();

-- Pharmacist sign-off (user + timestamp) is mandatory once a dispensing is signed off / dispensed.
ALTER TABLE "Dispensing" ADD CONSTRAINT dispensing_requires_signoff
  CHECK (status NOT IN ('SIGNED_OFF', 'DISPENSED') OR ("pharmacistId" IS NOT NULL AND "signedOffAt" IS NOT NULL));

ALTER TABLE "StockLot" ADD CONSTRAINT stock_lot_reserved_nonnegative CHECK ("qtyReserved" >= 0);

-- Sale or dispense is impossible outside AVAILABLE/RESERVED, and never from an expired lot.
CREATE OR REPLACE FUNCTION kx_enforce_lot_sellable() RETURNS trigger AS $$
DECLARE
  lot RECORD;
BEGIN
  SELECT status, "expiryDate" INTO lot FROM "StockLot" WHERE id = NEW."lotId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'lot % not found', NEW."lotId" USING ERRCODE = 'foreign_key_violation';
  END IF;
  IF lot.status NOT IN ('AVAILABLE', 'RESERVED') THEN
    RAISE EXCEPTION 'lot % is % and cannot be sold or dispensed', NEW."lotId", lot.status USING ERRCODE = 'check_violation';
  END IF;
  IF lot."expiryDate" < CURRENT_DATE THEN
    RAISE EXCEPTION 'lot % expired on %', NEW."lotId", lot."expiryDate" USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sale_line_lot_sellable
  BEFORE INSERT ON "SaleLine"
  FOR EACH ROW EXECUTE FUNCTION kx_enforce_lot_sellable();

CREATE TRIGGER dispensing_line_lot_sellable
  BEFORE INSERT ON "DispensingLine"
  FOR EACH ROW EXECUTE FUNCTION kx_enforce_lot_sellable();
