import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { bootApp, ledgerOnHand, receive, seedDrug, seedTenant, type Fixture, type TestApp } from "./helpers";
import { StockLedger } from "../src/modules/inventory/stock-ledger.service";
import type { AuthUser } from "../src/auth/auth-user";

/** Property-based: the stock projection (qtyOnHand/qtyReserved) always equals the append-only movement ledger. */
describe("stock ledger properties (KPINV)", () => {
  let t: TestApp, f: Fixture, ledger: StockLedger, drugId: string;
  before(async () => { t = await bootApp(); f = await seedTenant(t); ledger = t.app.get(StockLedger); drugId = (await seedDrug(t, f)).id; });
  after(async () => { await t.close(); });

  type Op = { kind: "RECEIPT" | "SALE" | "ADJUST" | "RESERVE" | "RELEASE" | "RETURN" | "WRITE_OFF_NEG"; qty: number; approved: boolean };
  const opArb: fc.Arbitrary<Op> = fc.record({ kind: fc.constantFrom("RECEIPT", "SALE", "ADJUST", "RESERVE", "RELEASE", "RETURN", "WRITE_OFF_NEG" as const) as fc.Arbitrary<Op["kind"]>, qty: fc.integer({ min: 1, max: 30 }), approved: fc.boolean() });

  it("projection == ledger after any random sequence; invariants hold; rejected ops leave no trace", async () => {
    let seq = 0;
    await fc.assert(fc.asyncProperty(fc.array(opArb, { minLength: 1, maxLength: 14 }), async (ops) => {
      const lot = await receive(t, f, { drugId, quantity: 20, lotNumber: `PROP-${Date.now()}-${seq++}` });
      const user = { userId: f.users.owner.id, orgId: f.orgId } as AuthUser;
      for (const op of ops) {
        const before_ = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } });
        const mvBefore = await t.prisma.stockMovement.count({ where: { lotId: lot.id } });
        const approvedBy = op.approved ? f.users.manager.id : undefined;
        const typeOf = { RECEIPT: "RECEIPT", SALE: "SALE", ADJUST: "ADJUSTMENT", RESERVE: "RESERVE", RELEASE: "RELEASE_RESERVATION", RETURN: "RETURN_FROM_CUSTOMER", WRITE_OFF_NEG: "ADJUSTMENT" } as const;
        const quantity = op.kind === "WRITE_OFF_NEG" ? -op.qty : op.kind === "ADJUST" ? (op.qty % 2 ? op.qty : -op.qty) : op.qty;
        try {
          await t.prisma.$transaction(async (tx) => { await ledger.post(tx, { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: typeOf[op.kind], quantity, performedBy: user.userId, approvedBy }); });
        } catch {
          // a rejected operation must leave stock and ledger unchanged
          const same = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } });
          assert.equal(same.qtyOnHand, before_.qtyOnHand); assert.equal(same.qtyReserved, before_.qtyReserved);
          assert.equal(await t.prisma.stockMovement.count({ where: { lotId: lot.id } }), mvBefore);
        }
        const l = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } });
        assert.equal(l.qtyOnHand, await ledgerOnHand(t.prisma, lot.id), "projection equals the ledger sum");
        const reserve = await t.prisma.stockMovement.groupBy({ by: ["type"], where: { lotId: lot.id, type: { in: ["RESERVE", "RELEASE_RESERVATION"] } }, _sum: { qtyDelta: true } });
        const res = (reserve.find((r) => r.type === "RESERVE")?._sum.qtyDelta ?? 0) - (reserve.find((r) => r.type === "RELEASE_RESERVATION")?._sum.qtyDelta ?? 0);
        assert.equal(l.qtyReserved, res, "reserved projection equals RESERVE - RELEASE");
        assert.ok(l.qtyReserved >= 0);
        if (l.qtyOnHand < 0) assert.ok((await t.prisma.stockMovement.count({ where: { lotId: lot.id, managerApprovalBy: { not: null } } })) > 0, "negative stock only with a recorded manager approval");
      }
    }), { numRuns: 20 });
  });

  it("concurrent sales on one lot never oversell (row lock): N parallel sales of 1 against stock K succeed exactly K times", async () => {
    const lot = await receive(t, f, { drugId, quantity: 5, lotNumber: `CONC-${Date.now()}` });
    const results = await Promise.allSettled(Array.from({ length: 12 }, () =>
      t.prisma.$transaction(async (tx) => { await ledger.post(tx, { orgId: f.orgId, branchId: f.branchId, lotId: lot.id, type: "SALE", quantity: 1, performedBy: f.users.cashier.id }); })));
    assert.equal(results.filter((r) => r.status === "fulfilled").length, 5);
    const l = await t.prisma.stockLot.findUniqueOrThrow({ where: { id: lot.id } });
    assert.equal(l.qtyOnHand, 0);
    assert.equal(await ledgerOnHand(t.prisma, lot.id), 0);
  });
});
