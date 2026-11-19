ALTER TABLE "StockCountLine" ALTER COLUMN "qtyCounted" DROP NOT NULL;
ALTER TABLE "DispensingLine" ADD COLUMN "prescriptionLineId" TEXT;
