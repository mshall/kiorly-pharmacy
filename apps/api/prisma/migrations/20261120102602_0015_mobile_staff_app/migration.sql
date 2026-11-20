-- CreateTable
CREATE TABLE "MobileDevice" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "appVersion" TEXT,
    "tokenHash" TEXT NOT NULL,
    "pushToken" TEXT,
    "pushProvider" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "lastSeenAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "revokedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PushMessage" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "bodyAr" TEXT NOT NULL,
    "data" JSONB,
    "provider" TEXT NOT NULL DEFAULT 'mock',
    "deliveredAt" TIMESTAMP(3),
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PushMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MobileAlertAck" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "alertKey" TEXT NOT NULL,
    "ackedBy" TEXT NOT NULL,
    "note" TEXT,
    "ackedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MobileAlertAck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ControlledCountersign" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "discrepancyId" TEXT NOT NULL,
    "witnessId" TEXT NOT NULL,
    "note" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ControlledCountersign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MobileDevice_orgId_status_idx" ON "MobileDevice"("orgId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MobileDevice_userId_deviceId_key" ON "MobileDevice"("userId", "deviceId");

-- CreateIndex
CREATE INDEX "PushMessage_userId_createdAt_idx" ON "PushMessage"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "PushMessage_orgId_createdAt_idx" ON "PushMessage"("orgId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MobileAlertAck_orgId_alertKey_key" ON "MobileAlertAck"("orgId", "alertKey");

-- CreateIndex
CREATE INDEX "ControlledCountersign_orgId_discrepancyId_idx" ON "ControlledCountersign"("orgId", "discrepancyId");

-- CreateIndex
CREATE UNIQUE INDEX "ControlledCountersign_orgId_discrepancyId_witnessId_key" ON "ControlledCountersign"("orgId", "discrepancyId", "witnessId");
