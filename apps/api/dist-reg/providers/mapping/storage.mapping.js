"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storageMapping = void 0;
const generic_1 = require("./generic");
exports.storageMapping = {
    objectPath: (key) => `/${key.split("/").map(encodeURIComponent).join("/")}`,
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    putHeaders: (contentType) => ({ "content-type": contentType }),
};
//# sourceMappingURL=storage.mapping.js.map