import "reflect-metadata";
import { after, before, describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { Prisma } from "../src/generated/prisma/client";
import { loadEnv } from "../src/config/env";
import { PrismaService } from "../src/prisma/prisma.service";
import { schemaSmoke } from "./schema.pharmacy.cases";

/** Prisma 7 has no `Prisma.dmmf`: model names and scalar fields come from the generated `ModelName` / `<Model>ScalarFieldEnum` objects (no @@map in this schema, so table name = model name). */
const modelNames = Object.values(Prisma.ModelName);
const scalarFields = (m: Prisma.ModelName): string[] => Object.keys(Prisma[`${m}ScalarFieldEnum`]);

describe("schema smoke (FROZEN-v1)", () => {
  const prisma = new PrismaService();
  before(() => loadEnv());
  after(async () => { await prisma.$disconnect(); });

  it("schema.prisma carries the FROZEN-v1 banner", () => {
    const src = readFileSync(resolve(__dirname, "../prisma/schema.prisma"), "utf8");
    assert.match(src.slice(0, 600), /FROZEN-v1/);
    assert.doesNotMatch(src.slice(0, 200), /DRAFT SCHEMA/);
  });

  it("generated client exposes the expected core models", () => {
    const names: string[] = modelNames;
    for (const n of schemaSmoke.models) assert.ok(names.includes(n), `model ${n}`);
  });

  it("every model is tenant-scoped (orgId) except reference/child tables", () => {
    const missing = modelNames
      .filter((m) => !schemaSmoke.unscoped.includes(m))
      .filter((m) => !scalarFields(m).includes("orgId"));
    assert.deepEqual(missing, []);
  });

  it("migration is applied: every model has a table", async () => {
    const rows = await prisma.$queryRaw<{ table_name: string }[]>`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    const have = new Set(rows.map((r) => r.table_name));
    for (const m of modelNames) assert.ok(have.has(m), `table ${m}`);
  });

  it("domain invariants hold at the database level", async () => {
    await schemaSmoke.invariants(prisma);
  });
});
