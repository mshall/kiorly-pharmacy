import { PrismaClient } from "../generated/prisma/client";
import { createPgAdapter } from "../prisma/pg-adapter";
import { markDemoRows } from "./demo-data";

/** Called by every demo seed when it is done: registers the rows it created in "DemoMarker" so `npm run demo-data:remove` can find them later. Idempotent; never fails the seed. */
export async function tagDemoRows(batch: string): Promise<void> {
  const prisma = new PrismaClient({ adapter: createPgAdapter() });
  try {
    const n = await markDemoRows(prisma as never, { batch });
    console.log(`demo-data: tagged ${JSON.stringify(n)} (npm run demo-data:remove -- --dry-run lists what would go)`);
  } catch (e) {
    console.warn(`demo-data: tagging skipped: ${(e as Error).message}`);
  } finally { await prisma.$disconnect(); }
}
