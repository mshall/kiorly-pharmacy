"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_POOL_MAX = void 0;
exports.resolvePoolMax = resolvePoolMax;
exports.createPgAdapter = createPgAdapter;
const adapter_pg_1 = require("@prisma/adapter-pg");
exports.DEFAULT_POOL_MAX = 10;
function resolvePoolMax(connectionLimit) {
    if (Number.isInteger(connectionLimit) && connectionLimit > 0)
        return connectionLimit;
    const env = Number(process.env.DB_POOL_MAX);
    return Number.isInteger(env) && env > 0 ? env : exports.DEFAULT_POOL_MAX;
}
function createPgAdapter(databaseUrl = process.env.DATABASE_URL) {
    if (!databaseUrl)
        throw new Error("DATABASE_URL is not set");
    const url = new URL(databaseUrl);
    const take = (name) => {
        const v = url.searchParams.get(name) ?? undefined;
        url.searchParams.delete(name);
        return v;
    };
    const schema = take("schema");
    const limit = Number(take("connection_limit"));
    const connectTimeoutSec = Number(take("connect_timeout")) || 10;
    const poolTimeoutSec = Number(take("pool_timeout")) || 10;
    return new adapter_pg_1.PrismaPg({
        connectionString: url.toString(),
        max: resolvePoolMax(limit),
        connectionTimeoutMillis: Math.max(connectTimeoutSec, poolTimeoutSec) * 1000,
    }, schema ? { schema } : undefined);
}
//# sourceMappingURL=pg-adapter.js.map