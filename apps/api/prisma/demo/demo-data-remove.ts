/**
 * Demo data removal for the Pharmacy (founder request: "remove the dummy records, keep the real ones"). Same contract as the Kiorex platform tool.
 *
 *   npm run demo-data:remove -- --dry-run     DEFAULT. A rehearsal: runs the whole removal inside a transaction that is rolled back and prints the exact result. Writes nothing.
 *   npm run demo-data:remove -- --confirm     deletes what the rehearsal showed, in ONE transaction.
 *   npm run demo-data:remove -- --mark        one-time backfill: registers the demo organisations and the synthetic catalogue of a database seeded before the marker existed
 *                                             (the seeds tag as they go, so this is only for an old database).
 *
 * Starts ONLY from the rows registered in "DemoMarker" (never an id pattern, a name or a date). Append-only tables (stock movements, audit log, controlled-substance log,
 * ...) refuse the delete by design and keep their rows; the report names them. This tool never disables a trigger. Safe to repeat.
 * Flags: --dry-run and --confirm together are refused. DATABASE_URL (or DB_SECRET_ARN via the container entrypoint) selects the database.
 */
import { PrismaClient } from "../../src/generated/prisma/client";
import { createPgAdapter } from "../../src/prisma/pg-adapter";
import { formatReport, markDemoRows, parseMode, removeDemoData, type RemovalReport } from "../../src/common/demo-data";

class Rehearsal extends Error { constructor(public readonly report: RemovalReport) { super("rehearsal"); } }

export async function run(argv: string[], prisma: PrismaClient, log: (m: string) => void = console.log): Promise<RemovalReport | null> {
  const mode = parseMode(argv);
  log(`demo-data: mode=${mode}`);
  if (mode === "mark") { log(`marked ${JSON.stringify(await markDemoRows(prisma as never, { batch: "backfill" }))}`); return null; }
  let report: RemovalReport;
  if (mode === "dry-run") {
    try { await prisma.$transaction(async (tx) => { throw new Rehearsal(await removeDemoData(tx as never)); }, { timeout: 120_000 }); throw new Error("unreachable"); }
    catch (e) { if (!(e instanceof Rehearsal)) throw e; report = e.report; }
  } else {
    report = await prisma.$transaction(async (tx) => removeDemoData(tx as never), { timeout: 120_000 });
  }
  for (const l of formatReport(report, mode === "confirm")) log(l);
  log(mode === "confirm" ? `demo-data: deleted ${report.totalDeleted} row(s); ${report.markersCleaned} marker(s) cleaned` : "dry run: nothing was changed. Re-run with --confirm to delete exactly this.");
  return report;
}

if (require.main === module) {
  const prisma = new PrismaClient({ adapter: createPgAdapter() });
  run(process.argv.slice(2), prisma).catch((e) => { console.error(`demo-data: ${(e as Error).message}`); process.exitCode = 1; }).finally(() => prisma.$disconnect());
}
