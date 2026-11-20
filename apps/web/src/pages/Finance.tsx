import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Plus } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Segmented, Select, Table, Tabs, Td, type Tone } from "@/components/ui";
import { StatCard, Skeleton } from "@/brand/ui-kit";
import { ChartCard, Columns, HBars, LegendDot, RAMP } from "@/components/charts";
import { AgingTable, ApAgingTab, Statement, type AgingRow } from "@/pages/purchasing/PurchasingMore";
import { fmtDate, fmtMoney, fmtNum, todayIso } from "@/lib/format";
import { download } from "@/lib/print";
import { useToast } from "@/lib/toast";


const short = (n: number) => (n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(n >= 10_000 ? 0 : 1)}k` : String(Math.round(n)));
const CATS = ["RENT", "UTILITIES", "SALARIES", "MARKETING", "MAINTENANCE", "SUPPLIES", "TRANSPORT", "BANK_FEES", "INSURANCE", "OTHER"];
interface Overview { sales: { count: number; gross: string; discounts: string; vatIncluded: string; revenueNet: string; refunds: string }; cogs: string; grossMargin: string; grossMarginPct: number; expenses: { total: string; byCategory: Array<{ category: string; amount: string }> }; netOperatingProfit: string; paymentsByMethod: Array<{ method: string; received: string; refunded: string; net: string }>; receivables: string; payables: string; claimsOutstanding: string; daily: Array<{ day: string; revenue: string; margin: string; expenses: string }> }

function OverviewTab({ from, to }: { from: string; to: string }) {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const q = useQuery({ queryKey: ["fin-overview", branchId, from, to], queryFn: () => api<Overview>("/finance/overview", { query: { branchId, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` } }), enabled: !!branchId, placeholderData: (p) => p });
  const d = q.data;
  if (!d) return <div className="grid gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>;
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label={t("fin.revenueNet")} value={fmtMoney(d.sales.revenueNet)} hint={`${t("fin.grossSales")}: ${fmtMoney(d.sales.gross)}`} tone="brand" /><StatCard label={t("fin.grossMargin")} value={fmtMoney(d.grossMargin)} hint={`${d.grossMarginPct}% · ${t("fin.cogs")}: ${fmtMoney(d.cogs)}`} tone="good" /><StatCard label={t("fin.expensesTotal")} value={fmtMoney(d.expenses.total)} tone="warn" /><StatCard label={t("fin.netProfit")} value={fmtMoney(d.netOperatingProfit)} tone={Number(d.netOperatingProfit) >= 0 ? "good" : "bad"} /></div>
    <div className="grid gap-4 sm:grid-cols-3"><StatCard label={t("fin.receivables")} value={fmtMoney(d.receivables)} /><StatCard label={t("fin.payables")} value={fmtMoney(d.payables)} /><StatCard label={t("fin.claimsOut")} value={fmtMoney(d.claimsOutstanding)} /></div>
    <ChartCard title={t("fin.dailyTrend")} subtitle={`${t("fin.vatIncluded")}: ${fmtMoney(d.sales.vatIncluded)} · ${t("fin.discounts")}: ${fmtMoney(d.sales.discounts)} · ${t("fin.refunds")}: ${fmtMoney(d.sales.refunds)}`} legend={<><LegendDot color={RAMP[0]!}>{t("fin.revenueNet")}</LegendDot></>}><Columns ariaLabel={t("fin.dailyTrend")} format={short} data={d.daily.map((x) => ({ label: x.day.slice(5), value: Number(x.revenue) }))} /></ChartCard>
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={t("fin.byMethod")}><Table dense numeric={[1, 2, 3]} head={[t("pos.method"), t("fin.received"), t("fin.refunded"), t("fin.net")]} empty={!d.paymentsByMethod.length ? <Empty>{t("common.none")}</Empty> : null}>{d.paymentsByMethod.map((p) => <tr key={p.method}><Td>{t(`method.${p.method}`)}</Td><Td className="kx-num text-end">{fmtMoney(p.received)}</Td><Td className="kx-num text-end">{Number(p.refunded) ? fmtMoney(p.refunded) : "—"}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(p.net)}</Td></tr>)}</Table></Card>
      <ChartCard title={t("fin.expByCategory")}>{d.expenses.byCategory.length ? <HBars ariaLabel={t("fin.expByCategory")} format={short} rows={d.expenses.byCategory.map((c) => ({ label: t(`fin.cat.${c.category}`), value: Number(c.amount) }))} /> : <Empty>{t("fin.expEmpty")}</Empty>}</ChartCard>
    </div></div>;
}

