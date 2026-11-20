import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Download, FileText } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, Empty, ErrorNote, Field, Input, PageHeader, Select, Table, Td } from "@/components/ui";
import { StatCard, TableSkeleton, Skeleton } from "@/brand/ui-kit";
import { ChartCard, Columns, HBars, LegendDot, RAMP, Stack } from "@/components/charts";
import { download } from "@/lib/print";
import { fmtDate, fmtMoney, fmtNum, todayIso } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Report } from "@/lib/types";

type Name = string;
interface Catalogue { catalogue: Array<{ name: string; group: string }> }
const MONEY = /gross|vat|discount|cash|revenue|cogs|cost|retail|value|balance|limit|total|amount|price|margin(?!Pct)|refund|outstanding|claimed|approved|paid|expected|counted|variance|openingFloat|^current$|^d\d|extra|avg$/i;
const num = (v: unknown) => Number(v ?? 0) || 0;
const short = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(Math.round(n)));
const ISO = /^\d{4}-\d{2}-\d{2}/;

/** Summary tiles + a chart in the brand ramps for the reports where a picture helps; the table below is always the full data. */
function Insight({ name, rep }: { name: Name; rep: Report }) {
  const { t } = useTranslation();
  const rows = rep.rows;
  const [now] = useState(() => Date.now());
  if (!rows.length) return null;
  let body: ReactNode = null;
  if (name === "sales-daily") {
    const gross = rows.reduce((a, r) => a + num(r.gross), 0), sales = rows.reduce((a, r) => a + num(r.sales), 0), vat = rows.reduce((a, r) => a + num(r.vat), 0);
    const best = rows.reduce((b, r) => (num(r.gross) > num(b.gross) ? r : b), rows[0]!);
    body = <>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={t("rep.kGross")} value={fmtMoney(gross)} tone="brand" />
        <StatCard label={t("rep.kSales")} value={fmtNum(sales)} />
        <StatCard label={t("rep.kAvg")} value={fmtMoney(sales ? gross / sales : 0)} hint={t("rep.perSale")} />
        <StatCard label={t("rep.kBest")} value={fmtMoney(best.gross)} hint={fmtDate(String(best.day))} tone="good" />
      </div>
      <ChartCard title={t("rep.cSalesDaily")} subtitle={`${t("rep.kVat")}: ${fmtMoney(vat)}`} legend={<LegendDot color={RAMP[0]!}>{t("rep.kGross")}</LegendDot>}>
        <Columns ariaLabel={t("rep.cSalesDaily")} format={short} data={rows.map((r) => ({ label: String(r.day).slice(5), value: num(r.gross) }))} />
      </ChartCard></>;
  } else if (name === "top-sellers") {
    const top = rows.slice(0, 10), total = rows.reduce((a, r) => a + num(r.revenue), 0);
    body = <>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kRevenue")} value={fmtMoney(total)} tone="brand" /><StatCard label={t("rep.kUnits")} value={fmtNum(rows.reduce((a, r) => a + num(r.qty), 0))} /><StatCard label={t("rep.kProducts")} value={fmtNum(rows.length)} /></div>
      <ChartCard title={t("rep.cTop")} subtitle={t("rep.byRevenue")}><HBars ariaLabel={t("rep.cTop")} format={short} rows={[...top].sort((a, b) => num(b.revenue) - num(a.revenue)).map((r) => ({ label: String(r.brandName), value: num(r.revenue), sub: `${num(r.qty)}×` }))} /></ChartCard></>;
  } else if (name === "stock-valuation") {
    const cost = rows.reduce((a, r) => a + num(r.cost), 0), retail = rows.reduce((a, r) => a + num(r.retail), 0);
    body = <>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kCost")} value={fmtMoney(cost)} /><StatCard label={t("rep.kRetail")} value={fmtMoney(retail)} tone="brand" /><StatCard label={t("rep.kMargin")} value={`${fmtNum(retail ? Math.round(((retail - cost) / retail) * 100) : 0)}%`} tone="good" hint={t("rep.potential")} /></div>
      <ChartCard title={t("rep.cStock")} subtitle={t("rep.top10")}><HBars ariaLabel={t("rep.cStock")} format={short} rows={rows.slice(0, 10).map((r) => ({ label: String(r.brandName), value: num(r.retail), marker: num(r.cost) }))} marker={t("rep.kCost")} />
        <p className="mt-3 flex gap-4 text-xs text-muted-foreground"><LegendDot color={RAMP[0]!}>{t("rep.kRetail")}</LegendDot><LegendDot color="hsl(var(--foreground) / 0.7)">{t("rep.kCost")}</LegendDot></p></ChartCard></>;
  } else if (name === "expiry") {
    const sum = (s: string) => rows.filter((r) => String(r.status) === s).reduce((a, r) => a + num(r.qtyOnHand), 0);
    const soon = rows.filter((r) => String(r.status) !== "EXPIRED" && ISO.test(String(r.expiryDate)) && new Date(String(r.expiryDate)).getTime() - now <= 30 * 86_400_000).reduce((a, r) => a + num(r.qtyOnHand), 0);
    const expired = sum("EXPIRED"), total = rows.reduce((a, r) => a + num(r.qtyOnHand), 0), value = rows.reduce((a, r) => a + num(r.value), 0);
    body = <>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kAtRisk")} value={fmtMoney(value)} tone="warn" hint={t("rep.costValue")} /><StatCard label={t("rep.kExpired")} value={fmtNum(expired)} tone={expired ? "bad" : "neutral"} hint={t("rep.units")} /><StatCard label={t("rep.kSoon")} value={fmtNum(soon)} tone={soon ? "warn" : "neutral"} hint={t("rep.units")} /></div>
      <ChartCard title={t("rep.cExpiry")}><Stack ariaLabel={t("rep.cExpiry")} parts={[{ label: t("rep.kExpired"), value: expired, color: "hsl(var(--danger-text))" }, { label: t("rep.kSoon"), value: soon, color: "hsl(var(--warning))" }, { label: t("rep.kWatch"), value: Math.max(0, total - expired - soon), color: "var(--kx-ocean-500)" }]} /></ChartCard></>;
  } else if (name === "supplier-balances") {
    const bal = rows.reduce((a, r) => a + num(r.balance), 0), over = rows.filter((r) => num(r.creditLimit) > 0 && num(r.balance) > num(r.creditLimit)).length;
    body = <>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kPayable")} value={fmtMoney(bal)} tone="brand" /><StatCard label={t("rep.kSuppliers")} value={fmtNum(rows.length)} /><StatCard label={t("rep.kOverLimit")} value={fmtNum(over)} tone={over ? "bad" : "good"} /></div>
      <ChartCard title={t("rep.cBalances")} subtitle={t("rep.markerHint")}><HBars ariaLabel={t("rep.cBalances")} format={short} marker={t("sup.creditLimit")} rows={rows.map((r) => ({ label: String(r.name).replace(/\s*\(DEMO\)/, ""), value: num(r.balance), marker: num(r.creditLimit) || undefined, tone: num(r.creditLimit) > 0 && num(r.balance) > num(r.creditLimit) ? "bad" as const : undefined }))} /></ChartCard></>;
  } else if (name === "margin-by-product" || name === "margin-by-category") {
    const rev = rows.reduce((a, r) => a + num(r.revenue), 0), mar = rows.reduce((a, r) => a + num(r.margin), 0);
    const key = name === "margin-by-product" ? "label" : "category";
    body = <>
      <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.col.revenue")} value={fmtMoney(rev)} tone="brand" /><StatCard label={t("rep.col.margin")} value={fmtMoney(mar)} tone="good" /><StatCard label={t("rep.col.marginPct")} value={`${rev ? Math.round((mar / rev) * 1000) / 10 : 0}%`} /></div>
      <ChartCard title={t(`rep.names.${name}`)} subtitle={t("rep.top10")}><HBars ariaLabel={t(`rep.names.${name}`)} format={short} rows={rows.slice(0, 10).map((r) => ({ label: String(r[key]), value: num(r.margin) }))} /></ChartCard></>;
  } else if (name === "sales-by-hour") {
    body = <ChartCard title={t("rep.names.sales-by-hour")}><Columns ariaLabel={t("rep.names.sales-by-hour")} format={short} data={rows.map((r) => ({ label: String(r.hour).slice(0, 2), value: num(r.gross) }))} /></ChartCard>;
  } else if (name === "payments-by-method") {
    body = <ChartCard title={t("rep.names.payments-by-method")}><Stack ariaLabel={t("rep.names.payments-by-method")} parts={rows.map((r, i) => ({ label: t(`method.${String(r.method)}`, { defaultValue: String(r.method) }), value: num(r.amount), color: RAMP[i % RAMP.length]! }))} /></ChartCard>;
  } else if (name === "cash-close") {
    const v = rows.reduce((a, r) => a + num(r.variance), 0);
    body = <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kRows")} value={fmtNum(rows.length)} tone="brand" /><StatCard label={t("rep.col.variance")} value={fmtMoney(v)} tone={Math.abs(v) < 0.005 ? "good" : "warn"} /></div>;
  } else {
    const sums = rep.columns.filter((c) => MONEY.test(c.key) && rows.every((r) => r[c.key] === null || /^-?\d+(\.\d+)?$/.test(String(r[c.key])))).slice(0, 2);
    body = <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("rep.kRows")} value={fmtNum(rows.length)} tone="brand" />{sums.map((c) => <StatCard key={c.key} label={t(`rep.col.${c.key}`, { defaultValue: c.label })} value={fmtMoney(rows.reduce((a, r) => a + num(r[c.key]), 0))} />)}</div>;
  }
  return <div className="space-y-4" data-testid="report-insight">{body}</div>;
}

