import { signV4, awsRegionFromHost } from './sigv4';

/**
 * Amazon SES v2 over HTTPS (SigV4, no SDK).  EMAIL_API_URL=https://email.<region>.amazonaws.com
 *   send: POST /v2/email/outbound-emails  { FromEmailAddress, Destination:{ToAddresses}, Content:{Simple:{Subject,Body}}, ConfigurationSetName? } -> { MessageId }
 *   EMAIL_API_KEY = "<ACCESS_KEY_ID>:<SECRET_ACCESS_KEY>[:<SESSION_TOKEN>]" (IAM user limited to ses:SendEmail, from Secrets Manager).
 *   events: SES configuration set -> SNS topic -> HTTPS subscription to POST /messaging/webhooks/email with basic-auth password = EMAIL_WEBHOOK_SECRET
 *   (SNS supports credentials in the subscription URL). Handles SubscriptionConfirmation and Delivery / Bounce / Complaint / Reject notifications.
 */
export interface SesCreds { accessKeyId: string; secretAccessKey: string; sessionToken?: string }
export function parseSesCreds(apiKey: string): SesCreds | null {
  const [accessKeyId, secretAccessKey, sessionToken] = apiKey.split(':');
  return accessKeyId && secretAccessKey ? { accessKeyId, secretAccessKey, ...(sessionToken ? { sessionToken } : {}) } : null;
}

export function sesSendBody(i: { from: string; to: string; subject: string; text: string; html?: string; configurationSet?: string; reference?: string }) {
  return {
    FromEmailAddress: i.from, Destination: { ToAddresses: [i.to] },
    Content: { Simple: { Subject: { Data: i.subject, Charset: 'UTF-8' }, Body: { Text: { Data: i.text, Charset: 'UTF-8' }, ...(i.html ? { Html: { Data: i.html, Charset: 'UTF-8' } } : {}) } } },
    ...(i.configurationSet ? { ConfigurationSetName: i.configurationSet } : {}),
    ...(i.reference ? { EmailTags: [{ Name: 'ref', Value: i.reference.replace(/[^A-Za-z0-9_.@-]/g, '_').slice(0, 256) }] } : {}),
  };
}
export const sesSigner = (apiUrl: string, apiKey: string) => {
  const creds = parseSesCreds(apiKey);
  const region = awsRegionFromHost(new URL(apiUrl).host);
  return creds && region ? (r: { method: string; url: string; body: string }) => signV4({ ...r, ...creds, region, service: 'ses', headers: { 'content-type': 'application/json' } }) : undefined;
};
export function parseSesSend(json: any): { providerRef: string } {
  if (typeof json?.MessageId !== 'string' || !json.MessageId) throw new Error('no MessageId in SES response');
  return { providerRef: json.MessageId };
}

/** Basic-auth verification of the SNS HTTPS subscription (password = webhook secret). */
export function verifySnsBasicAuth(secret: string, headers: Record<string, unknown>): boolean {
  if (!secret) return false;
  const a = String(Array.isArray(headers.authorization) ? headers.authorization[0] : headers.authorization ?? '');
  if (!a.startsWith('Basic ')) return false;
  const pw = Buffer.from(a.slice(6), 'base64').toString('utf8').split(':').slice(1).join(':');
  return pw.length === secret.length && pw === secret;
}
/** SNS SubscriptionConfirmation: only honour AWS SNS hosts. */
export function snsConfirmUrl(raw: string): string | null {
  try { const j = JSON.parse(raw); if (j?.Type !== 'SubscriptionConfirmation') return null; const u = new URL(String(j.SubscribeURL)); return u.protocol === 'https:' && /^sns\.[a-z0-9-]+\.amazonaws\.com$/.test(u.host) ? u.toString() : null; } catch { return null; }
}
export function parseSesEvents(raw: string): Array<{ providerRef: string; status: 'SENT' | 'DELIVERED' | 'FAILED'; error?: string; occurredAt?: string }> {
  let env: any; try { env = JSON.parse(raw); } catch { return []; }
  if (env?.Type !== 'Notification') return [];
  let m: any; try { m = JSON.parse(env.Message); } catch { return []; }
  const id = m?.mail?.messageId; const type = String(m?.eventType ?? m?.notificationType ?? '');
  if (!id) return [];
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
