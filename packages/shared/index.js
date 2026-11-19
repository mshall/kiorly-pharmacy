"use strict";
// Kiorly Pharmacy shared constants (plain CJS so api and web can both consume without a build step).
const PRODUCT_KEY = "kiorly-pharmacy";
const FLAG_KEYS = ["pharmacy.module", "pharmacy.kiorex_orders", "pharmacy.forecasting", "pharmacy.insurer_claims"];
/** ADR-025: these are NEVER feature flags. */
const SAFETY_CONTROLS = [
  {
    "id": "safety.pharmacy.lot_expiry_block",
    "name": "LOT_EXPIRY_BLOCK",
    "description": "Sale of an expired lot is impossible",
    "requirements": "KPINV03"
  },
  {
    "id": "safety.pharmacy.lot_recall_block",
    "name": "LOT_RECALL_BLOCK",
    "description": "Sale of a recalled lot is impossible (cross-branch within 5 minutes)",
    "requirements": "KPINV03, KPSUP03"
  },
  {
    "id": "safety.pharmacy.lot_quarantine_block",
    "name": "LOT_QUARANTINE_BLOCK",
    "description": "Sale of a quarantined lot is impossible (cold-chain excursion, recall hold)",
    "requirements": "KPINV03, KPINV06"
  },
  {
    "id": "safety.pharmacy.pharmacist_signoff",
    "name": "PHARMACIST_SIGNOFF",
    "description": "Every Rx dispense carries pharmacist user + timestamp",
    "requirements": "KPRX06"
  },
  {
    "id": "safety.pharmacy.rx_safety_checks",
    "name": "RX_SAFETY_CHECKS",
    "description": "Interaction / allergy / duplicate checks run on every Rx",
    "requirements": "KPRX03"
  },
  {
    "id": "safety.pharmacy.controlled_substance_log",
    "name": "CONTROLLED_SUBSTANCE_LOG",
    "description": "Controlled-medicine dispensing log with ID capture; never exposed to Kiorex ordering",
    "requirements": "KPRX05"
  },
  {
    "id": "safety.pharmacy.audit_logging",
    "name": "AUDIT_LOGGING",
    "description": "State changes affecting stock, money, access are audited",
    "requirements": "KX-08 §09"
  },
  {
    "id": "safety.pharmacy.consent_enforcement",
    "name": "CONSENT_ENFORCEMENT",
    "description": "e-Rx intake requires a valid patient consent token",
    "requirements": "KPRX01"
  },
  {
    "id": "safety.pharmacy.tenant_isolation",
    "name": "TENANT_ISOLATION",
    "description": "Tenant isolation and authorization",
    "requirements": "KX-08 §09"
  },
  {
    "id": "safety.pharmacy.privileged_mfa",
    "name": "PRIVILEGED_MFA",
    "description": "Privileged MFA on production",
    "requirements": "KX-08 §09"
  }
];
module.exports = { PRODUCT_KEY, FLAG_KEYS, SAFETY_CONTROLS };
