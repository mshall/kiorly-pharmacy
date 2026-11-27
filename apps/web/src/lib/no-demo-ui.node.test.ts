import { execFileSync } from "node:child_process";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

test("no test-users panel, demo credentials or local address in the production or development bundle", { timeout: 240_000 }, () => {
  execFileSync("node", [path.join(here, "../../scripts/check-no-dev-test-users.mjs")], { stdio: "pipe", cwd: path.join(here, "../..") });
});
