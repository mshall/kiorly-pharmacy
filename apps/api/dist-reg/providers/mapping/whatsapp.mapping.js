"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsappMapping = void 0;
const generic_1 = require("./generic");
exports.whatsappMapping = {
    sendPath: "/messages",
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    toRequest: (r, cfg) => ({ to: r.to, from: r.from ?? cfg.senderId, template: { name: r.templateId, language: r.locale, params: r.params ?? {} }, text: r.text, reference: r.reference }),
    fromResponse: (json) => (0, generic_1.genericMessageResponse)(json),
    parseWebhook: (json) => (0, generic_1.genericEvents)(json, "message"),
};
//# sourceMappingURL=whatsapp.mapping.js.map