export type AdapterMode = "mock" | "real";
/** Every third-party integration has MODE=mock|real (default mock). Real adapters are wired in the "Provider go-live" pass. */
export function adapterMode(name: "PSP" | "MESSAGING" | "CONSENT" | "AI"): AdapterMode {
  return process.env[`${name}_MODE`] === "real" ? "real" : "mock";
}
export class ProviderNotWiredError extends Error {
  constructor(provider: string) {
    super(`Real ${provider} adapter is not wired yet (see Docs/NEEDS_HUMAN.md "Provider go-live"). Use ${provider.toUpperCase()}_MODE=mock.`);
  }
}
