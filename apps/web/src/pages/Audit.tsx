import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, PageHeader, Select, Table, Td } from "@/components/ui";
import { TableSkeleton } from "@/brand/ui-kit";
import { fmtDateTime, todayIso } from "@/lib/format";
import { download } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Page } from "@/lib/types";

interface Entry { id: string; actorId: string | null; action: string; entityType: string; entityId: string; meta: Record<string, unknown> | null; at: string }
const ENTITIES = ["Sale", "Dispensing", "Prescription", "Customer", "StockLot", "Supplier", "PurchaseOrder", "Shift", "Expense", "Promotion", "InsurerClaim", "StaffRole", "Tenant", "StaffUser", "ControlledDiscrepancy", "Export"];

export function Audit() {
  const { t } = useTranslation(); const toast = useToast();
  const [action, setAction] = useState(""); const [entity, setEntity] = useState(""); const [actor, setActor] = useState(""); const [from, setFrom] = useState(""); const [to, setTo] = useState(todayIso()); const [page, setPage] = useState(1); const [open, setOpen] = useState<string | null>(null);
  const staff = useQuery({ queryKey: ["staff"], queryFn: () => api<Array<{ id: string; displayName: string }>>("/staff"), retry: false });
  const query = { action: action || undefined, entityType: entity || undefined, actorId: actor || undefined, from: from ? `${from}T00:00:00.000Z` : undefined, to: to ? `${to}T23:59:59.999Z` : undefined };
  const q = useQuery({ queryKey: ["audit", query, page], queryFn: () => api<Page<Entry>>("/audit", { query: { ...query, page, pageSize: 50 } }), placeholderData: (p) => p });
  const names = new Map((staff.data ?? []).map((s) => [s.id, s.displayName]));
  const exp = () => void download("/audit/export.csv", "audit.csv", query).catch(() => toast(t("errors.network"), "err"));
  return (<>
    <PageHeader title={t("aud.title")} subtitle={t("aud.subtitle")} actions={<Button variant="outline" onClick={exp}><Download aria-hidden className="size-4" />{t("aud.export")}</Button>} />
    <div className="mb-4 flex flex-wrap items-end gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-kx-1">
      <Field label={t("aud.action")}>{(id) => <Input id={id} dir="ltr" placeholder="sale." value={action} onChange={(e) => { setAction(e.target.value); setPage(1); }} className="w-40" />}</Field>
      <Field label={t("aud.entity")}>{(id) => <Select id={id} value={entity} onChange={(e) => { setEntity(e.target.value); setPage(1); }}><option value="">{t("aud.allEntities")}</option>{ENTITIES.map((x) => <option key={x}>{x}</option>)}</Select>}</Field>
      {!!staff.data && <Field label={t("aud.actor")}>{(id) => <Select id={id} value={actor} onChange={(e) => { setActor(e.target.value); setPage(1); }}><option value="">{t("aud.allStaff")}</option>{staff.data!.map((s) => <option key={s.id} value={s.id}>{s.displayName}</option>)}</Select>}</Field>}
      <Field label={t("rep.from")}>{(id) => <Input id={id} type="date" value={from} max={to} onChange={(e) => { setFrom(e.target.value); setPage(1); }} />}</Field><Field label={t("rep.to")}>{(id) => <Input id={id} type="date" value={to} min={from} onChange={(e) => { setTo(e.target.value); setPage(1); }} />}</Field></div>
    <ErrorNote error={q.error} />
    <Card className="p-0">{q.isLoading ? <TableSkeleton rows={10} cols={5} /> : <Table dense head={[t("aud.at"), t("aud.actor"), t("aud.action"), t("aud.entity"), t("aud.details")]} hideOnPhone={[3]} empty={!q.data?.items.length ? <Empty>{t("aud.empty")}</Empty> : null}>
      {q.data?.items.map((e) => <tr key={e.id}><Td className="whitespace-nowrap text-xs">{fmtDateTime(e.at)}</Td><Td>{e.actorId ? names.get(e.actorId) ?? e.actorId.slice(-6) : "—"}</Td><Td><Badge tone="neutral"><span dir="ltr">{e.action}</span></Badge></Td><Td><span className="text-xs">{e.entityType}</span> <span className="font-mono text-[11px] text-muted-foreground" dir="ltr">{e.entityId.slice(-8)}</span></Td>
        <Td className="max-w-xs">{e.meta ? <button type="button" className="text-start font-mono text-[11px] text-muted-foreground hover:text-foreground" dir="ltr" onClick={() => setOpen(open === e.id ? null : e.id)}>{open === e.id ? <pre className="whitespace-pre-wrap">{JSON.stringify(e.meta, null, 1)}</pre> : <span className="line-clamp-1">{JSON.stringify(e.meta)}</span>}</button> : "—"}</Td></tr>)}</Table>}
      <div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3 text-sm"><span className="text-muted-foreground">{t("common.total", { count: q.data?.total ?? 0 })}</span><div className="flex gap-2"><Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage(page - 1)}>{t("common.prev")}</Button><Button size="sm" variant="outline" disabled={page * 50 >= (q.data?.total ?? 0)} onClick={() => setPage(page + 1)}>{t("common.next")}</Button></div></div></Card>
  </>);
}
