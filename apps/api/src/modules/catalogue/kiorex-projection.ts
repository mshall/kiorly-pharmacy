import type { Drug } from "../../generated/prisma/client";

/**
 * Everything that leaves the pharmacy towards Kiorex goes through this projection (KPCAT02 / KPRX05):
 * controlled-schedule drugs are NEVER exposed to Kiorex ordering, and Rx-only items are flagged so Kiorex requires an Rx.
 */
export const isKiorexExposable = (d: Pick<Drug, "controlledSchedule" | "active">): boolean => d.active && d.controlledSchedule === "NONE";

export function projectDrugForKiorex(d: Drug) {
  if (!isKiorexExposable(d)) return null;
  return { sku: d.id, gtin: d.gtin, name: d.brandName, nameAr: d.brandNameAr, activeIngredient: d.activeIngredient, strength: d.strength, form: d.dosageForm, pack: d.packSize, requiresPrescription: d.rxOnly, coldChain: d.coldChain };
}

/**
 * Arabic label for the standard dosage forms the Egyptian catalogue uses (1.8.0 `formAr`). The pharmacy holds no Arabic dosage-form column, so this is a
 * display dictionary, not clinical content: an unknown form returns undefined and the patient app falls back to the English form (never a wrong translation).
 */
const FORM_AR: Record<string, string> = {
  tablet: "أقراص", tablets: "أقراص", "film-coated tablet": "أقراص مغلفة", "chewable tablet": "أقراص للمضغ", "effervescent tablet": "أقراص فوارة", capsule: "كبسولات", capsules: "كبسولات",
  syrup: "شراب", suspension: "معلق", solution: "محلول", drops: "نقط", "eye drops": "نقط للعين", "ear drops": "نقط للأذن", "nasal spray": "بخاخ للأنف", spray: "بخاخ",
  cream: "كريم", ointment: "مرهم", gel: "جل", lotion: "لوشن", injection: "حقن", ampoule: "أمبولات", vial: "فيال", suppository: "لبوس", suppositories: "لبوس",
  sachet: "أكياس", powder: "بودرة", inhaler: "بخاخ استنشاق", patch: "لصقة", lozenge: "أقراص للمص", shampoo: "شامبو",
};
export const dosageFormAr = (form: string | null | undefined): string | undefined => (form ? FORM_AR[form.trim().toLowerCase()] : undefined);
