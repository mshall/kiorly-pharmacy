import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Minus, RefreshCw, ShieldCheck } from "lucide-react";
import { Badge, Button, Card, ErrorNote, Meter, Modal, PageHeader, Spinner, Switch } from "@/components/ui";
import { useToast } from "@/lib/toast";
import { useSubInvoices, useSubMutations, useSubPlans, useSubState, type DowngradeImpact, type PlanRow, type SubState } from "@/features/subscription/subscription-api";
import { capabilityRows, hasCap, isFreeEdition, priceOf, usagePercent } from "@/features/subscription/subscription-logic";

/** Keyboard-focusable named scroll region (WCAG 2.1.1): the tables scroll sideways on a 320 px phone. */
// eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
const Region = ({ label, children }: { label: string; children: React.ReactNode }) => <div role="region" aria-label={label} tabIndex={0} className="relative overflow-x-auto rounded-lg border border-border">{children}</div>;

function useFmt() {
  const { i18n } = useTranslation();
  const loc = i18n.language.startsWith("ar") ? "ar-EG" : "en-GB";
  return { date: (iso: string | null | undefined) => (iso ? new Date(iso).toLocaleDateString(loc, { day: "numeric", month: "long", year: "numeric" }) : ""), num: (n: number) => new Intl.NumberFormat(loc).format(n), money: (a: string, c: string) => new Intl.NumberFormat(loc, { style: "currency", currency: c }).format(Number(a)) };
}

function Impact({ i, testid }: { i: DowngradeImpact; testid: string }) {
  const { t } = useTranslation(); const { num } = useFmt();
  const over = i.reducedLimits.reduce((n, l) => n + l.overBy, 0);
  return (
    <div className="space-y-3 rounded-lg border border-border bg-muted/40 p-3 text-sm" data-testid={testid}>
      <h4 className="font-medium">{t("sub.offWhat")}</h4>
      {i.lostFeatures.length === 0 && i.reducedLimits.length === 0 ? <p>{t("sub.nothingLost")}</p> : null}
      {i.lostFeatures.length > 0 ? <div><p className="text-muted-foreground">{t("sub.offLost")}</p><ul className="mt-1 list-disc space-y-0.5 ps-5" data-testid={`${testid}-lost`}>{i.lostFeatures.map((c) => <li key={c}>{t(`sub.cap_${c}`, { defaultValue: c })}</li>)}</ul></div> : null}
      {i.reducedLimits.length > 0 ? <div><p className="text-muted-foreground">{t("sub.offLimits")}</p><ul className="mt-1 list-disc space-y-0.5 ps-5">{i.reducedLimits.map((l) => <li key={l.key}>{t("sub.offLimitRow", { label: t(`sub.${l.key}`), from: l.from == null ? t("sub.unlimited") : num(l.from), to: l.to == null ? t("sub.unlimited") : num(l.to), current: num(l.current) })}</li>)}</ul>{over > 0 ? <p className="mt-1">{t("sub.offOver", { count: over })}</p> : null}</div> : null}
      <p className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />{t("sub.offKept", { days: i.readOnlyGraceDays })}</p>
    </div>
  );
}

