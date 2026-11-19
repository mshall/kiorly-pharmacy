/** Flag catalogue for Kiorly Pharmacy (KX-08 §09). All ship ON; OFF => 403 FEATURE_DISABLED {key,scope}. */
export type FlagClass = "Module" | "AI" | "Integration" | "Launch-locked";

export interface FlagDefinition {
  key: string;
  cls: FlagClass;
  dependsOn: string[];
  /** ADR-024: effective only with gate evidence. None of this product's own flags are launch-locked (the Kiorex-side ones are). */
  launchLocked: boolean;
  offBehaviour: string;
}

export const FLAG_DEFINITIONS: readonly FlagDefinition[] = [
  { key: "pharmacy.module", cls: "Module", dependsOn: [], launchLocked: false, offBehaviour: "No new sign-ups; existing tenants read-only with export" },
  { key: "pharmacy.kiorex_orders", cls: "Module", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Order inbox hidden; stock not exposed to Kiorex" },
  { key: "pharmacy.forecasting", cls: "AI", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Min/max reorder only" },
  { key: "pharmacy.insurer_claims", cls: "Module", dependsOn: ["pharmacy.module"], launchLocked: false, offBehaviour: "Cash/self-pay only" },
];

export const FLAG_KEYS = FLAG_DEFINITIONS.map((f) => f.key);
export type FlagKey = string;
export const isKnownFlagKey = (key: string): boolean => FLAG_KEYS.includes(key);
