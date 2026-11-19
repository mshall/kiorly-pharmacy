-- Kiorex integration: per-tenant machine credentials + order context.
ALTER TABLE "KiorexOrder" ADD COLUMN "patientRef" TEXT, ADD COLUMN "deliveryMethod" TEXT, ADD COLUMN "paymentRef" TEXT;

CREATE TABLE "IntegrationClient" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "secretEnc" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'KIOREX',
    "kiorexBaseUrl" TEXT,
    "webhookSecretEnc" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "IntegrationClient_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "IntegrationClient_key_key" ON "IntegrationClient"("key");
CREATE INDEX "IntegrationClient_orgId_idx" ON "IntegrationClient"("orgId");
