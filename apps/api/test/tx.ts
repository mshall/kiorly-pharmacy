import type { Prisma, PrismaClient } from "../src/generated/prisma/client";

class Rollback extends Error {}

/** Runs fn in a transaction that is ALWAYS rolled back (so smoke tests leave no rows). DB errors from fn propagate. */
export async function rollbackTx<T>(prisma: PrismaClient, fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  let out: T | undefined;
  try {
    await prisma.$transaction(async (tx) => {
      out = await fn(tx);
      throw new Rollback();
    });
  } catch (e) {
    if (!(e instanceof Rollback)) throw e;
  }
  return out as T;
}
