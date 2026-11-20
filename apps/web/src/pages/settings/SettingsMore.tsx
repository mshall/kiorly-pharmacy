import { useQuery } from "@tanstack/react-query";
import { Fragment, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Download, Lock, Minus, Plus, Upload } from "lucide-react";
import { api, fetchBlob } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Select, Switch, Table, Td } from "@/components/ui";
import { PERMISSION_GROUPS } from "@/lib/rbac";
import { download } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Role } from "@/lib/types";

interface Matrix { roles: Role[]; matrix: Record<string, Record<string, { granted: boolean; default: boolean; overridden: boolean; locked: boolean }>> }

/** Editable roles x permissions matrix (the API is the source of truth; OWNER and safety-critical cells are locked). */
export function RolesMatrixTab() {
  const { t } = useTranslation(); const { can } = useAuth(); const toast = useToast();
  const q = useQuery({ queryKey: ["roles-matrix"], queryFn: () => api<Matrix>("/admin/roles") });
  const set = useAction((v: { role: string; permission: string; granted: boolean }) => api(`/admin/roles/${v.role}/permissions`, { method: "PUT", body: { permission: v.permission, granted: v.granted } }), ["roles-matrix", "me"], { silent: true, onDone: () => toast(t("set.rolesSaved")) });
  const reset = useAction((role: string) => api(`/admin/roles/${role}/reset`, { method: "POST" }), ["roles-matrix", "me"]);
  const editable = can("roles.manage");
  const roles = (q.data?.roles ?? []) as Role[];
  return (
    <Card title={t("set.rolesTitle")} className="p-0 [&>header]:px-4 [&>header]:pt-4">
      <p className="mb-3 px-4 text-sm text-muted-foreground">{editable ? t("set.rolesEditable") : t("set.rolesNote")}</p>
      <div className="px-4"><ErrorNote error={set.error || reset.error} /></div>
      {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- keyboard-scrollable region */}
      <div className="kx-table-wrap overflow-auto" tabIndex={0} role="region" aria-label={t("set.rolesTitle")}>
        <table className="kx-table w-full text-sm">
          <thead><tr className="border-b border-border"><th scope="col" className="sticky inset-s-0 z-2 bg-card px-4 py-2.5 text-start text-[11px] font-semibold text-muted-foreground">{t("set.permission")}</th>{roles.map((r) => <th key={r} scope="col" className="px-3 py-2.5 text-center text-[11px] font-semibold text-muted-foreground"><div>{t(`roles.${r}`)}</div>{editable && r !== "OWNER" && <button type="button" className="mt-0.5 text-[10px] font-normal text-primary underline-offset-2 hover:underline" onClick={() => reset.mutate(r)}>{t("set.rolesReset")}</button>}</th>)}</tr></thead>
          <tbody>{PERMISSION_GROUPS.map((g) => (
            <Fragment key={g.id}><tr><th scope="colgroup" colSpan={roles.length + 1} className="bg-muted/50 px-4 py-1.5 text-start text-xs font-semibold text-muted-foreground">{t(`set.grp.${g.id}`)}</th></tr>
              {g.perms.map((p) => <tr key={p} className="border-b border-border/60"><th scope="row" className="sticky inset-s-0 bg-card px-4 py-2 text-start text-sm font-normal"><span>{t(`set.perm.${p}`, { defaultValue: p })}</span><code className="ms-2 text-[11px] text-muted-foreground" dir="ltr">{p}</code></th>
                {roles.map((r) => { const c = q.data?.matrix[r]?.[p]; if (!c) return <td key={r} />; const can_ = editable && !c.locked;
                  return <td key={r} className="px-3 py-1.5 text-center"><button type="button" disabled={!can_ || set.isPending} aria-pressed={c.granted} aria-label={`${t(`roles.${r}`)} · ${t(`set.perm.${p}`, { defaultValue: p })}: ${c.granted ? t("set.allowed") : t("set.denied")}`} onClick={() => set.mutate({ role: r, permission: p, granted: !c.granted })} className={`inline-flex size-8 items-center justify-center rounded-lg transition-colors ${can_ ? "hover:bg-muted" : "cursor-default"} ${c.overridden ? "ring-2 ring-[hsl(var(--warning)/0.6)]" : ""}`} title={c.locked ? t("set.rolesLocked") : c.overridden ? t("set.rolesOverridden") : undefined}>
                    {c.granted ? <Check aria-hidden className="size-4 text-[hsl(var(--success))]" /> : <Minus aria-hidden className="size-4 text-muted-foreground/50" />}{c.locked && !c.granted ? null : c.locked && <Lock aria-hidden className="absolute size-2.5 translate-x-3 translate-y-3 text-muted-foreground/60" />}</button></td>; })}</tr>)}</Fragment>))}</tbody>
        </table>
      </div>
    </Card>
  );
}

