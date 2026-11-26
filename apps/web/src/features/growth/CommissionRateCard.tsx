import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api, ApiError, fetchBlob } from "@/lib/api";
import { Badge, Card, Spinner } from "@/components/ui";

type Spec = { feeType: "PERCENT" | "FLAT"; percentBps: number | null; flatMinor: number | null; minMinor: number | null; maxMinor: number | null; mode: string | null };
type Eff = { state: "SET" | "NOT_SET"; source: "OVERRIDE" | "DEFAULT" | null; version: number | null; reason: string | null; spec: Spec | null };
type Hist = { version: number; scope: "DEFAULT" | "ORG"; kind: "RATE" | "INHERIT"; effectiveFrom: string; reason: string | null; spec: Spec | null };
type Params = { graceDays: number | null; retryDays: number[] | null; invoiceDueDays: number | null; reminderDays: number[] | null; disputeWindowDays: number | null; savedMethodChargeAllowed: boolean | null };
type Counsel = { status: "NOT_REVIEWED" | "APPROVED_WITH_CONDITIONS" | "APPROVED" | "REJECTED" } | null;
type Disclosure = { rateDisclosure: { en: string; ar: string }; termsSummary: { en: string; ar: string } } | null;
interface RateView { known: boolean; state: "SET" | "NOT_SET"; effective: Eff; default: Eff; override: Eff | null; inheriting: boolean; upcoming: Hist | null; history: Hist[]; disclosure?: Disclosure; counsel?: Counsel; params?: Params }
type Payout = { payoutRef: string; paidAt: string | null; cashMinor: number; commissionDeductedMinor: number; bankReference: string | null; reconciliation: "MATCHED" | "UNMATCHED" | "DISPUTED" };
interface Statement { currency: string; onlineCollectionsMinor: number; cashVisitCommissionAccruedMinor: number; cashVisitCommissionNettedMinor: number; cashVisitCommissionOpenMinor: number; cashVisitCharges: number; deductions: { commissionMinor: number; feesMinor: number | null; refundsMinor: number | null; chargebacksMinor: number | null }; netPayableMinor: number; paidByBankTransferMinor: number; payouts: Payout[]; reconciliation: "MATCHED" | "UNMATCHED" | "DISPUTED" | "NO_PAYOUT" }

function RateText({ spec }: { spec: Spec | null }) {
  const { t, i18n } = useTranslation();
  if (!spec) return <span data-testid="rate-not-set"><Badge tone="warn">{t("growth.rate.notSet")}</Badge></span>;
  const money = (n: number) => new Intl.NumberFormat(i18n.language, { style: "currency", currency: "EGP" }).format(n / 100);
  const base = spec.feeType === "PERCENT" ? t("growth.rate.percentOf", { pct: new Intl.NumberFormat(i18n.language, { style: "percent", maximumFractionDigits: 2 }).format((spec.percentBps ?? 0) / 10_000) }) : t("growth.rate.flatPer", { amount: money(spec.flatMinor ?? 0) });
  const bounds = [spec.minMinor != null ? `${t("growth.rate.min")} ${money(spec.minMinor)}` : null, spec.maxMinor != null ? `${t("growth.rate.max")} ${money(spec.maxMinor)}` : null].filter(Boolean).join(", ");
  return <span>{base}{bounds ? ` (${bounds})` : ""}</span>;
}

