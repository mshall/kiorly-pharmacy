-- DropIndex
DROP INDEX "UomConversion_drugId_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "UomConversion_orgId_drugId_name_key" ON "UomConversion"("orgId", "drugId", "name");