interface MarginRow { key: string; label: string; labelAr: string | null; units: number; revenue: string; cogs: string; margin: string; marginPct: number }
function MarginTab({ from, to }: { from: string; to: string }) {
  const { t, i18n } = useTranslation(); const { branchId } = useAuth(); const [by, setBy] = useState<"product" | "category">("product");
  const q = useQuery({ queryKey: ["fin-margin", branchId, from, to, by], queryFn: () => api<MarginRow[]>("/finance/margin", { query: { branchId, by, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` } }), enabled: !!branchId });
  return <div className="space-y-3"><Segmented<"product" | "category"> label={t("fin.tabMargin")} value={by} onChange={setBy} options={[{ id: "product", label: t("fin.byProduct") }, { id: "category", label: t("fin.byCategory") }]} />
    <Card className="p-0"><Table dense numeric={[1, 2, 3, 4, 5]} head={[by === "product" ? t("common.product") : t("fin.byCategory"), t("fin.units"), t("fin.revenue"), t("fin.cost"), t("fin.margin"), t("fin.marginPct")]} empty={!q.data?.length ? <Empty>{t("common.noResults")}</Empty> : null}>
      {q.data?.map((r) => <tr key={r.key}><Td className="font-medium">{i18n.language === "ar" && r.labelAr ? r.labelAr : r.label}</Td><Td className="kx-num text-end">{fmtNum(r.units)}</Td><Td className="kx-num text-end">{fmtMoney(r.revenue)}</Td><Td className="kx-num text-end">{fmtMoney(r.cogs)}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(r.margin)}</Td><Td className="text-end"><Badge tone={r.marginPct < 10 ? "bad" : r.marginPct < 20 ? "warn" : "good"}>{r.marginPct}%</Badge></Td></tr>)}</Table></Card></div>;
}

interface Expense { id: string; category: string; amount: string; vatAmount: string; method: string; description: string; expenseDate: string; receiptRef: string | null; fromDrawer: boolean; voidedAt: string | null }
function ExpensesTab({ from, to }: { from: string; to: string }) {
  const { t } = useTranslation(); const { branchId, can } = useAuth(); const [open, setOpen] = useState(false); const [cat, setCat] = useState("");
  const q = useQuery({ queryKey: ["expenses", branchId, from, to, cat], queryFn: () => api<{ total: number; sum: string; items: Expense[] }>("/finance/expenses", { query: { branchId, category: cat || undefined, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z`, pageSize: 100 } }), enabled: !!branchId });
  const [f, set, bind, reset] = useForm({ category: "SUPPLIES", amount: "", vatAmount: "", method: "CASH", description: "", expenseDate: todayIso(), receiptRef: "", fromDrawer: false });
  const add = useAction(() => api("/finance/expenses", { body: { branchId, ...f, vatAmount: f.vatAmount || undefined, receiptRef: f.receiptRef || undefined } }), ["expenses", "fin-overview", "x-report", "cash-moves"], { onDone: () => { reset(); setOpen(false); } });
  const void_ = useAction((id: string) => api(`/finance/expenses/${id}/void`, { method: "POST" }), ["expenses", "fin-overview"]);
  return <div className="space-y-3"><div className="flex flex-wrap items-end justify-between gap-3"><Field label={t("fin.expCategory")}>{(id) => <Select id={id} value={cat} onChange={(e) => setCat(e.target.value)}><option value="">{t("common.all")}</option>{CATS.map((c) => <option key={c} value={c}>{t(`fin.cat.${c}`)}</option>)}</Select>}</Field><div className="flex items-center gap-3"><span className="text-sm text-muted-foreground">{t("fin.expSum")}: <b className="kx-num text-foreground">{fmtMoney(q.data?.sum ?? 0)}</b></span>{can("expense.write") && <Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("fin.newExpense")}</Button>}</div></div>
    <ErrorNote error={void_.error} />
    <Card className="p-0"><Table dense numeric={[2]} head={[t("fin.expDate"), t("fin.expCategory"), t("fin.expAmount"), t("fin.expDescription"), t("fin.expMethod"), ""]} empty={!q.data?.items.length ? <Empty>{t("fin.expEmpty")}</Empty> : null}>
      {q.data?.items.map((e) => <tr key={e.id} className={e.voidedAt ? "opacity-50" : undefined}><Td>{fmtDate(e.expenseDate)}</Td><Td><Badge tone="neutral">{t(`fin.cat.${e.category}`)}</Badge></Td><Td className="kx-num text-end font-semibold">{fmtMoney(e.amount)}</Td><Td>{e.description}{e.receiptRef && <span className="ms-2 font-mono text-xs text-muted-foreground">{e.receiptRef}</span>}</Td><Td>{t(`fin.pm.${e.method}`)}{e.fromDrawer && <span className="ms-1 text-xs text-muted-foreground">({t("pos.cashDrawer")})</span>}</Td>
        <Td className="text-end">{e.voidedAt ? <Badge tone="neutral">{t("fin.expVoided")}</Badge> : can("expense.write") && !e.fromDrawer && <Button size="sm" variant="ghost" onClick={() => void_.mutate(e.id)}>{t("fin.expVoid")}</Button>}</Td></tr>)}</Table></Card>
    <Modal open={open} onClose={() => setOpen(false)} title={t("fin.newExpense")}><form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}>
      <Field label={t("fin.expCategory")}>{(id) => <Select id={id} {...bind("category")}>{CATS.map((c) => <option key={c} value={c}>{t(`fin.cat.${c}`)}</option>)}</Select>}</Field><Field label={t("fin.expDate")}>{(id) => <Input id={id} type="date" required {...bind("expenseDate")} />}</Field>
      <Field label={t("fin.expAmount")}>{(id) => <Input id={id} inputMode="decimal" required pattern="[0-9]+(\.[0-9]{1,2})?" {...bind("amount")} />}</Field><Field label={t("fin.expVat")}>{(id) => <Input id={id} inputMode="decimal" pattern="[0-9]+(\.[0-9]{1,2})?" {...bind("vatAmount")} />}</Field>
      <Field label={t("fin.expMethod")}>{(id) => <Select id={id} value={f.method} onChange={(e) => set({ method: e.target.value, fromDrawer: e.target.value === "CASH" ? f.fromDrawer : false })}>{["CASH", "CARD", "BANK", "OTHER"].map((m) => <option key={m} value={m}>{t(`fin.pm.${m}`)}</option>)}</Select>}</Field><Field label={t("fin.expReceipt")}>{(id) => <Input id={id} {...bind("receiptRef")} />}</Field>
      <Field label={t("fin.expDescription")} className="sm:col-span-2">{(id) => <Input id={id} required minLength={3} {...bind("description")} />}</Field>
      {f.method === "CASH" && can("pos.cash_drawer") && <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={f.fromDrawer} onChange={(e) => set({ fromDrawer: e.target.checked })} />{t("fin.expFromDrawer")}</label>}
      <div className="sm:col-span-2"><ErrorNote error={add.error} /><Button type="submit" disabled={add.isPending}>{t("common.save")}</Button></div></form></Modal></div>;
}

