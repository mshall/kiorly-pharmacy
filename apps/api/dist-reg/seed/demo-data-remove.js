"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
const client_1 = require("../generated/prisma/client");
const pg_adapter_1 = require("../prisma/pg-adapter");
const demo_data_1 = require("../common/demo-data");
class Rehearsal extends Error {
    report;
    constructor(report) {
        super("rehearsal");
        this.report = report;
    }
}
async function run(argv, prisma, log = console.log) {
    const mode = (0, demo_data_1.parseMode)(argv);
    log(`demo-data: mode=${mode}`);
    if (mode === "mark") {
        log(`marked ${JSON.stringify(await (0, demo_data_1.markDemoRows)(prisma, { batch: "backfill" }))}`);
        return null;
    }
    let report;
    if (mode === "dry-run") {
        try {
            await prisma.$transaction(async (tx) => { throw new Rehearsal(await (0, demo_data_1.removeDemoData)(tx)); }, { timeout: 120_000 });
            throw new Error("unreachable");
        }
        catch (e) {
            if (!(e instanceof Rehearsal))
                throw e;
            report = e.report;
        }
    }
    else {
        report = await prisma.$transaction(async (tx) => (0, demo_data_1.removeDemoData)(tx), { timeout: 120_000 });
    }
    for (const l of (0, demo_data_1.formatReport)(report, mode === "confirm"))
        log(l);
    log(mode === "confirm" ? `demo-data: deleted ${report.totalDeleted} row(s); ${report.markersCleaned} marker(s) cleaned` : "dry run: nothing was changed. Re-run with --confirm to delete exactly this.");
    return report;
}
if (require.main === module) {
    const prisma = new client_1.PrismaClient({ adapter: (0, pg_adapter_1.createPgAdapter)() });
    run(process.argv.slice(2), prisma).catch((e) => { console.error(`demo-data: ${e.message}`); process.exitCode = 1; }).finally(() => prisma.$disconnect());
}
//# sourceMappingURL=demo-data-remove.js.map