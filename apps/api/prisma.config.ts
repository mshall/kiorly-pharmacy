// Prisma 7 CLI configuration: the datasource URL lives here (not in schema.prisma). The runtime client gets its connection
// through the pg driver adapter in src/prisma/pg-adapter.ts. dotenv never overrides variables that are already set.
import { config as loadEnv } from "dotenv";
import { defineConfig, env } from "prisma/config";

loadEnv({ path: ".env", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
});
