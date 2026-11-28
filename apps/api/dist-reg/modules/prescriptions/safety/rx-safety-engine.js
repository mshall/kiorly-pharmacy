"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUnresolvedBlock = void 0;
exports.ingredientsOf = ingredientsOf;
exports.runSafetyChecks = runSafetyChecks;
const interaction_dataset_1 = require("./interaction-dataset");
const dose_1 = require("../../clinical/dose");
const SALTS = /\b(hydrochloride|hcl|sodium|potassium|calcium|sulfate|sulphate|maleate|mesylate|besylate|tartrate|succinate|phosphate|acetate|citrate|trihydrate|anhydrous)\b/g;
function ingredientsOf(activeIngredient) {
    return activeIngredient.toLowerCase().replace(SALTS, "").split(/\s*(?:\+|\/|,|&|\band\b|\bwith\b)\s*/).map((s) => s.replace(/\s+/g, " ").trim()).filter(Boolean);
}
const rank = { MINOR: 0, MODERATE: 1, MAJOR: 2, CONTRAINDICATED: 3 };
const sevToOutcome = (s) => (s === "MAJOR" || s === "CONTRAINDICATED" ? "BLOCK" : "WARN");
function classesOf(ingredient) {
    return Object.entries(interaction_dataset_1.INGREDIENT_CLASSES).filter(([, m]) => m.includes(ingredient)).map(([c]) => c);
}
function runSafetyChecks(items, patient, rx, opt) {
    const now = opt.now ?? new Date();
    const rules = opt.rules ?? opt.kb?.interactions ?? interaction_dataset_1.INTERACTION_RULES;
    const dupDays = opt.duplicateWindowDays ?? 7;
    const activeDays = opt.activeCourseDays ?? 30;
    const out = [];
    const lines = items.map((i) => ({ ...i, ings: ingredientsOf(i.activeIngredient) }));
    const active = patient.recent.filter((r) => now.getTime() - r.dispensedAt.getTime() <= activeDays * 86_400_000);
    const pairs = [];
    const seen = new Set();
    const consider = (x, y, label) => {
        if (x === y)
            return;
        const rule = rules.find((r) => (r.a === x && r.b === y) || (r.a === y && r.b === x));
        if (!rule)
            return;
        const k = [x, y].sort().join("|") + label;
        if (seen.has(k))
            return;
        seen.add(k);
        pairs.push({ sev: rule.severity, text: `${x} + ${y}: ${rule.severity} — ${rule.note}${label ? ` (${label})` : ""}` });
    };
    for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++)
            for (const a of lines[i].ings)
                for (const b of lines[j].ings)
                    consider(a, b, "");
        for (const a of lines[i].ings)
            for (const r of active)
                for (const b of ingredientsOf(r.ingredient))
                    consider(a, b, "current medicine");
    }
    if (pairs.length) {
        const worst = pairs.reduce((m, p) => (rank[p.sev] > rank[m.sev] ? p : m));
        out.push({ kind: "INTERACTION", outcome: sevToOutcome(worst.sev), detail: pairs.map((p) => p.text).join("; "), overridable: worst.sev !== "CONTRAINDICATED" });
    }
    else
        out.push({ kind: "INTERACTION", outcome: "PASS", detail: null, overridable: false });
    const allergies = patient.allergies.map((a) => a.toLowerCase().trim()).filter(Boolean);
    const hits = [], cross = [];
    for (const l of lines)
        for (const ing of l.ings) {
            for (const al of allergies) {
                const alClasses = interaction_dataset_1.INGREDIENT_CLASSES[al] ? [al] : classesOf(al);
                if (ing === al || (interaction_dataset_1.INGREDIENT_CLASSES[al]?.includes(ing)) || classesOf(ing).some((c) => alClasses.includes(c)))
                    hits.push(`${l.label}: allergy to ${al}`);
                else if (interaction_dataset_1.CROSS_CLASS.some(([p, q]) => (alClasses.includes(p) && classesOf(ing).includes(q)) || (alClasses.includes(q) && classesOf(ing).includes(p))))
                    cross.push(`${l.label}: possible cross-sensitivity with ${al}`);
            }
        }
    if (hits.length)
        out.push({ kind: "ALLERGY", outcome: "BLOCK", detail: [...new Set(hits)].join("; "), overridable: true });
    else if (cross.length)
        out.push({ kind: "ALLERGY", outcome: "WARN", detail: [...new Set(cross)].join("; "), overridable: true });
    else
        out.push({ kind: "ALLERGY", outcome: "PASS", detail: null, overridable: false });
    const dups = [];
    let dupBlock = false;
    const counts = new Map();
    for (const l of lines)
        for (const ing of l.ings)
            counts.set(ing, [...(counts.get(ing) ?? []), l.label]);
    for (const [ing, labels] of counts)
        if (labels.length > 1) {
            dups.push(`${ing} appears in ${labels.join(" and ")}`);
            dupBlock = true;
        }
    for (const l of lines)
        for (const ing of l.ings) {
            const recent = patient.recent.find((r) => ingredientsOf(r.ingredient).includes(ing) && now.getTime() - r.dispensedAt.getTime() <= dupDays * 86_400_000);
            if (recent)
                dups.push(`${ing} was dispensed on ${recent.dispensedAt.toISOString().slice(0, 10)}`);
        }
    out.push(dups.length ? { kind: "DUPLICATE_THERAPY", outcome: dupBlock ? "BLOCK" : "WARN", detail: dups.join("; "), overridable: true } : { kind: "DUPLICATE_THERAPY", outcome: "PASS", detail: null, overridable: false });
    const q = [];
    let qBlock = false;
    for (const l of lines) {
        if (!Number.isInteger(l.quantity) || l.quantity <= 0) {
            q.push(`${l.label}: invalid quantity`);
            qBlock = true;
        }
        else if (l.quantity > 100) {
            q.push(`${l.label}: quantity ${l.quantity} exceeds sanity limit`);
            qBlock = true;
        }
        else if (l.quantity > 12)
            q.push(`${l.label}: unusually high quantity (${l.quantity} packs)`);
    }
    out.push(q.length ? { kind: "DOSE_QUANTITY", outcome: qBlock ? "BLOCK" : "WARN", detail: q.join("; "), overridable: false } : { kind: "DOSE_QUANTITY", outcome: "PASS", detail: null, overridable: false });
    if (rx.hasRx) {
        const p = [];
        let pBlock = false;
        if (!rx.prescriberName || !rx.prescriberLicenceNo) {
            p.push("Prescriber name or licence number missing");
            pBlock = true;
        }
        if (rx.validUntil && rx.validUntil.getTime() < now.getTime()) {
            p.push(`Prescription expired on ${rx.validUntil.toISOString().slice(0, 10)}`);
            pBlock = true;
        }
        if (!pBlock && !rx.prescriberVerifiedBadge)
            p.push("Prescriber has no Kiorly-verified badge");
        out.push(p.length ? { kind: "PRESCRIBER", outcome: pBlock ? "BLOCK" : "WARN", detail: p.join("; "), overridable: false } : { kind: "PRESCRIBER", outcome: "PASS", detail: null, overridable: false });
    }
    else
        out.push({ kind: "PRESCRIBER", outcome: "PASS", detail: "No prescription (OTC counter dispensing)", overridable: false });
    const c = lines.filter((l) => l.controlledSchedule !== "NONE" && l.quantity > opt.controlledQuantityLimit).map((l) => `${l.label}: ${l.quantity} exceeds the controlled-medicine limit of ${opt.controlledQuantityLimit}`);
    out.push(c.length ? { kind: "CONTROLLED_LIMIT", outcome: "BLOCK", detail: c.join("; "), overridable: false } : { kind: "CONTROLLED_LIMIT", outcome: "PASS", detail: null, overridable: false });
    const dose = [];
    let doseBlock = false;
    let doseHard = false;
    for (const l of lines) {
        const ings = l.ings;
        const rule = ings.length === 1 ? opt.kb?.dose.get(ings[0]) : undefined;
        const dd = (0, dose_1.dailyDoseMg)(l.directions, l.strength);
        if (!rule || !dd)
            continue;
        const child = patient.ageYears != null && patient.ageYears < 12;
        if (child && rule.pediatricMaxMgPerKg) {
            if (!patient.weightKg) {
                dose.push(`${l.label}: child under 12 — record the weight to check the paediatric dose (max ${rule.pediatricMaxMgPerKg} mg/kg/day)`);
                continue;
            }
            const perKg = dd.dailyMg / patient.weightKg;
            if (perKg > rule.pediatricMaxMgPerKg) {
                dose.push(`${l.label}: ${perKg.toFixed(1)} mg/kg/day exceeds the paediatric maximum of ${rule.pediatricMaxMgPerKg} mg/kg/day`);
                doseBlock = true;
            }
            continue;
        }
        if (dd.dailyMg > rule.maxDailyMg) {
            dose.push(`${l.label}: ${dd.dailyMg} mg/day exceeds the maximum of ${rule.maxDailyMg} mg/day`);
            doseBlock = true;
            if (dd.dailyMg > rule.maxDailyMg * 2)
                doseHard = true;
        }
        else if (rule.maxSingleMg && dd.perDoseMg > rule.maxSingleMg)
            dose.push(`${l.label}: single dose ${dd.perDoseMg} mg exceeds ${rule.maxSingleMg} mg`);
    }
    out.push(dose.length ? { kind: "DOSE_RANGE", outcome: doseBlock ? "BLOCK" : "WARN", detail: dose.join("; "), overridable: !doseHard } : { kind: "DOSE_RANGE", outcome: "PASS", detail: null, overridable: false });
    const preg = [];
    let pregOutcome = "PASS";
    let pregOverridable = true;
    const bump = (o) => { if (o === "BLOCK" || (o === "WARN" && pregOutcome === "PASS"))
        pregOutcome = o; };
    for (const l of lines)
        for (const ing of l.ings) {
            if (patient.pregnant) {
                const r = opt.kb?.pregnancy.get(ing);
                if (r?.category === "X") {
                    preg.push(`${l.label}: pregnancy category X — contraindicated (${r.note})`);
                    bump("BLOCK");
                    pregOverridable = false;
                }
                else if (r?.category === "D") {
                    preg.push(`${l.label}: pregnancy category D — ${r.note}`);
                    bump("BLOCK");
                }
                else if (r?.category === "C") {
                    preg.push(`${l.label}: pregnancy category C — ${r.note}`);
                    bump("WARN");
                }
            }
            if (patient.lactating) {
                const r = opt.kb?.lactation.get(ing);
                if (r) {
                    preg.push(`${l.label}: breastfeeding — ${r.note}`);
                    if (r.severity === "CONTRAINDICATED") {
                        bump("BLOCK");
                        pregOverridable = false;
                    }
                    else if (r.severity === "MAJOR")
                        bump("BLOCK");
                    else
                        bump("WARN");
                }
            }
        }
    out.push(preg.length ? { kind: "PREGNANCY_LACTATION", outcome: pregOutcome, detail: preg.join("; "), overridable: pregOutcome === "BLOCK" ? pregOverridable : false } : { kind: "PREGNANCY_LACTATION", outcome: "PASS", detail: null, overridable: false });
    const org = [];
    let orgOutcome = "PASS";
    for (const l of lines)
        for (const ing of l.ings) {
            for (const [flag, map, label] of [[patient.renalImpairment, opt.kb?.renal, "kidney impairment"], [patient.hepaticImpairment, opt.kb?.hepatic, "liver impairment"]]) {
                const r = flag ? map?.get(ing) : undefined;
                if (!r)
                    continue;
                org.push(`${l.label}: ${label} — ${r.note}`);
                if (r.severity === "MAJOR" || r.severity === "CONTRAINDICATED")
                    orgOutcome = "BLOCK";
                else if (orgOutcome === "PASS")
                    orgOutcome = "WARN";
            }
        }
    out.push(org.length ? { kind: "RENAL_HEPATIC", outcome: orgOutcome, detail: org.join("; "), overridable: orgOutcome === "BLOCK" } : { kind: "RENAL_HEPATIC", outcome: "PASS", detail: null, overridable: false });
    return out;
}
const hasUnresolvedBlock = (results) => results.some((r) => r.outcome === "BLOCK");
exports.hasUnresolvedBlock = hasUnresolvedBlock;
//# sourceMappingURL=rx-safety-engine.js.map