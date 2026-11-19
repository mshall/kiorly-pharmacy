/**
 * STARTER interaction / allergy dataset keyed by ACTIVE INGREDIENT (shared engine design with Kiorly Clinic CL02).
 * SYNTHETIC / INCOMPLETE: a clinical pharmacist must review and extend it before any pilot (PH-H02, Docs/NEEDS_HUMAN.md NH-PH-009).
 * Severity ladder from the 2025 prototype: MINOR < MODERATE < MAJOR < CONTRAINDICATED.
 */
export type Severity = "MINOR" | "MODERATE" | "MAJOR" | "CONTRAINDICATED";

export interface InteractionRule { a: string; b: string; severity: Severity; note: string }

const r = (a: string, b: string, severity: Severity, note: string): InteractionRule => ({ a, b, severity, note });

export const INTERACTION_RULES: readonly InteractionRule[] = [
  r("warfarin", "aspirin", "MAJOR", "Additive bleeding risk"),
  r("warfarin", "ibuprofen", "MAJOR", "NSAID raises bleeding risk with warfarin"),
  r("warfarin", "diclofenac", "MAJOR", "NSAID raises bleeding risk with warfarin"),
  r("warfarin", "naproxen", "MAJOR", "NSAID raises bleeding risk with warfarin"),
  r("warfarin", "ciprofloxacin", "MAJOR", "INR elevation"),
  r("warfarin", "metronidazole", "MAJOR", "INR elevation"),
  r("simvastatin", "clarithromycin", "CONTRAINDICATED", "Rhabdomyolysis risk (CYP3A4)"),
  r("atorvastatin", "clarithromycin", "MAJOR", "Raised statin exposure (CYP3A4)"),
  r("sildenafil", "isosorbide", "CONTRAINDICATED", "Severe hypotension with nitrates"),
  r("sildenafil", "nitroglycerin", "CONTRAINDICATED", "Severe hypotension with nitrates"),
  r("methotrexate", "ibuprofen", "MAJOR", "Reduced methotrexate clearance"),
  r("methotrexate", "trimethoprim", "MAJOR", "Additive antifolate toxicity"),
  r("enalapril", "potassium chloride", "MAJOR", "Hyperkalaemia"),
  r("lisinopril", "potassium chloride", "MAJOR", "Hyperkalaemia"),
  r("enalapril", "spironolactone", "MAJOR", "Hyperkalaemia"),
  r("lisinopril", "spironolactone", "MAJOR", "Hyperkalaemia"),
  r("enalapril", "ibuprofen", "MODERATE", "Reduced antihypertensive effect, renal risk"),
  r("digoxin", "amiodarone", "MAJOR", "Digoxin toxicity"),
  r("clopidogrel", "omeprazole", "MODERATE", "Reduced clopidogrel activation (CYP2C19)"),
  r("tramadol", "sertraline", "MAJOR", "Serotonin syndrome / seizure risk"),
  r("tramadol", "fluoxetine", "MAJOR", "Serotonin syndrome / seizure risk"),
  r("linezolid", "sertraline", "CONTRAINDICATED", "Serotonin syndrome"),
  r("lithium", "ibuprofen", "MAJOR", "Lithium toxicity"),
  r("ciprofloxacin", "theophylline", "MAJOR", "Theophylline toxicity"),
  r("ibuprofen", "aspirin", "MODERATE", "Reduced cardioprotection, GI bleeding"),
  r("diclofenac", "aspirin", "MODERATE", "GI bleeding"),
  r("amiodarone", "azithromycin", "MAJOR", "QT prolongation"),
  r("metformin", "ibuprofen", "MINOR", "Renal function monitoring"),
  r("diazepam", "tramadol", "MAJOR", "Respiratory depression"),
  r("alprazolam", "tramadol", "MAJOR", "Respiratory depression"),
];

/** Allergy / cross-sensitivity classes: an allergy recorded as the class (or any member) matches every member. */
export const INGREDIENT_CLASSES: Readonly<Record<string, readonly string[]>> = {
  penicillin: ["penicillin", "amoxicillin", "ampicillin", "flucloxacillin", "piperacillin", "phenoxymethylpenicillin"],
  cephalosporin: ["cephalexin", "cefuroxime", "ceftriaxone", "cefixime", "cefadroxil", "cefaclor"],
  sulfonamide: ["sulfamethoxazole", "sulfadiazine", "sulfasalazine"],
  nsaid: ["ibuprofen", "diclofenac", "naproxen", "ketorolac", "aspirin", "mefenamic acid", "indomethacin"],
  macrolide: ["azithromycin", "clarithromycin", "erythromycin"],
};

/** Penicillin <-> cephalosporin cross-reactivity is a WARN-level cross-sensitivity (clinically weaker than same-class). */
export const CROSS_CLASS: ReadonlyArray<readonly [string, string]> = [["penicillin", "cephalosporin"]];
