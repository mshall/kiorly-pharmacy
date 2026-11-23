import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Building2, Cog, Database, Globe, Inbox, Printer, ShieldCheck, Store, Users } from "lucide-react";
import { Button, Card, Empty, ErrorNote, Field, Input, PageHeader, Switch, Table, Tabs, Td } from "@/components/ui";
import { StatusChip, TableSkeleton } from "@/brand/ui-kit";
import { fmtDateTime } from "@/lib/format";
import { useToast } from "@/lib/toast";
import { SignInDefaultCard } from "@/pages/settings/SignInDefaultCard";
import { StaffManagement } from "@/pages/settings/StaffManagement";
import { DataTab, ModeCard, ReceiptTab, RegionalTab, RolesMatrixTab } from "@/pages/settings/SettingsMore";

const Badge = ({ tone = "neutral", children }: { tone?: "neutral" | "good" | "bad" | "warn" | "info"; children: React.ReactNode }) => <StatusChip tone={tone}>{children}</StatusChip>;

interface Branch { id: string; name: string; code: string | null; licenceNo: string | null; active: boolean }

function BranchesTab() {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const branches = useQuery({ queryKey: ["branches"], queryFn: () => api<Branch[]>("/branches") });
  const [name, setName] = useState("");
  const add = useMutation({ mutationFn: () => api("/branches", { body: { name } }), onSuccess: () => { setName(""); void qc.invalidateQueries({ queryKey: ["branches"] }); } });
  return (
    <Card title={t("set.branches")}>
      <Table head={[t("sup.name"), t("onb.branchLicence"), t("common.status")]} empty={branches.isLoading ? <TableSkeleton rows={3} cols={3} /> : null}>{branches.data?.map((b) => <tr key={b.id}><Td className="font-medium">{b.name}</Td><Td>{b.licenceNo ?? "—"}</Td><Td><Badge tone={b.active ? "good" : "bad"}>{b.active ? t("set.active") : t("set.inactive")}</Badge></Td></tr>)}</Table>
      <form className="mt-3 flex items-end gap-2" onSubmit={(e) => { e.preventDefault(); add.mutate(); }}><Field label={t("set.newBranch")}>{(id) => <Input id={id} required minLength={2} value={name} onChange={(e) => setName(e.target.value)} />}</Field><Button type="submit">{t("set.addBranch")}</Button></form>
      <ErrorNote error={add.error} />
    </Card>
  );
}

function PharmacyTab() {
  const { t } = useTranslation();
  const toast = useToast(); const qc = useQueryClient();
  const q = useQuery({ queryKey: ["settings"], queryFn: () => api<{ name: string; edition: string; market: string; pack: { currency: string; vat: { label: string; defaultRate: string }; shiftVarianceThreshold: string }; settings: Record<string, string> }>("/settings") });
  const [f, setF] = useState<Record<string, string>>({});
  const save = useMutation({ mutationFn: () => api("/settings", { method: "PATCH", body: f }), onSuccess: () => { toast(t("common.saved")); setF({}); void qc.invalidateQueries({ queryKey: ["settings"] }); } });
  if (!q.data) return <Card><TableSkeleton rows={4} cols={2} /></Card>;
  const mode = <ModeCard />;
  const v = (k: string, d = "") => f[k] ?? q.data.settings[k] ?? d;
  const set = (k: string) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  return (
    <div className="space-y-4">{mode}<Card title={q.data.name} actions={<Badge tone="info">{q.data.edition}</Badge>}>
      <form className="grid gap-x-4 gap-y-4 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Field label={t("set.vatRate")} hint={t("set.vatHint", { default: q.data.pack.vat.defaultRate })}>{(id) => <Input id={id} inputMode="decimal" value={v("vatRate", q.data.pack.vat.defaultRate)} onChange={set("vatRate")} />}</Field>
        <Field label={t("set.varianceThreshold")}>{(id) => <Input id={id} inputMode="decimal" value={v("shiftVarianceThreshold", q.data.pack.shiftVarianceThreshold)} onChange={set("shiftVarianceThreshold")} />}</Field>
        <Field label={t("set.ownerPhone")} hint={t("set.ownerPhoneHint")}>{(id) => <Input id={id} inputMode="tel" value={v("ownerPhone")} onChange={set("ownerPhone")} />}</Field>
        <Field label={t("set.receiptFooter")}>{(id) => <Input id={id} value={v("receiptFooter")} onChange={set("receiptFooter")} />}</Field>
        <div className="flex flex-wrap items-center gap-3 border-t border-border/70 pt-4 sm:col-span-2"><Button type="submit" disabled={save.isPending || !Object.keys(f).length}>{t("common.save")}</Button>{Object.keys(f).length > 0 && <><span className="text-sm text-muted-foreground">{t("set.unsaved")}</span><Button type="button" variant="ghost" onClick={() => setF({})}>{t("set.discard")}</Button></>}<div className="w-full"><ErrorNote error={save.error} /></div></div>
      </form>
      <p className="mt-4 text-xs text-muted-foreground">{t("set.noTaxNote")}</p>
    </Card></div>
  );
}

