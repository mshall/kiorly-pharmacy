"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const pg_adapter_1 = require("../prisma/pg-adapter");
const passport_1 = require("../auth/passport");
const password_1 = require("../auth/password");
const need = (k) => { const v = process.env[k]?.trim(); if (!v)
    throw new Error(`${k} is required`); return v; };
const strong = (pw, label) => { if (pw && pw.length < 10)
    throw new Error(`${label} needs at least 10 characters`); return pw; };
async function main() {
    const email = need("OWNER_EMAIL").toLowerCase();
    const phone = process.env.OWNER_PHONE ? (0, passport_1.normalizePhone)(process.env.OWNER_PHONE) : null;
    if (process.env.OWNER_PHONE && !phone)
        throw new Error("OWNER_PHONE must be E.164");
    const pw = strong(process.env.OWNER_PASSWORD, "OWNER_PASSWORD");
    const xpw = strong(process.env.EXTRA_PASSWORD, "EXTRA_PASSWORD");
    const prisma = new client_1.PrismaClient({ adapter: (0, pg_adapter_1.createPgAdapter)() });
    try {
        if (await prisma.staffUser.findUnique({ where: { email } })) {
            console.log("owner exists: nothing changed");
            return;
        }
        const out = await prisma.$transaction(async (tx) => {
            const tenant = await tx.tenant.create({ data: { name: need("ORG_NAME"), marketCode: (process.env.MARKET_CODE ?? "EG").toUpperCase(), edition: "LITE", settings: { mode: "STANDALONE" } } });
            const branch = await tx.branch.create({ data: { orgId: tenant.id, name: need("ORG_NAME"), code: "B1" } });
            const owner = await tx.staffUser.create({ data: { orgId: tenant.id, displayName: need("OWNER_NAME"), email, role: "OWNER", phone, ...(pw ? { passwordHash: await (0, password_1.hashPassword)(pw) } : {}) } });
            if (process.env.EXTRA_EMAIL) {
                await tx.staffUser.create({ data: { orgId: tenant.id, branchId: branch.id, displayName: process.env.EXTRA_NAME ?? "Staff", email: process.env.EXTRA_EMAIL.toLowerCase(), role: (process.env.EXTRA_ROLE ?? "CASHIER"), ...(xpw ? { passwordHash: await (0, password_1.hashPassword)(xpw) } : {}) } });
            }
            if (process.env.TAG_BATCH)
                await tx.$executeRawUnsafe(`INSERT INTO "DemoMarker" ("tableName","rowId","dataClass","batch") VALUES ('Tenant',$1,'DEMO',$2) ON CONFLICT DO NOTHING`, tenant.id, process.env.TAG_BATCH);
            return { tenantId: tenant.id, ownerId: owner.id };
        });
        console.log(JSON.stringify({ ...out, phoneSet: !!phone, passwordSet: !!pw, tagged: !!process.env.TAG_BATCH }));
    }
    finally {
        await prisma.$disconnect();
    }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
//# sourceMappingURL=onboard-org.js.map