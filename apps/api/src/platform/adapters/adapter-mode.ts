import { providerMode } from "../../providers/provider-env";

export type AdapterMode = "mock" | "real";
/**
 * Every third-party integration has MODE=mock|real (default mock). PSP -> PAYMENT_MODE (legacy PSP_MODE), MESSAGING -> real when any of
 * SMS_MODE / EMAIL_MODE / WHATSAPP_MODE is real (legacy MESSAGING_MODE), PUSH -> PUSH_MODE. CONSENT and AI keep `<NAME>_MODE` and are still wired in the go-live pass.
 */
export function adapterMode(name: "PSP" | "MESSAGING" | "PUSH" | "CONSENT" | "AI"): AdapterMode {
  if (name === "PSP") return providerMode("PAYMENT");
  if (name === "PUSH") return providerMode("PUSH");
  if (name === "MESSAGING") return (["SMS", "EMAIL", "WHATSAPP"] as const).some((k) => providerMode(k) === "real") ? "real" : "mock";
  return process.env[`${name}_MODE`] === "real" ? "real" : "mock";
}
export class ProviderNotWiredError extends Error {
  constructor(provider: string) {
    super(`Real ${provider} adapter is not wired yet (see Docs/NEEDS_HUMAN.md "Provider go-live"). Use ${provider.toUpperCase()}_MODE=mock.`);
  }
}
