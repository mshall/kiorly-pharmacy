import test from "node:test";
import assert from "node:assert/strict";
import { demoPasswordHash, demoPasswordsAllowed } from "./demo-password";

test("demo passwords exist only locally: any declared deployed environment gets none", async () => {
  assert.equal(demoPasswordsAllowed({}), true);
  for (const e of ["local", "dev", "development"]) assert.equal(demoPasswordsAllowed({ KIORLY_ENV: e }), true, e);
  for (const e of ["test", "staging", "pilot", "prod", "production", "weird"]) assert.equal(demoPasswordsAllowed({ KIORLY_ENV: e }), false, e);
  assert.equal(await demoPasswordHash("x-demo-password", { KIORLY_ENV: "test" }), null);
  assert.match((await demoPasswordHash("x-demo-password", {}))!, /^scrypt\$/);
});
