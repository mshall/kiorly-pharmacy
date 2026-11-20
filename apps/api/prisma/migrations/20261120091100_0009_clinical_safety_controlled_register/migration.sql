-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SafetyCheckKind" ADD VALUE 'DOSE_RANGE';
ALTER TYPE "SafetyCheckKind" ADD VALUE 'PREGNANCY_LACTATION';
ALTER TYPE "SafetyCheckKind" ADD VALUE 'RENAL_HEPATIC';

-- AlterTable
ALTER TABLE "SafetyCheckResult" ADD COLUMN     "overridable" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "ClinicalRule" (
    "id" TEXT NOT NULL,
    "orgId" TEXT,
    "key" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "ingredient" TEXT NOT NULL,
    "ingredientB" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'MODERATE',
    "note" TEXT NOT NULL,
    "maxDailyMg" DECIMAL(10,2),
    "maxSingleMg" DECIMAL(10,2),
    "pediatricMaxMgPerKg" DECIMAL(8,2),
    "category" TEXT,
    "source" TEXT NOT NULL DEFAULT 'seed',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ClinicalRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlledRegisterEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "lotId" TEXT NOT NULL,
    "movementId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "qtyDelta" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "patientName" TEXT,
    "patientIdLast4" TEXT,
    "prescriptionId" TEXT,
    "prescriberLicenceNo" TEXT,
    "performedBy" TEXT NOT NULL,
    "witnessId" TEXT,
    "witnessName" TEXT,
    "reason" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlledRegisterEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlledDiscrepancy" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "expectedQty" INTEGER NOT NULL,
    "countedQty" INTEGER NOT NULL,
    "difference" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "notes" TEXT,
    "reportedBy" TEXT NOT NULL,
    "witnessId" TEXT,
    "resolvedBy" TEXT,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlledDiscrepancy_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ClinicalRule_key_key" ON "ClinicalRule"("key");

-- CreateIndex
CREATE INDEX "ClinicalRule_kind_ingredient_idx" ON "ClinicalRule"("kind", "ingredient");

-- CreateIndex
CREATE INDEX "ClinicalRule_orgId_idx" ON "ClinicalRule"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "ControlledRegisterEntry_movementId_key" ON "ControlledRegisterEntry"("movementId");

-- CreateIndex
CREATE INDEX "ControlledRegisterEntry_orgId_branchId_drugId_occurredAt_idx" ON "ControlledRegisterEntry"("orgId", "branchId", "drugId", "occurredAt");

-- CreateIndex
CREATE INDEX "ControlledRegisterEntry_orgId_occurredAt_idx" ON "ControlledRegisterEntry"("orgId", "occurredAt");

-- CreateIndex
CREATE INDEX "ControlledDiscrepancy_orgId_status_idx" ON "ControlledDiscrepancy"("orgId", "status");


-- Backfill the controlled register from the existing stock ledger (running balance per branch + drug).
INSERT INTO "ControlledRegisterEntry" ("id","orgId","branchId","drugId","lotId","movementId","kind","qtyDelta","balanceAfter","refType","refId","performedBy","reason","occurredAt")
SELECT 'bf_' || m."id", m."orgId", m."branchId", l."drugId", m."lotId", m."id", m."type"::text, m."qtyDelta",
       (SUM(m."qtyDelta") OVER (PARTITION BY m."branchId", l."drugId" ORDER BY m."occurredAt", m."id"))::int,
       m."refType", m."refId", m."performedBy", m."reason", m."occurredAt"
FROM "StockMovement" m JOIN "StockLot" l ON l."id" = m."lotId" JOIN "Drug" d ON d."id" = l."drugId"
WHERE d."controlledSchedule" <> 'NONE' AND m."type" NOT IN ('RESERVE','RELEASE_RESERVATION');
