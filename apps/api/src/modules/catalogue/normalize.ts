/** KPCAT04: generic substitution = same active ingredient + strength + dosage form (normalised). */
export const normIngredient = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");
export const normStrength = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "").replace(/milligrams?|mgs?$/, "mg").replace(/micrograms?|mcg|µg/g, "mcg");
export const normForm = (s: string) => {
  const f = s.trim().toLowerCase().replace(/\s+/g, " ");
  const alias: Record<string, string> = { tablet: "tablet", tablets: "tablet", tab: "tablet", tabs: "tablet", capsule: "capsule", capsules: "capsule", cap: "capsule", caps: "capsule", syrup: "syrup", suspension: "suspension", injection: "injection", amp: "injection", ampoule: "injection", vial: "injection", cream: "cream", ointment: "ointment", drops: "drops", "eye drops": "eye drops" };
  return alias[f] ?? f;
};
export function groupKey(d: { activeIngredient: string; strength: string; dosageForm: string }) {
  return { activeIngredient: normIngredient(d.activeIngredient), strength: normStrength(d.strength), dosageForm: normForm(d.dosageForm) };
}
