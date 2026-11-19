import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Card, ErrorNote, PageHeader, Spinner, cn } from "@/components/ui";
import { fmtMoney, fmtNum } from "@/lib/format";
import type { Dashboard as D } from "@/lib/types";

function Tile({ to, label, value, tone }: { to: string; label: string; value: string | number; tone?: "bad" | "warn" | "good" }) {
  return (
    <Link to={to} className="block rounded-lg bg-card p-4 shadow-sm ring-1 ring-border hover:bg-accent">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-3xl font-bold", tone === "bad" && "text-danger", tone === "warn" && "text-[hsl(var(--warning))]", tone === "good" && "text-[hsl(var(--success))]")}>{value}</div>
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
      <PageHeader title={t("dash.title")} subtitle={me?.tenant.name} />
      {q.isLoading && <Spinner />}
      <ErrorNote error={q.error} />
      {d && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Tile to="/pos" label={t("dash.todaySales")} value={fmtMoney(d.today.salesTotal)} tone="good" />
          <Tile to="/pos" label={t("dash.salesCount")} value={fmtNum(d.today.salesCount)} />
          <Tile to="/rx" label={t("dash.rxQueue")} value={fmtNum(d.rxQueue)} tone={d.rxQueue ? "warn" : undefined} />
          <Tile to="/rx" label={t("dash.awaitingSignoff")} value={fmtNum(d.awaitingSignoff)} tone={d.awaitingSignoff ? "warn" : undefined} />
          <Tile to="/inventory" label={t("dash.blockedLots")} value={fmtNum(d.blockedLots)} tone={d.blockedLots ? "bad" : undefined} />
          <Tile to="/inventory" label={t("dash.expiring30")} value={fmtNum(d.expiring30)} tone={d.expiring30 ? "warn" : undefined} />
          <Tile to="/inventory" label={t("dash.expiredInStock")} value={fmtNum(d.expiredInStock)} tone={d.expiredInStock ? "bad" : undefined} />
          <Tile to="/purchasing" label={t("dash.lowStock")} value={fmtNum(d.lowStock)} tone={d.lowStock ? "warn" : undefined} />
          {d.kiorexOrdersPending !== null && can("orders.read") && <Tile to="/orders" label={t("dash.kiorexOrders")} value={fmtNum(d.kiorexOrdersPending)} tone={d.kiorexOrdersPending ? "warn" : undefined} />}
          {d.syncConflicts > 0 && <Tile to="/pos" label={t("dash.syncConflicts")} value={fmtNum(d.syncConflicts)} tone="bad" />}
        </div>
      )}
      {d && <Card className="mt-4" title={t("dash.shift")}><p className="text-sm">{d.openShift ? t("dash.shiftOpen") : t("dash.shiftClosed")}</p></Card>}
    </>
  );
}
