import { SAFETY_CONTROLS } from "@kiorly/pharmacy-shared";

/**
 * ADR-025: safety controls are NEVER feature flags. A switch that can disable them is itself a hazard.
 * Safety-path directories (relative to src/modules) must never reference FeatureFlagsService / RequiresFlag;
 * safety-controls.node.test.ts enforces this in CI.
 */
export const SAFETY_CONTROL_IDS: readonly string[] = SAFETY_CONTROLS.map((c) => c.id);
export const SAFETY_PATH_DIRS: readonly string[] = ["inventory/lot-guard", "dispensing", "prescriptions/safety", "suppliers/recall"];

export class SafetyControlNotAFlagError extends Error {
  constructor(public readonly key: string) {
    super(`"${key}" is a safety control (ADR-025); it can never be evaluated as a feature flag.`);
    this.name = "SafetyControlNotAFlagError";
  }
}

export function isSafetyControlKey(key: string): boolean {
  return key.startsWith("safety.") || SAFETY_CONTROL_IDS.includes(key);
}
