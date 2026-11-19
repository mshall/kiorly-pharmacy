import "reflect-metadata";
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { loadEnv } from "../src/config/env";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/app.setup";

describe("health e2e", () => {
  let app: INestApplication;
  let base = "";

  before(async () => {
    loadEnv();
    process.env.SWAGGER_ENABLED = "false";
    const mod = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = mod.createNestApplication();
    configureApp(app);
    await app.listen(0, "127.0.0.1");
    base = await app.getUrl();
  });
  after(async () => {
    await app.close();
  });

  it("GET /api/v1/health/live => 200 ok", async () => {
    const res = await fetch(`${base}/api/v1/health/live`);
    assert.equal(res.status, 200);
    const body = (await res.json()) as { status: string; product: string };
    assert.equal(body.status, "ok");
    assert.equal(body.product, "kiorly-pharmacy");
  });

  it("GET /api/v1/health/ready => 200 with database ok", async () => {
    const res = await fetch(`${base}/api/v1/health/ready`);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { status: "ok", database: "ok" });
  });

  it("unprefixed /health/live is 404 (global prefix enforced)", async () => {
    const res = await fetch(`${base}/health/live`);
    assert.equal(res.status, 404);
  });
});