interface SettingsDoc { settings: Record<string, unknown>; pack: { currency: string; vat: { label: string; defaultRate: string } } }
const useSettings = () => useQuery({ queryKey: ["settings"], queryFn: () => api<SettingsDoc>("/settings") });
const saveSettings = (body: Record<string, unknown>) => api("/settings", { method: "PATCH", body });

/** Standalone / integrated switch (first-class setting). */
export function ModeCard() {
  const { t } = useTranslation(); const { me, can } = useAuth(); const toast = useToast();
  const standalone = me?.tenant.mode !== "INTEGRATED";
  const sw = useAction((mode: string) => saveSettings({ mode }), ["me", "settings"], { silent: true, onDone: () => toast(t("set.modeSwitched")) });
  return (
    <Card title={t("set.modeTitle")} actions={<Badge tone={standalone ? "neutral" : "info"}>{standalone ? t("set.modeStandalone") : t("set.modeIntegrated")}</Badge>}>
      <p className="text-sm text-muted-foreground">{standalone ? t("set.modeStandaloneNote") : t("set.modeIntegratedNote")}</p>
      {can("settings.write") && <Button className="mt-3" variant="outline" disabled={sw.isPending} onClick={() => sw.mutate(standalone ? "INTEGRATED" : "STANDALONE")}>{t("set.modeSwitchTo", { mode: standalone ? t("set.modeIntegrated") : t("set.modeStandalone") })}</Button>}
      <div className="mt-2"><ErrorNote error={sw.error} /></div>
    </Card>
  );
}

