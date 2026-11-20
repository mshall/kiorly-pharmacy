import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight, PackagePlus, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { buttonClass, ErrorNote, PageHeader } from "@/components/ui";
import { StatCard } from "@/brand/ui-kit";
import { fmtMoney, fmtNum } from "@/lib/format";
import type { Dashboard as D } from "@/lib/types";
import { ChartCard, Columns, HBars } from "@/components/charts";

function Tile({ to, label, value, tone }: { to: string; label: string; value: string | number; tone?: "bad" | "warn" | "good" }) {
  return (
    <Link to={to} className="block rounded-xl transition-transform duration-150 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2">
      <StatCard label={label} value={value} tone={tone ?? "neutral"} className="h-full hover:border-primary/40" />
    </Link>
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const { branchId, me, can } = useAuth();
  const q = useQuery({ queryKey: ["dashboard", branchId], queryFn: () => api<D>("/dashboard", { query: { branchId } }), enabled: !!branchId, refetchInterval: 30_000 });
  const d = q.data;
  return (
    <>
      <PageHeader title={t("dash.title")} subtitle={me?.tenant.name} actions={<>
        {can("inventory.receive") && <Link to="/receiving" className={buttonClass({ variant: "outline" })}><PackagePlus aria-hidden className="size-4" />{t("nav.receiving")}</Link>}
        {can("pos.sell") && <Link to="/pos" className={buttonClass()}><ShoppingCart aria-hidden className="size-4" />{t("dash.newSale")}</Link>}
      </>} />
      {q.isLoading && <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 8 }, (_, i) => <div key={i} className="kx-skeleton h-24 rounded-xl" />)}</div>}
      <ErrorNote error={q.error} />
      {d && (
        <div className="space-y-6">
          {(d.syncConflicts > 0 || d.expiredInStock > 0 || d.blockedLots > 0) && (
            <ul aria-label={t("dash.attention")} className="space-y-2">
              {d.expiredInStock > 0 && <li><Link to="/inventory" className="flex items-center justify-between gap-3 rounded-xl border border-[hsl(var(--danger-text)/0.3)] bg-[hsl(var(--danger-text)/0.08)] px-4 py-3 text-sm font-medium text-[hsl(var(--danger-text))]"><span className="flex items-center gap-3"><AlertTriangle aria-hidden className="size-4 shrink-0" />{t("dash.attnExpired", { count: d.expiredInStock })}</span><ChevronRight aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" /></Link></li>}
              {d.syncConflicts > 0 && <li><Link to="/pos" className="flex items-center justify-between gap-3 rounded-xl border border-[hsl(var(--danger-text)/0.3)] bg-[hsl(var(--danger-text)/0.08)] px-4 py-3 text-sm font-medium text-[hsl(var(--danger-text))]"><span className="flex items-center gap-3"><AlertTriangle aria-hidden className="size-4 shrink-0" />{t("dash.attnConflicts", { count: d.syncConflicts })}</span><ChevronRight aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" /></Link></li>}
              {d.blockedLots > 0 && <li><Link to="/inventory" className="flex items-center justify-between gap-3 rounded-xl border border-[hsl(var(--warning)/0.4)] bg-[hsl(var(--warning)/0.1)] px-4 py-3 text-sm font-medium text-[hsl(var(--warning))]"><span className="flex items-center gap-3"><AlertTriangle aria-hidden className="size-4 shrink-0" />{t("dash.attnBlocked", { count: d.blockedLots })}</span><ChevronRight aria-hidden="true" className="size-4 shrink-0 rtl:rotate-180" /></Link></li>}
            </ul>
          )}
          <section aria-labelledby="dash-sales"><h2 id="dash-sales" className="mb-3 text-sm font-semibold text-muted-foreground">{t("dash.grpSales")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Tile to="/pos" label={t("dash.todaySales")} value={fmtMoney(d.today.salesTotal)} tone="good" />
              <Tile to="/pos" label={t("dash.salesCount")} value={fmtNum(d.today.salesCount)} />
              {d.openShift ? <Tile to="/pos" label={t("dash.shift")} value={t("dash.shiftOpen")} tone="good" /> : <Tile to="/pos" label={t("dash.shift")} value={t("dash.shiftClosed")} tone="warn" />}
            </div></section>
          {d.finance && <section aria-labelledby="dash-fin"><h2 id="dash-fin" className="mb-3 text-sm font-semibold text-muted-foreground">{t("fin.title")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Tile to="/finance" label={t("fin.revenueNet")} value={fmtMoney(d.finance.revenueNet)} tone="good" /><Tile to="/finance" label={t("fin.grossMargin")} value={fmtMoney(d.finance.grossMargin)} /><Tile to="/finance" label={t("fin.receivables")} value={fmtMoney(d.finance.receivables)} /><Tile to="/finance" label={t("fin.payables")} value={fmtMoney(d.finance.payables)} /></div></section>}
          {(d.salesTrend?.length ?? 0) > 0 && <div className="grid gap-4 lg:grid-cols-2"><ChartCard title={t("dash.trend7")} subtitle={t("dash.trend7Hint")}><Columns ariaLabel={t("dash.trend7")} format={(n) => String(Math.round(n))} data={d.salesTrend.map((x) => ({ label: x.day.slice(5), value: Number(x.total) }))} /></ChartCard>
            <ChartCard title={t("dash.topSellers")} subtitle={t("dash.trend7Hint")}><HBars ariaLabel={t("dash.topSellers")} format={(n) => String(Math.round(n))} rows={d.topSellers.map((x) => ({ label: x.brandName, value: x.qty }))} /></ChartCard></div>}
          <section aria-labelledby="dash-disp"><h2 id="dash-disp" className="mb-3 text-sm font-semibold text-muted-foreground">{t("dash.grpDispensing")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <Tile to="/rx" label={t("dash.rxQueue")} value={fmtNum(d.rxQueue)} tone={d.rxQueue ? "warn" : undefined} />
              <Tile to="/rx" label={t("dash.rxVerification")} value={fmtNum(d.rxVerification ?? 0)} tone={d.rxVerification ? "warn" : undefined} />
              {(d.refillsDue ?? 0) > 0 && <Tile to="/rx" label={t("dash.refillsDue")} value={fmtNum(d.refillsDue)} />}
              {(d.controlledDiscrepancies ?? 0) > 0 && <Tile to="/controlled" label={t("dash.ctlDisc")} value={fmtNum(d.controlledDiscrepancies)} tone="bad" />}
              <Tile to="/rx" label={t("dash.awaitingSignoff")} value={fmtNum(d.awaitingSignoff)} tone={d.awaitingSignoff ? "warn" : undefined} />
              {d.kiorexOrdersPending !== null && can("orders.read") && <Tile to="/orders" label={t("dash.kiorexOrders")} value={fmtNum(d.kiorexOrdersPending)} tone={d.kiorexOrdersPending ? "warn" : undefined} />}
            </div></section>
          <section aria-labelledby="dash-stock"><h2 id="dash-stock" className="mb-3 text-sm font-semibold text-muted-foreground">{t("dash.grpStock")}</h2>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Tile to="/inventory" label={t("dash.blockedLots")} value={fmtNum(d.blockedLots)} tone={d.blockedLots ? "bad" : undefined} />
              <Tile to="/inventory" label={t("dash.expiring30")} value={fmtNum(d.expiring30)} tone={d.expiring30 ? "warn" : undefined} />
              <Tile to="/inventory" label={t("dash.expiredInStock")} value={fmtNum(d.expiredInStock)} tone={d.expiredInStock ? "bad" : undefined} />
              <Tile to="/purchasing" label={t("dash.lowStock")} value={fmtNum(d.lowStock)} tone={d.lowStock ? "warn" : undefined} />
              {d.syncConflicts > 0 && <Tile to="/pos" label={t("dash.syncConflicts")} value={fmtNum(d.syncConflicts)} tone="bad" />}
            </div></section>
        </div>
      )}
    </>
  );
}
