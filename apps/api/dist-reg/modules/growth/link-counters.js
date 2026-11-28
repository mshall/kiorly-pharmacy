"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.utcDay = utcDay;
exports.bumpLinkCounter = bumpLinkCounter;
exports.isLikelyBot = isLikelyBot;
function utcDay(d) {
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
}
async function bumpLinkCounter(db, link, counter, at = new Date(), by = 1) {
    const day = utcDay(at);
    const v = counter === "visits" ? by : 0;
    const o = counter === "orders" ? by : 0;
    const c = counter === "completed" ? by : 0;
    await db.$executeRaw `
    INSERT INTO "ProviderReferralLinkDaily" ("linkId", "orgId", "date", "visits", "orders", "completed", "updatedAt")
    VALUES (${link.id}, ${link.orgId}, ${day}, ${v}, ${o}, ${c}, now())
    ON CONFLICT ("linkId", "date") DO UPDATE SET
      "visits" = "ProviderReferralLinkDaily"."visits" + ${v},
      "orders" = "ProviderReferralLinkDaily"."orders" + ${o},
      "completed" = "ProviderReferralLinkDaily"."completed" + ${c},
      "updatedAt" = now()`;
}
const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|pingdom|uptime|monitor|curl\/|wget|python-requests|python-urllib|go-http-client|okhttp\/|java\/|libwww|httpclient|axios|node-fetch|postman|facebookexternalhit|embedly|skypeuri|telegrambot|discordbot|slackbot|linkedinbot|twitterbot|applebot|bingpreview|google-read-aloud|chrome-lighthouse/i;
function isLikelyBot(headers) {
    const h = (k) => {
        const v = headers[k];
        return (Array.isArray(v) ? v[0] : v)?.toString() ?? "";
    };
    const ua = h("user-agent").trim();
    if (ua.length < 12)
        return true;
    if (BOT_UA.test(ua))
        return true;
    const purpose = `${h("purpose")} ${h("sec-purpose")} ${h("x-purpose")} ${h("x-moz")}`.toLowerCase();
    if (purpose.includes("prefetch") || purpose.includes("preview") || purpose.includes("prerender"))
        return true;
    return false;
}
//# sourceMappingURL=link-counters.js.map