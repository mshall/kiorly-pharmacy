# Design notes harvested from the 2025 prototypes (pharmacy + inventory)

**Status:** design input only (ADR-026, KX-22 §08). Source: `_legacy/kiorex-backend/services/{pharmacy-service,inventory-service}` (read-only). **No code was copied**; these are the *ideas* worth keeping and the mistakes to avoid. The v2 model lives in `apps/api/prisma/schema.prisma` (DRAFT).

## What the 2025 model looked like

| 2025 entity | Ideas worth keeping | Problem to fix in v2 | v2 model |
|---|---|---|---|
| Medication (pharmacy-service) | Brand + generic name, form, strength, active ingredients list, Rx-required flag, barcode/NDC, manufacturer | Stock quantity, single expiry date and single batch stored on the drug row; no lots | `Drug` (catalogue only) + `StockLot` |
| InventoryItem (inventory-service) | SKU, min/max stock, unit cost vs price, storage instructions, controlled-substance flag, status active/inactive/discontinued, barcode | `currentStock` as a number with one `expiryDate`/`batchNumber`; supplier as a scalar relation; no FEFO possible | `StockLot` per (branch, drug, lotNumber) with expiry; FEFO via index on expiry; min/max on reorder policy (KPSUP02) |
| StockMovement | Movement types (in/out/adjustment/transfer/expired/damaged), reason, performer, movement date | Stores `previousStock/newStock` snapshots (racy, editable) | Append-only ledger with signed `qtyDelta`; DB trigger forbids UPDATE/DELETE; stock is a projection |
| Inventory (pharmacy-service) | Transaction types incl. return, invoice number, supplier, prescription/patient reference | A second, duplicate stock log in another service; patient id on stock rows | One ledger; patient links only via Dispensing/Sale, never on the ledger |
| Supplier | Contact, payment terms, tax id, status | Free-text certifications | `Supplier` with terms, credit limit and balance (KPSUP01); ledger in the kernel |
| MedicationInteraction | Severity ladder minor / moderate / major / contraindicated; mechanism, clinical effects, management, monitoring, references | Not keyed to ingredients in a way a dispensing check can use | Shared interaction engine keyed by **active ingredient** (KPRX03, shared with Clinic CL02); outcome rows in `SafetyCheckResult` |
| MedicationAllergy | Severity ladder incl. life-threatening, cross-reactions, verified-by | Belongs to the patient record, not to a pharmacy | Not stored here: consumed read-only via consented Rx context; checked into `SafetyCheckResult` |
| Prescription | Statuses (pending/approved/rejected/dispensed/completed/cancelled), priority (routine/urgent/stat), dose/frequency/duration, rejection reason, approved/dispensed by | Approval and dispensing were single user fields with no sign-off semantics; no consent, no source, no idempotency | `Prescription` (source, consent token hash, sourceEventId) separated from `Dispensing` (pharmacist sign-off user + timestamp, DB CHECK) |

## Harvested ideas, mapped to requirements

- Severity ladders for interactions/allergies (minor..contraindicated, mild..life-threatening) → `SafetyCheckOutcome` PASS/WARN/BLOCK/OVERRIDDEN (KPRX03). Override must be attributed.
- Priority (routine/urgent/stat) is a useful Rx field; not yet in the draft schema. **Question for discovery (D01):** does priority matter in Egyptian community pharmacy?
- Movement reasons (expired, damaged, return) → `StockMovementType` has EXPIRY_WRITE_OFF, RECALL_WRITE_OFF, RETURN_TO_SUPPLIER, COUNT_VARIANCE.
- Storage instructions on the item → fold into `Drug.coldChain` + product leaflet later; open question for D01.
- Unit cost vs price split → `StockLot.unitCost` (per lot) and `PriceBookEntry` (effective-dated).

## Do not carry over

TypeORM entities, Stripe/Twilio integrations, any cross-service patient joins, stock numbers on catalogue rows, JSON blobs for medication properties, and the duplicated inventory logs.

## Open modelling questions for discovery

1. Pack vs strip vs unit: do pharmacies sell loose strips? (affects quantity unit on `StockLot`/`SaleLine`.)
2. How are insurer-contracted prices represented (pharmacy.insurer_claims)? Not modelled yet.
3. Which controlled schedules does EDA define, and what exact fields must the log hold (KPRX05; counsel NH-PH-004)?
4. Branch-to-branch transfers (Chain edition): in-transit state is not modelled yet (TRANSFER_OUT/IN movements only).
