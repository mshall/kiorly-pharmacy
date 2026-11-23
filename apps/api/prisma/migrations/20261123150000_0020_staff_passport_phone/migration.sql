-- AlterTable
ALTER TABLE "StaffUser" ADD COLUMN "phone" TEXT;

-- CreateIndex
CREATE INDEX "StaffUser_phone_idx" ON "StaffUser"("phone");
