"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsMapping = void 0;
const generic_1 = require("./generic");
exports.smsMapping = {
    sendPath: "/messages",
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    toRequest: (r, cfg) => ({ to: r.to, from: r.from ?? cfg.senderId, text: r.text, reference: r.reference, templateId: r.templateId, locale: r.locale }),
    fromResponse: (json) => (0, generic_1.genericMessageResponse)(json),
    parseWebhook: (json) => (0, generic_1.genericEvents)(json, "message"),
};
//# sourceMappingURL=sms.mapping.js.map