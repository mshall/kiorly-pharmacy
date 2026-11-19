import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./app.setup";
import { loadEnv } from "./config/env";

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  const port = Number(process.env.PORT ?? 3100);
  const host = process.env.LISTEN_HOST ?? "0.0.0.0";
  await app.listen(port, host);
  console.log(`Kiorly Pharmacy API listening on http://localhost:${port}/api/v1`);
}

void bootstrap();
