import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { DEMO_ROOTS, deletionOrder, formatReport, markDemoRows, parseMode, removeDemoData, scopePredicate, type SqlClient } from "./demo-data";

/** A catalogue like the real one in miniature: Tenant <- Branch (orgId), Sale (orgId) <- SaleLine (no orgId, FK cascade), SaleReturn (no orgId, FK restrict to Sale), Drug (global). */
const cat = () => ({
  tables: new Map<string, Set<string>>([
    ["Tenant", new Set(["id", "name"])], ["Branch", new Set(["id", "orgId"])], ["Sale", new Set(["id", "orgId"])], ["SaleLine", new Set(["id", "saleId"])],
    ["SaleReturn", new Set(["id", "saleId"])], ["Drug", new Set(["id", "sourceKey"])], ["DemoMarker", new Set(["tableName", "rowId"])], ["Global", new Set(["id"])],
  ]),
  fks: [
    { child: "SaleLine", childCol: "saleId", parent: "Sale", parentCol: "id", onDelete: "c" },
    { child: "SaleReturn", childCol: "saleId", parent: "Sale", parentCol: "id", onDelete: "r" },
    { child: "Branch", childCol: "orgId", parent: "Tenant", parentCol: "id", onDelete: "r" },
  ],
});

function fake(opts: { orgs?: { id: string; name: string }[]; failTables?: string[] } = {}) {
  const sql: { text: string; values: unknown[] }[] = [];
  const catalogue = cat();
  const db: SqlClient = {
    async $executeRawUnsafe(text: string, ...values: unknown[]) {
      sql.push({ text, values });
      const m = /^DELETE FROM "(\w+)"/.exec(text);
      if (m && opts.failTables?.includes(m[1]!)) throw new Error(`ERROR: ${m[1]} is append-only`);
      return 0;
    },
    async $queryRawUnsafe(text: string) {
      sql.push({ text, values: [] });
      if (text.includes("information_schema.columns")) return [...catalogue.tables].flatMap(([t, cs]) => [...cs].map((c) => ({ t, c }))) as never;
      if (text.includes("pg_constraint")) return catalogue.fks.map((f) => ({ child: f.child, child_col: f.childCol, parent: f.parent, parent_col: f.parentCol, del: f.onDelete })) as never;
      if (text.startsWith('SELECT "id", "name" FROM "Tenant"')) return (opts.orgs ?? []) as never;
      return [{ n: 0 }] as never;
    },
  };
  return { db, sql };
}

describe("pharmacy demo data: scope and order", () => {
  it("a table with orgId is scoped by it; children without orgId are scoped through their foreign key; global tables are not scoped", () => {
    const c = cat();
    assert.equal(scopePredicate(c, "Branch"), `"orgId" = $1`);
    assert.equal(scopePredicate(c, "SaleLine"), `"saleId" IN (SELECT "id" FROM "Sale" WHERE "orgId" = $1)`);
    assert.equal(scopePredicate(c, "SaleReturn"), `"saleId" IN (SELECT "id" FROM "Sale" WHERE "orgId" = $1)`);
    for (const t of ["Tenant", "Drug", "Global", "DemoMarker"]) assert.equal(scopePredicate(c, t), null, t);
  });
  it("children are deleted before their parents", () => {
    const order = deletionOrder(cat()).map((x) => x.table);
    assert.ok(order.indexOf("SaleLine") < order.indexOf("Sale"));
    assert.ok(order.indexOf("SaleReturn") < order.indexOf("Sale"));
    assert.ok(!order.includes("Tenant") && !order.includes("DemoMarker") && !order.includes("Drug"));
  });
  it("identifiers are checked", () => {
    const c = cat(); c.tables.set('Bad"; DROP', new Set(["orgId"]));
    assert.throws(() => deletionOrder(c), /bad identifier/);
  });
});

describe("pharmacy demo data: tagging", () => {
  it("is idempotent and binds the batch; roots are the three demo organisations and the synthetic catalogue", async () => {
    const { db, sql } = fake();
    await markDemoRows(db, { batch: "x" });
    assert.equal(sql.length, DEMO_ROOTS.length);
    for (const s of sql) { assert.match(s.text, /ON CONFLICT DO NOTHING/); assert.deepEqual(s.values, ["x"]); }
    assert.match(DEMO_ROOTS[0]!.seededWhere, /org_demo_kiorly.*org_demo_solo.*org_demo_basic/);
    assert.match(DEMO_ROOTS[1]!.seededWhere, /synthetic-eg:/);
  });
});