/** COM-3: the counsel STATUS chip (never reviewer, document or conditions), the disclosure texts exactly as Kiorex wrote them (only when set) and the collection parameters Kiorex set on the rate. */
function Extras({ v }: { v: RateView }) {
  const { t, i18n } = useTranslation();
  const pref = i18n.language.startsWith("ar") ? "ar" : "en";
  const blocks = v.disclosure ? (["rateDisclosure", "termsSummary"] as const).map((k) => { const x = v.disclosure![k]; const lang = x[pref].trim() ? pref : x[pref === "ar" ? "en" : "ar"].trim() ? (pref === "ar" ? "en" : "ar") : null; return lang ? { k, lang, text: x[lang] } : null; }).filter((b): b is { k: "rateDisclosure" | "termsSummary"; lang: "en" | "ar"; text: string } => b !== null) : [];
  const p = v.params; const list = (a: number[] | null) => (a && a.length ? a.join(", ") : null);
  const rows: [string, string | null][] = p ? [["pDisputeWindowDays", p.disputeWindowDays === null ? null : String(p.disputeWindowDays)], ["pInvoiceDueDays", p.invoiceDueDays === null ? null : String(p.invoiceDueDays)], ["pGraceDays", p.graceDays === null ? null : String(p.graceDays)], ["pRetryDays", list(p.retryDays)], ["pReminderDays", list(p.reminderDays)], ["pSavedMethodChargeAllowed", p.savedMethodChargeAllowed === null ? null : t(p.savedMethodChargeAllowed ? "growth.rate.yes" : "growth.rate.no")]] : [];
  const set = rows.filter((r): r is [string, string] => r[1] !== null);
  return (
    <>
      {v.counsel && <div><Badge tone={v.counsel.status === "APPROVED" ? "good" : "neutral"}><span data-testid="growth-counsel" data-status={v.counsel.status}>{t("growth.rate.counselLabel")}: {t(`growth.rate.counsel${v.counsel.status}`)}</span></Badge></div>}
      {blocks.length > 0 && <div className="space-y-3" data-testid="growth-disclosure">{blocks.map((b) => <section key={b.k} className="rounded-lg border p-3" data-testid={`growth-disclosure-${b.k}`}><h4 className="text-sm font-semibold">{t(b.k === "rateDisclosure" ? "growth.rate.discRateDisclosure" : "growth.rate.discTermsSummary")}</h4><p className="mt-1 whitespace-pre-line text-sm" lang={b.lang} dir={b.lang === "ar" ? "rtl" : "ltr"}>{b.text}</p></section>)}</div>}
      {set.length > 0 && <section data-testid="growth-rate-params"><h4 className="text-sm font-semibold">{t("growth.rate.paramsTitle")}</h4><dl className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{set.map(([k, val]) => <div key={k} className="min-w-0 rounded-lg border p-3"><dt className="text-xs text-muted-foreground">{t(`growth.rate.${k}`)}</dt><dd className="mt-1 text-sm font-semibold" dir="ltr">{val}</dd></div>)}</dl></section>}
    </>
  );
}

const money = (lang: string, cur: string, minor: number | null) => { if (minor === null) return "—"; try { return new Intl.NumberFormat(lang, { style: "currency", currency: cur }).format(minor / 100); } catch { return (minor / 100).toFixed(2); } };
const thisMonth = () => new Date().toISOString().slice(0, 7);
const reconTone = (s: string) => (s === "MATCHED" ? "good" : s === "DISPUTED" ? "warn" : "neutral") as "good" | "warn" | "neutral";

