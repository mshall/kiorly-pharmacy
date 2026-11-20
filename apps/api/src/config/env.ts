import { config } from "dotenv";
import { resolve } from "node:path";

/** Loads apps/api/.env (if any) and applies local-dev defaults. Never put secrets in defaults. */
export function loadEnv(): void {
  config({ path: resolve(__dirname, "../../.env"), quiet: true });
  process.env.DATABASE_URL ??= "postgresql://postgres:postgres@127.0.0.1:5433/kiorly_pharmacy?schema=public";
  process.env.PORT ??= "3100";
}
