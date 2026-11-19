import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { allocateFefo, assertSellable, fefoOrder, isSellable, lotBlockReason, type PickCandidate } from "./lot-guard";
import { DomainError } from "../../../common/errors";

const today = new Date("2026-11-20T00:00:00.000Z");
const d = (iso: string) => new Date(`${iso}T00:00:00.000Z`);
const lot = (o: Partial<PickCandidate> & { id: string }): PickCandidate => ({ status: "AVAILABLE", expiryDate: d("2027-06-01"), receivedAt: d("2026-01-01"), qtyOnHand: 10, qtyReserved: 0, ...o });

describe("lot guard (KPINV03, ADR-025 safety path)", () => {
  it("blocks expired, recalled, quarantined and non-available lots; sellable only AVAILABLE/RESERVED in date", () => {
    assert.equal(lotBlockReason({ id: "1", status: "AVAILABLE", expiryDate: d("2026-11-19") }, today), "EXPIRED");
    assert.equal(lotBlockReason({ id: "1", status: "AVAILABLE", expiryDate: d("2026-11-20") }, today), null, "sellable through the whole expiry day");
    assert.equal(lotBlockReason({ id: "1", status: "RECALLED", expiryDate: d("2030-01-01") }, today), "RECALLED");
    assert.equal(lotBlockReason({ id: "1", status: "QUARANTINE", expiryDate: d("2030-01-01") }, today), "QUARANTINE");
    assert.equal(lotBlockReason({ id: "1", status: "EXPIRED", expiryDate: d("2030-01-01") }, today), "EXPIRED");
    assert.equal(lotBlockReason({ id: "1", status: "RECEIVED", expiryDate: d("2030-01-01") }, today), "NOT_AVAILABLE");
    assert.equal(lotBlockReason({ id: "1", status: "DISPENSED", expiryDate: d("2030-01-01") }, today), "NOT_AVAILABLE");
    assert.equal(isSellable({ id: "1", status: "RESERVED", expiryDate: d("2030-01-01") }, today), true);
    assert.throws(() => assertSellable({ id: "x", status: "RECALLED", expiryDate: d("2030-01-01") }), (e: unknown) => e instanceof DomainError && e.code === "LOT_BLOCKED");
  });

  it("FEFO: earliest expiry first, ties by received date, then id", () => {
    const lots = [lot({ id: "c", expiryDate: d("2027-03-01") }), lot({ id: "a", expiryDate: d("2027-01-01"), receivedAt: d("2026-02-01") }), lot({ id: "b", expiryDate: d("2027-01-01"), receivedAt: d("2026-01-15") })];
    assert.deepEqual(fefoOrder(lots, today).map((l) => l.id), ["b", "a", "c"]);
  });

  it("property: FEFO allocation never picks a blocked/expired/empty lot, never over-allocates, is expiry-ordered and reports the exact shortage", () => {
    const status = fc.constantFrom("AVAILABLE", "RESERVED", "QUARANTINE", "RECALLED", "EXPIRED", "RECEIVED", "DISPENSED" as const) as fc.Arbitrary<PickCandidate["status"]>;
    const lotArb = fc.record({ id: fc.uuid(), status, expiryDate: fc.integer({ min: -30, max: 400 }).map((n) => new Date(today.getTime() + n * 86_400_000)), receivedAt: fc.integer({ min: 0, max: 100 }).map((n) => new Date(today.getTime() - n * 86_400_000)), qtyOnHand: fc.integer({ min: 0, max: 50 }), reserved: fc.integer({ min: 0, max: 50 }) });
    fc.assert(fc.property(fc.array(lotArb, { maxLength: 12 }), fc.integer({ min: 1, max: 120 }), (raw, qty) => {
      const lots = raw.map((r) => ({ ...lot({ id: r.id, status: r.status, expiryDate: r.expiryDate, receivedAt: r.receivedAt, qtyOnHand: r.qtyOnHand, qtyReserved: Math.min(r.reserved, r.qtyOnHand) }) }));
      const { picks, shortage } = allocateFefo(lots, qty, today);
      const by = new Map(lots.map((l) => [l.id, l]));
      let total = 0, lastExpiry = -Infinity;
      for (const p of picks) {
        const l = by.get(p.lotId)!;
        assert.ok(isSellable(l, today), "picked lot must be sellable");
        assert.ok(p.quantity > 0 && p.quantity <= l.qtyOnHand - l.qtyReserved, "within free qty");
        assert.ok(l.expiryDate.getTime() >= lastExpiry, "expiry non-decreasing");
        lastExpiry = l.expiryDate.getTime();
        total += p.quantity;
      }
      const sellableFree = lots.filter((l) => isSellable(l, today)).reduce((a, l) => a + Math.max(l.qtyOnHand - l.qtyReserved, 0), 0);
      assert.equal(total + shortage, qty);
      assert.equal(total, Math.min(qty, sellableFree));
    }), { numRuns: 300 });
  });
});
