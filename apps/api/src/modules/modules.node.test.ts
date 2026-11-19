import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { BOUNDED_CONTEXTS } from "./modules.registry";

describe("bounded-context placeholders", () => {
  it("each context has a module file and is imported by AppModule", () => {
    const app = readFileSync(resolve(__dirname, "../app.module.ts"), "utf8");
    for (const c of BOUNDED_CONTEXTS) {
      assert.ok(existsSync(join(__dirname, c.dir, `${c.dir}.module.ts`)), c.dir);
      assert.ok(app.includes(c.name), `AppModule imports ${c.name}`);
    }
  });
});