function ReceivablesTab() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["receivables"], queryFn: () => api<{ creditDays: number; outstanding: string; totals: Record<string, string>; customers: Array<AgingRow & { accountId: string; customer: { displayName: string; phone: string | null } }> }>("/finance/receivables") });
  return <div className="space-y-3"><p className="text-sm text-muted-foreground">{t("fin.recvDays", { days: q.data?.creditDays ?? 30 })} · {t("pur.outstanding")}: <b className="kx-num text-foreground">{fmtMoney(q.data?.outstanding ?? 0)}</b></p>
    <Card className="p-0"><AgingTable rows={q.data?.customers ?? []} label={(r) => r.customer.displayName} empty={t("fin.recvEmpty")} /></Card></div>;
}

interface Claim { id: string; insurerName: string; memberRef: string; amountClaimed: string; approvedAmount: string | null; paidAmount: string; status: string; submissionRef: string | null; rejectionReason: string | null; createdAt: string }
const CLAIM_TONE: Record<string, Tone> = { DRAFT: "neutral", SUBMITTED: "info", APPROVED: "warn", REJECTED: "bad", PAID: "good" };
function ClaimsTab() {
  const { t } = useTranslation(); const { branchId, flag } = useAuth(); const toast = useToast();
  const q = useQuery({ queryKey: ["claims"], queryFn: () => api<Claim[]>("/claims"), retry: false });
  const rec = useQuery({ queryKey: ["claims-recon"], queryFn: () => api<{ insurers: Array<{ insurer: string; claims: number; claimed: string; approved: string; paid: string; outstanding: string; shortfall: string; overdue: number }> }>("/claims/reconciliation"), retry: false });
  const [sel, setSel] = useState<string[]>([]); const [dlg, setDlg] = useState<{ kind: "new" | "batch" | "approve" | "reject" | "pay"; claim?: Claim } | null>(null);
  const [f, , bind, reset] = useForm({ insurerName: "", memberRef: "", amountClaimed: "", submissionRef: "", approvedAmount: "", reason: "", amount: "", reference: "" });
  const done = () => { setDlg(null); reset(); setSel([]); };
  const inv = ["claims", "claims-recon", "fin-overview"];
  const create = useAction(() => api("/claims", { body: { branchId, insurerName: f.insurerName, memberRef: f.memberRef, amountClaimed: f.amountClaimed } }), inv, { onDone: done });
  const batch = useAction(() => api("/claims/batch-submit", { body: { ids: sel, submissionRef: f.submissionRef } }), inv, { onDone: done });
  const approve = useAction(() => api(`/claims/${dlg!.claim!.id}/approve`, { body: { approvedAmount: f.approvedAmount || undefined } }), inv, { onDone: done });
  const reject = useAction(() => api(`/claims/${dlg!.claim!.id}/reject`, { body: { reason: f.reason } }), inv, { onDone: done });
  const pay = useAction(() => api(`/claims/${dlg!.claim!.id}/payments`, { body: { amount: f.amount, reference: f.reference || undefined } }), inv, { onDone: done });
  const off = q.error instanceof ApiError && (q.error.featureDisabled || q.error.entitlementRequired);
  void toast;
  if (off || !flag("pharmacy.insurer_claims")) return <Card><Empty>{t("fin.claimsOff")}</Empty></Card>;
  const m = dlg?.kind === "new" ? create : dlg?.kind === "batch" ? batch : dlg?.kind === "approve" ? approve : dlg?.kind === "reject" ? reject : pay;
  return <div className="space-y-4">
    <Card title={t("fin.claimRecon")} className="p-0 [&>header]:px-4 [&>header]:pt-4"><Table dense numeric={[1, 2, 3, 4, 5, 6]} head={[t("fin.claimInsurer"), t("rx.items"), t("fin.claimAmount"), t("fin.claimApproved"), t("fin.claimPaid"), t("fin.claimOutstanding"), t("fin.claimShortfall"), t("fin.claimOverdue")]} empty={!rec.data?.insurers.length ? <Empty>{t("fin.claimsEmpty")}</Empty> : null}>
      {rec.data?.insurers.map((i) => <tr key={i.insurer}><Td className="font-medium">{i.insurer}</Td><Td className="kx-num text-end">{i.claims}</Td><Td className="kx-num text-end">{fmtMoney(i.claimed)}</Td><Td className="kx-num text-end">{fmtMoney(i.approved)}</Td><Td className="kx-num text-end">{fmtMoney(i.paid)}</Td><Td className="kx-num text-end font-semibold">{fmtMoney(i.outstanding)}</Td><Td className="kx-num text-end">{Number(i.shortfall) ? fmtMoney(i.shortfall) : "—"}</Td><Td className="text-end">{i.overdue ? <Badge tone="bad">{i.overdue}</Badge> : "—"}</Td></tr>)}</Table></Card>
    <Card title={t("fin.tabClaims")} actions={<div className="flex gap-2">{sel.length > 0 && <Button size="sm" variant="outline" onClick={() => setDlg({ kind: "batch" })}>{t("fin.claimBatch")} ({sel.length})</Button>}<Button size="sm" onClick={() => setDlg({ kind: "new" })}><Plus aria-hidden className="size-4" />{t("fin.claimNew")}</Button></div>} className="p-0 [&>header]:px-4 [&>header]:pt-4">
      <Table dense numeric={[3, 4, 5]} head={["", t("fin.claimInsurer"), t("fin.claimMember"), t("fin.claimAmount"), t("fin.claimApproved"), t("fin.claimPaid"), t("common.status"), ""]} empty={!q.data?.length ? <Empty>{t("fin.claimsEmpty")}</Empty> : null}>
        {q.data?.map((c) => <tr key={c.id}><Td className="w-8">{c.status === "DRAFT" && <input type="checkbox" aria-label={c.id} checked={sel.includes(c.id)} onChange={(e) => setSel(e.target.checked ? [...sel, c.id] : sel.filter((x) => x !== c.id))} />}</Td><Td className="font-medium">{c.insurerName}</Td><Td className="font-mono text-xs">{c.memberRef}</Td><Td className="kx-num text-end">{fmtMoney(c.amountClaimed)}</Td><Td className="kx-num text-end">{c.approvedAmount ? fmtMoney(c.approvedAmount) : "—"}</Td><Td className="kx-num text-end">{Number(c.paidAmount) ? fmtMoney(c.paidAmount) : "—"}</Td>
          <Td><Badge tone={CLAIM_TONE[c.status] ?? "neutral"}>{t(`claimStatus.${c.status}`)}</Badge>{c.rejectionReason && <div className="max-w-40 truncate text-xs text-muted-foreground" title={c.rejectionReason}>{c.rejectionReason}</div>}</Td>
          <Td className="text-end"><div className="flex justify-end gap-1">{c.status === "SUBMITTED" && <><Button size="sm" onClick={() => setDlg({ kind: "approve", claim: c })}>{t("fin.claimApprove")}</Button><Button size="sm" variant="ghost" onClick={() => setDlg({ kind: "reject", claim: c })}>{t("fin.claimReject")}</Button></>}{c.status === "APPROVED" && <Button size="sm" onClick={() => setDlg({ kind: "pay", claim: c })}>{t("fin.claimPay")}</Button>}</div></Td></tr>)}</Table></Card>
    <Modal open={!!dlg} onClose={() => setDlg(null)} title={dlg ? t({ new: "fin.claimNew", batch: "fin.claimBatch", approve: "fin.claimApprove", reject: "fin.claimReject", pay: "fin.claimPay" }[dlg.kind]) : ""}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); m.mutate(); }}>
      {dlg?.kind === "new" && <><Field label={t("fin.claimInsurer")}>{(id) => <Input id={id} required minLength={2} {...bind("insurerName")} />}</Field><Field label={t("fin.claimMember")}>{(id) => <Input id={id} required minLength={2} {...bind("memberRef")} />}</Field><Field label={t("fin.claimAmount")}>{(id) => <Input id={id} inputMode="decimal" required {...bind("amountClaimed")} />}</Field></>}
      {dlg?.kind === "batch" && <Field label={t("fin.claimBatchRef")}>{(id) => <Input id={id} required minLength={2} {...bind("submissionRef")} />}</Field>}
      {dlg?.kind === "approve" && <Field label={t("fin.claimApprovedAmount")} hint={fmtMoney(dlg.claim!.amountClaimed)}>{(id) => <Input id={id} inputMode="decimal" placeholder={dlg.claim!.amountClaimed} {...bind("approvedAmount")} />}</Field>}
      {dlg?.kind === "reject" && <Field label={t("fin.claimRejectReason")}>{(id) => <Input id={id} required minLength={3} {...bind("reason")} />}</Field>}
      {dlg?.kind === "pay" && <><Field label={t("fin.expAmount")} hint={`${t("fin.claimOutstanding")}: ${fmtMoney(Number(dlg.claim!.approvedAmount ?? dlg.claim!.amountClaimed) - Number(dlg.claim!.paidAmount))}`}>{(id) => <Input id={id} inputMode="decimal" required {...bind("amount")} />}</Field><Field label={t("fin.claimPayRef")}>{(id) => <Input id={id} {...bind("reference")} />}</Field></>}
      <ErrorNote error={m.error} /><Button type="submit" disabled={m.isPending}>{t("common.confirm")}</Button></form></Modal></div>;
}

