"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SafetyControlNotAFlagError = exports.SAFETY_PATH_DIRS = exports.SAFETY_CONTROL_IDS = void 0;
exports.isSafetyControlKey = isSafetyControlKey;
const pharmacy_shared_1 = require("@kiorly/pharmacy-shared");
exports.SAFETY_CONTROL_IDS = pharmacy_shared_1.SAFETY_CONTROLS.map((c) => c.id);
exports.SAFETY_PATH_DIRS = ["inventory/lot-guard", "dispensing", "prescriptions/safety", "suppliers/recall"];
class SafetyControlNotAFlagError extends Error {
    key;
    constructor(key) {
        super(`"${key}" is a safety control (ADR-025); it can never be evaluated as a feature flag.`);
        this.key = key;
        this.name = "SafetyControlNotAFlagError";
    }
}
exports.SafetyControlNotAFlagError = SafetyControlNotAFlagError;
function isSafetyControlKey(key) {
    return key.startsWith("safety.") || exports.SAFETY_CONTROL_IDS.includes(key);
}
//# sourceMappingURL=safety-controls.js.map