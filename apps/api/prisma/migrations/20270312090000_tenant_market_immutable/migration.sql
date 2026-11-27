-- Founder decision A (27 Nov 2026): a healthcare provider operating in a country belongs to that country for life.
-- No API path changes Tenant.marketCode (there is no market switch for a Pharmacy); this trigger is the last line of defence.
-- A correction is the documented super-admin data fix (ADR-060):
--   ALTER TABLE "Tenant" DISABLE TRIGGER "Tenant_marketCode_immutable"; UPDATE ...; ALTER TABLE "Tenant" ENABLE TRIGGER "Tenant_marketCode_immutable";
CREATE OR REPLACE FUNCTION kx_tenant_market_immutable() RETURNS trigger AS $$
BEGIN
  IF NEW."marketCode" IS DISTINCT FROM OLD."marketCode" THEN
    RAISE EXCEPTION 'MARKET_IMMUTABLE: a pharmacy belongs to its country market for life (% -> % refused)', OLD."marketCode", NEW."marketCode" USING ERRCODE = '55000';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER "Tenant_marketCode_immutable" BEFORE UPDATE OF "marketCode" ON "Tenant"
  FOR EACH ROW EXECUTE FUNCTION kx_tenant_market_immutable();
