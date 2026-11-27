/**
 * Durable DEMO data marker and removal (side table "DemoMarker", dataClass DEMO). Mirrors the Kiorex platform (`kiorex-platform/apps/api/src/common/demo-data.ts`):
 * dry-run default, `--confirm` to delete, `--mark` to backfill an old database. The Pharmacy and the Lab keep a copy of this file each (same rules, own roots).
 *
 * WHY a marker and not an id pattern: the founder will later ask "remove the dummy records, keep the real ones". Selecting by name, id pattern or date would stay correct only
 * while nobody ever creates a real row that looks like a demo row. The marker is written ONCE, by the demo seed, for exactly the root rows the seed created (the demo
 * organisations, and the shared synthetic catalogue); removal then starts ONLY from the rows named in "DemoMarker". A real organisation has no marker, so it cannot be selected.
 *
 * What removal deletes: for every marked organisation, every row that belongs to it. "Belongs to it" is read from the database catalogue, not from a hand-kept list: a table
 * with an `orgId` column, or a table whose foreign key points at a row that belongs to the organisation (children without an `orgId` of their own). Rows are deleted children
 * first, one table at a time inside a SAVEPOINT. The tool NEVER disables a trigger or weakens an audit control: an append-only table (stock movements, audit log, ledger,
 * custody, consent, ...) refuses the delete, the savepoint rolls back, and those rows stay as inert history; the organisation row itself is kept for as long as anything of
 * the organisation remains (nothing is orphaned) and the report says which tables kept rows and why. Shared synthetic catalogue rows are removed only while nothing references
 * them. Safe to repeat (idempotent): a second run deletes whatever the first one could not reach and the markers of vanished rows are cleaned.
 *
 * The dry run is a REHEARSAL: the very same procedure runs inside a transaction that is rolled back, so the report is exact (it includes the rows an append-only trigger will
 * refuse) and nothing is written.
 *
 * All identifiers come from the database catalogue and are checked against a strict pattern; values are bound parameters.
 */
export interface SqlClient {
  $executeRawUnsafe(sql: string, ...values: unknown[]): Promise<number>;
  $queryRawUnsafe<T = unknown>(sql: string, ...values: unknown[]): Promise<T>;
}

export interface DemoRoot {
  /** Postgres table (Prisma model name). */
  table: string;
  /** `org`: an organisation, removed together with everything it owns. `shared`: a global row removed only while nothing references it. */
  kind: 'org' | 'shared';
  /** TAG TIME ONLY: predicate over the table naming the rows the demo seeds create. Removal never evaluates it. */
  seededWhere: string;
}

/** The roots the Pharmacy demo seeds create (`prisma/seed.ts`, `demo/seed-suite.ts`, `demo/seed-mobile.ts`). */
export const DEMO_ROOTS: DemoRoot[] = [
  { table: 'Tenant', kind: 'org', seededWhere: `"externalOrgId" IN ('org_demo_kiorly', 'org_demo_solo', 'org_demo_basic')` },
  { table: 'Drug', kind: 'shared', seededWhere: `starts_with("sourceKey", 'synthetic-eg:')` },
];

const CLASS = 'DEMO';
const ORG_TABLE = 'Tenant';
const ORG_COLUMN = 'orgId';
const NEVER = new Set(['DemoMarker', '_prisma_migrations', ORG_TABLE]);
const ident = (s: string): string => { if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(s)) throw new Error(`bad identifier ${s}`); return `"${s}"`; };
const lit = (s: string): string => `'${s.replace(/'/g, "''")}'`;

interface Fk { child: string; childCol: string; parent: string; parentCol: string; onDelete: string }
interface Catalogue { tables: Map<string, Set<string>>; fks: Fk[] }

