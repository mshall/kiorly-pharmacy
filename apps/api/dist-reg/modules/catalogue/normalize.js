"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normForm = exports.normStrength = exports.normIngredient = void 0;
exports.groupKey = groupKey;
const normIngredient = (s) => s.trim().toLowerCase().replace(/\s+/g, " ");
exports.normIngredient = normIngredient;
const normStrength = (s) => s.trim().toLowerCase().replace(/\s+/g, "").replace(/milligrams?|mgs?$/, "mg").replace(/micrograms?|mcg|µg/g, "mcg");
exports.normStrength = normStrength;
const normForm = (s) => {
    const f = s.trim().toLowerCase().replace(/\s+/g, " ");
    const alias = { tablet: "tablet", tablets: "tablet", tab: "tablet", tabs: "tablet", capsule: "capsule", capsules: "capsule", cap: "capsule", caps: "capsule", syrup: "syrup", suspension: "suspension", injection: "injection", amp: "injection", ampoule: "injection", vial: "injection", cream: "cream", ointment: "ointment", drops: "drops", "eye drops": "eye drops" };
    return alias[f] ?? f;
};
exports.normForm = normForm;
function groupKey(d) {
    return { activeIngredient: (0, exports.normIngredient)(d.activeIngredient), strength: (0, exports.normStrength)(d.strength), dosageForm: (0, exports.normForm)(d.dosageForm) };
}
//# sourceMappingURL=normalize.js.map