/** COM-3: settlement statement of one month, the same figures Kiorex finance sees. Providers are paid by bank transfer only; Kiorex never holds or pays cash. */
function SettlementStatement() {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState(thisMonth());
  const q = useQuery({ queryKey: ["growth", "commission-statement", period], queryFn: () => api<Statement>("/growth/commission-statement", { query: { period } }), retry: false, enabled: /^\d{4}-\d{2}$/.test(period) });
  const m = (n: number | null) => money(i18n.language, q.data?.currency ?? "EGP", n);
  const csv = async () => { const b = await fetchBlob(`/growth/commission-statement/${period}/export.csv`); const url = URL.createObjectURL(b); const a = document.createElement("a"); a.href = url; a.download = `settlement-${period}.csv`; a.click(); URL.revokeObjectURL(url); };
  const printPdf = async () => { const b = await fetchBlob(`/growth/commission-statement/${period}/print`, { lang: i18n.language.startsWith("ar") ? "ar" : "en" }); window.open(URL.createObjectURL(b), "_blank", "noopener"); };
  const notConnected = q.error instanceof ApiError && q.error.code === "STATEMENT_NOT_CONNECTED";
  const s = q.data;
  const cards: [string, string][] = s ? [["cOnline", m(s.onlineCollectionsMinor)], ["cCashAccrued", m(s.cashVisitCommissionAccruedMinor)], ["cCashNetted", m(s.cashVisitCommissionNettedMinor)], ["cCashOpen", m(s.cashVisitCommissionOpenMinor)], ["cDedCommission", m(s.deductions.commissionMinor)], ["cDedFees", m(s.deductions.feesMinor)], ["cDedRefunds", m(s.deductions.refundsMinor)], ["cDedChargebacks", m(s.deductions.chargebacksMinor)], ["cNet", m(s.netPayableMinor)], ["cPaid", m(s.paidByBankTransferMinor)]] : [];
  return (
    <div className="space-y-3" data-testid="growth-settlement">
      <div className="flex flex-wrap items-end gap-3"><label className="text-sm">{t("growth.stmt.period")}<input type="month" value={period} onChange={(e) => setPeriod(e.target.value)} className="mt-1 block h-11 rounded-md border bg-background px-2" data-testid="growth-stmt-period" /></label>
        {s && <button type="button" onClick={() => void csv()} className="min-h-11 rounded-md border px-3 text-sm" data-testid="growth-stmt-csv">{t("growth.stmt.export")}</button>}
        {s && <button type="button" onClick={() => void printPdf()} className="min-h-11 rounded-md border px-3 text-sm" data-testid="growth-stmt-print">{t("growth.stmt.print")}</button>}</div>
      {q.isLoading && <Spinner />}
      {q.isError && <p role="alert" className="text-sm" data-testid="growth-stmt-unavailable">{t(notConnected ? "growth.stmt.notConnected" : "growth.stmt.unavailable")}</p>}
      {s && (
        <>
          <p className="text-sm text-muted-foreground">{t("growth.stmt.source")}</p>
          <p className="text-sm">{t("growth.stmt.bankOnly")}</p>
          <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{t("growth.stmt.reconciliation")}</span><Badge tone={reconTone(s.reconciliation)}><span data-testid="growth-stmt-recon" data-status={s.reconciliation}>{t(`growth.stmt.recon${s.reconciliation}`)}</span></Badge></div>
          <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="growth-stmt-cards">{cards.map(([k, v]) => <div key={k} className="min-w-0 rounded-lg border p-3" data-testid={`growth-stmt-${k}`}><dt className="text-xs text-muted-foreground">{t(`growth.stmt.${k}`)}</dt><dd className="mt-1 text-base font-semibold tabular-nums" dir="ltr">{v}</dd></div>)}</dl>
          <h4 className="text-sm font-semibold">{t("growth.stmt.payouts")}</h4>
          {s.payouts.length ? (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard-scrollable region (axe scrollable-region-focusable)
            <div className="max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label={t("growth.stmt.payouts")}>
              <table className="w-full min-w-[34rem] text-sm"><thead><tr className="border-b text-start">{["colPayout", "colDate", "colCash", "colDeducted", "colBank", "colStatus"].map((c) => <th key={c} scope="col" className="p-2 text-start font-medium">{t(`growth.stmt.${c}`)}</th>)}</tr></thead>
                <tbody>{s.payouts.map((p) => <tr key={p.payoutRef} className="border-b"><td className="p-2" dir="ltr">{p.payoutRef}</td><td className="p-2" dir="ltr">{p.paidAt?.slice(0, 10) ?? "—"}</td><td className="p-2" dir="ltr">{m(p.cashMinor)}</td><td className="p-2" dir="ltr">{m(p.commissionDeductedMinor)}</td><td className="p-2" dir="ltr">{p.bankReference ?? "—"}</td><td className="p-2"><Badge tone={reconTone(p.reconciliation)}>{t(`growth.stmt.recon${p.reconciliation}`)}</Badge></td></tr>)}</tbody></table>
            </div>
          ) : <p className="text-sm text-muted-foreground">{t("growth.stmt.noPayouts")}</p>}
        </>
      )}
    </div>
  );
}

