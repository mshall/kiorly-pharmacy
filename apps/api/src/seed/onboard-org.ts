/**
 * Operator tool: create a Pharmacy organisation with its first owner (the public sign-up needs the owner's own browser and Kiorex Passport; this is for operator-created and test organisations).
 * Every value comes from the environment (never from a file in git, never printed):
 *   ORG_NAME, OWNER_NAME, OWNER_EMAIL, OWNER_PHONE (E.164, confirmed by the operator: the first Kiorex Passport sign-in by that OTP-verified phone binds the owner when OIDC_PHONE_LINK=true),
 *   optional OWNER_PASSWORD, MARKET_CODE (default EG; fixed for life), TAG_BATCH (registers the organisation in "DemoMarker" so `npm run demo-data:remove` can delete a throwaway one),
 *   optional first staff member: EXTRA_EMAIL, EXTRA_NAME, EXTRA_ROLE (default CASHIER), EXTRA_PASSWORD.
 * Idempotent per owner e-mail: an existing owner is left as it is.
 */
import { PrismaClient } from "../generated/prisma/client";
import { createPgAdapter } from "../prisma/pg-adapter";
import { normalizePhone } from "../auth/passport";
import { hashPassword } from "../auth/password";

const need = (k: string): string => { const v = process.env[k]?.trim(); if (!v) throw new Error(`${k} is required`); return v; };
const strong = (pw: string | undefined, label: string) => { if (pw && pw.length < 10) throw new Error(`${label} needs at least 10 characters`); return pw; };

async function main() {
  const email = need("OWNER_EMAIL").toLowerCase();
  const phone = process.env.OWNER_PHONE ? normalizePhone(process.env.OWNER_PHONE) : null;
  if (process.env.OWNER_PHONE && !phone) throw new Error("OWNER_PHONE must be E.164");
  const pw = strong(process.env.OWNER_PASSWORD, "OWNER_PASSWORD"); const xpw = strong(process.env.EXTRA_PASSWORD, "EXTRA_PASSWORD");
  const prisma = new PrismaClient({ adapter: createPgAdapter() });
  try {
    if (await prisma.staffUser.findUnique({ where: { email } })) { console.log("owner exists: nothing changed"); return; }
    const out = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({ data: { name: need("ORG_NAME"), marketCode: (process.env.MARKET_CODE ?? "EG").toUpperCase(), edition: "LITE", settings: { mode: "STANDALONE" } } });
      const branch = await tx.branch.create({ data: { orgId: tenant.id, name: need("ORG_NAME"), code: "B1" } });
      const owner = await tx.staffUser.create({ data: { orgId: tenant.id, displayName: need("OWNER_NAME"), email, role: "OWNER", phone, ...(pw ? { passwordHash: await hashPassword(pw) } : {}) } });
      if (process.env.EXTRA_EMAIL) {
        await tx.staffUser.create({ data: { orgId: tenant.id, branchId: branch.id, displayName: process.env.EXTRA_NAME ?? "Staff", email: process.env.EXTRA_EMAIL.toLowerCase(), role: (process.env.EXTRA_ROLE ?? "CASHIER") as "CASHIER", ...(xpw ? { passwordHash: await hashPassword(xpw) } : {}) } });
      }
      if (process.env.TAG_BATCH) await tx.$executeRawUnsafe(`INSERT INTO "DemoMarker" ("tableName","rowId","dataClass","batch") VALUES ('Tenant',$1,'DEMO',$2) ON CONFLICT DO NOTHING`, tenant.id, process.env.TAG_BATCH);
      return { tenantId: tenant.id, ownerId: owner.id };
    });
    console.log(JSON.stringify({ ...out, phoneSet: !!phone, passwordSet: !!pw, tagged: !!process.env.TAG_BATCH }));
  } finally { await prisma.$disconnect(); }
}
main().catch((e) => { console.error(e instanceof Error ? e.message : e); process.exit(1); });
