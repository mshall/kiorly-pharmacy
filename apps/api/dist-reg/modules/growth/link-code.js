"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_CODE_LENGTH = exports.LINK_CODE_ALPHABET = exports.LINK_CODE_PATTERN = void 0;
exports.generateLinkCode = generateLinkCode;
exports.normalizeLinkCode = normalizeLinkCode;
const node_crypto_1 = require("node:crypto");
exports.LINK_CODE_PATTERN = /^[0-9A-HJKMNP-TV-Z]{8}$/;
exports.LINK_CODE_ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
exports.LINK_CODE_LENGTH = 8;
function generateLinkCode(random = node_crypto_1.randomBytes) {
    const bytes = random(exports.LINK_CODE_LENGTH);
    let out = "";
    for (let i = 0; i < exports.LINK_CODE_LENGTH; i += 1)
        out += exports.LINK_CODE_ALPHABET[bytes[i] & 31];
    return out;
}
function normalizeLinkCode(raw) {
    if (typeof raw !== "string")
        return null;
    const code = raw.trim().toUpperCase();
    return exports.LINK_CODE_PATTERN.test(code) ? code : null;
}
//# sourceMappingURL=link-code.js.map