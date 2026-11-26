/**
 * Container PID 1 of the Kiorly Pharmacy API image. Host-agnostic (AWS App Runner, ECS, a single Docker host, Kubernetes): no cloud SDK.
 *
 *  1. DATABASE_URL: used as given; otherwise built from DB_SECRET_JSON (the JSON of a Secrets Manager / Vault secret injected as ONE env var:
 *     host, port, username, password, dbname) or from DB_HOST [DB_PORT DB_NAME DB_USER DB_PASSWORD DB_SSLMODE DB_SCHEMA]. Credentials are URL-encoded and never logged.
 *  2. `prisma migrate deploy` (unless PRISMA_MIGRATE_ON_BOOT=false) with bounded retries (MIGRATE_MAX_ATTEMPTS, default 8; MIGRATE_RETRY_BASE_MS, default 3000,
 *     linear back-off capped at 30 s). The database may still be starting, so retries cover that. If every attempt fails the process EXITS NON-ZERO
 *     and the server never starts: the container never looks healthy on a half-migrated database (the orchestrator restarts it or shows it failed).
 *  3. Starts the Nest server (dist/main.js) as a child; SIGTERM/SIGINT are forwarded; the child's exit code is the container's exit code.
 * Seeding never runs on boot.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const log = (m) => process.stderr.write(`[boot] ${m}\n`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const posInt = (v, d) => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : d; };

export function buildDatabaseUrl(env) {
  if (env.DATABASE_URL?.trim()) return { url: env.DATABASE_URL, host: "(DATABASE_URL)" };
  let p = {};
  if (env.DB_SECRET_JSON?.trim()) {
    try { p = JSON.parse(env.DB_SECRET_JSON); } catch { throw new Error("DB_SECRET_JSON is not valid JSON"); }
  }
  const host = p.host ?? p.hostname ?? p.endpoint ?? env.DB_HOST;
  if (!host) throw new Error("no database configured: set DATABASE_URL, or DB_SECRET_JSON, or DB_HOST (+ DB_USER, DB_PASSWORD, DB_NAME)");
  const user = p.username ?? p.user ?? env.DB_USER ?? "postgres";
  const pass = p.password ?? env.DB_PASSWORD ?? "";
  const name = p.dbname ?? p.database ?? env.DB_NAME ?? "postgres";
  const port = p.port ?? env.DB_PORT ?? 5432;
  const q = new URLSearchParams({ schema: env.DB_SCHEMA ?? "public" });
  if (env.DB_SSLMODE) q.set("sslmode", env.DB_SSLMODE);
  return { url: `postgresql://${encodeURIComponent(String(user))}:${encodeURIComponent(String(pass))}@${host}:${port}/${encodeURIComponent(String(name))}?${q}`, host: String(host) };
}

const run = (cmd, args) => new Promise((resolve) => {
  const c = spawn(cmd, args, { stdio: "inherit", env: process.env, cwd: here });
  c.on("error", () => resolve(127));
  c.on("close", (code) => resolve(code ?? 1));
});

async function main() {
  try {
    const db = buildDatabaseUrl(process.env);
    process.env.DATABASE_URL = db.url;
    log(`database host ${db.host}`);
  } catch (e) { log(`FATAL: ${e.message}`); process.exit(2); }

  if (process.env.PRISMA_MIGRATE_ON_BOOT !== "false") {
    const max = posInt(process.env.MIGRATE_MAX_ATTEMPTS, 8);
    const base = posInt(process.env.MIGRATE_RETRY_BASE_MS, 3000);
    let ok = false;
    for (let attempt = 1; attempt <= max; attempt++) {
      log(`prisma migrate deploy (attempt ${attempt}/${max})`);
      if ((await run("prisma", ["migrate", "deploy", "--config", process.env.PRISMA_CONFIG ?? "/opt/prisma/prisma.config.mjs"])) === 0) { ok = true; break; }
      if (attempt < max) await sleep(Math.min(30_000, base * attempt));
    }
    if (!ok) { log(`FATAL: migrations failed after ${max} attempts; not starting the server`); process.exit(1); }
    log("migrations applied");
  } else log("PRISMA_MIGRATE_ON_BOOT=false: skipping migrations");

  const server = spawn(process.execPath, [path.join(here, "dist", "main.js")], { stdio: "inherit", env: process.env });
  for (const sig of ["SIGTERM", "SIGINT"]) process.on(sig, () => server.kill(sig));
  server.on("exit", (code, signal) => process.exit(code ?? (signal ? 1 : 0)));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
