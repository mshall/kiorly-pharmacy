"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sesSigner = void 0;
exports.parseSesCreds = parseSesCreds;
exports.sesSendBody = sesSendBody;
exports.parseSesSend = parseSesSend;
exports.verifySnsBasicAuth = verifySnsBasicAuth;
exports.snsConfirmUrl = snsConfirmUrl;
exports.parseSesEvents = parseSesEvents;
const sigv4_1 = require("./sigv4");
function parseSesCreds(apiKey) {
    const [accessKeyId, secretAccessKey, sessionToken] = apiKey.split(':');
    return accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) } : null;
}
function sesSendBody(i) {
    return {
        FromEmailAddress: i.from, Destination: { ToAddresses: [i.to] },
        Content: { Simple: { Subject: { Data: i.subject, Charset: 'UTF-8' }, Body: { Text: { Data: i.text, Charset: 'UTF-8' }, ...(i.html ? { Html: { Data: i.html, Charset: 'UTF-8' } } : {}) } } },
        ...(i.configurationSet ? { ConfigurationSetName: i.configurationSet } : {}),
        ...(i.reference ? { EmailTags: [{ Name: 'ref', Value: i.reference.replace(/[^A-Za-z0-9_.@-]/g, '_').slice(0, 256) }] } : {}),
    };
}
const sesSigner = (apiUrl, apiKey) => {
    const creds = parseSesCreds(apiKey);
    const region = (0, sigv4_1.awsRegionFromHost)(new URL(apiUrl).host);
    return creds && region ? (r) => (0, sigv4_1.signV4)({ ...r, ...creds, region, service: 'ses', headers: { 'content-type': 'application/json' } }) : undefined;
};
exports.sesSigner = sesSigner;
function parseSesSend(json) {
    if (typeof json?.MessageId !== 'string' || !json.MessageId)
        throw new Error('no MessageId in SES response');
    return { providerRef: json.MessageId };
}
const http_hardening_1 = require("../../common/http-hardening");
function verifySnsBasicAuth(secret, headers) {
    if (!secret)
        return false;
    const a = String(Array.isArray(headers.authorization) ? headers.authorization[0] : headers.authorization ?? '');
    if (!a.startsWith('Basic '))
        return false;
    const pw = Buffer.from(a.slice(6), 'base64').toString('utf8').split(':').slice(1).join(':');
    return (0, http_hardening_1.secretsEqual)(pw, secret);
}
function snsConfirmUrl(raw) {
    try {
        const j = JSON.parse(raw);
        if (j?.Type !== 'SubscriptionConfirmation')
            return null;
        const u = new URL(String(j.SubscribeURL));
        return u.protocol === 'https:' && /^sns\.[a-z0-9-]+\.amazonaws\.com$/.test(u.host) ? u.toString() : null;
    }
    catch {
        return null;
    }
}
function parseSesEvents(raw) {
    let env;
    try {
        env = JSON.parse(raw);
    }
    catch {
        return [];
    }
    if (env?.Type !== 'Notification')
        return [];
    let m;
    try {
        m = JSON.parse(env.Message);
    }
    catch {
        return [];
    }
    const id = m?.mail?.messageId;
    const type = String(m?.eventType ?? m?.notificationType ?? '');
    if (!id)
        return [];
    const at = m?.[type.toLowerCase()]?.timestamp ?? m?.mail?.timestamp;
    const base = { providerRef: String(id), ...(at ? { occurredAt: String(at) } : {}) };
    switch (type) {
        case 'Send': return [{ ...base, status: 'SENT' }];
        case 'Delivery': return [{ ...base, status: 'DELIVERED' }];
        case 'Bounce': return [{ ...base, status: 'FAILED', error: `SES_BOUNCE_${String(m.bounce?.bounceType ?? 'UNKNOWN').toUpperCase()}` }];
        case 'Complaint': return [{ ...base, status: 'FAILED', error: 'SES_COMPLAINT' }];
        case 'Reject': return [{ ...base, status: 'FAILED', error: 'SES_REJECT' }];
        default: return [];
    }
}
//# sourceMappingURL=ses.js.map