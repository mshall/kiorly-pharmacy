"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymobRefundBody = exports.paymobAuth = exports.paymobHmac = exports.paymobHmacString = exports.PAYMOB_HMAC_FIELDS = void 0;
exports.verifyPaymobHmac = verifyPaymobHmac;
exports.paymobIntentionBody = paymobIntentionBody;
exports.parsePaymobIntention = parsePaymobIntention;
exports.parsePaymobCallback = parsePaymobCallback;
exports.paymobTransactionIdFromInquiry = paymobTransactionIdFromInquiry;
const node_crypto_1 = require("node:crypto");
exports.PAYMOB_HMAC_FIELDS = ['amount_cents', 'created_at', 'currency', 'error_occured', 'has_parent_transaction', 'id', 'integration_id', 'is_3d_secure', 'is_auth', 'is_capture', 'is_refunded', 'is_standalone_payment', 'is_voided', 'order.id', 'owner', 'pending', 'source_data.pan', 'source_data.sub_type', 'source_data.type', 'success'];
const dig = (o, p) => p.split('.').reduce((a, k) => (a == null ? a : a[k]), o);
const paymobHmacString = (obj) => exports.PAYMOB_HMAC_FIELDS.map((f) => { const v = dig(obj, f); return v === undefined || v === null ? '' : String(v); }).join('');
exports.paymobHmacString = paymobHmacString;
const paymobHmac = (secret, obj) => (0, node_crypto_1.createHmac)('sha512', secret).update((0, exports.paymobHmacString)(obj), 'utf8').digest('hex');
exports.paymobHmac = paymobHmac;
function verifyPaymobHmac(secret, obj, given) {
    if (!secret || !given)
        return false;
    const a = Buffer.from(given.toLowerCase());
    const b = Buffer.from((0, exports.paymobHmac)(secret, obj));
    return a.length === b.length && (0, node_crypto_1.timingSafeEqual)(a, b);
}
const paymobAuth = (secretKey) => ({ authorization: `Token ${secretKey}` });
exports.paymobAuth = paymobAuth;
function paymobIntentionBody(i) {
    return {
        amount: i.amountMinor, currency: i.currency, payment_methods: i.integrationIds, special_reference: i.paymentId,
        items: [{ name: 'Kiorex payment', amount: i.amountMinor, description: 'Kiorex', quantity: 1 }],
        billing_data: { first_name: 'Kiorex', last_name: 'Patient', email: 'noreply@kiorex.com', phone_number: 'NA', apartment: 'NA', floor: 'NA', street: 'NA', building: 'NA', shipping_method: 'NA', postal_code: 'NA', city: 'NA', country: 'EG', state: 'NA' },
        notification_url: i.notificationUrl, redirection_url: i.redirectionUrl,
    };
}
function parsePaymobIntention(json, apiUrl, publicKey) {
    const cs = json?.client_secret;
    const order = json?.intention_order_id ?? json?.id;
    if (typeof cs !== 'string' || !cs || order === undefined)
        throw new Error('no client_secret / order id in Paymob response');
    return { pspRef: String(order), checkoutUrl: `${apiUrl.replace(/\/+$/, '')}/unifiedcheckout/?publicKey=${encodeURIComponent(publicKey)}&clientSecret=${encodeURIComponent(cs)}` };
}
function parsePaymobCallback(raw) {
    let j;
    try {
        j = JSON.parse(raw);
    }
    catch {
        return null;
    }
    const o = j?.obj;
    if (j?.type !== 'TRANSACTION' || !o || !Number.isInteger(o.amount_cents) || o.id === undefined)
        return null;
    const orderId = String(o.order?.id ?? '');
    const paymentId = o.order?.merchant_order_id ? String(o.order.merchant_order_id) : undefined;
    const occurredAt = o.created_at ? new Date(String(o.created_at).replace(/(\.\d+)?$/, (m) => (/[zZ+]/.test(String(o.created_at)) ? m : `${m}Z`))).toISOString() : new Date().toISOString();
    const base = { eventId: `paymob_${o.id}`, amountMinor: o.amount_cents, occurredAt, paymentId };
    if (o.pending === true)
        return null;
    if (o.is_refunded === true && o.success === true)
        return { ...base, eventId: `${base.eventId}_refund`, type: 'refund.settled', pspRef: String(o.id) };
    if (o.is_voided === true)
        return null;
    if (o.success === true)
        return { ...base, type: 'payment.captured', pspRef: orderId };
    return { ...base, type: 'payment.failed', pspRef: orderId };
}
const paymobRefundBody = (transactionId, amountMinor) => ({ transaction_id: Number(transactionId), amount_cents: amountMinor });
exports.paymobRefundBody = paymobRefundBody;
function paymobTransactionIdFromInquiry(json) {
    const id = json?.id ?? json?.data?.id;
    if (id === undefined)
        throw new Error('no transaction id in Paymob inquiry response');
    return String(id);
}
//# sourceMappingURL=paymob.js.map