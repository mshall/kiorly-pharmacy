-- COM-2: the pharmacy's commission rate as Kiorex reports it (read-only here). One row per organisation; the newest version wins.
CREATE TABLE IF NOT EXISTS "KiorexCommissionRateView" (
    "id" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "version" BIGINT NOT NULL,
    "view" JSONB NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KiorexCommissionRateView_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "KiorexCommissionRateView_orgId_key" ON "KiorexCommissionRateView"("orgId");
DO $$ BEGIN
  ALTER TABLE "KiorexCommissionRateView" ADD CONSTRAINT "KiorexCommissionRateView_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
