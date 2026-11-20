import { Module } from "@nestjs/common";
import { ClinicalController } from "./clinical.controller";
import { ClinicalKnowledge, LocalClinicalKnowledge } from "./knowledge";

/** Clinical knowledge base + safety override review. The adapter token is swappable (local starter KB today). */
@Module({ controllers: [ClinicalController], providers: [LocalClinicalKnowledge, { provide: ClinicalKnowledge, useExisting: LocalClinicalKnowledge }], exports: [ClinicalKnowledge, LocalClinicalKnowledge] })
export class ClinicalModule {}
