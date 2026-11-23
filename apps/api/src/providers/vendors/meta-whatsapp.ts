import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Meta WhatsApp Business Cloud API (Graph API). Pure wire-format helpers, no I/O.
 *   send:    POST {WHATSAPP_API_URL = https://graph.facebook.com/v21.0}/{phone-number-id}/messages   Authorization: Bearer <system-user token>
 *            business-initiated messages MUST be approved templates (type=template); free text only inside the 24 h customer-service window.
 *   webhook: GET  ?hub.mode=subscribe&hub.verify_token=<WHATSAPP_VERIFY_TOKEN>&hub.challenge=<n>  -> echo the challenge
 *            POST X-Hub-Signature-256: sha256=HMAC-SHA256(<app secret>, raw body); body entry[].changes[].value.{statuses[],messages[]}
 */
export interface MetaStatus { providerRef: string; status: 'SENT' | 'DELIVERED' | 'READ' | 'FAILED'; error?: string; occurredAt?: string }
export interface MetaInbound { from: string; text?: string; buttonPayload?: string; providerRef?: string }

export const metaPhone = (e164: string) => e164.replace(/^\+/, '').replace(/[^\d]/g, '');

export function metaTemplateBody(i: { to: string; templateName: string; language: 'ar' | 'en'; bodyParams: string[]; urlButtonParam?: string }) {
  const components: unknown[] = [];
  if (i.bodyParams.length) components.push({ type: 'body', parameters: i.bodyParams.map((text) => ({ type: 'text', text })) });
  if (i.urlButtonParam) components.push({ type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: i.urlButtonParam }] }); // OTP "copy code" button
  return { messaging_product: 'whatsapp', recipient_type: 'individual', to: metaPhone(i.to), type: 'template', template: { name: i.templateName, language: { code: i.language }, ...(components.length ? { components } : {}) } };
}

export function parseMetaSend(json: any): { providerRef: string } {
  const id = json?.messages?.[0]?.id;
  if (typeof id !== 'string' || !id) throw new Error('no message id in Meta response');
  return { providerRef: id };
}

const eq = (a: string, b: string) => { const x = Buffer.from(a); const y = Buffer.from(b); return x.length === y.length && timingSafeEqual(x, y); };
const h = (headers: Record<string, unknown>, n: string) => { const v = headers[n]; return Array.isArray(v) ? String(v[0] ?? '') : String(v ?? ''); };

export function verifyMetaSignature(appSecret: string, rawBody: string, headers: Record<string, unknown>): boolean {
  if (!appSecret) return false;
  const sig = h(headers, 'x-hub-signature-256');
  if (!sig.startsWith('sha256=')) return false;
  return eq(sig, `sha256=${createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`);
}
export const signMetaBody = (appSecret: string, rawBody: string) => `sha256=${createHmac('sha256', appSecret).update(rawBody, 'utf8').digest('hex')}`;

/** Returns the challenge to echo, or null when the token / mode is wrong. */
export function metaVerifyChallenge(q: Record<string, unknown>, verifyToken: string): string | null {
  if (!verifyToken || q['hub.mode'] !== 'subscribe' || q['hub.verify_token'] !== verifyToken || q['hub.challenge'] === undefined) return null;
  return String(q['hub.challenge']);
}

export function parseMetaWebhook(raw: string): { statuses: MetaStatus[]; inbound: MetaInbound[] } {
  const out = { statuses: [] as MetaStatus[], inbound: [] as MetaInbound[] };
  let j: any; try { j = JSON.parse(raw); } catch { return out; }
  if (j?.object !== 'whatsapp_business_account') return out;
  for (const entry of j.entry ?? []) for (const ch of entry?.changes ?? []) {
    const v = ch?.value; if (!v) continue;
    for (const s of v.statuses ?? []) {
      const st = String(s?.status ?? '').toLowerCase(); const id = String(s?.id ?? '');
      const status = st === 'sent' ? 'SENT' : st === 'delivered' ? 'DELIVERED' : st === 'read' ? 'READ' : st === 'failed' ? 'FAILED' : undefined;
      if (!status || !id) continue;
      const err = s?.errors?.[0];
      out.statuses.push({ providerRef: id, status, ...(status === 'FAILED' ? { error: `META_${err?.code ?? 'FAILED'}`.slice(0, 200) } : {}), ...(s?.timestamp ? { occurredAt: new Date(Number(s.timestamp) * 1000).toISOString() } : {}) });
    }
    for (const m of v.messages ?? []) {
      if (!m?.from) continue;
      const text = m.type === 'text' ? m.text?.body : m.type === 'interactive' ? (m.interactive?.button_reply?.title ?? m.interactive?.list_reply?.title) : undefined;
      const buttonPayload = m.type === 'button' ? m.button?.payload : m.type === 'interactive' ? (m.interactive?.button_reply?.id ?? m.interactive?.list_reply?.id) : undefined;
      out.inbound.push({ from: `+${String(m.from).replace(/^\+/, '')}`, ...(text ? { text: String(text) } : {}), ...(buttonPayload ? { buttonPayload: String(buttonPayload) } : {}), ...(m.id ? { providerRef: String(m.id) } : {}) });
    }
  }
  return out;
}
