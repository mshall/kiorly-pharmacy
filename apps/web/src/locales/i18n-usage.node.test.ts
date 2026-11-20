import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

const root = fileURLToPath(new URL("..", import.meta.url));
const en = JSON.parse(readFileSync(join(root, "locales/en.json"), "utf8")) as Record<string, unknown>;
const get = (k: string): unknown => k.split(".").reduce<unknown>((o, p) => (o && typeof o === "object" ? (o as Record<string, unknown>)[p] : undefined), en);

const walk = (d: string): string[] => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : /\.tsx?$/.test(n) && !n.endsWith(".test.ts") ? [p] : []; });

describe("i18n usage", () => {
  it("every literal t('key') used in the UI exists in en.json (and therefore, by parity, in ar.json)", () => {
    const missing: string[] = [];
    for (const f of walk(root)) for (const m of readFileSync(f, "utf8").matchAll(/\bt\("([a-zA-Z0-9_.-]+)"/g)) if (get(m[1]!) === undefined) missing.push(`${f.replace(root, "")}: ${m[1]}`);
    assert.deepEqual(missing, []);
  });

  it("dynamic key families cover every backend enum value", () => {
    const families: Record<string, string[]> = {
      lot: ["AVAILABLE", "RESERVED", "RECEIVED", "QUARANTINE", "RECALLED", "EXPIRED", "DISPENSED"],
      roles: ["OWNER", "PHARMACIST", "CASHIER", "BRANCH_MANAGER", "CHAIN_OPS", "ASSISTANT"],
      rxStatus: ["RECEIVED", "VALIDATING", "VALIDATED", "PARTIALLY_DISPENSED", "DISPENSED", "REJECTED", "CANCELLED", "EXPIRED", "TRANSFERRED_OUT"],
      rxSource: ["PAPER_SCAN", "KIORLY_E_RX", "KIOREX_UPLOAD", "MANUAL_ENTRY", "TRANSFER_IN"],
      dispStatus: ["DRAFT", "VALIDATED", "RESERVED", "SIGNED_OFF", "DISPENSED", "CANCELLED"],
      check: ["INTERACTION", "ALLERGY", "DUPLICATE_THERAPY", "DOSE_QUANTITY", "PRESCRIBER", "CONTROLLED_LIMIT", "DOSE_RANGE", "PREGNANCY_LACTATION", "RENAL_HEPATIC"],
      "promo.kind": ["PERCENT_OFF", "AMOUNT_OFF", "BUY_X_GET_Y", "BUNDLE_PRICE"], "promo.state": ["LIVE", "SCHEDULED", "ENDED", "EXHAUSTED", "OFF"], "pos.cashCat": ["FLOAT_TOP_UP", "OWNER_DEPOSIT", "OTHER_IN", "PETTY_CASH", "BANK_DEPOSIT", "SUPPLIER_PAYMENT", "EXPENSE", "OWNER_WITHDRAWAL", "OTHER_OUT"],
      "inv.rc": ["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"], "inv.lk": ["SHELF", "FRIDGE", "SAFE", "BACKROOM", "DISPLAY", "QUARANTINE"], "inv.cls": ["FAST", "NORMAL", "SLOW", "DEAD"], "inv.tr": ["REQUESTED", "IN_TRANSIT", "RECEIVED", "CANCELLED"], "inv.mt": ["RECEIPT", "SALE", "DISPENSE", "RETURN_FROM_CUSTOMER", "RETURN_TO_SUPPLIER", "ADJUSTMENT", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF", "TRANSFER_OUT", "TRANSFER_IN", "COUNT_VARIANCE"],
      "pur.rfqStatus": ["DRAFT", "SENT", "QUOTED", "AWARDED", "CLOSED", "CANCELLED"], "pur.ag": ["current", "d1_30", "d31_60", "d61_90", "d90_plus"], "fin.cat": ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"], "fin.pm": ["CASH", "CARD", "BANK", "OTHER"], claimStatus: ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "PAID"],
      "ctl.kind": ["RECEIPT", "DISPENSE", "ADJUSTMENT", "COUNT_VARIANCE", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF", "RETURN_TO_SUPPLIER", "RETURN_FROM_CUSTOMER", "TRANSFER_OUT", "TRANSFER_IN", "SALE"], "saf.kind": ["INTERACTION", "DOSE_RANGE", "PREGNANCY", "LACTATION", "RENAL", "HEPATIC"], "saf.sev": ["MINOR", "MODERATE", "MAJOR", "CONTRAINDICATED"],
      outcome: ["PASS", "WARN", "BLOCK", "OVERRIDDEN_BY_PHARMACIST"],
      method: ["CASH", "CARD", "INSTAPAY", "FAWRY", "WALLET", "CUSTOMER_CREDIT", "KIOREX_PREPAID", "LOYALTY_POINTS"],
      saleStatus: ["OPEN", "COMPLETED", "VOIDED", "PARTIALLY_RETURNED", "RETURNED"],
      ordStatus: ["RECEIVED", "ACCEPTED", "PARTIALLY_ACCEPTED", "REJECTED", "READY", "DISPENSED", "CANCELLED", "EXPIRED"],
      poStatus: ["DRAFT", "SENT", "PARTIALLY_RECEIVED", "RECEIVED", "CANCELLED"],
      recallStatus: ["ACTIVE", "LIFTED"], countStatus: ["OPEN", "PENDING_APPROVAL", "APPROVED", "REJECTED"], ledger: ["INVOICE", "PAYMENT", "RETURN_CREDIT", "ADJUSTMENT"],
      "rep.names": ["sales-daily", "top-sellers", "stock-valuation", "expiry", "controlled-register", "supplier-balances", "vat-lines", "dispensing-log"],
      z: ["salesCount", "grossSales", "vatTotal", "cashSales", "expectedCash", "countedCash", "variance"],
      sup: ["name", "phone", "email", "paymentTerms", "creditLimit"], inv: ["writeOff", "quarantine", "release"],
    };
    const missing = Object.entries(families).flatMap(([f, vals]) => vals.filter((v) => get(`${f}.${v}`) === undefined).map((v) => `${f}.${v}`));
    assert.deepEqual(missing, []);
  });

  it("backend error codes the UI should explain are translated", () => {
    for (const c of ["LOT_BLOCKED", "RX_REQUIRED", "SIGNOFF_REQUIRED", "PHARMACIST_REQUIRED", "INSUFFICIENT_STOCK", "SHIFT_REQUIRED", "PERMISSION_DENIED", "SAFETY_BLOCK_UNRESOLVED", "CONTROLLED_ID_REQUIRED", "RX_VALIDATION_REQUIRED"]) assert.notEqual(get(`errors.codes.${c}`), undefined, c);
  });
});
