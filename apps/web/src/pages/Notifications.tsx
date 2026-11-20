import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertOctagon, AlertTriangle, CheckCheck, Info, RefreshCw } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, PageHeader, Table, Tabs, Td, type Tone } from "@/components/ui";
import { fmtDateTime } from "@/lib/format";
import { useToast } from "@/lib/toast";

interface Alert { id: string; kind: string; severity: string; title: string; body: string | null; link: string | null; createdAt: string; read: boolean; resolvedAt: string | null }
const SEV: Record<string, { tone: Tone; icon: typeof Info }> = { CRITICAL: { tone: "bad", icon: AlertOctagon }, WARN: { tone: "warn", icon: AlertTriangle }, INFO: { tone: "info", icon: Info } };

export function Notifications() {
  const { t } = useTranslation(); const nav = useNavigate(); const toast = useToast(); const { can } = useAuth();
  const [tab, setTab] = useState("alerts"); const [unread, setUnread] = useState(false);
  const q = useQuery({ queryKey: ["alerts", unread], queryFn: () => api<{ unread: number; items: Alert[] }>("/notifications/feed", { query: { unread: unread ? "true" : undefined } }), refetchInterval: 60_000 });
  const msgs = useQuery({ queryKey: ["messages"], queryFn: () => api<Array<{ id: string; channel: string; recipient: string; template: string; body: string; createdAt: string }>>("/dashboard/notifications"), enabled: tab === "messages" && can("settings.read") });
  const read = useAction((id: string) => api(`/notifications/${id}/read`, { method: "POST" }), ["alerts", "alerts-count"], { silent: true });
  const all = useAction(() => api("/notifications/read-all", { method: "POST" }), ["alerts", "alerts-count"], { silent: true });
  const scan = useAction(() => api<{ created: number; resolved: number }>("/notifications/scan", { method: "POST" }), ["alerts", "alerts-count"], { silent: true, onDone: (r) => toast(t("ntf.scanned", r)) });
  return (<>
    <PageHeader title={t("ntf.title")} subtitle={t("ntf.subtitle")} actions={<><Button variant="outline" onClick={() => scan.mutate()} disabled={scan.isPending}><RefreshCw aria-hidden className="size-4" />{t("ntf.scan")}</Button><Button variant="outline" onClick={() => all.mutate()} disabled={all.isPending || !q.data?.unread}><CheckCheck aria-hidden className="size-4" />{t("ntf.markAll")}</Button></>} />
    <Tabs value={tab} onChange={setTab} tabs={[{ id: "alerts", label: t("ntf.tabAlerts"), count: q.data?.unread }, ...(can("settings.read") ? [{ id: "messages", label: t("ntf.tabMessages") }] : [])]} />
    <ErrorNote error={q.error || scan.error} />
    {tab === "alerts" ? <div className="mt-3 space-y-3"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={unread} onChange={(e) => setUnread(e.target.checked)} />{t("ntf.unreadOnly")}</label>
      {!q.data?.items.length ? <Card><Empty>{t("ntf.empty")}</Empty></Card> : <ul className="space-y-2">{q.data.items.map((a) => { const S = SEV[a.severity] ?? SEV.INFO!; const Icon = S.icon; return (
        <li key={a.id} className={`flex flex-wrap items-center gap-3 rounded-xl border p-3 ${a.read ? "border-border/60 bg-card opacity-75" : "border-border bg-card shadow-[var(--kx-shadow-1)]"}`}>
          <Icon aria-hidden className={`size-5 shrink-0 ${a.severity === "CRITICAL" ? "text-[hsl(var(--danger-text))]" : a.severity === "WARN" ? "text-[hsl(var(--warning))]" : "text-muted-foreground"}`} />
          <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="text-sm font-semibold">{t(`ntf.kind.${a.kind}`)}</span><Badge tone={S.tone}>{t(`ntf.sev.${a.severity}`)}</Badge>{!a.read && <span aria-label="unread" className="size-2 rounded-full bg-primary" />}</div>
            <p className="text-sm text-muted-foreground"><b className="text-foreground" dir="auto">{a.title}</b> {t(`ntf.msg.${a.kind}`)}</p><p className="text-xs text-muted-foreground">{fmtDateTime(a.createdAt)}</p></div>
          <div className="flex gap-2">{a.link && <Button size="sm" onClick={() => { read.mutate(a.id); nav(a.link!); }}>{t("ntf.open")}</Button>}{!a.read && <Button size="sm" variant="ghost" onClick={() => read.mutate(a.id)}>{t("ntf.markAll").replace(/.*/, "✓")}</Button>}</div></li>); })}</ul>}</div>
      : <Card className="mt-3 p-0"><Table dense head={[t("common.date"), t("set.channel"), t("set.recipient"), t("common.note")]} empty={!msgs.data?.length ? <Empty>{t("common.none")}</Empty> : null}>{msgs.data?.map((m) => <tr key={m.id}><Td>{fmtDateTime(m.createdAt)}</Td><Td><Badge tone="neutral">{m.channel}</Badge></Td><Td dir="ltr" className="text-end">{m.recipient}</Td><Td className="max-w-md text-sm">{m.body}</Td></tr>)}</Table></Card>}
  </>);
}
