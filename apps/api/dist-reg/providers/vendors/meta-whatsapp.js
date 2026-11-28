"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signMetaBody = exports.metaPhone = void 0;
exports.metaTemplateBody = metaTemplateBody;
exports.parseMetaSend = parseMetaSend;
exports.verifyMetaSignature = verifyMetaSignature;
exports.metaVerifyChallenge = metaVerifyChallenge;
exports.parseMetaWebhook = parseMetaWebhook;
const node_crypto_1 = require("node:crypto");
const metaPhone = (e164) => e164.replace(/^\+/, '').replace(/[^\d]/g, '');
exports.metaPhone = metaPhone;
function metaTemplateBody(i) {
    const components = [];
    if (i.bodyParams.length)
        components.push({ type: 'body', parameters: i.bodyParams.map((text) => ({ type: 'text', text })) });
    if (i.urlButtonParam)
        components.push({ type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: i.urlButtonParam }] });
    return { messaging_product: 'whatsapp', recipient_type: 'individual', to: (0, exports.metaPhone)(i.to), type: 'template', template: { name: i.templateName, language: { code: i.language }, ...(components.length ? { components } : {}) } };
}
function parseMetaSend(json) {
    const id = json?.messages?.[0]?.id;
    if (typeof id !== 'string' || !id)
        throw new Error('no message id in Meta response');
    return { providerRef: id };
}
const eq = (a, b) => { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && (0, node_crypto_1.timingSafeEqual)(x, y); };
const h = (headers, n) => { const v = headers[n]; return Array.isArray(v) ? String(v[0] ?? '') : String(v ?? ''); };
function verifyMetaSignature(appSecret, rawBody, headers) {
    if (!appSecret)
        return false;
    const sig = h(headers, 'x-hub-signature-256');
    if (!sig.startsWith('sha256='))
        return false;
    return eq(sig, `sha256=${(0, node_crypto_1.createHmac)('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`);
}
const signMetaBody = (appSecret, rawBody) => `sha256=${(0, node_crypto_1.createHmac)('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`;
exports.signMetaBody = signMetaBody;
function metaVerifyChallenge(q, verifyToken) {
    if (!verifyToken || q['hub.mode'] !== 'subscribe' || q['hub.verify_token'] !== verifyToken || q['hub.challenge'] === undefined)
        return null;
    return String(q['hub.challenge']);
}
function parseMetaWebhook(raw) {
    const out = { statuses: [], inbound: [] };
    let j;
    try {
        j = JSON.parse(raw);
    }
    catch {
        return out;
    }
    if (j?.object !== 'whatsapp_business_account')
        return out;
    for (const entry of j.entry ?? [])
        for (const ch of entry?.changes ?? []) {
            const v = ch?.value;
            if (!v)
                continue;
            for (const s of v.statuses ?? []) {
                const st = String(s?.status ?? '').toLowerCase();
                const id = String(s?.id ?? '');
                const status = st === 'sent' ? 'SENT' : st === 'delivered' ? 'DELIVERED' : st === 'read' ? 'READ' : st === 'failed' ? 'FAILED' : undefined;
                if (!status || !id)
                    continue;
                const err = s?.errors?.[0];
                out.statuses.push({ providerRef: id, status, ...(status === 'FAILED' ? { error: `META_${err?.code ?? 'FAILED'}`.slice(0, 200) } : {}), ...(s?.timestamp ? { occurredAt: new Date(Number(s.timestamp) * 1000).toISOString() } : {}) });
            }
            for (const m of v.messages ?? []) {
                if (!m?.from)
                    continue;
                const text = m.type === 'text' ? m.text?.body : m.type === 'interactive' ? (m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title) : undefined;
                const buttonPayload = m.type === 'button' ? m.button?.payload : m.type === 'interactive' ? (m.interactive?.button_reply?.id ?? m.interactive?.list_reply?.id) : undefined;
                out.inbound.push({ from: `+${String(m.from).replace(/^\+/, '')}`, ...(text ? { text: String(text) } : {}), ...(buttonPayload ? { buttonPayload: String(buttonPayload) } : {}), ...(m.id ? { providerRef: String(m.id) } : {}) });
            }
        }
    return out;
}
//# sourceMappingURL=meta-whatsapp.js.map