/** COM-2 / COM-3: the pharmacy's Kiorex commission rate and settlement statement, read only (Kiorex sets them). Shown to the roles that may see them; others get one line saying so. */
export function CommissionRateCard() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"rate" | "statement">("rate");
  const q = useQuery({ queryKey: ["growth", "commission-rate"], queryFn: () => api<RateView>("/growth/commission-rate"), retry: false });
  const forbidden = q.error instanceof ApiError && q.error.status === 403;
  return (
    <Card title={t("growth.statementTitle")}>
      <div data-testid="growth-statement" className="min-w-0">
        {q.isLoading && <Spinner />}
        {forbidden && <p className="text-sm text-muted-foreground" data-testid="growth-rate-role">{t("growth.rate.roleOnly")}</p>}
        {q.data && <div role="tablist" aria-label={t("growth.statementTitle")} className="mb-3 flex flex-wrap gap-1.5">{(["rate", "statement"] as const).map((x) => <button key={x} type="button" role="tab" aria-selected={tab === x} data-testid={`growth-tab-${x}`} onClick={() => setTab(x)} className={`min-h-11 rounded-md border px-3 text-sm ${tab === x ? "bg-primary text-primary-foreground" : ""}`}>{t(x === "rate" ? "growth.rate.title" : "growth.stmt.title")}</button>)}</div>}
        {q.data && tab === "statement" && <SettlementStatement />}
        {q.data && tab === "rate" && (
          <div className="space-y-3" data-testid="growth-rate">
            <p className="text-sm text-muted-foreground">{t("growth.rate.hint")}</p>
            <Extras v={q.data} />
            <div className="grid gap-3 md:grid-cols-3">
              <div className="min-w-0 rounded-lg border p-3" data-testid="growth-rate-effective"><div className="text-xs text-muted-foreground">{t("growth.rate.effective")}</div><div className="mt-1 text-lg font-semibold"><RateText spec={q.data.effective.spec} /></div>
                {q.data.effective.state === "SET" ? <div className="mt-1 text-xs text-muted-foreground">{t(`growth.rate.source${q.data.effective.source}`)} · v{q.data.effective.version}{q.data.effective.reason ? ` · ${q.data.effective.reason}` : ""}</div> : <div className="mt-1 text-xs text-muted-foreground">{t("growth.rate.notSetHint")}</div>}</div>
              <div className="min-w-0 rounded-lg border p-3" data-testid="growth-rate-default"><div className="text-xs text-muted-foreground">{t("growth.rate.default")}</div><div className="mt-1 text-sm font-semibold"><RateText spec={q.data.default.spec} /></div></div>
              <div className="min-w-0 rounded-lg border p-3" data-testid="growth-rate-override"><div className="text-xs text-muted-foreground">{t("growth.rate.override")}</div><div className="mt-1 text-sm font-semibold">{q.data.override ? <RateText spec={q.data.override.spec} /> : t("growth.rate.inheriting")}</div></div>
            </div>
            {q.data.upcoming && <p className="text-sm" data-testid="growth-rate-upcoming">{t("growth.rate.upcoming")}: {q.data.upcoming.kind === "INHERIT" ? t("growth.rate.backToDefault") : <RateText spec={q.data.upcoming.spec} />} · <span dir="ltr">{q.data.upcoming.effectiveFrom.slice(0, 10)}</span></p>}
            {q.data.history.length > 0 && (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard-scrollable region (axe scrollable-region-focusable)
              <div className="max-w-full overflow-x-auto" tabIndex={0} role="region" aria-label={t("growth.rate.history")}>
                <table className="w-full min-w-[28rem] text-sm"><thead><tr className="border-b text-start"><th scope="col" className="p-2 text-start font-medium">{t("growth.rate.colFrom")}</th><th scope="col" className="p-2 text-start font-medium">{t("growth.rate.colScope")}</th><th scope="col" className="p-2 text-start font-medium">{t("growth.rate.colRate")}</th><th scope="col" className="p-2 text-start font-medium">{t("growth.rate.colReason")}</th></tr></thead>
                  <tbody>{q.data.history.map((h) => <tr key={`${h.scope}${h.version}`} className="border-b"><td className="p-2" dir="ltr">{h.effectiveFrom.slice(0, 10)}</td><td className="p-2">{t(`growth.rate.scope${h.scope}`)}</td><td className="p-2">{h.kind === "INHERIT" ? t("growth.rate.backToDefault") : <RateText spec={h.spec} />}</td><td className="p-2">{h.reason ?? "-"}</td></tr>)}</tbody></table>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
