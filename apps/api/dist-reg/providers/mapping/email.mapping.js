"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailMapping = void 0;
const generic_1 = require("./generic");
exports.emailMapping = {
    sendPath: "/messages",
    authHeaders: (cfg) => (0, generic_1.bearer)(cfg),
    toRequest: (r, cfg) => ({ to: r.to, from: r.from ?? cfg.senderId, subject: r.subject ?? "Kiorly", text: r.text, html: r.html, reference: r.reference, templateId: r.templateId, locale: r.locale }),
    fromResponse: (json) => (0, generic_1.genericMessageResponse)(json),
    parseWebhook: (json) => (0, generic_1.genericEvents)(json, "message"),
};
//# sourceMappingURL=email.mapping.js.map