/** Reports + CSV/PDF export for the pharmacy's accountant. VAT lines are a data export only: Kiorly never submits anything to a tax authority. */
export function Reports() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const toast = useToast();
  const [name, setName] = useState<Name>("sales-daily");
  const [from, setFrom] = useState(() => new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10)); const [to, setTo] = useState(todayIso());
  const query = { branchId: branchId ?? undefined, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` };
  const cat = useQuery({ queryKey: ["report-catalogue"], queryFn: () => api<Catalogue>("/reports") });
  const res = useQuery({ queryKey: ["report", name, from, to, branchId], queryFn: () => api<Report>(`/reports/${name}`, { query }), placeholderData: (p) => p });
  const groups = ["SALES", "PROFIT", "STOCK", "CLINICAL", "PURCHASING", "RECEIVABLES"].map((g) => ({ g, names: (cat.data?.catalogue ?? []).filter((r) => r.group === g && (r.name !== "controlled-register" || can("controlled.read"))).map((r) => r.name) })).filter((x) => x.names.length);
  const exp = (format: "csv" | "pdf") => download(`/reports/${name}`, `${name}.${format}`, { ...query, format }).catch(() => toast(t("errors.network"), "err"));
  const numericCols = useMemo(() => (res.data?.columns ?? []).map((c, i) => (res.data!.rows.length > 0 && res.data!.rows.every((r) => r[c.key] === null || (typeof r[c.key] === "number") || /^-?\d+(\.\d+)?$/.test(String(r[c.key]))) && !/id|no$/i.test(c.key) ? i : -1)).filter((i) => i >= 0), [res.data]);
  const cell = (v: unknown, key: string, isNum: boolean): ReactNode => {
    if (v === null || v === undefined || v === "") return <span className="text-muted-foreground">—</span>;
    if (ISO.test(String(v)) && /date|day|at$|expiry/i.test(key)) return fmtDate(String(v));
    if (isNum && MONEY.test(key)) return fmtMoney(v as string);
    if (isNum) return fmtNum(v as number);
    return String(v);
  };
  return (
    <>
      <PageHeader title={t("rep.title")} subtitle={t("rep.subtitle")} actions={<><Button variant="outline" onClick={() => void exp("csv")}><Download aria-hidden className="size-4" />{t("rep.csv")}</Button><Button variant="outline" onClick={() => void exp("pdf")}><FileText aria-hidden className="size-4" />{t("rep.pdf")}</Button></>} />
      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-[var(--kx-shadow-1)]">
        <Field label={t("rep.report")}>{(id) => <Select id={id} value={name} onChange={(e) => setName(e.target.value)} className="min-w-52">{groups.map((x) => <optgroup key={x.g} label={t(`rep.groups.${x.g}`)}>{x.names.map((n) => <option key={n} value={n}>{t(`rep.names.${n}`)}</option>)}</optgroup>)}</Select>}</Field>
        <Field label={t("rep.from")}>{(id) => <Input id={id} type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />}</Field>
        <Field label={t("rep.to")}>{(id) => <Input id={id} type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />}</Field>
      </div>
      <ErrorNote error={res.error} />
      {res.isLoading ? <div className="space-y-4"><div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div><Card><TableSkeleton rows={6} cols={5} /></Card></div> : res.data && (
        <div className="space-y-4">
          <Insight name={name} rep={res.data} />
          {res.data.note && <p className="rounded-xl border border-primary/20 bg-accent p-3 text-sm text-accent-foreground">{res.data.note}</p>}
          <Card title={t(`rep.names.${name}`, { defaultValue: res.data.title })} className="p-0 [&>header]:px-4 [&>header]:pt-4">
            <Table dense head={res.data.columns.map((c) => t(`rep.col.${c.key}`, { defaultValue: c.label }))} numeric={numericCols} empty={!res.data.rows.length ? <Empty hint={t("rep.emptyHint")}>{t("common.none")}</Empty> : null}>
              {res.data.rows.map((r, i) => <tr key={i}>{res.data!.columns.map((c, ci) => <Td key={c.key} className={numericCols.includes(ci) ? "kx-num text-end" : undefined}>{cell(r[c.key], c.key, numericCols.includes(ci))}</Td>)}</tr>)}
            </Table>
          </Card>
        </div>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{t("rep.vatNote")}</p>
    </>
  );
}
