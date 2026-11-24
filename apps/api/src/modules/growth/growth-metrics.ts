/**
 * Pure roll-up for the Growth performance view (GRW-P4-B1): orders that came through the pharmacy's own links versus orders that came through the
 * Kiorex marketplace. COUNTS ONLY: no order value, no Kiorex fee and no customer identifier is ever part of this view (a pharmacy owes Kiorex no commission today).
 * Until the Kiorex acquisition block arrives (P4-B2) the link daily `orders` and `completed` are zero, so every Kiorex order is shown as marketplace.
 */
export interface KiorexOrderCounts { total: number; completed: number; rejectedOrCancelled: number }
export interface LinkCountTotals { visits: number; orders: number; completed: number }

const rate = (n: number, d: number): number | null => (d > 0 ? Math.round((n / d) * 1000) / 1000 : null);

export function buildPerformance(kiorex: KiorexOrderCounts, links: LinkCountTotals) {
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