describe("pharmacy demo data: removal", () => {
  it("starts only from DemoMarker: no statement selects by name, pattern or date", async () => {
    const { db, sql } = fake({ orgs: [{ id: "o1", name: "Demo" }] });
    await removeDemoData(db);
    for (const s of sql.filter((x) => /^(DELETE|SELECT "id")/.test(x.text) && !x.text.startsWith('DELETE FROM "DemoMarker"') && !/information_schema|pg_constraint/.test(x.text))) {
      assert.doesNotMatch(s.text, /LIKE|starts_with|ILIKE|createdAt|"name" =|~/, s.text);
    }
    const orgSelect = sql.find((x) => x.text.startsWith('SELECT "id", "name" FROM "Tenant"'))!;
    assert.match(orgSelect.text, /"DemoMarker" WHERE "dataClass" = 'DEMO' AND "tableName" = 'Tenant'/);
    const orgDeletes = sql.filter((x) => /^DELETE FROM "(Branch|Sale|SaleLine|SaleReturn)"/.test(x.text));
    assert.ok(orgDeletes.length >= 4);
    for (const d of orgDeletes) assert.deepEqual(d.values, ["o1"]);
  });
  it("every delete runs in its own savepoint; a refused table is kept, reported, and keeps the organisation row", async () => {
    const { db, sql } = fake({ orgs: [{ id: "o1", name: "Demo" }], failTables: ["SaleLine"] });
    // pretend rows remain in the refused table
    const q = db.$queryRawUnsafe.bind(db);
    db.$queryRawUnsafe = (async (text: string, ...v: unknown[]) => (text.startsWith('SELECT COUNT(*)::int AS n FROM "SaleLine"') ? [{ n: 3 }] : q(text, ...v))) as never;
    const rep = await removeDemoData(db);
    assert.ok(sql.some((s) => /^SAVEPOINT demo_sp_/.test(s.text)) && sql.some((s) => /^ROLLBACK TO SAVEPOINT demo_sp_/.test(s.text)));
    assert.deepEqual(rep.orgs[0]!.kept, [{ table: "SaleLine", rows: 3, reason: "ERROR: SaleLine is append-only" }]);
    assert.equal(rep.orgs[0]!.organisationDeleted, false);
    assert.ok(!sql.some((s) => s.text.startsWith('DELETE FROM "Tenant"')), "the organisation row is never deleted while rows of it remain");
  });
  it("deletes the organisation row once nothing of it remains, and never disables a trigger", async () => {
    const { db, sql } = fake({ orgs: [{ id: "o1", name: "Demo" }] });
    await removeDemoData(db);
    assert.ok(sql.some((s) => s.text.startsWith('DELETE FROM "Tenant" WHERE "id" = $1')));
    for (const s of sql) assert.doesNotMatch(s.text, /DISABLE TRIGGER|session_replication_role|ALTER TABLE/i);
  });
  it("a shared row is removed only while nothing references it (SET NULL references do not count)", async () => {
    const c = cat(); c.fks.push({ child: "Sale", childCol: "drugId", parent: "Drug", parentCol: "id", onDelete: "r" }, { child: "SaleLine", childCol: "drugRef", parent: "Drug", parentCol: "id", onDelete: "n" });
    const { sql } = fake();
    const catalogue = c;
    const db: SqlClient = {
      async $executeRawUnsafe(text: string, ...v: unknown[]) { sql.push({ text, values: v }); return 0; },
      async $queryRawUnsafe(text: string) {
        sql.push({ text, values: [] });
        if (text.includes("information_schema.columns")) return [...catalogue.tables].flatMap(([t, cs]) => [...cs].map((x) => ({ t, c: x }))) as never;
        if (text.includes("pg_constraint")) return catalogue.fks.map((f) => ({ child: f.child, child_col: f.childCol, parent: f.parent, parent_col: f.parentCol, del: f.onDelete })) as never;
        return [] as never;
      },
    };
    await removeDemoData(db);
    const del = sql.find((s) => s.text.startsWith('DELETE FROM "Drug"'))!;
    assert.match(del.text, /NOT EXISTS \(SELECT 1 FROM "Sale" WHERE "drugId" = "Drug"\."id"\)/);
    assert.doesNotMatch(del.text, /drugRef/);
  });
});

describe("pharmacy demo data: CLI flags and report", () => {
  it("dry-run is the default; --confirm and --mark; combinations and unknown flags are refused", () => {
    assert.equal(parseMode([]), "dry-run");
    assert.equal(parseMode(["--dry-run"]), "dry-run");
    assert.equal(parseMode(["--confirm"]), "confirm");
    assert.equal(parseMode(["--mark"]), "mark");
    assert.throws(() => parseMode(["--dry-run", "--confirm"]), /cannot be combined/);
    assert.throws(() => parseMode(["--mark", "--confirm"]), /stands alone/);
    assert.throws(() => parseMode(["--force"]), /unknown argument/);
  });
  it("the report says what was kept and why", () => {
    const lines = formatReport({ orgs: [{ orgId: "o1", name: "Demo", deleted: { Branch: 2 }, kept: [{ table: "StockMovement", rows: 9, reason: "append-only" }], organisationDeleted: false }], shared: [{ table: "Drug", deleted: 0, kept: 4 }], markersCleaned: 0, totalDeleted: 2 }, false).join("\n");
    assert.match(lines, /would be deleted/);
    assert.match(lines, /KEPT StockMovement\s+9 row\(s\): append-only/);
    assert.match(lines, /shared Drug: 0 would be deleted, 4 kept/);
  });
});
