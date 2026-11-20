import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dailyDoseMg, dosesPerDay, strengthToMg, unitsPerDose } from "./dose";

describe("directions -> daily dose (pure)", () => {
  it("strengths to mg", () => {
    assert.equal(strengthToMg("500 mg"), 500); assert.equal(strengthToMg("1 g"), 1000); assert.equal(strengthToMg("250 mcg"), 0.25); assert.equal(strengthToMg("100 IU/ml"), null); assert.equal(strengthToMg("0,5 mg"), 0.5);
  });
  it("frequency words, abbreviations, intervals and Arabic", () => {
    const cases: Array<[string, number | null]> = [["1 tab twice daily", 2], ["tid", 3], ["QID", 4], ["every 8 hours", 3], ["q6h", 4], ["3 times daily", 3], ["three times a day", 3], ["once daily", 1], ["at night", 1], ["كل 8 ساعات", 3], ["مرتين يوميا", 2], ["as needed", null], ["weekly", null]];
    for (const [sig, n] of cases) assert.equal(dosesPerDay(sig), n, sig);
  });
  it("units per dose and daily mg", () => {
    assert.equal(unitsPerDose("2 tablets"), 2); assert.equal(unitsPerDose("1/2 tablet"), 0.5); assert.equal(unitsPerDose("take one capsule"), 1); assert.equal(unitsPerDose("twice daily"), 1);
    assert.deepEqual(dailyDoseMg("2 tablets every 6 hours", "500 mg"), { perDoseMg: 1000, dosesPerDay: 4, dailyMg: 4000 });
    assert.equal(dailyDoseMg("as the doctor said", "500 mg"), null); assert.equal(dailyDoseMg("1 daily", "10 ml"), null); assert.equal(dailyDoseMg(null, "500 mg"), null);
  });
});
