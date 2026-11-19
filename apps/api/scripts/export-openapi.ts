/** Writes the OpenAPI document to Docs/openapi.json (no DB access needed beyond module boot). `npm run openapi:export` */
import "reflect-metadata";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { NestFactory } from "@nestjs/core";
import { loadEnv } from "../src/config/env";
import { AppModule } from "../src/app.module";
import { buildOpenApi, configureApp } from "../src/app.setup";

async function main() {
  loadEnv();
  process.env.SWAGGER_ENABLED = "false";
  process.env.JOBS_ENABLED = "false";
  process.env.OUTBOX_POLL_ENABLED = "false";
  const app = await NestFactory.create(AppModule, { rawBody: true, logger: false });
  configureApp(app);
  const doc = buildOpenApi(app);
  const out = resolve(__dirname, "../../../Docs/openapi.json");
  writeFileSync(out, JSON.stringify(doc, null, 2) + "\n");
  console.log(`openapi: ${Object.keys(doc.paths).length} paths -> ${out}`);
  await app.close();
}
void main().then(() => process.exit(0));