/** Tables, columns and single-column foreign keys of the current schema. */
export async function readCatalogue(db: SqlClient): Promise<Catalogue> {
  const cols = await db.$queryRawUnsafe<{ t: string; c: string }[]>(
    `SELECT table_name AS t, column_name AS c FROM information_schema.columns WHERE table_schema = current_schema() AND table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_type = 'BASE TABLE')`);
  const tables = new Map<string, Set<string>>();
  for (const r of cols) { if (!tables.has(r.t)) tables.set(r.t, new Set()); tables.get(r.t)!.add(r.c); }
  const fks = await db.$queryRawUnsafe<{ child: string; child_col: string; parent: string; parent_col: string; del: string }[]>(
    `SELECT cl.relname AS child, a.attname AS child_col, pl.relname AS parent, af.attname AS parent_col, c.confdeltype::text AS del
       FROM pg_constraint c
       JOIN pg_class cl ON cl.oid = c.conrelid JOIN pg_class pl ON pl.oid = c.confrelid JOIN pg_namespace n ON n.oid = cl.relnamespace
       JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
       JOIN pg_attribute af ON af.attrelid = c.confrelid AND af.attnum = c.confkey[1]
      WHERE c.contype = 'f' AND n.nspname = current_schema() AND array_length(c.conkey, 1) = 1`);
  return { tables, fks: fks.map((f) => ({ child: f.child, childCol: f.child_col, parent: f.parent, parentCol: f.parent_col, onDelete: f.del })) };
}

/** Predicate (over the table itself, `$1` = the organisation id) that selects the rows of `table` belonging to one organisation; null when the table has no link to an organisation. */
export function scopePredicate(cat: Catalogue, table: string, seen: string[] = []): string | null {
  if (NEVER.has(table) || seen.includes(table) || seen.length > 6) return null;
  const cols = cat.tables.get(table);
  if (!cols) return null;
  if (cols.has(ORG_COLUMN)) return `${ident(ORG_COLUMN)} = $1`;
  for (const fk of cat.fks) {
    if (fk.child !== table || fk.parent === ORG_TABLE) continue;
    const up = scopePredicate(cat, fk.parent, [...seen, table]);
    if (up) return `${ident(fk.childCol)} IN (SELECT ${ident(fk.parentCol)} FROM ${ident(fk.parent)} WHERE ${up})`;
  }
  return null;
}

/** Scoped tables in deletion order: a table that references another scoped table comes first (children before parents). */
export function deletionOrder(cat: Catalogue): { table: string; where: string }[] {
  const scoped = [...cat.tables.keys()].filter((t) => scopePredicate(cat, t) !== null).sort();
  const depth = new Map<string, number>();
  const parentsOf = (t: string) => cat.fks.filter((f) => f.child === t && f.parent !== t && scoped.includes(f.parent)).map((f) => f.parent);
  // number of ancestors: a table with more ancestors is deeper, so it is deleted earlier
  const anc = (t: string, seen = new Set<string>()): number => { if (seen.has(t)) return 0; seen.add(t); return parentsOf(t).reduce((a, p) => Math.max(a, 1 + anc(p, new Set(seen))), 0); };
  for (const t of scoped) depth.set(t, anc(t));
  return scoped.sort((a, b) => (depth.get(b)! - depth.get(a)!) || a.localeCompare(b)).map((table) => { ident(table); return { table, where: scopePredicate(cat, table)! }; });
}

/** Registers the root rows the demo seeds create. Idempotent (ON CONFLICT DO NOTHING). Call it at the end of every demo seed. */
export async function markDemoRows(db: SqlClient, opts: { batch?: string } = {}): Promise<Record<string, number>> {
  const out: Record<string, number> = {};
  for (const r of DEMO_ROOTS) {
    const n = await db.$executeRawUnsafe(
      `INSERT INTO "DemoMarker" ("tableName", "rowId", "dataClass", "batch") SELECT ${lit(r.table)}, "id", '${CLASS}', $1 FROM ${ident(r.table)} WHERE ${r.seededWhere} ON CONFLICT DO NOTHING`,
      opts.batch ?? 'seed-demo',
    ).catch((e: unknown) => { if (/does not exist/i.test(String((e as Error).message))) return 0; throw e; });
    if (n) out[r.table] = n;
  }
  return out;
}

