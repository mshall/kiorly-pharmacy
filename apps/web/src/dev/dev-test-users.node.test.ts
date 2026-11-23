import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { DEMO_PASSWORD, DEV_GROUPS, DEV_USERS } from "./dev-test-users-data.ts";

const here = path.dirname(fileURLToPath(import.meta.url));

test("dev test users are the 15 documented synthetic pharmacy logins", () => {
  assert.equal(DEV_USERS.length, 15);
  assert.equal(DEMO_PASSWORD, "Demo@12345");
  for (const u of DEV_USERS) { assert.ok(DEV_GROUPS[u.group]); assert.match(u.email, /@demo\.kiorly\.local$/); }
  assert.equal(new Set(DEV_USERS.map((u) => u.email)).size, 15);
});

test("the panel and its credentials are absent from a production build (and present in a development build)", { timeout: 240_000 }, () => {
  execFileSync("node", [path.join(here, "../../scripts/check-no-dev-test-users.mjs")], { stdio: "pipe", cwd: path.join(here, "../..") });
});
