// Runs DB-backed tests against an isolated test database (kiorly_pharmacy_test locally; DATABASE_URL in CI), migrating first.
import { spawnSync } from "node:child_process";

const local = "postgresql://postgres:postgres@127.0.0.1:5433/kiorly_pharmacy_test?schema=public";
const url = process.env.TEST_DATABASE_URL ?? (process.env.CI ? process.env.DATABASE_URL ?? local : local);
const env = { ...process.env, DATABASE_URL: url, NODE_ENV: "test", SWAGGER_ENABLED: "false", JOBS_ENABLED: "false", SIGNIN_RATE_PER_IP_PER_MINUTE: process.env.SIGNIN_RATE_PER_IP_PER_MINUTE ?? "100000" }; // the per-address sign-in limiter (30/min, Postgres counters) would throttle the many fixture logins of one test process
const run = (cmd, args) => { const r = spawnSync(cmd, args, { stdio: "inherit", env }); if (r.status !== 0) process.exit(r.status ?? 1); };

run("npx", ["prisma", "migrate", "deploy"]);
const files = process.argv.slice(2);
run("node", ["--require", "@swc-node/register", "--test", "--test-concurrency=1", ...(files.length ? files : ["test/**/*.e2e.test.ts"])]);
