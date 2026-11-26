import assert from "node:assert/strict";
import { test } from "node:test";
import { apiPrefix, corsNotice, corsOrigins, ephemeralStorageWarning, storageDirIsEphemeral } from "./runtime-env";

test("API_PREFIX defaults to api/v1, trims slashes, rejects odd characters", () => {
  assert.equal(apiPrefix({}), "api/v1");
  assert.equal(apiPrefix({ API_PREFIX: "/svc/v2/" }), "svc/v2");
  assert.throws(() => apiPrefix({ API_PREFIX: "a b" }));
  assert.throws(() => apiPrefix({ API_PREFIX: "a//b" }));
});

test("CORS_ORIGINS: explicit list wins, local default only outside production", () => {
  assert.deepEqual(corsOrigins({ CORS_ORIGINS: "https://a.example/, https://b.example" }, "http://x"), ["https://a.example", "https://b.example"]);
  assert.deepEqual(corsOrigins({}, "http://x,http://y"), ["http://x", "http://y"]);
  assert.deepEqual(corsOrigins({ NODE_ENV: "production" }, "http://x"), []);
  assert.deepEqual(corsOrigins({ CORS_ORIGINS: "", NODE_ENV: "development" }, "http://x"), []);
  assert.ok(corsNotice({ NODE_ENV: "production" }));
  assert.equal(corsNotice({ NODE_ENV: "production", CORS_ORIGINS: "https://a" }), null);
});

test("storage directory: ephemeral detection and the production-only warning", () => {
  assert.equal(storageDirIsEphemeral({}, "/app"), true);
  assert.equal(storageDirIsEphemeral({ STORAGE_DIR: "./.data" }, "/app"), true);
  assert.equal(storageDirIsEphemeral({ STORAGE_DIR: "/tmp/s" }, "/app"), true);
  assert.equal(storageDirIsEphemeral({ STORAGE_DIR: "/app/.data" }, "/app"), true);
  assert.equal(storageDirIsEphemeral({ STORAGE_DIR: "/data/storage" }, "/app"), false);
  assert.equal(ephemeralStorageWarning({ NODE_ENV: "development" }, "/app"), null);
  assert.ok(ephemeralStorageWarning({ NODE_ENV: "production" }, "/app")?.includes("LOST"));
  assert.ok(ephemeralStorageWarning({ NODE_ENV: "production", STORAGE_DIR: "/tmp/x" }, "/app"));
  assert.equal(ephemeralStorageWarning({ NODE_ENV: "production", STORAGE_DIR: "/data/storage" }, "/app"), null);
  assert.equal(ephemeralStorageWarning({ NODE_ENV: "production", STORAGE_MODE: "real" }, "/app"), null);
  assert.equal(ephemeralStorageWarning({ NODE_ENV: "production", STORAGE_DIR_PERSISTENT: "true" }, "/app"), null);
});
