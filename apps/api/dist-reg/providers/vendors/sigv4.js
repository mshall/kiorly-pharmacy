"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awsRegionFromHost = void 0;
exports.signV4 = signV4;
const node_crypto_1 = require("node:crypto");
const sha256 = (s) => (0, node_crypto_1.createHash)('sha256').update(s, 'utf8').digest('hex');
const hmac = (k, s) => (0, node_crypto_1.createHmac)('sha256', k).update(s, 'utf8').digest();
const enc = (s) => encodeURIComponent(s).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
function signV4(i) {
    const u = new URL(i.url);
    const d = (i.now ?? new Date()).toISOString().replace(/[:-]|\.\d{3}/g, '');
    const day = d.slice(0, 8);
    const hdrs = { ...Object.fromEntries(Object.entries(i.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v.trim()])), host: u.host, 'x-amz-date': d };
    if (i.sessionToken)
        hdrs['x-amz-security-token'] = i.sessionToken;
    const names = Object.keys(hdrs).sort();
    const canonicalHeaders = names.map((n) => `${n}:${hdrs[n]}\n`).join('');
    const signedHeaders = names.join(';');
    const query = [...u.searchParams.entries()].map(([k, v]) => [enc(k), enc(v)]).sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1)).map(([k, v]) => `${k}=${v}`).join('&');
    const path = u.pathname.split('/').map((s) => enc(decodeURIComponent(s))).join('/') || '/';
    const canonical = [i.method.toUpperCase(), path, query, canonicalHeaders, signedHeaders, sha256(i.body)].join('\n');
    const scope = `${day}/${i.region}/${i.service}/aws4_request`;
    const toSign = ['AWS4-HMAC-SHA256', d, scope, sha256(canonical)].join('\n');
    const key = hmac(hmac(hmac(hmac(`AWS4${i.secretAccessKey}`, day), i.region), i.service), 'aws4_request');
    const signature = (0, node_crypto_1.createHmac)('sha256', key).update(toSign, 'utf8').digest('hex');
    const out = { 'x-amz-date': d, authorization: `AWS4-HMAC-SHA256 Credential=${i.accessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}` };
    if (i.sessionToken)
        out['x-amz-security-token'] = i.sessionToken;
    return out;
}
const awsRegionFromHost = (host) => /\.([a-z]{2}(?:-[a-z]+)+-\d)\.amazonaws\.com(?:\.cn)?$/.exec(host)?.[1];
exports.awsRegionFromHost = awsRegionFromHost;
//# sourceMappingURL=sigv4.js.map