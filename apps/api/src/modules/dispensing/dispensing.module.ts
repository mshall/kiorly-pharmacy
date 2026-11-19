import { Module } from "@nestjs/common";

/**
 * PLACEHOLDER (KX-06 bounded context "Dispensing and pharmacist sign-off", requirements KPRX*).
 * No behaviour until its build-sequence steps are scheduled; see Docs/pharmacy-cursor-build-sequence.md.
 * SAFETY PATH (ADR-025): never gate this code behind a feature flag.
 */
@Module({})
export class DispensingModule {}