export function Finance() {
  const { t } = useTranslation(); const { can, branchId } = useAuth(); const toast = useToast();
  const [tab, setTab] = useState("overview"); const [stmt, setStmt] = useState<string | null>(null);
  const [from, setFrom] = useState(() => new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10)); const [to, setTo] = useState(todayIso());
  const tabs = useMemo(() => [{ id: "overview", label: t("fin.tabOverview") }, { id: "margin", label: t("fin.tabMargin") }, ...(can("expense.read") ? [{ id: "expenses", label: t("fin.tabExpenses") }] : []), { id: "receivables", label: t("fin.tabReceivables") }, { id: "payables", label: t("fin.tabPayables") }, ...(can("claims.manage") ? [{ id: "claims", label: t("fin.tabClaims") }] : [])], [t, can]);
  const exp = (name: string) => download(`/reports/${name}`, `${name}.csv`, { format: "csv", branchId: branchId ?? undefined, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` }).catch(() => toast(t("errors.network"), "err"));
  return (<>
    <PageHeader title={t("fin.title")} subtitle={t("fin.subtitle")} actions={<Button variant="outline" onClick={() => void exp("vat-lines")}><Download aria-hidden className="size-4" />{t("rep.names.vat-lines")}</Button>} />
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-card p-4"><Field label={t("rep.from")}>{(id) => <Input id={id} type="date" value={from} max={to} onChange={(e) => setFrom(e.target.value)} />}</Field><Field label={t("rep.to")}>{(id) => <Input id={id} type="date" value={to} min={from} onChange={(e) => setTo(e.target.value)} />}</Field></div>
    <Tabs value={tab} onChange={setTab} tabs={tabs} />
    <div className="mt-4" role="tabpanel">{tab === "overview" ? <OverviewTab from={from} to={to} /> : tab === "margin" ? <MarginTab from={from} to={to} /> : tab === "expenses" ? <ExpensesTab from={from} to={to} /> : tab === "receivables" ? <ReceivablesTab /> : tab === "payables" ? <ApAgingTab onStatement={setStmt} /> : <ClaimsTab />}</div>
    <Statement supplierId={stmt} onClose={() => setStmt(null)} />
    <p className="mt-4 text-xs text-muted-foreground">{t("rep.vatNote")}</p>
  </>);
}
