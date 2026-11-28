"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagDemoRows = tagDemoRows;
const client_1 = require("../generated/prisma/client");
const pg_adapter_1 = require("../prisma/pg-adapter");
const demo_data_1 = require("./demo-data");
async function tagDemoRows(batch) {
    const prisma = new client_1.PrismaClient({ adapter: (0, pg_adapter_1.createPgAdapter)() });
    try {
        const n = await (0, demo_data_1.markDemoRows)(prisma, { batch });
        console.log(`demo-data: tagged ${JSON.stringify(n)} (npm run demo-data:remove -- --dry-run lists what would go)`);
    }
    catch (e) {
        console.warn(`demo-data: tagging skipped: ${e.message}`);
    }
    finally {
        await prisma.$disconnect();
    }
}
//# sourceMappingURL=demo-data-tag.js.map