"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushSender = exports.pushConfigFromEnv = exports.isExpoToken = void 0;
exports.parseServiceAccount = parseServiceAccount;
exports.pushProblems = pushProblems;
const node_crypto_1 = require("node:crypto");
const isExpoToken = (t) => /^Expo(nent)?PushToken\[[^\]]+\]$/.test(t);
exports.isExpoToken = isExpoToken;
function parseServiceAccount(raw) {
    if (!raw?.trim())
        return null;
    const txt = raw.trim().startsWith('{') ? raw.trim() : Buffer.from(raw.trim(), 'base64').toString('utf8');
    try {
        const j = JSON.parse(txt);
        return typeof j.client_email === 'string' && typeof j.private_key === 'string' && typeof j.project_id === 'string' ? j : null;
    }
    catch {
        return null;
    }
}
function pushProblems(env) {
    const out = [];
    const hasFcm = !!env.PUSH_FCM_SERVICE_ACCOUNT_JSON?.trim();
    if (hasFcm && !parseServiceAccount(env.PUSH_FCM_SERVICE_ACCOUNT_JSON))
        out.push('PUSH_FCM_SERVICE_ACCOUNT_JSON is not a valid service-account JSON (raw or base64) with project_id, client_email, private_key');
    if (!hasFcm && !env.PUSH_EXPO_ACCESS_TOKEN?.trim() && env.PUSH_EXPO_ENABLED !== 'true')
        out.push('PUSH_MODE=real needs PUSH_FCM_SERVICE_ACCOUNT_JSON (FCM) and/or PUSH_EXPO_ENABLED=true / PUSH_EXPO_ACCESS_TOKEN (Expo)');
    return out;
}
const pushConfigFromEnv = (env) => ({
    fcmServiceAccountJson: env.PUSH_FCM_SERVICE_ACCOUNT_JSON, fcmProjectId: env.PUSH_FCM_PROJECT_ID, expoAccessToken: env.PUSH_EXPO_ACCESS_TOKEN, androidChannelId: env.PUSH_ANDROID_CHANNEL_ID,
});
exports.pushConfigFromEnv = pushConfigFromEnv;
const b64u = (b) => Buffer.from(b).toString('base64url');
const stringify = (d) => Object.fromEntries(Object.entries(d ?? {}).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => [k, typeof v === 'string' ? v : JSON.stringify(v)]));
class PushSender {
    cfg;
    fetchImpl;
    now;
    accessToken;
    constructor(cfg, fetchImpl = fetch, now = Date.now) {
        this.cfg = cfg;
        this.fetchImpl = fetchImpl;
        this.now = now;
    }
    async http(url, init) {
        const ctl = new AbortController();
        const t = setTimeout(() => ctl.abort(), this.cfg.timeoutMs ?? 8000);
        try {
            let last = { status: 0, json: {} };
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    const res = await this.fetchImpl(url, { ...init, signal: ctl.signal });
                    const text = await res.text();
                    let json = {};
                    try {
                        json = text ? JSON.parse(text) : {};
                    }
                    catch { }
                    last = { status: res.status, json };
                    if (res.status !== 429 && res.status < 500)
                        return last;
                }
                catch (e) {
                    if (e.name === 'AbortError')
                        throw e;
                    last = { status: 0, json: {} };
                }
                await new Promise((r) => setTimeout(r, 100 * 2 ** attempt));
            }
            return last;
        }
        finally {
            clearTimeout(t);
        }
    }
    async fcmAccessToken(sa) {
        if (this.accessToken && this.accessToken.exp - 60_000 > this.now())
            return this.accessToken.value;
        const iat = Math.floor(this.now() / 1000);
        const claims = { iss: sa.client_email, scope: 'https://www.googleapis.com/auth/firebase.messaging', aud: this.cfg.oauthUrl ?? sa.token_uri ?? 'https://oauth2.googleapis.com/token', iat, exp: iat + 3600 };
        const unsigned = `${b64u(JSON.stringify({ alg: 'RS256', typ: 'JWT' }))}.${b64u(JSON.stringify(claims))}`;
        const assertion = `${unsigned}.${b64u((0, node_crypto_1.createSign)('RSA-SHA256').update(unsigned).sign(sa.private_key))}`;
        const r = await this.http(claims.aud, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }).toString() });
        if (r.status !== 200 || typeof r.json?.access_token !== 'string')
            throw new Error(`FCM_AUTH_${r.status}`);
        this.accessToken = { value: r.json.access_token, exp: this.now() + (Number(r.json.expires_in) || 3600) * 1000 };
        return this.accessToken.value;
    }
    async sendFcm(m) {
        const sa = parseServiceAccount(this.cfg.fcmServiceAccountJson);
        if (!sa)
            return { ok: false, error: 'PUSH_FCM_NOT_CONFIGURED' };
        let token;
        try {
            token = await this.fcmAccessToken(sa);
        }
        catch (e) {
            return { ok: false, error: e.message.slice(0, 60) };
        }
        const project = this.cfg.fcmProjectId || sa.project_id;
        const body = { message: { token: m.token, notification: { title: m.title, body: m.body }, data: stringify(m.data), android: { priority: 'HIGH', notification: { channel_id: m.channelId ?? this.cfg.androidChannelId ?? 'default' } }, apns: { headers: { 'apns-priority': '10' }, payload: { aps: { sound: 'default' } } } } };
        const r = await this.http(`${this.cfg.fcmBase ?? 'https://fcm.googleapis.com'}/v1/projects/${encodeURIComponent(project)}/messages:send`, { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` }, body: JSON.stringify(body) });
        if (r.status === 200 && typeof r.json?.name === 'string')
            return { ok: true, providerRef: r.json.name };
        if (r.status === 401)
            this.accessToken = undefined;
        const code = String(r.json?.error?.details?.find?.((d) => d?.errorCode)?.errorCode ?? r.json?.error?.status ?? r.status);
        return { ok: false, error: `FCM_${code}`.slice(0, 80), invalidToken: code === 'UNREGISTERED' || (r.status === 404) || code === 'INVALID_ARGUMENT' && /registration token/i.test(String(r.json?.error?.message ?? '')) };
    }
    async sendExpo(m) {
        const r = await this.http(this.cfg.expoUrl ?? 'https://exp.host/--/api/v2/push/send', { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json', ...(this.cfg.expoAccessToken ? { authorization: `Bearer ${this.cfg.expoAccessToken}` } : {}) }, body: JSON.stringify([{ to: m.token, title: m.title, body: m.body, data: m.data ?? {}, sound: 'default', priority: 'high', channelId: m.channelId ?? this.cfg.androidChannelId ?? 'default' }]) });
        const t = r.json?.data?.[0];
        if (r.status === 200 && t?.status === 'ok')
            return { ok: true, providerRef: String(t.id ?? 'expo') };
        const err = String(t?.details?.error ?? r.json?.errors?.[0]?.code ?? r.status);
        return { ok: false, error: `EXPO_${err}`.slice(0, 80), invalidToken: err === 'DeviceNotRegistered' };
    }
    send(m) { return (0, exports.isExpoToken)(m.token) ? this.sendExpo(m) : this.sendFcm(m); }
}
exports.PushSender = PushSender;
//# sourceMappingURL=push.js.map