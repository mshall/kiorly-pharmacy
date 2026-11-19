-- Inbound webhook de-duplication is per tenant: (orgId, eventId).
DELETE FROM "InboundEvent" WHERE "orgId" IS NULL;
DROP INDEX IF EXISTS "InboundEvent_eventId_key";
ALTER TABLE "InboundEvent" ALTER COLUMN "orgId" SET NOT NULL;
CREATE UNIQUE INDEX "InboundEvent_orgId_eventId_key" ON "InboundEvent"("orgId", "eventId");
