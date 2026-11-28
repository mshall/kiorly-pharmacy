"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_ROOTS = void 0;
exports.readCatalogue = readCatalogue;
exports.scopePredicate = scopePredicate;
exports.deletionOrder = deletionOrder;
exports.markDemoRows = markDemoRows;
exports.removeDemoData = removeDemoData;
exports.parseMode = parseMode;
exports.formatReport = formatReport;
exports.DEMO_ROOTS = [
    { table: 'Tenant', kind: 'org', seededWhere: `"externalOrgId" IN ('org_demo_kiorly', 'org_demo_solo', 'org_demo_basic')` },
    { table: 'Drug', kind: 'shared', seededWhere: `starts_with("sourceKey", 'synthetic-eg:')` },
];
const CLASS = 'DEMO';
const ORG_TABLE = 'Tenant';
const ORG_COLUMN = 'orgId';
const NEVER = new Set(['DemoMarker', '_prisma_migrations', ORG_TABLE]);
const ident = (s) => { if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(s))
    throw new Error(`bad identifier ${s}`); return `"${s}"`; };
const lit = (s) => `'${s.replace(/'/g, "''")}'`;
async function readCatalogue(db) {
    const cols = await db.$queryRawUnsafe(`SELECT table_name AS t, column_name AS c FROM information_schema.columns WHERE table_schema = current_schema() AND table_name IN (SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema() AND table_type = 'BASE TABLE')`);
    const tables = new Map();
    for (const r of cols) {
        if (!tables.has(r.t))
            tables.set(r.t, new Set());
        tables.get(r.t).add(r.c);
    }
    const fks = await db.$queryRawUnsafe(`SELECT cl.relname AS child, a.attname AS child_col, pl.relname AS parent, af.attname AS parent_col, c.confdeltype::text AS del
       FROM pg_constraint c
       JOIN pg_class cl ON cl.oid = c.conrelid JOIN pg_class pl ON pl.oid = c.confrelid JOIN pg_namespace n ON n.oid = cl.relnamespace
       JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = c.conkey[1]
       JOIN pg_attribute af ON af.attrelid = c.confrelid AND af.attnum = c.confkey[1]
      WHERE c.contype = 'f' AND n.nspname = current_schema() AND array_length(c.conkey, 1) = 1`);
    return { tables, fks: fks.map((f) => ({ child: f.child, childCol: f.child_col, parent: f.parent, parentCol: f.parent_col, onDelete: f.del })) };
}
function scopePredicate(cat, table, seen = []) {
    if (NEVER.has(table) || seen.includes(table) || seen.length > 6)
        return null;
    const cols = cat.tables.get(table);
    if (!cols)
        return null;
    if (cols.has(ORG_COLUMN))
        return `${ident(ORG_COLUMN)} = $1`;
    for (const fk of cat.fks) {
        if (fk.child !== table || fk.parent === ORG_TABLE)
            continue;
        const up = scopePredicate(cat, fk.parent, [...seen, table]);
        if (up)
            return `${ident(fk.childCol)} IN (SELECT ${ident(fk.parentCol)} FROM ${ident(fk.parent)} WHERE ${up})`;
    }
    return null;
}
function deletionOrder(cat) {
    const scoped = [...cat.tables.keys()].filter((t) => scopePredicate(cat, t) !== null).sort();
    const depth = new Map();
    const parentsOf = (t) => cat.fks.filter((f) => f.child === t && f.parent !== t && scoped.includes(f.parent)).map((f) => f.parent);
    const anc = (t, seen = new Set()) => { if (seen.has(t))
        return 0; seen.add(t); return parentsOf(t).reduce((a, p) => Math.max(a, 1 + anc(p, new Set(seen))), 0); };
    for (const t of scoped)
        depth.set(t, anc(t));
    return scoped.sort((a, b) => (depth.get(b) - depth.get(a)) || a.localeCompare(b)).map((table) => { ident(table); return { table, where: scopePredicate(cat, table) }; });
}
async function markDemoRows(db, opts = {}) {
    const out = {};
    for (const r of exports.DEMO_ROOTS) {
        const n = await db.$executeRawUnsafe(`INSERT INTO "DemoMarker" ("tableName", "rowId", "dataClass", "batch") SELECT ${lit(r.table)}, "id", '${CLASS}', $1 FROM ${ident(r.table)} WHERE ${r.seededWhere} ON CONFLICT DO NOTHING`, opts.batch ?? 'seed-demo').catch((e) => { if (/does not exist/i.test(String(e.message)))
            return 0; throw e; });
        if (n)
            out[r.table] = n;
    }
    return out;
}
const firstLine = (e) => {
    const raw = String(e?.message ?? e);
    const m = /Message: `([^`]*)`/.exec(raw);
    return (m?.[1] ?? raw).split('\n').map((l) => l.trim()).filter(Boolean)[0]?.slice(0, 200) ?? 'refused';
};
let spN = 0;
async function attempt(db, sql, ...values) {
    const sp = `demo_sp_${++spN}`;
    await db.$executeRawUnsafe(`SAVEPOINT ${sp}`);
    try {
        const n = await db.$executeRawUnsafe(sql, ...values);
        await db.$executeRawUnsafe(`RELEASE SAVEPOINT ${sp}`);
        return { n };
    }
    catch (e) {
        await db.$executeRawUnsafe(`ROLLBACK TO SAVEPOINT ${sp}`);
        await db.$executeRawUnsafe(`RELEASE SAVEPOINT ${sp}`);
        return { error: firstLine(e) };
    }
}
const markedIds = (table) => `SELECT "rowId" FROM "DemoMarker" WHERE "dataClass" = '${CLASS}' AND "tableName" = ${lit(table)}`;
async function removeDemoData(db) {
    const cat = await readCatalogue(db);
    const order = deletionOrder(cat);
    const report = { orgs: [], shared: [], markersCleaned: 0, totalDeleted: 0 };
    for (const root of exports.DEMO_ROOTS.filter((r) => r.kind === 'org')) {
        const orgs = await db.$queryRawUnsafe(`SELECT "id", "name" FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)}) ORDER BY "id"`);
        for (const org of orgs) {
            const rep = { orgId: org.id, name: org.name, deleted: {}, kept: [], organisationDeleted: false };
            const reasons = new Map();
            for (let pass = 0; pass < 6; pass++) {
                let progressed = false;
                for (const t of order) {
                    const r = await attempt(db, `DELETE FROM ${ident(t.table)} WHERE ${t.where}`, org.id);
                    if ('error' in r) {
                        reasons.set(t.table, r.error);
                        continue;
                    }
                    reasons.delete(t.table);
                    if (r.n > 0) {
                        rep.deleted[t.table] = (rep.deleted[t.table] ?? 0) + r.n;
                        report.totalDeleted += r.n;
                        progressed = true;
                    }
                }
                if (!progressed)
                    break;
            }
            for (const t of order) {
                const left = (await db.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM ${ident(t.table)} WHERE ${t.where}`, org.id))[0]?.n ?? 0;
                if (left > 0)
                    rep.kept.push({ table: t.table, rows: left, reason: reasons.get(t.table) ?? 'still referenced' });
            }
            if (rep.kept.length === 0) {
                const r = await attempt(db, `DELETE FROM ${ident(root.table)} WHERE "id" = $1 AND "id" IN (${markedIds(root.table)})`, org.id);
                if ('error' in r)
                    rep.kept.push({ table: root.table, rows: 1, reason: r.error });
                else if (r.n > 0) {
                    rep.organisationDeleted = true;
                    report.totalDeleted += r.n;
                }
            }
            report.orgs.push(rep);
        }
    }
    for (const root of exports.DEMO_ROOTS.filter((r) => r.kind === 'shared')) {
        const refs = cat.fks.filter((f) => f.parent === root.table && f.onDelete !== 'n').map((f) => `NOT EXISTS (SELECT 1 FROM ${ident(f.child)} WHERE ${ident(f.childCol)} = ${ident(root.table)}.${ident(f.parentCol)})`);
        const before = (await db.$queryRawUnsafe(`SELECT COUNT(*)::int AS n FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)})`))[0]?.n ?? 0;
        const r = await attempt(db, `DELETE FROM ${ident(root.table)} WHERE "id" IN (${markedIds(root.table)})${refs.length ? ` AND ${refs.join(' AND ')}` : ''}`);
        const deleted = 'n' in r ? r.n : 0;
        report.totalDeleted += deleted;
        report.shared.push({ table: root.table, deleted, kept: Math.max(0, before - deleted) });
    }
    for (const root of exports.DEMO_ROOTS) {
        report.markersCleaned += await db.$executeRawUnsafe(`DELETE FROM "DemoMarker" m WHERE m."dataClass" = '${CLASS}' AND m."tableName" = ${lit(root.table)} AND NOT EXISTS (SELECT 1 FROM ${ident(root.table)} x WHERE x."id" = m."rowId")`);
    }
    return report;
}
function parseMode(argv) {
    const dry = argv.includes('--dry-run');
    const confirm = argv.includes('--confirm');
    const mark = argv.includes('--mark');
    if (dry && confirm)
        throw new Error('--dry-run and --confirm cannot be combined');
    if (mark && (dry || confirm))
        throw new Error('--mark stands alone');
    const unknown = argv.filter((a) => !['--dry-run', '--confirm', '--mark'].includes(a));
    if (unknown.length)
        throw new Error(`unknown argument ${unknown[0]} (use --dry-run, --confirm or --mark)`);
    return mark ? 'mark' : confirm ? 'confirm' : 'dry-run';
}
function formatReport(rep, confirmed) {
    const out = [];
    if (!rep.orgs.length)
        out.push('  no marked demo organisation');
    for (const o of rep.orgs) {
        const rows = Object.values(o.deleted).reduce((a, b) => a + b, 0);
        out.push(`  organisation ${o.orgId} (${o.name ?? 'unnamed'}): ${rows} row(s) ${confirmed ? 'deleted' : 'would be deleted'} in ${Object.keys(o.deleted).length} table(s); organisation row ${o.organisationDeleted ? (confirmed ? 'deleted' : 'would be deleted') : 'kept'}`);
        for (const [t, n] of Object.entries(o.deleted).sort())
            out.push(`      ${t.padEnd(30)} ${n}`);
        for (const k of o.kept)
            out.push(`      KEPT ${k.table.padEnd(25)} ${k.rows} row(s): ${k.reason}`);
    }
    for (const s of rep.shared)
        out.push(`  shared ${s.table}: ${s.deleted} ${confirmed ? 'deleted' : 'would be deleted'}, ${s.kept} kept (still referenced)`);
    return out;
}
//# sourceMappingURL=demo-data.js.map