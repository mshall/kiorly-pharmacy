-- CreateEnum
CREATE TYPE "PayLinkStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXPIRED', 'REFUND_PENDING', 'REFUNDED');

-- AlterEnum
ALTER TYPE "NotificationStatus" ADD VALUE 'DELIVERED';

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "deliveredAt" TIMESTAMP(3),
ADD COLUMN     "error" TEXT,
ADD COLUMN     "providerMessageId" TEXT;

-- CreateTable
CREATE TABLE "PayLink" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'EGP',
    "status" "PayLinkStatus" NOT NULL DEFAULT 'PENDING',
    "providerRef" TEXT,
    "payUrl" TEXT,
    "idempotencyKey" TEXT NOT NULL,
    "entryId" TEXT,
    "failureReason" TEXT,
    "refundedAmount" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "refundRef" TEXT,
    "refundAmount" DECIMAL(14,2),
    "expiresAt" TIMESTAMP(3),
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PayLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderWebhookEvent" (
    "id" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProviderWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PayLink_providerRef_idx" ON "PayLink"("providerRef");

-- CreateIndex
CREATE INDEX "PayLink_refundRef_idx" ON "PayLink"("refundRef");

-- CreateIndex
CREATE INDEX "PayLink_orgId_accountId_idx" ON "PayLink"("orgId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "PayLink_orgId_idempotencyKey_key" ON "PayLink"("orgId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "ProviderWebhookEvent_kind_eventId_key" ON "ProviderWebhookEvent"("kind", "eventId");

-- CreateIndex
CREATE INDEX "Notification_providerMessageId_idx" ON "Notification"("providerMessageId");