export interface OrgReport {
  orgId: string;
  name: string | null;
  /** rows deleted per table */
  deleted: Record<string, number>;
  /** tables that still hold rows of the organisation (append-only history or a reference that could not be cut) */
  kept: { table: string; rows: number; reason: string }[];
  /** the organisation row itself was deleted (only when nothing of it remains) */
  organisationDeleted: boolean;
}
export interface RemovalReport {
  orgs: OrgReport[];
  shared: { table: string; deleted: number; kept: number }[];
  /** markers whose row no longer exists, cleaned */
  markersCleaned: number;
  totalDeleted: number;
}

const firstLine = (e: unknown): string => {
  const raw = String((e as Error)?.message ?? e);
  const m = /Message: `([^`]*)`/.exec(raw); // Prisma wraps the database message: "Raw query failed. Code: `23000`. Message: `<text>`"
  return (m?.[1] ?? raw).split('\n').map((l) => l.trim()).filter(Boolean)[0]?.slice(0, 200) ?? 'refused';
};
let spN = 0;
/** Runs one statement inside its own savepoint: an error (an append-only trigger, a foreign key) is returned, the transaction stays usable. */
async function attempt(db: SqlClient, sql: string, ...values: unknown[]): Promise<{ n: number } | { error: string }> {
  const sp = `demo_sp_${++spN}`;
  await db.$executeRawUnsafe(`SAVEPOINT ${sp}`);
  try {
    const n = await db.$executeRawUnsafe(sql, ...values);
    await db.$executeRawUnsafe(`RELEASE SAVEPOINT ${sp}`);
    return { n };
  } catch (e) {
    await db.$executeRawUnsafe(`ROLLBACK TO SAVEPOINT ${sp}`);
    await db.$executeRawUnsafe(`RELEASE SAVEPOINT ${sp}`);
    return { error: firstLine(e) };
  }
}

const markedIds = (table: string): string => `SELECT "rowId" FROM "DemoMarker" WHERE "dataClass" = '${CLASS}' AND "tableName" = ${lit(table)}`;

/**
 * The removal procedure. MUST run inside a transaction (the CLI does): it uses savepoints. Selects ONLY through "DemoMarker".
 * `rehearsal` is informational (the caller rolls the transaction back).
 */
export async function removeDemoData(db: SqlClient): Promise<RemovalReport> {
  const cat = await readCatalogue(db);
  const order = deletionOrder(cat);
  const report: RemovalReport = { orgs: [], shared: [], markersCleaned: 0, totalDeleted: 0 };

  for (const root of DEMO_ROOTS.filter((r) => r.kind === 'org')) {
    const orgs = await db.$queryRawUnsafe<{ id: string; name: string | null }[]>(`SELECT "id", "name" FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)}) ORDER BY "id"`);
    for (const org of orgs) {
      const rep: OrgReport = { orgId: org.id, name: org.name, deleted: {}, kept: [], organisationDeleted: false };
      const reasons = new Map<string, string>();
      // several passes: a table that was blocked by a child deleted later succeeds on the next pass
      for (let pass = 0; pass < 6; pass++) {
        let progressed = false;
        for (const t of order) {
          const r = await attempt(db, `DELETE FROM ${ident(t.table)} WHERE ${t.where}`, org.id);
          if ('error' in r) { reasons.set(t.table, r.error); continue; }
          reasons.delete(t.table);
          if (r.n > 0) { rep.deleted[t.table] = (rep.deleted[t.table] ?? 0) + r.n; report.totalDeleted += r.n; progressed = true; }
        }
        if (!progressed) break;
      }
      for (const t of order) {
        const left = (await db.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*)::int AS n FROM ${ident(t.table)} WHERE ${t.where}`, org.id))[0]?.n ?? 0;
        if (left > 0) rep.kept.push({ table: t.table, rows: left, reason: reasons.get(t.table) ?? 'still referenced' });
      }
      if (rep.kept.length === 0) {
        const r = await attempt(db, `DELETE FROM ${ident(root.table)} WHERE "id" = $1 AND "id" IN (${markedIds(root.table)})`, org.id);
        if ('error' in r) rep.kept.push({ table: root.table, rows: 1, reason: r.error });
        else if (r.n > 0) { rep.organisationDeleted = true; report.totalDeleted += r.n; }
      }
      report.orgs.push(rep);
    }
  }

  for (const root of DEMO_ROOTS.filter((r) => r.kind === 'shared')) {
    // a shared row is removed only while no foreign key (other than SET NULL) points at it
    const refs = cat.fks.filter((f) => f.parent === root.table && f.onDelete !== 'n').map((f) => `NOT EXISTS (SELECT 1 FROM ${ident(f.child)} WHERE ${ident(f.childCol)} = ${ident(root.table)}.${ident(f.parentCol)})`);
    const before = (await db.$queryRawUnsafe<{ n: number }[]>(`SELECT COUNT(*)::int AS n FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)})`))[0]?.n ?? 0;
    const r = await attempt(db, `DELETE FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)})${refs.length ? ` AND ${refs.join(' AND ')}` : ''}`);
    const deleted = 'n' in r ? r.n : 0;
    report.totalDeleted += deleted;
    report.shared.push({ table: root.table, deleted, kept: Math.max(0, before - deleted) });
  }

  // markers of rows that no longer exist (the only thing removal writes besides the deletes)
  for (const root of DEMO_ROOTS) {
    report.markersCleaned += await db.$executeRawUnsafe(`DELETE FROM "DemoMarker" m WHERE m."dataClass" = '${CLASS}' AND m."tableName" = ${lit(root.table)} AND NOT EXISTS (SELECT 1 FROM ${ident(root.table)} x WHERE x."id" = m."rowId")`);
  }
  return report;
}