interface Printer { id: string; name: string; kind: string }
export function ReceiptTab() {
  const { t } = useTranslation();
  const q = useSettings();
  const r = (q.data?.settings.receipt ?? {}) as Record<string, unknown>;
  const [f, set, bind] = useForm({ header: String(r.header ?? ""), footer: String(r.footer ?? ""), logoText: String(r.logoText ?? ""), paper: String(r.paper ?? "80mm"), showVat: r.showVat !== false, showLicence: r.showLicence !== false });
  const [printers, setPrinters] = useState<Printer[]>(((q.data?.settings.printers ?? []) as Printer[]));
  const [loaded, setLoaded] = useState(false);
  if (q.data && !loaded) { const rr = (q.data.settings.receipt ?? {}) as Record<string, unknown>; set({ header: String(rr.header ?? ""), footer: String(rr.footer ?? ""), logoText: String(rr.logoText ?? ""), paper: String(rr.paper ?? "80mm"), showVat: rr.showVat !== false, showLicence: rr.showLicence !== false }); setPrinters((q.data.settings.printers ?? []) as Printer[]); setLoaded(true); }
  const save = useAction(() => saveSettings({ receipt: { header: f.header || undefined, footer: f.footer || undefined, logoText: f.logoText || undefined, paper: f.paper, showVat: f.showVat, showLicence: f.showLicence }, printers: printers.map((p) => ({ ...p, kind: p.kind })) }), ["settings"]);
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title={t("set.tabReceipt")}>
        <form className="grid gap-4" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
          <Field label={t("set.receiptLogo")}>{(id) => <Input id={id} {...bind("logoText")} />}</Field><Field label={t("set.receiptHeader")}>{(id) => <Input id={id} {...bind("header")} />}</Field><Field label={t("set.receiptFooter")}>{(id) => <Input id={id} {...bind("footer")} />}</Field>
          <Field label={t("set.receiptPaper")}>{(id) => <Select id={id} {...bind("paper")}><option value="80mm">{t("set.paperThermal")}</option><option value="a4">{t("set.paperA4")}</option></Select>}</Field>
          <div className="flex flex-col gap-2"><Switch checked={f.showVat} onChange={(v) => set({ showVat: v })} label={t("set.showVat")} /><Switch checked={f.showLicence} onChange={(v) => set({ showLicence: v })} label={t("set.showLicence")} /></div>
          <ErrorNote error={save.error} /><div><Button type="submit" disabled={save.isPending}>{t("common.save")}</Button></div>
        </form>
        <p className="mt-4 text-xs text-muted-foreground">{t("set.noTaxNote")}</p>
      </Card>
      <div className="space-y-4">
        <Card title={t("set.printers")}>
          <p className="mb-3 text-xs text-muted-foreground">{t("set.printersNote")}</p>
          <div className="space-y-2">{printers.map((p, i) => <div key={p.id} className="flex gap-2"><Input aria-label={t("set.printerName")} value={p.name} onChange={(e) => setPrinters(printers.map((x, k) => (k === i ? { ...x, name: e.target.value } : x)))} /><Select aria-label={t("set.printerKind")} value={p.kind} onChange={(e) => setPrinters(printers.map((x, k) => (k === i ? { ...x, kind: e.target.value } : x)))} className="w-44">{["RECEIPT", "LABEL", "A4"].map((k) => <option key={k} value={k}>{t(`set.pk.${k}`)}</option>)}</Select><Button type="button" variant="ghost" aria-label={t("common.remove")} onClick={() => setPrinters(printers.filter((_, k) => k !== i))}>✕</Button></div>)}</div>
          <Button type="button" variant="outline" size="sm" className="mt-3" onClick={() => setPrinters([...printers, { id: `p${Date.now()}`, name: "", kind: "RECEIPT" }])}><Plus aria-hidden className="size-4" />{t("set.addPrinter")}</Button>
        </Card>
        <Card title={t("set.previewReceipt")}><div className="mx-auto max-w-xs rounded-md border border-dashed border-border bg-background p-4 font-mono text-xs"><div className="text-center text-sm font-semibold">{f.logoText || t("app.product")}</div>{f.header && <div className="text-center text-muted-foreground">{f.header}</div>}<div className="my-2 border-y border-dashed border-border py-1 text-center">…</div>{f.showVat && <div className="flex justify-between"><span>{t("pos.vat")}</span><span>14.00</span></div>}<div className="flex justify-between font-bold"><span>{t("pos.total")}</span><span>100.00</span></div>{f.footer && <div className="mt-2 text-center text-muted-foreground">{f.footer}</div>}</div></Card>
      </div>
    </div>
  );
}

