"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LINK_TAG_KEYS = void 0;
exports.sanitizeLinkTags = sanitizeLinkTags;
exports.defaultTagsForChannel = defaultTagsForChannel;
exports.effectiveTags = effectiveTags;
exports.LINK_TAG_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "campaign"];
const TAG_PATTERN = /^[a-z0-9][a-z0-9_.-]{0,39}$/;
function sanitizeLinkTags(input) {
    if (input === undefined || input === null)
        return { ok: true, tags: null };
    if (typeof input !== "object" || Array.isArray(input))
        return { ok: false, key: "tags" };
    const out = {};
    for (const [k, v] of Object.entries(input)) {
        if (!exports.LINK_TAG_KEYS.includes(k))
            return { ok: false, key: k };
        if (v === undefined || v === null || v === "")
            continue;
        if (typeof v !== "string")
            return { ok: false, key: k };
        const value = v.trim().toLowerCase();
        if (!TAG_PATTERN.test(value))
            return { ok: false, key: k };
        out[k] = value;
    }
    return { ok: true, tags: Object.keys(out).length ? out : null };
}
function defaultTagsForChannel(channelKind) {
    switch (channelKind) {
        case "QR_POSTER":
        case "QR_DESK":
            return { utm_source: "kiorly", utm_medium: "qr" };
        case "SOCIAL":
            return { utm_source: "kiorly", utm_medium: "social" };
        case "SMS":
            return { utm_source: "kiorly", utm_medium: "sms" };
        case "WHATSAPP_SHARE":
            return { utm_source: "kiorly", utm_medium: "whatsapp" };
        case "EMAIL_SIG":
            return { utm_source: "kiorly", utm_medium: "email" };
        case "GOOGLE_PROFILE":
            return { utm_source: "google", utm_medium: "profile" };
        default:
            return { utm_source: "kiorly", utm_medium: "link" };
    }
}
function effectiveTags(channelKind, stored) {
    const parsed = sanitizeLinkTags(stored);
    return { ...defaultTagsForChannel(channelKind), ...(parsed.ok && parsed.tags ? parsed.tags : {}) };
}
//# sourceMappingURL=link-tags.js.map