export type Mode = 'dry-run' | 'confirm' | 'mark';
export function parseMode(argv: string[]): Mode {
  const dry = argv.includes('--dry-run'); const confirm = argv.includes('--confirm'); const mark = argv.includes('--mark');
  if (dry && confirm) throw new Error('--dry-run and --confirm cannot be combined');
  if (mark && (dry || confirm)) throw new Error('--mark stands alone');
  const unknown = argv.filter((a) => !['--dry-run', '--confirm', '--mark'].includes(a));
  if (unknown.length) throw new Error(`unknown argument ${unknown[0]} (use --dry-run, --confirm or --mark)`);
  return mark ? 'mark' : confirm ? 'confirm' : 'dry-run';
}

/** One human line per fact, for the CLI. */
export function formatReport(rep: RemovalReport, confirmed: boolean): string[] {
  const out: string[] = [];
  if (!rep.orgs.length) out.push('  no marked demo organisation');
  for (const o of rep.orgs) {
    const rows = Object.values(o.deleted).reduce((a, b) => a + b, 0);
    out.push(`  organisation ${o.orgId} (${o.name ?? 'unnamed'}): ${rows} row(s) ${confirmed ? 'deleted' : 'would be deleted'} in ${Object.keys(o.deleted).length} table(s); organisation row ${o.organisationDeleted ? (confirmed ? 'deleted' : 'would be deleted') : 'kept'}`);
    for (const [t, n] of Object.entries(o.deleted).sort()) out.push(`      ${t.padEnd(30)} ${n}`);
    for (const k of o.kept) out.push(`      KEPT ${k.table.padEnd(25)} ${k.rows} row(s): ${k.reason}`);
  }
  for (const s of rep.shared) out.push(`  shared ${s.table}: ${s.deleted} ${confirmed ? 'deleted' : 'would be deleted'}, ${s.kept} kept (still referenced)`);
  return out;
}
