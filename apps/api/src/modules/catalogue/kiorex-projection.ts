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
