import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fc from "fast-check";
import { hasUnresolvedBlock, ingredientsOf, runSafetyChecks, type EngineItem, type CheckResult } from "./rx-safety-engine";
import { INTERACTION_RULES } from "./interaction-dataset";

const item = (activeIngredient: string, over: Partial<EngineItem> = {}): EngineItem => ({ drugId: activeIngredient, activeIngredient, quantity: 1, controlledSchedule: "NONE", label: activeIngredient, ...over });
const opts = { controlledQuantityLimit: 3, now: new Date("2026-11-20T10:00:00Z") };
const rx = { hasRx: true, prescriberName: "Dr", prescriberLicenceNo: "L1", prescriberVerifiedBadge: true, validUntil: new Date("2027-01-01") };
const patient = { allergies: [] as string[], recent: [] as Array<{ ingredient: string; dispensedAt: Date }> };
const by = (r: CheckResult[], k: string) => r.find((x) => x.kind === k)!;

describe("Rx safety engine (KPRX03, safety.pharmacy.rx_safety_checks)", () => {
  it("always returns one result per check kind (so 'the checks ran' is provable) and PASS when clean", () => {
    const r = runSafetyChecks([item("paracetamol")], patient, rx, opts);
    assert.deepEqual(r.map((x) => x.kind).sort(), ["ALLERGY", "CONTROLLED_LIMIT", "DOSE_QUANTITY", "DOSE_RANGE", "DUPLICATE_THERAPY", "INTERACTION", "PREGNANCY_LACTATION", "PRESCRIBER", "RENAL_HEPATIC"]);
    assert.ok(r.every((x) => x.outcome === "PASS"));
    assert.equal(hasUnresolvedBlock(r), false);
  });

  it("parses combination products and strips salts", () => {
    assert.deepEqual(ingredientsOf("Amoxicillin + Clavulanic acid"), ["amoxicillin", "clavulanic acid"]);
    assert.deepEqual(ingredientsOf("Metformin Hydrochloride"), ["metformin"]);
    assert.deepEqual(ingredientsOf("sulfamethoxazole/trimethoprim"), ["sulfamethoxazole", "trimethoprim"]);
  });

  it("interaction severity ladder: MAJOR/CONTRAINDICATED block (contraindicated not overridable), MODERATE warns, interactions with current medicines count", () => {
    assert.equal(by(runSafetyChecks([item("warfarin"), item("ibuprofen")], patient, rx, opts), "INTERACTION").outcome, "BLOCK");
    const contra = by(runSafetyChecks([item("sildenafil"), item("nitroglycerin")], patient, rx, opts), "INTERACTION");
    assert.equal(contra.outcome, "BLOCK"); assert.equal(contra.overridable, false);
    assert.equal(by(runSafetyChecks([item("ibuprofen"), item("aspirin")], patient, rx, opts), "INTERACTION").outcome, "WARN");
    const recent = { allergies: [], recent: [{ ingredient: "warfarin", dispensedAt: new Date("2026-11-10T00:00:00Z") }] };
    assert.match(by(runSafetyChecks([item("diclofenac")], recent, rx, opts), "INTERACTION").detail!, /current medicine/);
    const old = { allergies: [], recent: [{ ingredient: "warfarin", dispensedAt: new Date("2026-05-10T00:00:00Z") }] };
    assert.equal(by(runSafetyChecks([item("diclofenac")], old, rx, opts), "INTERACTION").outcome, "PASS", "a course finished long ago is not 'current'");
  });

  it("property: interaction/duplicate/allergy outcomes are order-independent (symmetry of the dataset)", () => {
    const ingredients = [...new Set(INTERACTION_RULES.flatMap((r) => [r.a, r.b])), "paracetamol", "amoxicillin"];
    fc.assert(fc.property(fc.shuffledSubarray(ingredients, { minLength: 1, maxLength: 5 }), fc.array(fc.constantFrom("penicillin", "nsaid", "sulfonamide", "none"), { maxLength: 2 }), (ings, allergies) => {
      const items = ings.map((i) => item(i));
      const a = runSafetyChecks(items, { allergies, recent: [] }, rx, opts);
      const b = runSafetyChecks([...items].reverse(), { allergies, recent: [] }, rx, opts);
      for (const k of ["INTERACTION", "ALLERGY", "DUPLICATE_THERAPY"]) assert.equal(by(a, k).outcome, by(b, k).outcome, k);
    }), { numRuns: 200 });
  });

  it("allergy: ingredient, class and members match; penicillin<->cephalosporin is a cross-sensitivity WARN; unrelated passes", () => {
    const chk = (al: string[], ing: string) => by(runSafetyChecks([item(ing)], { allergies: al, recent: [] }, rx, opts), "ALLERGY").outcome;
    assert.equal(chk(["amoxicillin"], "amoxicillin"), "BLOCK");
    assert.equal(chk(["penicillin"], "amoxicillin"), "BLOCK");
    assert.equal(chk(["amoxicillin"], "ampicillin"), "BLOCK", "same class");
    assert.equal(chk(["nsaid"], "ibuprofen"), "BLOCK");
    assert.equal(chk(["penicillin"], "cefuroxime"), "WARN");
    assert.equal(chk(["penicillin"], "paracetamol"), "PASS");
    assert.equal(chk(["Amoxicillin "], "amoxicillin"), "BLOCK", "case/whitespace insensitive");
  });

  it("duplicate therapy: same ingredient twice blocks; dispensed within the window warns", () => {
    assert.equal(by(runSafetyChecks([item("paracetamol", { label: "A" }), item("paracetamol", { label: "B", drugId: "x" })], patient, rx, opts), "DUPLICATE_THERAPY").outcome, "BLOCK");
    const r = { allergies: [], recent: [{ ingredient: "paracetamol", dispensedAt: new Date("2026-11-18T00:00:00Z") }] };
    assert.equal(by(runSafetyChecks([item("paracetamol")], r, rx, opts), "DUPLICATE_THERAPY").outcome, "WARN");
    const stale = { allergies: [], recent: [{ ingredient: "paracetamol", dispensedAt: new Date("2026-10-01T00:00:00Z") }] };
    assert.equal(by(runSafetyChecks([item("paracetamol")], stale, rx, opts), "DUPLICATE_THERAPY").outcome, "PASS");
  });

  it("prescriber/validity, dose/quantity and controlled limit", () => {
    assert.equal(by(runSafetyChecks([item("x")], patient, { ...rx, prescriberLicenceNo: null }, opts), "PRESCRIBER").outcome, "BLOCK");
    assert.equal(by(runSafetyChecks([item("x")], patient, { ...rx, validUntil: new Date("2026-11-01") }, opts), "PRESCRIBER").outcome, "BLOCK");
    assert.equal(by(runSafetyChecks([item("x")], patient, { ...rx, prescriberVerifiedBadge: false }, opts), "PRESCRIBER").outcome, "WARN");
    assert.equal(by(runSafetyChecks([item("x")], patient, { hasRx: false }, opts), "PRESCRIBER").outcome, "PASS");
    assert.equal(by(runSafetyChecks([item("x", { quantity: 13 })], patient, rx, opts), "DOSE_QUANTITY").outcome, "WARN");
    assert.equal(by(runSafetyChecks([item("x", { quantity: 101 })], patient, rx, opts), "DOSE_QUANTITY").outcome, "BLOCK");
    assert.equal(by(runSafetyChecks([item("x", { quantity: 0 })], patient, rx, opts), "DOSE_QUANTITY").outcome, "BLOCK");
    const c = by(runSafetyChecks([item("morphine", { controlledSchedule: "SCHEDULE_2", quantity: 4 })], patient, rx, opts), "CONTROLLED_LIMIT");
    assert.equal(c.outcome, "BLOCK"); assert.equal(c.overridable, false);
    assert.equal(by(runSafetyChecks([item("morphine", { controlledSchedule: "SCHEDULE_2", quantity: 3 })], patient, rx, opts), "CONTROLLED_LIMIT").outcome, "PASS");
  });

  it("KB checks (dose range, pregnancy/lactation, renal/hepatic) are pure and use the supplied snapshot", () => {
    const kb = {
      dose: new Map([["drugx", { ingredient: "drugx", maxDailyMg: 100, maxSingleMg: 60, pediatricMaxMgPerKg: 5 }]]),
      pregnancy: new Map([["drugx", { ingredient: "drugx", category: "X" as const, note: "no" }]]), lactation: new Map([["drugx", { ingredient: "drugx", severity: "MAJOR" as const, note: "avoid" }]]),
      renal: new Map([["drugx", { ingredient: "drugx", severity: "MODERATE" as const, note: "adjust" }]]), hepatic: new Map([["drugx", { ingredient: "drugx", severity: "MAJOR" as const, note: "hepatotoxic" }]]),
    };
    const run = (over: Partial<EngineItem>, pat: object = {}) => runSafetyChecks([item("drugx", { strength: "50 mg", directions: "1 tablet twice daily", ...over })], { ...patient, ...pat }, rx, { ...opts, kb });
    assert.equal(by(run({}), "DOSE_RANGE").outcome, "PASS");
    assert.equal(by(run({ directions: "2 tablets twice daily" }), "DOSE_RANGE").outcome, "BLOCK");
    assert.equal(by(run({ directions: "2 tablets twice daily" }), "DOSE_RANGE").overridable, true);
    assert.equal(by(run({ directions: "5 tablets four times daily" }), "DOSE_RANGE").overridable, false, "more than 2x the maximum is a hard stop");
    assert.equal(by(run({ directions: "1 tablet once daily", strength: "70 mg" }), "DOSE_RANGE").outcome, "WARN", "single dose above maxSingle but daily within range");
    assert.equal(by(run({}, { ageYears: 4, weightKg: 10 }), "DOSE_RANGE").outcome, "BLOCK", "100 mg/day / 10 kg = 10 mg/kg > 5");
    assert.equal(by(run({}, { ageYears: 4 }), "DOSE_RANGE").outcome, "WARN");
    assert.equal(by(run({}, { pregnant: true }), "PREGNANCY_LACTATION").overridable, false);
    assert.equal(by(run({}, { lactating: true }), "PREGNANCY_LACTATION").outcome, "BLOCK");
    assert.equal(by(run({}, { lactating: true }), "PREGNANCY_LACTATION").overridable, true);
    assert.equal(by(run({}, { renalImpairment: true }), "RENAL_HEPATIC").outcome, "WARN");
    assert.equal(by(run({}, { hepaticImpairment: true }), "RENAL_HEPATIC").outcome, "BLOCK");
    assert.equal(by(run({}), "PREGNANCY_LACTATION").outcome, "PASS");
    assert.equal(by(runSafetyChecks([item("drugx", { strength: "50 mg", directions: "2 tablets twice daily" })], { ...patient, pregnant: true }, rx, opts), "PREGNANCY_LACTATION").outcome, "PASS", "no kb supplied: no verdict, never a guess");
  });
});