function AutoRenew({ s, owner }: { s: SubState; owner: boolean }) {
  const { t } = useTranslation(); const { date } = useFmt(); const m = useSubMutations(); const toast = useToast();
  const [open, setOpen] = useState(false); const [ok, setOk] = useState(false);
  if (s.onFreePlan) return null;
  const endsOn = date(s.endsOn ?? s.currentPeriodEnd);
  return (
    <section aria-labelledby="ar-h" className="rounded-xl border border-border p-3" data-testid="auto-renew">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 id="ar-h" className="flex items-center gap-2 text-sm font-medium"><RefreshCw className="size-4" aria-hidden />{t("sub.autoRenew")}</h3>
          <p className="mt-1 text-sm text-muted-foreground" data-testid="auto-renew-state">{s.autoRenew ? t("sub.autoRenewOn") : t("sub.autoRenewOff", { date: endsOn })}</p>
          {s.autoRenewForced ? <p className="mt-1 text-xs text-muted-foreground">{s.autoRenewForced === "ON" ? t("sub.forcedOn") : t("sub.forcedOff")}</p> : null}
          {!owner ? <p className="mt-1 text-xs text-muted-foreground">{t("sub.ownerOnly")}</p> : null}
        </div>
        <span data-testid="auto-renew-switch-wrap"><Switch checked={s.autoRenew} label={t("sub.autoRenew")} disabled={!owner || !s.canChangeAutoRenew || m.autoRenew.isPending} onChange={(v) => (v ? m.autoRenew.mutate({ enabled: true }, { onSuccess: () => toast(t("sub.onDone")) }) : setOpen(true))} /></span>
      </div>
      <ErrorNote error={m.autoRenew.error} />
      <Modal open={open} onClose={() => { setOpen(false); setOk(false); }} title={t("sub.offTitle")}>
        <div data-testid="auto-renew-dialog" className="space-y-3">
          <p className="text-sm">{t("sub.offLead", { date: endsOn })}</p>
          {s.downgradeImpact ? <Impact i={s.downgradeImpact} testid="auto-renew-impact" /> : null}
          <label className="flex items-start gap-2 text-sm"><input type="checkbox" className="mt-1 size-4" checked={ok} onChange={(e) => setOk(e.target.checked)} data-testid="auto-renew-understood" /><span>{t("sub.offCheck", { date: endsOn })}</span></label>
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setOpen(false)}>{t("sub.keep")}</Button><Button variant="danger" disabled={!ok || m.autoRenew.isPending} data-testid="auto-renew-confirm" onClick={() => m.autoRenew.mutate({ enabled: false, confirmDowngrade: true }, { onSuccess: () => { setOpen(false); setOk(false); toast(t("sub.offDone")); } })}>{t("sub.offConfirm")}</Button></div>
        </div>
      </Modal>
    </section>
  );
}

