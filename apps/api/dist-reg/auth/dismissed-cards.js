"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidDismissedBody = exports.MAX_DISMISSED = void 0;
exports.sanitizeDismissed = sanitizeDismissed;
exports.MAX_DISMISSED = 50;
const KEY = /^[a-zA-Z0-9][a-zA-Z0-9._:-]{0,63}$/;
function sanitizeDismissed(input) {
    const list = Array.isArray(input) ? input : [];
    const out = [];
    for (const k of list) {
        if (typeof k === "string" && KEY.test(k) && !out.includes(k))
            out.push(k);
        if (out.length >= exports.MAX_DISMISSED)
            break;
    }
    return out;
}
const isValidDismissedBody = (b) => !!b && typeof b === "object" && Array.isArray(b.keys) && b.keys.length <= exports.MAX_DISMISSED && b.keys.every((k) => typeof k === "string" && KEY.test(k));
exports.isValidDismissedBody = isValidDismissedBody;
//# sourceMappingURL=dismissed-cards.js.map