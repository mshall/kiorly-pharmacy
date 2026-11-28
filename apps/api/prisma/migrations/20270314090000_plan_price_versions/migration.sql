-- LG-SUB-1: plan prices become versioned, effective-dated and append-only (additive; the table is empty until a price is published through the Kiorly admin).
ALTER TABLE "PlanPrice" ADD COLUMN IF NOT EXISTS "priceVersion" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "PlanPrice" ADD COLUMN IF NOT EXISTS "proposalId" TEXT;
ALTER TABLE "PlanPrice" ADD COLUMN IF NOT EXISTS "proposedBy" TEXT;
ALTER TABLE "PlanPrice" ADD COLUMN IF NOT EXISTS "publishedBy" TEXT;
ALTER TABLE "PlanPrice" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
CREATE UNIQUE INDEX IF NOT EXISTS "PlanPrice_proposalId_key" ON "PlanPrice"("proposalId");
CREATE UNIQUE INDEX IF NOT EXISTS "PlanPrice_edition_marketCode_interval_priceVersion_key" ON "PlanPrice"("edition", "marketCode", "interval", "priceVersion");

-- append-only: a price row is never deleted and never edited; the only change allowed is ending it (validTo from NULL to a time) when a newer version starts
CREATE OR REPLACE FUNCTION plan_price_append_only() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'PlanPrice is append-only'; END IF;
  IF OLD."validTo" IS NOT NULL
     OR NEW.edition <> OLD.edition OR NEW."marketCode" <> OLD."marketCode" OR NEW.interval <> OLD.interval OR NEW.currency <> OLD.currency
     OR NEW.amount <> OLD.amount OR NEW."validFrom" <> OLD."validFrom" OR NEW."priceVersion" <> OLD."priceVersion"
     OR NEW."proposalId" IS DISTINCT FROM OLD."proposalId" OR NEW."proposedBy" IS DISTINCT FROM OLD."proposedBy" OR NEW."publishedBy" IS DISTINCT FROM OLD."publishedBy" THEN
    RAISE EXCEPTION 'PlanPrice is append-only: only validTo of an open row may be set';
  END IF;
  RETURN NEW;
END; $$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS "PlanPrice_append_only" ON "PlanPrice";
CREATE TRIGGER "PlanPrice_append_only" BEFORE UPDATE OR DELETE ON "PlanPrice" FOR EACH ROW EXECUTE FUNCTION plan_price_append_only();