export function Plan() {
  const { t } = useTranslation(); const { date, num, money } = useFmt(); const toast = useToast(); const m = useSubMutations();
  const st = useSubState(); const pl = useSubPlans(); const inv = useSubInvoices();
  const [interval, setInterval] = useState<"MONTHLY" | "ANNUAL">("MONTHLY");
  const [target, setTarget] = useState<PlanRow | null>(null);
  if (st.isPending || pl.isPending) return <div role="status" className="p-6"><Spinner /> <span className="sr-only">{t("sub.loading")}</span></div>;
  if (st.isError || pl.isError || !st.data || !pl.data) return <Card><ErrorNote error={st.error ?? pl.error} /><Button size="sm" variant="outline" onClick={() => { void st.refetch(); void pl.refetch(); }}>{t("sub.retry")}</Button></Card>;
  const s = st.data, c = pl.data;
  const owner = s.isOwner;
  const rows = capabilityRows(c.plans);
  const cur = c.plans.find((p) => p.relation === "CURRENT");
  const targets = c.plans.filter((p) => p.relation === "UPGRADE" && p.edition !== "ENTERPRISE");
  const priceCell = (p: PlanRow) => { if (isFreeEdition(p.edition)) return <span className="text-lg font-semibold">{t("sub.free")}</span>; const x = priceOf(p, interval); return x ? <span><span className="text-lg font-semibold">{money(x.amount, x.currency)}</span><span className="block text-xs text-muted-foreground">{interval === "MONTHLY" ? t("sub.perMonth") : t("sub.perYear")}</span></span> : <span className="text-sm text-muted-foreground">{t("sub.priceTbd")}</span>; };
  const limit = (v: number | null) => (v == null ? t("sub.unlimited") : num(v));
  return (
    <div className="space-y-4" data-testid="upgrade-plan">
      <PageHeader title={t("sub.title")} description={t("sub.intro")} />
      <Card title={<span data-testid="current-plan-name">{t("sub.current")}: {t(`sub.ed_${s.edition}`)} <Badge tone={s.status === "ACTIVE" ? "good" : "warn"}>{t(`sub.status_${s.status}`, { defaultValue: s.status })}</Badge></span>}>
        <p className="mb-3 text-sm text-muted-foreground" data-testid="current-plan-renewal">{s.onFreePlan ? t("sub.freeNow") : s.autoRenew ? t("sub.renewsOn", { date: date(s.renewsOn) }) : t("sub.endsOn", { date: date(s.endsOn) })}</p>
        {s.liteReadOnlyGraceUntil ? <div role="status" className="mb-3 rounded-lg border border-border p-3 text-sm" data-testid="lite-grace"><p className="font-medium">{t("sub.graceTitle")}</p><p>{t("sub.graceBody", { date: date(s.liteReadOnlyGraceUntil) })}</p></div> : null}
        <section aria-labelledby="usage-h" className="mb-3" data-testid="usage"><h3 id="usage-h" className="mb-2 text-sm font-medium">{t("sub.usage")}</h3>
          <ul className="grid gap-3 sm:grid-cols-2">{([["users", cur?.maxUsers ?? null], ["branches", cur?.maxBranches ?? null]] as const).map(([k, lim]) => { const pct = usagePercent(c.usage[k], lim); return <li key={k} className="rounded-lg border border-border p-3 text-sm" data-testid={`usage-${k}`}><div className="flex justify-between gap-2"><span className="text-muted-foreground">{t(`sub.${k}`)}</span><span>{lim == null ? t("sub.unlimited") : t("sub.usageRow", { current: num(c.usage[k]), limit: num(lim) })}</span></div>{pct != null ? <Meter value={pct} label={t(`sub.${k}`)} tone={pct >= 100 ? "bad" : pct >= 80 ? "warn" : "brand"} className="mt-2" /> : null}</li>; })}</ul>
        </section>
        <AutoRenew s={s} owner={owner} />
        <p className="mt-3 text-xs text-muted-foreground">{t("sub.reminders", { days: s.policy.renewalReminderDaysBefore.join(", ") })} {t("sub.lapse", { days: s.policy.downgradeAfterDays })}</p>
      </Card>

      <Card title={t("sub.compare")} data-testid="plan-compare">
        <p className="mb-2 text-sm text-muted-foreground">{t("sub.compareHint")}</p>
        <div role="group" aria-label={t("sub.intervalLabel")} className="mb-3 inline-flex rounded-lg border border-border p-0.5" data-testid="interval-toggle">{(["MONTHLY", "ANNUAL"] as const).map((i) => <button key={i} type="button" aria-pressed={interval === i} onClick={() => setInterval(i)} className={`rounded-md px-3 py-1.5 text-sm ${interval === i ? "bg-primary text-primary-foreground" : ""}`}>{t(i === "MONTHLY" ? "sub.monthly" : "sub.annual")}</button>)}</div>
        <Region label={t("sub.compare")}>
          <table className="w-full min-w-[36rem] text-sm" data-testid="plan-table"><caption className="sr-only">{t("sub.compare")}</caption>
            <thead><tr><th scope="col" className="p-3 text-start font-medium text-muted-foreground">{t("sub.featureCol")}</th>{c.plans.map((p) => <th key={p.edition} scope="col" className="p-3 text-start align-top" data-testid={`plan-col-${p.edition}`}><span className="flex flex-wrap items-center gap-1.5 font-semibold">{t(`sub.ed_${p.edition}`)}{p.relation === "CURRENT" ? <Badge tone="info">{t("sub.planNow")}</Badge> : null}</span><span className="mt-1 block font-normal" data-testid={`price-${p.edition}`}>{priceCell(p)}</span></th>)}</tr></thead>
            <tbody>
              <tr><th scope="rowgroup" colSpan={c.plans.length + 1} className="bg-muted/50 px-3 py-2 text-start text-xs font-semibold text-muted-foreground">{t("sub.limits")}</th></tr>
              {(["maxUsers", "maxBranches"] as const).map((k) => <tr key={k}><th scope="row" className="p-3 text-start font-normal">{t(k === "maxUsers" ? "sub.users" : "sub.branches")}</th>{c.plans.map((p) => <td key={p.edition} className="border-t border-border p-3">{limit(p[k])}</td>)}</tr>)}
              <tr><th scope="rowgroup" colSpan={c.plans.length + 1} className="bg-muted/50 px-3 py-2 text-start text-xs font-semibold text-muted-foreground">{t("sub.features")}</th></tr>
              {rows.map((r) => <tr key={r}><th scope="row" className="p-3 text-start font-normal">{t(`sub.cap_${r}`, { defaultValue: r })}</th>{c.plans.map((p) => { const on = hasCap(p, r); return <td key={p.edition} className="border-t border-border p-3" data-testid={`cell-${r.replace(/\W+/g, "_")}-${p.edition}`} data-on={on ? "1" : "0"}>{on ? <Check className="size-4" aria-hidden /> : <Minus className="size-4 text-muted-foreground" aria-hidden />}<span className="sr-only">{on ? t("sub.included") : t("sub.notIncluded")}</span></td>; })}</tr>)}
              <tr><th scope="row" className="p-3 text-start font-normal"><span className="sr-only">{t("sub.upgrade")}</span></th>{c.plans.map((p) => <td key={p.edition} className="border-t border-border p-3 align-top">{targets.includes(p) ? <Button size="sm" disabled={!priceOf(p, interval)} onClick={() => setTarget(p)} data-testid={`upgrade-${p.edition}`}>{s.onFreePlan && s.previousEdition === p.edition ? t("sub.reactivate", { plan: t(`sub.ed_${p.edition}`) }) : t("sub.upgrade")}</Button> : p.relation === "DOWNGRADE" ? <span className="text-xs text-muted-foreground">{t("sub.lowerPlan")}</span> : null}</td>)}</tr>
            </tbody></table>
        </Region>
        {c.plans.filter((p) => p.downgradeImpact).map((p) => <details key={p.edition} className="mt-3 rounded-lg border border-border p-3" data-testid={`downgrade-${p.edition}`}><summary className="cursor-pointer text-sm font-medium">{t("sub.whatLose")}: {t(`sub.ed_${p.edition}`)}</summary><div className="mt-3"><Impact i={p.downgradeImpact!} testid={`impact-${p.edition}`} /></div></details>)}
        {c.taxLine ? <p className="mt-3 text-xs text-muted-foreground">{t("sub.tax", { rate: c.taxLine.ratePercent })}</p> : null}
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title={t("sub.payment")} data-testid="payment-method">
          {s.paymentMethod ? <p className="text-sm" data-testid="payment-method-default">{t("sub.card", { brand: s.paymentMethod.brand ?? "Card", last4: s.paymentMethod.last4 })}</p> : <p className="text-sm text-muted-foreground">{t("sub.noCard")}</p>}
          <p className="mt-2 text-xs text-muted-foreground">{t("sub.cardNote")}</p>
          <Button className="mt-2" size="sm" variant="outline" data-testid="add-card" onClick={() => m.card.mutate({ tokenRef: `tok_mock_${Date.now()}`, brand: "Visa", last4: "4242", expMonth: 12, expYear: 2030 })}>{t("sub.addCard")}</Button>
          <ErrorNote error={m.card.error} />
        </Card>
        <Card title={t("sub.invoices")} data-testid="invoice-history">
          {(inv.data ?? []).length === 0 ? <p className="text-sm text-muted-foreground">{t("sub.noInvoices")}</p> : <Region label={t("sub.invoices")}><table className="w-full min-w-[24rem] text-sm"><thead><tr>{["colNumber", "colPeriod", "colTotal", "colStatus"].map((k) => <th key={k} scope="col" className="p-2 text-start font-medium text-muted-foreground">{t(`sub.${k}`)}</th>)}</tr></thead><tbody>{inv.data!.map((r) => <tr key={r.id}><td className="border-t border-border p-2">{r.number}</td><td className="border-t border-border p-2">{r.periodKey}</td><td className="border-t border-border p-2">{money(r.total, r.currency)}</td><td className="border-t border-border p-2">{t(`sub.inv_${r.status}`, { defaultValue: r.status })}</td></tr>)}</tbody></table></Region>}
        </Card>
      </div>

      <Modal open={!!target} onClose={() => setTarget(null)} title={target ? t("sub.confirmTitle", { plan: t(`sub.ed_${target.edition}`) }) : ""}>
        {target ? <div className="space-y-3" data-testid="upgrade-dialog"><p className="text-sm">{t("sub.confirmBody")}</p><ErrorNote error={m.reactivate.error} />
          <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setTarget(null)}>{t("sub.cancel")}</Button><Button data-testid="upgrade-confirm" disabled={m.reactivate.isPending} onClick={() => m.reactivate.mutate({ edition: target.edition, interval }, { onSuccess: (r) => { toast(t("sub.upgraded") + (r.needsPaymentMethod ? ` ${t("sub.needsCard")}` : "")); setTarget(null); } })}>{t("sub.confirm")}</Button></div></div> : null}
      </Modal>
    </div>
  );
}