interface Tax { code: string; label: string; rate: string }
export function RegionalTab() {
  const { t } = useTranslation();
  const q = useSettings();
  const s = q.data?.settings ?? {}; const lo = (s.loyalty ?? {}) as Record<string, unknown>;
  const [f, set, bind] = useForm({ currency: "EGP", ar: true, en: true, maxCashierDiscountPct: "10", costVarianceTolerancePct: "5", refillReminderDays: "3", customerCreditDays: "30", loyaltyEnabled: true, earnPer: "10", redeemValue: "0.50" });
  const [taxes, setTaxes] = useState<Tax[]>([]); const [loaded, setLoaded] = useState(false);
  if (q.data && !loaded) {
    const langs = (s.languages as string[] | undefined) ?? ["ar", "en"];
    set({ currency: String(s.currency ?? q.data.pack.currency), ar: langs.includes("ar"), en: langs.includes("en"), maxCashierDiscountPct: String(s.maxCashierDiscountPct ?? 10), costVarianceTolerancePct: String(s.costVarianceTolerancePct ?? 5), refillReminderDays: String(s.refillReminderDays ?? 3), customerCreditDays: String(s.customerCreditDays ?? 30), loyaltyEnabled: lo.enabled !== false, earnPer: String(lo.earnPer ?? 10), redeemValue: String(lo.redeemValue ?? "0.50") });
    setTaxes((s.taxRates as Tax[] | undefined) ?? [{ code: "STD", label: q.data.pack.vat.label, rate: q.data.pack.vat.defaultRate }]); setLoaded(true);
  }
  const save = useAction(() => saveSettings({ currency: f.currency.toUpperCase(), languages: [f.ar && "ar", f.en && "en"].filter(Boolean), taxRates: taxes, maxCashierDiscountPct: Number(f.maxCashierDiscountPct), costVarianceTolerancePct: Number(f.costVarianceTolerancePct), refillReminderDays: Number(f.refillReminderDays), customerCreditDays: Number(f.customerCreditDays), loyalty: { enabled: f.loyaltyEnabled, earnPer: f.earnPer, redeemValue: f.redeemValue } }), ["settings"]);
  return (
    <form className="grid gap-4 lg:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
      <Card title={t("set.taxRates")}>
        <div className="grid gap-4 sm:grid-cols-2"><Field label={t("set.currency")}>{(id) => <Input id={id} maxLength={3} dir="ltr" {...bind("currency")} />}</Field>
          <fieldset><legend className="mb-1.5 text-sm font-medium">{t("set.languages")}</legend><div className="flex gap-4 pt-1"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.ar} onChange={(e) => set({ ar: e.target.checked })} />العربية</label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.en} onChange={(e) => set({ en: e.target.checked })} />English</label></div></fieldset></div>
        <div className="mt-4 space-y-2">{taxes.map((x, i) => <div key={i} className="grid grid-cols-[6rem_1fr_7rem_auto] gap-2"><Input aria-label={t("set.taxCode")} value={x.code} dir="ltr" onChange={(e) => setTaxes(taxes.map((y, k) => (k === i ? { ...y, code: e.target.value } : y)))} /><Input aria-label={t("set.taxLabel")} value={x.label} onChange={(e) => setTaxes(taxes.map((y, k) => (k === i ? { ...y, label: e.target.value } : y)))} /><Input aria-label={t("set.taxRate")} inputMode="decimal" value={x.rate} dir="ltr" onChange={(e) => setTaxes(taxes.map((y, k) => (k === i ? { ...y, rate: e.target.value } : y)))} /><Button type="button" variant="ghost" aria-label={t("common.remove")} onClick={() => setTaxes(taxes.filter((_, k) => k !== i))}>✕</Button></div>)}
          <Button type="button" variant="outline" size="sm" onClick={() => setTaxes([...taxes, { code: "", label: "", rate: "0.00" }])}><Plus aria-hidden className="size-4" />{t("set.addTaxRate")}</Button></div>
        <p className="mt-3 text-xs text-muted-foreground">{t("set.noTaxNote")}</p>
      </Card>
      <Card title={t("set.rules")}>
        <div className="grid gap-4 sm:grid-cols-2"><Field label={t("set.maxDiscount")}>{(id) => <Input id={id} type="number" min={0} max={100} {...bind("maxCashierDiscountPct")} />}</Field><Field label={t("set.costTolerance")}>{(id) => <Input id={id} type="number" min={0} max={100} {...bind("costVarianceTolerancePct")} />}</Field>
          <Field label={t("set.refillDays")}>{(id) => <Input id={id} type="number" min={0} max={30} {...bind("refillReminderDays")} />}</Field><Field label={t("set.creditDays")}>{(id) => <Input id={id} type="number" min={0} max={365} {...bind("customerCreditDays")} />}</Field></div>
      </Card>
      <Card title={t("set.loyaltyTitle")}><div className="grid gap-4 sm:grid-cols-3"><div className="sm:col-span-3"><Switch checked={f.loyaltyEnabled} onChange={(v) => set({ loyaltyEnabled: v })} label={t("set.loyaltyEnabled")} /></div><Field label={t("set.loyaltyEarn")}>{(id) => <Input id={id} inputMode="decimal" {...bind("earnPer")} />}</Field><Field label={t("set.loyaltyRedeem")}>{(id) => <Input id={id} inputMode="decimal" {...bind("redeemValue")} />}</Field></div></Card>
      <div className="lg:col-span-2"><ErrorNote error={save.error} /><Button type="submit" disabled={save.isPending}>{t("common.save")}</Button></div>
    </form>
  );
}

const KINDS = ["drugs", "stock", "customers", "suppliers"] as const;
interface Report { total: number; ok: number; skipped: number; errors: number; created?: number; updated?: number; rows: Array<{ row: number; status: string; message?: string }> }
const ENTITIES = ["customers", "drugs", "stock", "sales", "prescriptions", "suppliers", "expenses", "audit", "controlled-register"];

