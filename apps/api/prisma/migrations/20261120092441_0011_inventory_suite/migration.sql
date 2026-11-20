-- AlterTable
ALTER TABLE "Drug" ADD COLUMN     "baseUnit" TEXT NOT NULL DEFAULT 'pack',
ADD COLUMN     "category" TEXT;

-- AlterTable
ALTER TABLE "StockLot" ADD COLUMN     "locationId" TEXT;

-- AlterTable
ALTER TABLE "StockMovement" ADD COLUMN     "reasonCode" TEXT;

-- CreateTable
CREATE TABLE "ShelfLocation" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT,
    "kind" TEXT NOT NULL DEFAULT 'SHELF',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShelfLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UomConversion" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "drugId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "factor" INTEGER NOT NULL,
    "barcode" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UomConversion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ShelfLocation_orgId_branchId_idx" ON "ShelfLocation"("orgId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "ShelfLocation_branchId_code_key" ON "ShelfLocation"("branchId", "code");

-- CreateIndex
CREATE INDEX "UomConversion_orgId_drugId_idx" ON "UomConversion"("orgId", "drugId");

-- CreateIndex
CREATE UNIQUE INDEX "UomConversion_drugId_name_key" ON "UomConversion"("drugId", "name");

-- AddForeignKey
ALTER TABLE "UomConversion" ADD CONSTRAINT "UomConversion_drugId_fkey" FOREIGN KEY ("drugId") REFERENCES "Drug"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

