import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { normalizeStatement } from "./commission-statement";
import { renderStatementHtml } from "./statement-html";

/** LG-COM-20: the provider sees the same cash / cash-transfer split as Kiorex finance (two-way visibility, 26 Nov 2026). */
const from = new Date("2026-12-01T00:00:00Z"); const to = new Date("2027-01-01T00:00:00Z");
const raw = {
  orgRef: "org_1", currency: "EGP", onlineCollectionsMinor: 0, cashVisitCommissionAccruedMinor: 3000, cashVisitCommissionNettedMinor: 1000, cashVisitCommissionOpenMinor: 2000, cashVisitCharges: 3,
  cashBreakdown: { cash: { accruedMinor: 1000, nettedMinor: 1000, openMinor: 0, charges: 1 }, cashTransfer: { accruedMinor: 2000, nettedMinor: 0, openMinor: 2000, charges: 2, byDetail: { BANK_TRANSFER: 1, INSTAPAY: 1, CARD_TERMINAL: 0, "<script>": 5 }, unspecifiedDetail: 0 } },
  unknownTender: { charges: 2, commissionMinor: 700 },
  deductions: { commissionMinor: 0 }, netPayableMinor: 0, paidByBankTransferMinor: 0, payouts: [], reconciliation: "NO_PAYOUT",
};

describe("PHARMACY statement keeps the cash vs cash-transfer split", () => {
  it("normalizes cashBreakdown and unknownTender (and drops odd detail keys)", () => {
    const v = normalizeStatement(raw, { orgRef: "org_1", from, to })!;
    assert.deepEqual(v.cashBreakdown?.cash, { accruedMinor: 1000, nettedMinor: 1000, openMinor: 0, charges: 1 });
    assert.deepEqual(v.cashBreakdown?.cashTransfer, { accruedMinor: 2000, nettedMinor: 0, openMinor: 2000, charges: 2, byDetail: { BANK_TRANSFER: 1, INSTAPAY: 1, CARD_TERMINAL: 0 }, unspecifiedDetail: 0 });
    assert.deepEqual(v.unknownTender, { charges: 2, commissionMinor: 700 });
  });
  it("an older Kiorex without the split reads as null, never as zero cash", () => {
    const v = normalizeStatement({ netPayableMinor: 1 }, { orgRef: "org_1", from, to })!;
    assert.equal(v.cashBreakdown, null); assert.equal(v.unknownTender, null);
  });
  it("the printable statement shows each kind on its own row, in English and Arabic; nothing when absent", () => {
    const v = normalizeStatement(raw, { orgRef: "org_1", from, to })!;
    const en = renderStatementHtml({ product: "PHARMACY", lang: "en", periodKey: "2026-12", organisation: "Org", statement: v });
    assert.match(en, /Of which cash transfer: accrued/); assert.match(en, /Of which cash at the visit: accrued/); assert.match(en, /payment method not reported/);
    const ar = renderStatementHtml({ product: "PHARMACY", lang: "ar", periodKey: "2026-12", organisation: "Org", statement: v });
    assert.match(ar, /منها تحويل نقدي: مستحقة/);
    const bare = renderStatementHtml({ product: "PHARMACY", lang: "en", periodKey: "2026-12", organisation: "Org", statement: normalizeStatement({ netPayableMinor: 1 }, { orgRef: "o", from, to })! });
    assert.doesNotMatch(bare, /Of which cash transfer/);
  });
});

describe("mobile statement: not connected is an answer, not a server error", () => {
  it("returns 200 { connected: false } for STATEMENT_NOT_CONNECTED and rethrows everything else", async () => {
    const { ServiceUnavailableException, ForbiddenException } = await import("@nestjs/common");
    const { GrowthMobileService } = await import("./growth-mobile.service");
    const mk = (err: unknown, ok?: unknown) => new GrowthMobileService({} as never, {} as never, {} as never, {} as never, { statement: async () => { if (err) throw err; return ok; } } as never);
    const u = { orgId: "o1" } as never;
    assert.deepEqual(await mk(new ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "x" })).commissionStatement(u, "2026-12"), { connected: false, code: "STATEMENT_NOT_CONNECTED", period: "2026-12" });
    assert.deepEqual(await mk(new ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "x" })).commissionStatement(u), { connected: false, code: "STATEMENT_NOT_CONNECTED", period: new Date().toISOString().slice(0, 7) });
    await assert.rejects(mk(new ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "x" })).commissionStatement(u, "2026-12"), (e: { getStatus(): number }) => e.getStatus() === 503);
    await assert.rejects(mk(new ForbiddenException("role")).commissionStatement(u, "2026-12"), (e: { getStatus(): number }) => e.getStatus() === 403);
    assert.deepEqual(await mk(null, { period: { key: "2026-12" } }).commissionStatement(u, "2026-12"), { connected: true, period: { key: "2026-12" } });
  });
});
