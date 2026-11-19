import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * Founder decision (ADR-011, KX-01 FD-02, 19 Nov 2026): NO tax-authority reporting anywhere in the ecosystem.
 * This test FAILS if code references ETA / e-invoice submission endpoints, signing certificates, fiscal devices, ZATCA/FTA clients.
 * VAT *lines* on receipts/exports are allowed (market-pack config).
 */
const root = resolve(__dirname, "../../../..");
const SCAN = ["apps/api/src", "apps/api/prisma", "apps/web/src", "packages", "infra"];
const SELF = "no-tax-authority.node.test.ts";
const SKIP_DIRS = new Set(["node_modules", "dist", ".terraform", "migrations_lock"]);

const FORBIDDEN: Array<[RegExp, string]> = [
  [/eta\.gov\.eg|invoicing\.eta|api\.preprod\.invoicing|id\.eta\.gov/i, "Egyptian Tax Authority (ETA) endpoint"],
  [/\be[-_ ]?(invoice|receipt)s?\b/i, "e-invoice / e-receipt submission"],
  [/zatca|fatoora|fta\.gov|tax\.gov\.ae/i, "ZATCA / FTA endpoint"],
  [/submitInvoice|submitReceipt|submitDocument|documentSubmission|taxAuthority|tax_authority/i, "tax-authority submission function"],
  [/signing[-_ ]?cert|e[-_ ]?seal|eseal|\.pfx\b|usbToken|fiscal[-_ ]?(device|printer|memory)/i, "signing certificate / e-seal / fiscal device"],
  [/\beta[-_]?(uuid|status|submission|token|client|signature)\b|etaUuid|longId/i, "ETA identifiers"],
];

function walk(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => {
    if (SKIP_DIRS.has(n)) return [];
    const p = join(dir, n);
    const st = statSync(p);
    return st.isDirectory() ? walk(p) : /\.(ts|tsx|js|mjs|sql|prisma|json|tf|hcl|css|html)$/.test(n) && n !== SELF && !/package-lock\.json$/.test(n) ? [p] : [];
  });
}

describe("no-tax-authority (ADR-011, KX-01)", () => {
  it("no source, schema, migration, web or infra file references tax-authority submission", () => {
    const offenders: string[] = [];
    for (const dir of SCAN) for (const file of walk(join(root, dir))) {
      const src = readFileSync(file, "utf8");
      for (const [re, what] of FORBIDDEN) { const m = re.exec(src); if (m) offenders.push(`${file.replace(root + "/", "")}: ${what} ("${m[0]}")`); }
    }
    assert.deepEqual(offenders, [], "Kiorly never integrates with, submits to, or reports to any tax authority");
  });

  it("the Prisma schema has no tax-authority columns (VAT lines only)", () => {
    const schema = readFileSync(join(root, "apps/api/prisma/schema.prisma"), "utf8");
    assert.doesNotMatch(schema, /uuid|taxAuthority|etaStatus|submissionId|signature/i);
    assert.match(schema, /vatRate|vatTotal|vatAmount/);
  });

  it("the guard itself works (self-test on a synthetic violation)", () => {
    assert.ok(FORBIDDEN.some(([re]) => re.test("POST https://api.invoicing.eta.gov.eg/api/v1/documentsubmissions")));
    assert.ok(FORBIDDEN.some(([re]) => re.test("const eInvoice = submitInvoice(doc)")));
    assert.ok(FORBIDDEN.some(([re]) => re.test("send the e-receipt to the portal")));
    assert.ok(!FORBIDDEN.some(([re]) => re.test("receipt.vatTotal: VAT lines for the accountant")));
  });
});
