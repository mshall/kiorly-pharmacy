"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPerformance = buildPerformance;
const rate = (n, d) => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);
function buildPerformance(kiorex, links) {
    const linkOrders = Math.min(links.orders, kiorex.total || links.orders);
    const linkCompleted = Math.min(links.completed, linkOrders);
    const market = { orders: Math.max(0, kiorex.total - linkOrders), completed: Math.max(0, kiorex.completed - linkCompleted) };
    return {
        providerOriginated: { orders: linkOrders, completed: linkCompleted, completionRate: rate(linkCompleted, linkOrders) },
        marketplaceOriginated: { orders: market.orders, completed: market.completed, completionRate: rate(market.completed, market.orders) },
        links: { visits: links.visits, orders: links.orders, completed: links.completed, visitToOrder: rate(links.orders, links.visits), orderToCompleted: rate(links.completed, links.orders) },
        kiorex: { orders: kiorex.total, completed: kiorex.completed, rejectedOrCancelled: kiorex.rejectedOrCancelled },
        acquisitionPending: links.orders === 0,
    };
}
//# sourceMappingURL=growth-metrics.js.map