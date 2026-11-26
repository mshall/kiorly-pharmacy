import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./app.setup";
import { loadEnv } from "./config/env";
import { assertProviderConfig } from "./providers/provider-env";
import { homeOrigins } from "./auth/handoff";
import { warnIfLeadSigningMissing } from "./providers/lead-signing-status";
import { apiPrefix, corsOrigins, warnStartupConfig } from "./config/runtime-env";

async function bootstrap() {
  loadEnv();
  assertProviderConfig(); // fail fast: <KIND>_MODE=real without URL / key / webhook secret / sender never boots (names only, no values logged)
  warnStartupConfig(); // production on an ephemeral STORAGE_DIR / no CORS_ORIGINS: notices only
  warnIfLeadSigningMissing(); // production without KIOREX_LEAD_SIGNING_SECRET: a notice only (names, never values)
  const app = await NestFactory.create(AppModule, { rawBody: true });
  // Kiorly Home (password handoff) is allow-listed too: KIORLY_HOME_ORIGINS (from config/domains.json), local default only outside production.
  app.enableCors({ origin: [...corsOrigins(process.env, "http://localhost:5190,http://127.0.0.1:5190,http://localhost:8082,http://127.0.0.1:8082"), ...homeOrigins()], credentials: false });
  configureApp(app);
  const port = Number(process.env.PORT ?? 3100);
  const host = process.env.LISTEN_HOST ?? "0.0.0.0";
  await app.listen(port, host);
  console.log(`Kiorly Pharmacy API listening on http://localhost:${port}/${apiPrefix()}`);
}

void bootstrap();