function MarketplaceTab() {
  const { t } = useTranslation();
  const { me, flag } = useAuth();
  const toast = useToast(); const qc = useQueryClient();
  const q = useQuery({ queryKey: ["mkt-settings"], queryFn: () => api<Array<{ branchId: string; optedIn: boolean; deliveryRadiusKm: string; prepMinutes: number; slaMinutes: number }>>("/kiorex-orders/settings"), enabled: flag("pharmacy.kiorex_orders"), retry: false });
  const save = useMutation({ mutationFn: (v: { branchId: string; optedIn: boolean; deliveryRadiusKm?: string; prepMinutes?: number; slaMinutes?: number }) => api(`/kiorex-orders/settings/${v.branchId}`, { method: "PUT", body: { optedIn: v.optedIn, deliveryRadiusKm: v.deliveryRadiusKm, prepMinutes: v.prepMinutes, slaMinutes: v.slaMinutes } }), onSuccess: () => { toast(t("common.saved")); void qc.invalidateQueries({ queryKey: ["mkt-settings"] }); } });
  if (!flag("pharmacy.kiorex_orders")) return <Empty>{t("errors.featureDisabled", { key: "pharmacy.kiorex_orders" })}</Empty>;
  return (
    <Card title={t("set.marketplace")}>
      <p className="mb-3 text-sm text-muted-foreground">{t("set.marketplaceNote")}</p>
      <ErrorNote error={save.error} />
      <Table head={[t("common.branch"), t("set.optIn"), t("set.radius"), t("set.prep"), t("set.sla")]}>
        {me?.branches.map((b) => { const s = q.data?.find((x) => x.branchId === b.id); return (
          <tr key={b.id}><Td className="font-medium">{b.name}</Td>
            <Td><div className="flex items-center gap-2"><Switch checked={!!s?.optedIn} label={`${t("set.optIn")}: ${b.name}`} onChange={(v) => save.mutate({ branchId: b.id, optedIn: v })} /><span className="text-sm text-muted-foreground">{s?.optedIn ? t("set.on") : t("set.off")}</span></div></Td>
            <Td className="kx-num">{s?.deliveryRadiusKm ?? "5.00"} km</Td><Td>{s?.prepMinutes ?? 30}</Td><Td>{s?.slaMinutes ?? 10}</Td></tr>); })}
      </Table>
    </Card>
  );
}

