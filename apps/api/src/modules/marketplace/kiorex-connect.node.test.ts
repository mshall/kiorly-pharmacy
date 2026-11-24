import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { canRequest, deriveIntakeSigningKey, enrolmentIdOf, intakeHeaders, isEnrolmentCode, newIntakeNonce, deriveStatusToken, intakeUrl, kiorexHost, progressPct, signConnectBody, validatePayoutLabel } from "./kiorex-connect.core";
import { computePharmacySteps, type PharmacyConnectFacts } from "./kiorex-connect.logic";

const ready = (o: Partial<PharmacyConnectFacts> = {}): PharmacyConnectFacts => ({ status: "CONSENTED", subscriptionStatus: "ACTIVE", optedInBranches: 1, pricedItems: 12, branchesMissingHours: 0, branchesMissingLicenceNo: 0, licenceDocument: true, payoutLabel: true, termsAccepted: true, liveOnKiorex: false, ...o });
const st = (f: PharmacyConnectFacts, k: string) => computePharmacySteps(f).find((s) => s.key === k)!.status;

describe("pharmacy Connect to Kiorex (ADR-040)", () => {
  it("a complete standalone pharmacy can request registration", () => {
    const steps = computePharmacySteps(ready());
    assert.equal(canRequest(steps, "CONSENTED"), true); assert.equal(st(ready(), "request"), "action_needed");
  });
  it("each real gap maps to action_needed and blocks the request", () => {
    for (const [o, k] of [[{ optedInBranches: 0 }, "branch_optin"], [{ pricedItems: 0 }, "catalogue"], [{ branchesMissingHours: 1 }, "hours_delivery"], [{ branchesMissingLicenceNo: 1 }, "licence"], [{ licenceDocument: false }, "licence"], [{ payoutLabel: false }, "payout"], [{ termsAccepted: false }, "terms"]] as const) {
      assert.equal(st(ready(o), k), "action_needed", k); assert.equal(st(ready(o), "request"), "blocked", k); assert.equal(canRequest(computePharmacySteps(ready(o)), "CONSENTED"), false);
    }
    assert.equal(st(ready({ subscriptionStatus: "SUSPENDED" }), "subscription"), "blocked");
  });
  it("waits on Kiorex once requested and is done only when approved and live", () => {
    assert.equal(st(ready({ status: "REQUESTED" }), "request"), "waiting_kiorex");
    assert.equal(canRequest(computePharmacySteps(ready({ status: "REQUESTED" })), "REQUESTED"), false);
    const live = ready({ status: "APPROVED", liveOnKiorex: true });
    assert.equal(progressPct(computePharmacySteps(live)), 100);
  });
  it("payout is a label only: account-number-like input is refused", () => {
    assert.deepEqual(validatePayoutLabel("Main settlement account"), { ok: true, value: "Main settlement account" });
    for (const bad of ["1234567890123", "EG380019000500000000263180002", "acct 1234 5678 9012", "x"]) assert.equal(validatePayoutLabel(bad).ok, false, bad);
  });
  it("status token is derived (never stored), stable per org and differs per org", () => {
    assert.equal(deriveStatusToken("k", "org1"), deriveStatusToken("k", "org1")); assert.notEqual(deriveStatusToken("k", "org1"), deriveStatusToken("k", "org2")); assert.ok(deriveStatusToken("k", "o").length >= 32);
  });
  it("signs like the outbox and targets the Kiorex intake route", () => {
    assert.match(signConnectBody("s", 1, "{}"), /^sha256=[0-9a-f]{64}$/);
    assert.equal(intakeUrl(kiorexHost({ KIOREX_BASE_URL: "http://localhost:4000/api/v1/" })), "http://localhost:4000/api/v1/partners/v1/connection-requests");
  });
  it("intake auth (contracts 1.9.0): enrolment code signs the first request, the issued key later ones; same derivation as kiorex-contracts", () => {
    const code = "kxe_AAAAAAAA.BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB";
    assert.equal(deriveIntakeSigningKey(code), "a0ce8b1dc66e4970ef3b844867fabe228c276e5bfffaccfe2ace5e67232adac3"); // contracts test vector
    const h = intakeHeaders(code, 1700000000, '{"a":1}', code);
    assert.equal(h["X-Kiorly-Signature"], "sha256=0f75288125b5933d50f18d797e51ff3160081300fb82c2b8753a22711baf3e14"); // contracts test vector
    assert.equal(h["X-Kiorex-Enrolment"], "kxe_AAAAAAAA");
    assert.equal(intakeHeaders("kxi_secret", 1, "{}")["X-Kiorex-Enrolment"], undefined);
    assert.equal(isEnrolmentCode(code), true); assert.equal(isEnrolmentCode("kxe_short"), false); assert.equal(isEnrolmentCode(undefined), false);
    assert.match(newIntakeNonce(), /^[A-Za-z0-9_-]{16,64}$/);
    assert.equal(enrolmentIdOf(code), "kxe_AAAAAAAA");
  });
});
