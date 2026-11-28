"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fawryRefundBody = exports.fawryStatusUrl = exports.fawryCallbackSignature = void 0;
exports.fawryCheckoutUrl = fawryCheckoutUrl;
exports.verifyFawryCallback = verifyFawryCallback;
exports.parseFawryCallback = parseFawryCallback;
const node_crypto_1 = require("node:crypto");
const sha = (s) => (0, node_crypto_1.createHash)('sha256').update(s, 'utf8').digest('hex');
const major = (minor) => (minor / 100).toFixed(2);
const eq = (a, b) => { const x = Buffer.from(a.toLowerCase()); const y = Buffer.from(b.toLowerCase()); return x.length === y.length && (0, node_crypto_1.timingSafeEqual)(x, y); };
function fawryCheckoutUrl(i) {
    const item = { itemId: 'kiorex-payment', description: 'Kiorex', price: major(i.amountMinor), quantity: '1' };
    const signature = sha(`${i.merchantCode}${i.paymentId}${''}${i.returnUrl}${item.itemId}${item.quantity}${item.price}${i.secureKey}`);
    const chargeRequest = { merchantCode: i.merchantCode, merchantRefNum: i.paymentId, language: i.language ?? 'ar-eg', chargeItems: [item], returnUrl: i.returnUrl, orderWebHookUrl: i.webhookUrl, signature };
    return { pspRef: i.paymentId, checkoutUrl: `${i.apiUrl.replace(/\/+$/, '')}/ECommercePlugin/FawryPay.jsp?chargeRequest=${encodeURIComponent(JSON.stringify(chargeRequest))}` };
}
const fawryCallbackSignature = (secureKey, b) => sha(`${b.fawryRefNumber}${b.merchantRefNumber}${Number(b.paymentAmount).toFixed(2)}${Number(b.orderAmount).toFixed(2)}${b.orderStatus}${b.paymentMethod}${b.paymentRefrenceNumber ?? ''}${secureKey}`);
exports.fawryCallbackSignature = fawryCallbackSignature;
function verifyFawryCallback(secureKey, raw) {
    let b;
    try {
        b = JSON.parse(raw);
    }
    catch {
        return null;
    }
    if (!secureKey || !b?.messageSignature || b.fawryRefNumber === undefined || !b.merchantRefNumber)
        return null;
    return eq(String(b.messageSignature), (0, exports.fawryCallbackSignature)(secureKey, b)) ? b : null;
}
function parseFawryCallback(b) {
    const status = String(b?.orderStatus ?? '').toUpperCase();
    const type = status === 'PAID' ? 'payment.captured' : status === 'REFUNDED' || status === 'PARTIAL_REFUNDED' ? 'refund.settled' : status === 'FAILED' || status === 'CANCELED' || status === 'EXPIRED' ? 'payment.failed' : null;
    if (!type)
        return null;
    const fees = Number(b.fawryFees);
    return { eventId: `fawry_${b.fawryRefNumber}_${status}`, type, pspRef: type === 'refund.settled' ? `${b.fawryRefNumber}` : String(b.merchantRefNumber), paymentId: String(b.merchantRefNumber), amountMinor: Math.round(Number(b.paymentAmount) * 100), ...(Number.isFinite(fees) && fees > 0 ? { feeMinor: Math.round(fees * 100) } : {}), occurredAt: b.paymentTime ? new Date(Number(b.paymentTime)).toISOString() : new Date().toISOString() };
}
const fawryStatusUrl = (apiUrl, merchantCode, secureKey, merchantRefNumber) => `${apiUrl.replace(/\/+$/, '')}/ECommerceWeb/Fawry/payments/status/v2?merchantCode=${encodeURIComponent(merchantCode)}&merchantRefNumber=${encodeURIComponent(merchantRefNumber)}&signature=${sha(`${merchantCode}${merchantRefNumber}${secureKey}`)}`;
exports.fawryStatusUrl = fawryStatusUrl;
const fawryRefundBody = (i) => { const reason = i.reason ?? 'Refund'; return { merchantCode: i.merchantCode, referenceNumber: i.fawryRefNumber, refundAmount: Number(major(i.amountMinor)), reason, signature: sha(`${i.merchantCode}${i.fawryRefNumber}${major(i.amountMinor)}${reason}${i.secureKey}`) }; };
exports.fawryRefundBody = fawryRefundBody;
//# sourceMappingURL=fawry.js.map