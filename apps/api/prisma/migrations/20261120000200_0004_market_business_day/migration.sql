-- Business day for lot expiry: the market calendar day (Africa/Cairo for EG), NOT the server's session timezone.
-- A lot with expiryDate = D is sellable through the end of D (market time). NEEDS_HUMAN: per-market timezone for non-EG packs.
CREATE OR REPLACE FUNCTION kx_today() RETURNS date AS $$ SELECT (now() AT TIME ZONE 'Africa/Cairo')::date $$ LANGUAGE sql STABLE;

CREATE OR REPLACE FUNCTION kx_enforce_lot_sellable() RETURNS trigger AS $$
DECLARE
  lot RECORD;
BEGIN
  SELECT status, "expiryDate" INTO lot FROM "StockLot" WHERE id = NEW."lotId";
  IF NOT FOUND THEN
    RAISE EXCEPTION 'lot % not found', NEW."lotId" USING ERRCODE = 'foreign_key_violation';
  END IF;
  IF lot.status NOT IN ('AVAILABLE', 'RESERVED') THEN
    RAISE EXCEPTION 'lot % is % and cannot be sold or dispensed', NEW."lotId", lot.status USING ERRCODE = 'check_violation';
  END IF;
  IF lot."expiryDate" < kx_today() THEN
    RAISE EXCEPTION 'lot % expired on %', NEW."lotId", lot."expiryDate" USING ERRCODE = 'check_violation';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION kx_stock_movement_apply() RETURNS trigger AS $$
DECLARE
  lot RECORD;
  new_on_hand integer;
  new_reserved integer;
  signed RECORD;
BEGIN
  SELECT id, status, "expiryDate", "qtyOnHand", "qtyReserved" INTO lot FROM "StockLot" WHERE id = NEW."lotId" FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'lot % not found', NEW."lotId" USING ERRCODE = 'foreign_key_violation';
  END IF;

  IF NEW.type IN ('SALE', 'DISPENSE', 'RESERVE', 'TRANSFER_OUT') THEN
    IF lot.status NOT IN ('AVAILABLE', 'RESERVED') THEN
      RAISE EXCEPTION 'lot % is % and cannot be sold or dispensed', NEW."lotId", lot.status USING ERRCODE = 'check_violation';
    END IF;
    IF lot."expiryDate" < kx_today() THEN
      RAISE EXCEPTION 'lot % expired on %', NEW."lotId", lot."expiryDate" USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.type = 'DISPENSE' THEN
    SELECT "pharmacistId", "signedOffAt" INTO signed FROM "Dispensing" WHERE id = NEW."refId";
    IF NOT FOUND OR signed."pharmacistId" IS NULL OR signed."signedOffAt" IS NULL THEN
      RAISE EXCEPTION 'DISPENSE movement requires a pharmacist-signed dispensing (pharmacist sign-off missing)' USING ERRCODE = 'check_violation';
    END IF;
  END IF;

  IF NEW.type IN ('RESERVE', 'RELEASE_RESERVATION') THEN
    IF NEW."qtyDelta" <= 0 THEN
      RAISE EXCEPTION 'reservation movements carry a positive quantity' USING ERRCODE = 'check_violation';
    END IF;
    IF NEW.type = 'RESERVE' THEN new_reserved := lot."qtyReserved" + NEW."qtyDelta"; ELSE new_reserved := lot."qtyReserved" - NEW."qtyDelta"; END IF;
    IF new_reserved < 0 THEN
      RAISE EXCEPTION 'reservation underflow on lot %', NEW."lotId" USING ERRCODE = 'check_violation';
    END IF;
    IF new_reserved > lot."qtyOnHand" AND NEW."managerApprovalBy" IS NULL THEN
      RAISE EXCEPTION 'cannot reserve more than on hand on lot %', NEW."lotId" USING ERRCODE = 'check_violation';
    END IF;
    UPDATE "StockLot" SET "qtyReserved" = new_reserved WHERE id = NEW."lotId";
    RETURN NEW;
  END IF;

  IF NEW.type IN ('SALE', 'DISPENSE', 'TRANSFER_OUT', 'RETURN_TO_SUPPLIER', 'EXPIRY_WRITE_OFF', 'RECALL_WRITE_OFF') AND NEW."qtyDelta" >= 0 THEN
    RAISE EXCEPTION '% movements must be negative', NEW.type USING ERRCODE = 'check_violation';
  END IF;
  IF NEW.type IN ('RECEIPT', 'RETURN_FROM_CUSTOMER', 'TRANSFER_IN') AND NEW."qtyDelta" <= 0 THEN
    RAISE EXCEPTION '% movements must be positive', NEW.type USING ERRCODE = 'check_violation';
  END IF;

  new_on_hand := lot."qtyOnHand" + NEW."qtyDelta";
  IF new_on_hand < 0 AND NEW."managerApprovalBy" IS NULL THEN
    RAISE EXCEPTION 'negative stock on lot % requires manager approval', NEW."lotId" USING ERRCODE = 'check_violation';
  END IF;
  UPDATE "StockLot" SET "qtyOnHand" = new_on_hand WHERE id = NEW."lotId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

