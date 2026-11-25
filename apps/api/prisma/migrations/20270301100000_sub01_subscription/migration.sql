-- SUB-01 subscription lifecycle (auto-renew, Lite downgrade, notices, invoices, plan prices).
CREATE TABLE "OrgSubscription" (
  "id" TEXT NOT NULL, "orgId" TEXT NOT NULL, "interval" TEXT NOT NULL DEFAULT 'MONTHLY', "status" TEXT NOT NULL DEFAULT 'ACTIVE',
  "autoRenew" BOOLEAN NOT NULL DEFAULT true, "autoRenewForced" TEXT, "autoRenewChangedAt" TIMESTAMP(3), "autoRenewChangedBy" TEXT,
  "currentPeriodStart" TIMESTAMP(3) NOT NULL, "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
  "paymentTokenRef" TEXT, "paymentBrand" TEXT, "paymentLast4" TEXT, "paymentExpMonth" INTEGER, "paymentExpYear" INTEGER,
  "failedAttempts" INTEGER NOT NULL DEFAULT 0, "firstFailedAt" TIMESTAMP(3), "nextRetryAt" TIMESTAMP(3),
  "downgradedToLiteAt" TIMESTAMP(3), "downgradeReason" TEXT, "previousEdition" "Edition", "liteReadOnlyGraceUntil" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "OrgSubscription_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "OrgSubscription_orgId_key" ON "OrgSubscription"("orgId");
CREATE INDEX "OrgSubscription_autoRenew_currentPeriodEnd_idx" ON "OrgSubscription"("autoRenew", "currentPeriodEnd");

CREATE TABLE "SubscriptionEvent" (
  "id" TEXT NOT NULL, "orgId" TEXT NOT NULL, "type" TEXT NOT NULL, "fromJson" JSONB, "toJson" JSONB, "actorId" TEXT,
  "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SubscriptionEvent_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "SubscriptionEvent_orgId_at_idx" ON "SubscriptionEvent"("orgId", "at");
CREATE INDEX "SubscriptionEvent_orgId_type_idx" ON "SubscriptionEvent"("orgId", "type");

CREATE TABLE "SubscriptionNotice" (
  "id" TEXT NOT NULL, "orgId" TEXT NOT NULL, "kind" TEXT NOT NULL, "payload" JSONB NOT NULL,
  "notBefore" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "sentAt" TIMESTAMP(3), "dedupeKey" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "SubscriptionNotice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SubscriptionNotice_orgId_dedupeKey_key" ON "SubscriptionNotice"("orgId", "dedupeKey");
CREATE INDEX "SubscriptionNotice_orgId_createdAt_idx" ON "SubscriptionNotice"("orgId", "createdAt");

CREATE TABLE "SubscriptionInvoice" (
  "id" TEXT NOT NULL, "orgId" TEXT NOT NULL, "number" TEXT NOT NULL, "periodKey" TEXT NOT NULL,
  "periodStart" TIMESTAMP(3) NOT NULL, "periodEnd" TIMESTAMP(3) NOT NULL, "edition" "Edition" NOT NULL, "currency" TEXT NOT NULL,
  "subtotal" DECIMAL(14,2) NOT NULL, "tax" DECIMAL(14,2) NOT NULL, "total" DECIMAL(14,2) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'ISSUED', "providerRef" TEXT, "attempts" INTEGER NOT NULL DEFAULT 0,
  "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "paidAt" TIMESTAMP(3), CONSTRAINT "SubscriptionInvoice_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "SubscriptionInvoice_number_key" ON "SubscriptionInvoice"("number");
CREATE UNIQUE INDEX "SubscriptionInvoice_orgId_periodKey_key" ON "SubscriptionInvoice"("orgId", "periodKey");
CREATE INDEX "SubscriptionInvoice_orgId_issuedAt_idx" ON "SubscriptionInvoice"("orgId", "issuedAt");

CREATE TABLE "PlanPrice" (
  "id" TEXT NOT NULL, "edition" "Edition" NOT NULL, "marketCode" TEXT NOT NULL DEFAULT 'EG', "interval" TEXT NOT NULL DEFAULT 'MONTHLY',
  "currency" TEXT NOT NULL DEFAULT 'EGP', "amount" DECIMAL(14,2) NOT NULL, "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "validTo" TIMESTAMP(3),
  CONSTRAINT "PlanPrice_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "PlanPrice_edition_marketCode_interval_idx" ON "PlanPrice"("edition", "marketCode", "interval");
