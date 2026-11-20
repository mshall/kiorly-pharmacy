import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Prisma 7 talks to Postgres through the `pg` driver adapter. DATABASE_URL keeps the Prisma-style query parameters we
 * already use (`schema`, `connection_limit`, `connect_timeout`, `pool_timeout`); they are translated to adapter/pool options here
 * and removed from the connection string handed to `pg`.
 */
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
      ...(Number.isFinite(limit) && limit > 0 ? { max: limit } : {}),
      connectionTimeoutMillis: Math.max(connectTimeoutSec, poolTimeoutSec) * 1000,
    },
    schema ? { schema } : undefined,
  );
}
