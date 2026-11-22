import { providerMode } from "../../providers/provider-env";

export type AdapterMode = "mock" | "real";
/**
 * Every third-party integration has MODE=mock|real (default mock). PSP -> PAYMENT_MODE (legacy PSP_MODE), MESSAGING -> real when any of
 * SMS_MODE / EMAIL_MODE / WHATSAPP_MODE is real (legacy MESSAGING_MODE), PUSH -> PUSH_MODE. CONSENT, AI and STORAGE use `<NAME>_MODE` directly.
 */
export function adapterMode(name: "PSP" | "MESSAGING" | "PUSH" | "CONSENT" | "AI" | "STORAGE"): AdapterMode {
  if (name === "PSP") return providerMode("PAYMENT");
  if (name === "PUSH") return providerMode("PUSH");
  if (name === "MESSAGING") return (["SMS", "EMAIL", "WHATSAPP"] as const).some((k) => providerMode(k) === "real") ? "real" : "mock";
  return providerMode(name);
}
