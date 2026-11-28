"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signTwilio = exports.twilioPath = exports.twilioAuth = exports.twilioCreds = void 0;
exports.twilioForm = twilioForm;
exports.parseTwilioSend = parseTwilioSend;
exports.verifyTwilioSignature = verifyTwilioSignature;
exports.parseTwilioStatus = parseTwilioStatus;
const node_crypto_1 = require("node:crypto");
const twilioCreds = (apiKey) => { const i = apiKey.indexOf(':'); return i > 0 ? { sid: apiKey.slice(0, i), token: apiKey.slice(i + 1) } : null; };
exports.twilioCreds = twilioCreds;
const twilioAuth = (apiKey) => ({ authorization: `Basic ${Buffer.from(apiKey).toString('base64')}` });
exports.twilioAuth = twilioAuth;
const twilioPath = (apiKey) => `/2010-04-01/Accounts/${encodeURIComponent((0, exports.twilioCreds)(apiKey)?.sid ?? '')}/Messages.json`;
exports.twilioPath = twilioPath;
function twilioForm(i) {
    const f = { To: i.to, Body: i.body };
    if (/^MG[0-9a-f]{32}$/i.test(i.from))
        f.MessagingServiceSid = i.from;
    else
        f.From = i.from;
    if (i.statusCallback)
        f.StatusCallback = i.statusCallback;
    return f;
}
function parseTwilioSend(json) {
    if (typeof json?.sid !== 'string' || !json.sid)
        throw new Error('no sid in Twilio response');
    return { providerRef: json.sid };
}
function verifyTwilioSignature(authToken, publicUrl, rawBody, headers) {
    if (!authToken || !publicUrl)
        return false;
    const sig = String(Array.isArray(headers['x-twilio-signature']) ? headers['x-twilio-signature'][0] : headers['x-twilio-signature'] ?? '');
    const params = [...new URLSearchParams(rawBody).entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
    const expected = (0, node_crypto_1.createHmac)('sha1', authToken).update(publicUrl + params.map(([k, v]) => k + v).join(''), 'utf8').digest('base64');
    const x = Buffer.from(sig);
    const y = Buffer.from(expected);
    return x.length === y.length && (0, node_crypto_1.timingSafeEqual)(x, y);
}
const signTwilio = (authToken, publicUrl, rawBody) => (0, node_crypto_1.createHmac)('sha1', authToken).update(publicUrl + [...new URLSearchParams(rawBody).entries()].sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0)).map(([k, v]) => k + v).join(''), 'utf8').digest('base64');
exports.signTwilio = signTwilio;
function parseTwilioStatus(raw) {
    const p = new URLSearchParams(raw);
    const id = p.get('MessageSid') ?? p.get('SmsSid');
    const st = (p.get('MessageStatus') ?? p.get('SmsStatus') ?? '').toLowerCase();
    const status = st === 'sent' ? 'SENT' : st === 'delivered' ? 'DELIVERED' : st === 'read' ? 'READ' : st === 'failed' || st === 'undelivered' ? 'FAILED' : undefined;
    if (!id || !status)
        return [];
    return [{ providerRef: id, status, ...(status === 'FAILED' ? { error: `TWILIO_${p.get('ErrorCode') ?? 'FAILED'}` } : {}) }];
}
//# sourceMappingURL=twilio-sms.js.map