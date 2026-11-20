-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'LOYALTY_POINTS';

-- AlterEnum
ALTER TYPE "StaffRole" ADD VALUE 'ASSISTANT';

-- AlterTable
ALTER TABLE "PatientRef" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "address" TEXT,
ADD COLUMN     "chronicConditions" TEXT[],
ADD COLUMN     "consentDataProcessing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "consentRecordedAt" TIMESTAMP(3),
ADD COLUMN     "consentRecordedBy" TEXT,
ADD COLUMN     "customerNo" TEXT,
ADD COLUMN     "dateOfBirth" DATE,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "hepaticImpairment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lactating" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lifetimeSpend" DECIMAL(14,2) NOT NULL DEFAULT 0,
ADD COLUMN     "loyaltyPoints" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "loyaltyTier" TEXT NOT NULL DEFAULT 'BRONZE',
ADD COLUMN     "medicalNotes" TEXT,
ADD COLUMN     "mergedIntoId" TEXT,
ADD COLUMN     "pregnant" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "renalImpairment" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "weightKg" DECIMAL(5,1);

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "exchangeOfSaleId" TEXT,
ADD COLUMN     "patientId" TEXT;

-- CreateTable
CREATE TABLE "CustomerNote" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'NOTE',
    "body" TEXT NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CustomerNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyLink" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "relatedPatientId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoyaltyEntry" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "saleId" TEXT,
    "note" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoyaltyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermissionOverride" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "role" "StaffRole" NOT NULL,
    "permission" TEXT NOT NULL,
    "granted" BOOLEAN NOT NULL,
    "updatedBy" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermissionOverride_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CustomerNote_orgId_patientId_createdAt_idx" ON "CustomerNote"("orgId", "patientId", "createdAt");

-- CreateIndex
CREATE INDEX "FamilyLink_orgId_patientId_idx" ON "FamilyLink"("orgId", "patientId");

-- CreateIndex
CREATE INDEX "FamilyLink_orgId_relatedPatientId_idx" ON "FamilyLink"("orgId", "relatedPatientId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyLink_patientId_relatedPatientId_key" ON "FamilyLink"("patientId", "relatedPatientId");

-- CreateIndex
CREATE INDEX "LoyaltyEntry_orgId_patientId_createdAt_idx" ON "LoyaltyEntry"("orgId", "patientId", "createdAt");

-- CreateIndex
CREATE INDEX "RolePermissionOverride_orgId_idx" ON "RolePermissionOverride"("orgId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermissionOverride_orgId_role_permission_key" ON "RolePermissionOverride"("orgId", "role", "permission");

-- CreateIndex
CREATE INDEX "PatientRef_orgId_displayName_idx" ON "PatientRef"("orgId", "displayName");

-- CreateIndex
CREATE UNIQUE INDEX "PatientRef_orgId_customerNo_key" ON "PatientRef"("orgId", "customerNo");

-- CreateIndex
CREATE INDEX "Sale_orgId_patientId_idx" ON "Sale"("orgId", "patientId");

