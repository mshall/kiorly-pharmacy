"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = createId;
const node_crypto_1 = require("node:crypto");
function createId() {
    return `c${Date.now().toString(36)}${(0, node_crypto_1.randomBytes)(9).toString("hex")}`;
}
//# sourceMappingURL=ids.js.map