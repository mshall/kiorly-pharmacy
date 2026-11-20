import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 talks to Postgres through the `pg` driver adapter. DATABASE_URL keeps the Prisma-style query parameters we
 * already use (`schema`, `connection_limit`, `connect_timeout`, `pool_timeout`); they are translated to adapter/pool options here
 * and removed from the connection string handed to `pg`.
 */
/**
 * Pool size when `DATABASE_URL` has no `connection_limit`: `DB_POOL_MAX`, else 10 (the `pg` default, made explicit).
 * Prisma 6 used num_cpus*2+1 (21 on a 10-core Mac), so budget per process: the shared dev cluster has max_connections=100.
 */
export const DEFAULT_POOL_MAX = 10;
export function resolvePoolMax(connectionLimit: number): number {
  if (Number.isInteger(connectionLimit) && connectionLimit > 0) return connectionLimit;
  const env = Number(process.env.DB_POOL_MAX);
  return Number.isInteger(env) && env > 0 ? env : DEFAULT_POOL_MAX;
}

export function createPgAdapter(databaseUrl: string | undefined = process.env.DATABASE_URL): PrismaPg {
  if (!databaseUrl) throw new Error("DATABASE_URL is not set");
  const url = new URL(databaseUrl);
  const take = (name: string): string | undefined => {
    const v = url.searchParams.get(name) ?? undefined;
    url.searchParams.delete(name);
    return v;
  };
  const schema = take("schema");
  const limit = Number(take("connection_limit"));
  const connectTimeoutSec = Number(take("connect_timeout")) || 10;
  const poolTimeoutSec = Number(take("pool_timeout")) || 10;
  return new PrismaPg(
    {
      connectionString: url.toString(),
      max: resolvePoolMax(limit),
      connectionTimeoutMillis: Math.max(connectTimeoutSec, poolTimeoutSec) * 1000,
    },
    schema ? { schema } : undefined,
  );
}
