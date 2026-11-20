import { Prisma } from "@prisma/client";
import { D, round2 } from "../../common/money";

/** Pure promotion engine: given the priced cart (per drug) and the promotions in force, returns the discount per drug and what was applied. */
export interface PromoCartLine { drugId: string; quantity: number; unitPrice: Prisma.Decimal; /** manual discount already on the line */ manualDiscount: Prisma.Decimal }
export interface PromoDef {
  id: string; name: string; kind: "PERCENT_OFF" | "AMOUNT_OFF" | "BUY_X_GET_Y" | "BUNDLE_PRICE" | string; couponCode?: string | null; drugIds: string[];
  params: { percent?: number; amount?: number | string; buy?: number; get?: number; percentOff?: number; items?: Array<{ drugId: string; qty: number }>; price?: number | string };
  minSubtotal?: Prisma.Decimal | null; priority: number; stackable: boolean;
}
export interface AppliedPromo { promoId: string; name: string; amount: Prisma.Decimal; couponCode?: string }
export interface PromoResult { byDrug: Map<string, Prisma.Decimal>; applied: AppliedPromo[]; unusedCoupons: string[] }

export function applyPromotions(cart: PromoCartLine[], promos: readonly PromoDef[], coupons: readonly string[] = []): PromoResult {
  const codes = new Set(coupons.map((c) => c.trim().toLowerCase()).filter(Boolean));
  const usedCodes = new Set<string>();
  const lines = new Map<string, { qty: number; unit: Prisma.Decimal; gross: Prisma.Decimal; discounted: Prisma.Decimal; promoDiscounted: boolean }>();
  for (const l of cart) {
    const cur = lines.get(l.drugId);
    const gross = l.unitPrice.mul(l.quantity);
    if (cur) { cur.qty += l.quantity; cur.gross = cur.gross.plus(gross); cur.discounted = cur.discounted.plus(l.manualDiscount); }
    else lines.set(l.drugId, { qty: l.quantity, unit: l.unitPrice, gross, discounted: l.manualDiscount, promoDiscounted: false });
  }
  const subtotal = [...lines.values()].reduce((a, l) => a.plus(l.gross), D(0));
  const byDrug = new Map<string, Prisma.Decimal>();
  const applied: AppliedPromo[] = [];
  const room = (id: string) => { const l = lines.get(id)!; return Prisma.Decimal.max(l.gross.minus(l.discounted), D(0)); };
  const take = (id: string, amount: Prisma.Decimal) => {
    const l = lines.get(id)!;
    const a = Prisma.Decimal.min(round2(amount), room(id));
    if (a.lte(0)) return D(0);
    l.discounted = l.discounted.plus(a); l.promoDiscounted = true;
    byDrug.set(id, (byDrug.get(id) ?? D(0)).plus(a));
    return a;
  };

  for (const p of [...promos].sort((a, b) => b.priority - a.priority)) {
    const code = p.couponCode?.trim().toLowerCase();
    if (code && !codes.has(code)) continue;
    if (p.minSubtotal && subtotal.lt(p.minSubtotal)) continue;
    const scope = (p.drugIds.length ? p.drugIds : [...lines.keys()]).filter((id) => lines.has(id) && (p.stackable || !lines.get(id)!.promoDiscounted || p.kind === "BUNDLE_PRICE"));
    let total = D(0);
    if (p.kind === "PERCENT_OFF") {
      const pct = D(p.params.percent ?? 0);
      if (pct.lte(0) || pct.gt(100)) continue;
      for (const id of scope) total = total.plus(take(id, room(id).mul(pct).div(100)));
    } else if (p.kind === "AMOUNT_OFF") {
      const amt = D(p.params.amount ?? 0);
      if (amt.lte(0)) continue;
      for (const id of scope) total = total.plus(take(id, amt.mul(lines.get(id)!.qty)));
    } else if (p.kind === "BUY_X_GET_Y") {
      const buy = p.params.buy ?? 0, get = p.params.get ?? 0, off = D(p.params.percentOff ?? 100);
      if (buy < 1 || get < 1) continue;
      for (const id of scope) { const l = lines.get(id)!; const free = Math.floor(l.qty / (buy + get)) * get; if (free > 0) total = total.plus(take(id, l.unit.mul(free).mul(off).div(100))); }
    } else if (p.kind === "BUNDLE_PRICE") {
      const items = p.params.items ?? [];
      if (!items.length || p.params.price == null) continue;
      const sets = Math.min(...items.map((i) => (lines.has(i.drugId) && i.qty > 0 ? Math.floor(lines.get(i.drugId)!.qty / i.qty) : 0)));
      if (!(sets > 0)) continue;
      const list = items.reduce((a, i) => a.plus(lines.get(i.drugId)!.unit.mul(i.qty)), D(0));
      const saving = list.minus(D(p.params.price)).mul(sets);
      if (saving.lte(0)) continue;
      for (const i of items) total = total.plus(take(i.drugId, saving.mul(lines.get(i.drugId)!.unit.mul(i.qty)).div(list)));
    }
    if (total.gt(0)) { applied.push({ promoId: p.id, name: p.name, amount: total, couponCode: code ? p.couponCode! : undefined }); if (code) usedCodes.add(code); }
  }
  return { byDrug, applied, unusedCoupons: [...codes].filter((c) => !usedCodes.has(c)) };
}
