-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "branchId" TEXT,
    "kind" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'WARN',
    "title" TEXT NOT NULL,
    "body" TEXT,
    "link" TEXT,
    "refType" TEXT,
    "refId" TEXT,
    "dedupeKey" TEXT NOT NULL,
    "readBy" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Alert_orgId_resolvedAt_createdAt_idx" ON "Alert"("orgId", "resolvedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Alert_orgId_dedupeKey_key" ON "Alert"("orgId", "dedupeKey");

