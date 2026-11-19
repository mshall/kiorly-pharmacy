import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./app.setup";
import { loadEnv } from "./config/env";

async function bootstrap() {
  loadEnv();
  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.enableCors({ origin: (process.env.CORS_ORIGINS ?? "http://localhost:5190,http://127.0.0.1:5190").split(","), credentials: false });
  configureApp(app);
  const port = Number(process.env.PORT ?? 3100);
  const host = process.env.LISTEN_HOST ?? "0.0.0.0";
  await app.listen(port, host);
  console.log(`Kiorly Pharmacy API listening on http://localhost:${port}/api/v1`);
}

void bootstrap();
