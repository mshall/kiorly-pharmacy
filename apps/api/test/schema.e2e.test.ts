import "reflect-metadata";
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Prisma } from "@prisma/client";
import { loadEnv } from "../src/config/env";
import { PrismaService } from "../src/prisma/prisma.service";
import { schemaSmoke } from "./schema.pharmacy.cases";

describe("schema smoke (DRAFT schema, pending discovery)", () => {
  const prisma = new PrismaService();
  before(() => loadEnv());
  after(async () => { await prisma.$disconnect(); });

  it("schema.prisma carries the DRAFT banner", () => {
    const src = readFileSync(resolve(__dirname, "../prisma/schema.prisma"), "utf8");
    assert.match(src.slice(0, 600), /DRAFT/);
  });

  it("generated client exposes the expected core models", () => {
    const names = Prisma.dmmf.datamodel.models.map((m) => m.name);
    for (const n of schemaSmoke.models) assert.ok(names.includes(n), `model ${n}`);
  });

  it("every model is tenant-scoped (orgId) except reference/child tables", () => {
    const missing = Prisma.dmmf.datamodel.models
      .filter((m) => !schemaSmoke.unscoped.includes(m.name))
      .filter((m) => !m.fields.some((f) => f.name === "orgId"))
      .map((m) => m.name);
    assert.deepEqual(missing, []);
  });

  it("migration is applied: every model has a table", async () => {
    const rows = await prisma.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const have = new Set(rows.map((r) => r.table_name));
    for (const m of Prisma.dmmf.datamodel.models) assert.ok(have.has(m.dbName ?? m.name), `table ${m.name}`);
  });

  it("domain invariants hold at the database level", async () => {
    await schemaSmoke.invariants(prisma);
  });
});