function SystemTab() {
  const { t } = useTranslation();
  const { flag } = useAuth();
  const n = useQuery({ queryKey: ["notifications"], queryFn: () => api<Array<{ id: string; channel: string; recipient: string; template: string; body: string; createdAt: string; provider: string }>>("/dashboard/notifications") });
  const o = useQuery({ queryKey: ["outbox"], queryFn: () => api<Array<{ id: string; type: string; aggregateId: string; status: string; attempts: number; occurredAt: string }>>("/dashboard/outbox") });
  return (
    <div className="space-y-4">
      <Card title={t("set.flags")}>
        <ul className="grid gap-2 sm:grid-cols-2">{["pharmacy.module", "pharmacy.kiorex_orders", "pharmacy.forecasting", "pharmacy.insurer_claims"].map((k) => <li key={k} className="flex items-center justify-between rounded-lg border border-border/80 p-3 text-sm"><code className="text-xs" dir="ltr">{k}</code><Badge tone={flag(k) ? "good" : "neutral"}>{flag(k) ? t("set.on") : t("set.off")}</Badge></li>)}</ul>
        <p className="mt-3 text-xs text-muted-foreground">{t("set.safetyNotFlags")}</p>
      </Card>
      <Card title={t("set.inbox")}>
        <p className="mb-2 text-xs text-muted-foreground">{t("set.inboxNote")}</p>
        <Table head={[t("common.date"), t("set.channel"), t("set.recipient"), t("common.note")]} empty={!n.data?.length ? <Empty>{t("common.none")}</Empty> : null}>{n.data?.map((m) => <tr key={m.id}><Td>{fmtDateTime(m.createdAt)}</Td><Td><Badge>{m.channel}</Badge></Td><Td>{m.recipient}</Td><Td className="text-xs">{m.body}</Td></tr>)}</Table>
      </Card>
      <Card title={t("set.outbox")}>
        <Table head={[t("common.date"), t("common.type"), "ID", t("common.status")]} empty={!o.data?.length ? <Empty>{t("common.none")}</Empty> : null}>{o.data?.map((e) => <tr key={e.id}><Td>{fmtDateTime(e.occurredAt)}</Td><Td>{e.type}</Td><Td className="font-mono text-xs">{e.aggregateId}</Td><Td><Badge tone={e.status === "SENT" ? "good" : e.status === "FAILED" ? "bad" : "warn"}>{e.status}</Badge></Td></tr>)}</Table>
      </Card>
    </div>
  );
}

export function Settings() {
  const { t } = useTranslation();
  const { can, me } = useAuth();
  const [tab, setTab] = useState("pharmacy");
  const tabs = [{ id: "pharmacy", label: t("set.pharmacy"), icon: <Store /> }, ...(can("staff.manage") ? [{ id: "staff", label: t("set.staff"), icon: <Users /> }] : []), { id: "roles", label: t("set.rolesTitle"), icon: <ShieldCheck /> }, { id: "branches", label: t("set.branches"), icon: <Building2 /> }, ...(can("settings.write") ? [{ id: "receipt", label: t("set.tabReceipt"), icon: <Printer /> }, { id: "regional", label: t("set.tabRegional"), icon: <Globe /> }] : []), ...(can("data.import") || can("data.export") ? [{ id: "data", label: t("set.tabData"), icon: <Database /> }] : []), ...(me?.tenant.mode === "INTEGRATED" ? [{ id: "marketplace", label: t("set.marketplace"), icon: <Inbox /> }] : []), { id: "system", label: t("set.system"), icon: <Cog /> }];
  return (
    <>
      <PageHeader title={t("set.title")} subtitle={t("set.subtitle")} />
      <Tabs value={tab} onChange={setTab} tabs={tabs} />
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === "pharmacy" && <><PharmacyTab /><SignInDefaultCard /></>}{tab === "staff" && <StaffManagement />}{tab === "roles" && <RolesMatrixTab />}{tab === "receipt" && <ReceiptTab />}{tab === "regional" && <RegionalTab />}{tab === "data" && <DataTab />}{tab === "branches" && <BranchesTab />}{tab === "marketplace" && <MarketplaceTab />}{tab === "system" && <SystemTab />}
      </div>
    </>
  );
}
