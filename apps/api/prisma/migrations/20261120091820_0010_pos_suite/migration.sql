-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "name" TEXT NOT NULL,
    "nameAr" TEXT,
    "kind" TEXT NOT NULL,
    "couponCode" TEXT,
    "drugIds" TEXT[],
    "params" JSONB NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endsAt" TIMESTAMP(3),
    "minSubtotal" DECIMAL(14,2),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionRedemption" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "saleId" TEXT NOT NULL,
    "patientId" TEXT,
    "discountAmount" DECIMAL(14,2) NOT NULL,
    "couponCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionRedemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HeldCart" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "patientId" TEXT,
    "payload" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'HELD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "HeldCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CashMovement" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "shiftId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "reason" TEXT NOT NULL,
    "refType" TEXT,
    "refId" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CashMovement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_orgId_active_startsAt_idx" ON "Promotion"("orgId", "active", "startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "Promotion_orgId_couponCode_key" ON "Promotion"("orgId", "couponCode");

-- CreateIndex
CREATE INDEX "PromotionRedemption_orgId_promotionId_idx" ON "PromotionRedemption"("orgId", "promotionId");

-- CreateIndex
CREATE INDEX "PromotionRedemption_saleId_idx" ON "PromotionRedemption"("saleId");

-- CreateIndex
CREATE INDEX "HeldCart_orgId_branchId_status_idx" ON "HeldCart"("orgId", "branchId", "status");

-- CreateIndex
CREATE INDEX "CashMovement_orgId_shiftId_idx" ON "CashMovement"("orgId", "shiftId");

-- CreateIndex
CREATE INDEX "CashMovement_orgId_branchId_createdAt_idx" ON "CashMovement"("orgId", "branchId", "createdAt");