export function DataTab() {
  const { t } = useTranslation(); const { can, branchId, me } = useAuth(); const toast = useToast();
  const [kind, setKind] = useState<(typeof KINDS)[number]>("drugs"); const [csv, setCsv] = useState(""); const [name, setName] = useState(""); const [report, setReport] = useState<Report | null>(null); const [branch, setBranch] = useState(branchId ?? "");
  const file = useRef<HTMLInputElement>(null);
  const run = useAction((dryRun: boolean) => api<Report>(`/admin/import/${kind}`, { body: { csv, dryRun, branchId: branch || undefined } }), ["stock", "drugs", "customers", "suppliers"], { silent: true, onDone: setReport });
  const apply = useAction(() => api<Report>(`/admin/import/${kind}`, { body: { csv, dryRun: false, branchId: branch || undefined } }), ["stock", "drugs", "customers", "suppliers", "price-book"], { silent: true, onDone: (r) => { setReport(r); toast(t("set.imp.done")); } });
  const onFile = (f: File | undefined) => { if (!f) return; setName(f.name); setReport(null); const fr = new FileReader(); fr.onload = () => setCsv(String(fr.result)); fr.readAsText(f, "utf-8"); };
  const tpl = () => void download(`/admin/import/${kind}/template`, `${kind}-template.csv`).catch(() => toast(t("errors.network"), "err"));
  const exp = (e: string) => void download(`/admin/export/${e}`, `${e}.csv`).catch(() => toast(t("errors.network"), "err"));
  const backup = () => void fetchBlob("/admin/export").then((b) => { const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `kiorly-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 10_000); }).catch(() => toast(t("errors.network"), "err"));
  return (
    <div className="space-y-4">
      {can("data.import") && <Card title={t("set.imp.title")}>
        <div className="grid gap-3 sm:grid-cols-3"><Field label={t("set.imp.kind")}>{(id) => <Select id={id} value={kind} onChange={(e) => { setKind(e.target.value as never); setReport(null); }}>{KINDS.map((k) => <option key={k} value={k}>{t(`set.imp.${k}`)}</option>)}</Select>}</Field>
          {kind === "stock" && me && me.branches.length > 1 && <Field label={t("set.imp.stockBranch")}>{(id) => <Select id={id} value={branch} onChange={(e) => setBranch(e.target.value)}>{me.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>}</Field>}
          <Field label={t("set.imp.file")}>{(id) => <input id={id} ref={file} type="file" accept=".csv,text/csv,text/plain" onChange={(e) => onFile(e.target.files?.[0])} className="min-h-10 text-sm" />}</Field></div>
        <div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" onClick={tpl}><Download aria-hidden className="size-4" />{t("set.imp.template")}</Button><Button variant="outline" disabled={!csv || run.isPending} onClick={() => run.mutate(true)}><Upload aria-hidden className="size-4" />{t("set.imp.check")}</Button><Button disabled={!csv || !report || report.errors > 0 || apply.isPending} onClick={() => apply.mutate()}>{t("set.imp.apply")}</Button>{name && <span className="self-center text-sm text-muted-foreground">{name}</span>}</div>
        <div className="mt-2"><ErrorNote error={run.error || apply.error} /></div>
        {report && <div className="mt-4 space-y-2"><p className="text-sm font-medium">{t("set.imp.result", { ok: report.ok, skipped: report.skipped, errors: report.errors })}{report.created != null && !report.errors ? ` · +${report.created}` : ""}</p>{report.errors > 0 && <p className="text-sm text-[hsl(var(--danger-text))]">{t("set.imp.fix")}</p>}
          {report.rows.some((r) => r.status !== "OK") && <Table dense head={[t("set.imp.row"), t("common.status"), t("common.note")]}>{report.rows.filter((r) => r.status !== "OK").slice(0, 100).map((r) => <tr key={r.row}><Td className="kx-num">{r.row}</Td><Td><Badge tone={r.status === "ERROR" ? "bad" : "neutral"}>{r.status}</Badge></Td><Td>{r.message}</Td></tr>)}</Table>}</div>}
      </Card>}
      {can("data.export") && <Card title={t("set.exp.title")}><p className="mb-3 text-sm text-muted-foreground">{t("set.exp.note")}</p><div className="flex flex-wrap gap-2"><Button onClick={backup}><Download aria-hidden className="size-4" />{t("set.exp.bundle")}</Button>{ENTITIES.map((e) => <Button key={e} variant="outline" size="sm" onClick={() => exp(e)}>{t(`set.exp.e.${e}`)} · {t("set.exp.csv")}</Button>)}</div></Card>}
      {!can("data.import") && !can("data.export") && <Empty>{t("common.none")}</Empty>}
    </div>
  );
}
