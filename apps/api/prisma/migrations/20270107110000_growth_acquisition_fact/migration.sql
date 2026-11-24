-- GRW-P4-B2: partner side of the Kiorex product acquisition block (additive nullable columns; no existing row changes).
-- `acquisitionOrigin` and `acquisitionDecisionRef` are what Kiorex decided; `acquisitionLinkId` is the org's own link the decision cites (set only when the code belongs to this organisation);
-- `acquisitionOrderCountedAt` / `acquisitionCompletedCountedAt` make the daily counters idempotent per order.
ALTER TABLE "KiorexOrder"
  ADD COLUMN "acquisitionOrigin" TEXT,
  ADD COLUMN "acquisitionDecisionRef" TEXT,
  ADD COLUMN "acquisitionReason" TEXT,
  ADD COLUMN "acquisitionLinkId" TEXT,
  ADD COLUMN "acquisitionOrderCountedAt" TIMESTAMP(3),
  ADD COLUMN "acquisitionCompletedCountedAt" TIMESTAMP(3);
ALTER TABLE "KiorexOrder" ADD CONSTRAINT "KiorexOrder_acquisitionOrigin_chk" CHECK ("acquisitionOrigin" IS NULL OR "acquisitionOrigin" IN ('PROVIDER_LED','MARKETPLACE','UNATTRIBUTED'));
CREATE INDEX "KiorexOrder_acquisitionLinkId_idx" ON "KiorexOrder"("acquisitionLinkId") WHERE "acquisitionLinkId" IS NOT NULL;
