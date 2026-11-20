-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RxSource" ADD VALUE 'MANUAL_ENTRY';
ALTER TYPE "RxSource" ADD VALUE 'TRANSFER_IN';

-- AlterEnum
ALTER TYPE "RxStatus" ADD VALUE 'TRANSFERRED_OUT';

-- AlterTable
ALTER TABLE "Dispensing" ADD COLUMN     "counsellingTopics" TEXT[],
ADD COLUMN     "partialReason" TEXT;

-- AlterTable
ALTER TABLE "Prescription" ADD COLUMN     "nextRefillDueAt" TIMESTAMP(3),
ADD COLUMN     "prescriberId" TEXT,
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'NORMAL',
ADD COLUMN     "refillIntervalDays" INTEGER,
ADD COLUMN     "refillsAllowed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refillsUsed" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "transferredOutAt" TIMESTAMP(3),
ADD COLUMN     "verificationNotes" TEXT;

-- CreateTable
CREATE TABLE "Prescriber" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "licenceNo" TEXT NOT NULL,
    "specialty" TEXT,
    "phone" TEXT,
    "clinicName" TEXT,
    "clinicAddress" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedBy" TEXT,
    "verifiedAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prescriber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RxRefill" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "refillNo" INTEGER NOT NULL,
    "early" BOOLEAN NOT NULL DEFAULT false,
    "earlyReason" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RxRefill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefillReminder" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "refillNo" INTEGER NOT NULL,
    "notificationId" TEXT,
    "sentAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RefillReminder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RxTransfer" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "prescriptionId" TEXT NOT NULL,
    "counterpartyName" TEXT NOT NULL,
    "counterpartyPhone" TEXT,
    "counterpartyPharmacist" TEXT,
    "counterpartyLicenceNo" TEXT,
    "reason" TEXT,
    "snapshot" JSONB,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RxTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Prescriber_orgId_name_idx" ON "Prescriber"("orgId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Prescriber_orgId_licenceNo_key" ON "Prescriber"("orgId", "licenceNo");

-- CreateIndex
CREATE INDEX "RxRefill_orgId_prescriptionId_idx" ON "RxRefill"("orgId", "prescriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "RxRefill_prescriptionId_refillNo_key" ON "RxRefill"("prescriptionId", "refillNo");

-- CreateIndex
CREATE INDEX "RefillReminder_orgId_idx" ON "RefillReminder"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "RefillReminder_prescriptionId_refillNo_key" ON "RefillReminder"("prescriptionId", "refillNo");

-- CreateIndex
CREATE INDEX "RxTransfer_orgId_direction_createdAt_idx" ON "RxTransfer"("orgId", "direction", "createdAt");

-- CreateIndex
CREATE INDEX "RxTransfer_prescriptionId_idx" ON "RxTransfer"("prescriptionId");

-- CreateIndex
CREATE INDEX "Prescription_orgId_prescriberId_idx" ON "Prescription"("orgId", "prescriberId");

-- CreateIndex
CREATE INDEX "Prescription_orgId_patientId_idx" ON "Prescription"("orgId", "patientId");

-- CreateIndex
CREATE INDEX "Prescription_orgId_nextRefillDueAt_idx" ON "Prescription"("orgId", "nextRefillDueAt");

