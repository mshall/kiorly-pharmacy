"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dosageFormAr = exports.isKiorexExposable = void 0;
exports.projectDrugForKiorex = projectDrugForKiorex;
const isKiorexExposable = (d) => d.active && d.controlledSchedule === "NONE";
exports.isKiorexExposable = isKiorexExposable;
function projectDrugForKiorex(d) {
    if (!(0, exports.isKiorexExposable)(d))
        return null;
    return { sku: d.id, gtin: d.gtin, name: d.brandName, nameAr: d.brandNameAr, activeIngredient: d.activeIngredient, strength: d.strength, form: d.dosageForm, pack: d.packSize, requiresPrescription: d.rxOnly, coldChain: d.coldChain };
}
const FORM_AR = {
    tablet: "أقراص", tablets: "أقراص", "film-coated tablet": "أقراص مغلفة", "chewable tablet": "أقراص للمضغ", "effervescent tablet": "أقراص فوارة", capsule: "كبسولات", capsules: "كبسولات",
    syrup: "شراب", suspension: "معلق", solution: "محلول", drops: "نقط", "eye drops": "نقط للعين", "ear drops": "نقط للأذن", "nasal spray": "بخاخ للأنف", spray: "بخاخ",
    cream: "كريم", ointment: "مرهم", gel: "جل", lotion: "لوشن", injection: "حقن", ampoule: "أمبولات", vial: "فيال", suppository: "لبوس", suppositories: "لبوس",
    sachet: "أكياس", powder: "بودرة", inhaler: "بخاخ استنشاق", patch: "لصقة", lozenge: "أقراص للمص", shampoo: "شامبو",
};
const dosageFormAr = (form) => (form ? FORM_AR[form.trim().toLowerCase()] : undefined);
exports.dosageFormAr = dosageFormAr;
//# sourceMappingURL=kiorex-projection.js.map