import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Printer, Wand2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, Select, Table, Td, type Tone } from "@/components/ui";
import { StatCard } from "@/brand/ui-kit";
import { WitnessFields, useWitness } from "@/components/witness";
import { drugName, fmtDate, fmtDateTime, fmtMoney, fmtNum } from "@/lib/format";
import { printHtml } from "@/lib/print";
import { useToast } from "@/lib/toast";
import type { Lot, Page } from "@/lib/types";

const KINDS = ["SHELF", "FRIDGE", "SAFE", "BACKROOM", "DISPLAY", "QUARANTINE"];
interface Loc { id: string; code: string; label: string | null; kind: string; active: boolean; lots: number; units: number }

export function LocationsTab() {
  const { t } = useTranslation(); const { branchId, can } = useAuth();
  const [open, setOpen] = useState(false); const [sel, setSel] = useState<Loc | null>(null); const [lotId, setLotId] = useState("");
  const q = useQuery({ queryKey: ["locations", branchId], queryFn: () => api<Loc[]>("/inventory/locations", { query: { branchId } }), enabled: !!branchId });
  const contents = useQuery({ queryKey: ["location-contents", sel?.id], queryFn: () => api<{ lots: Array<{ lotId: string; brandName: string; brandNameAr: string | null; strength: string; lotNumber: string; expiryDate: string; qtyOnHand: number; value: string }> }>(`/inventory/locations/${sel!.id}/contents`), enabled: !!sel });
  const lots = useQuery({ queryKey: ["lots-pick", branchId], queryFn: () => api<Page<Lot>>("/inventory/lots", { query: { branchId, pageSize: 100 } }), enabled: !!sel && can("inventory.adjust") });
  const [f, , bind, reset] = useForm({ code: "", label: "", kind: "SHELF" });
  const create = useAction(() => api("/inventory/locations", { body: { branchId, code: f.code, label: f.label || undefined, kind: f.kind } }), ["locations"], { onDone: () => { reset(); setOpen(false); } });
  const assign = useAction(() => api(`/inventory/locations/${sel!.id}/assign`, { body: { lotIds: [lotId] } }), ["locations", "location-contents", "lots"], { onDone: () => setLotId("") });
  return <Card title={t("inv.tabLocations")} actions={can("inventory.adjust") && <Button size="sm" onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("inv.newLocation")}</Button>}>
    <Table head={[t("inv.locationCode"), t("inv.locationLabel"), t("inv.locationKind"), t("inv.contents"), ""]} empty={!q.data?.length ? <Empty>{t("inv.locationEmpty")}</Empty> : null}>
      {q.data?.map((l) => <tr key={l.id}><Td className="font-mono font-semibold">{l.code}</Td><Td>{l.label ?? "—"}</Td><Td><Badge tone={l.kind === "FRIDGE" ? "info" : l.kind === "SAFE" ? "bad" : "neutral"}>{t(`inv.lk.${l.kind}`)}</Badge></Td><Td>{t("inv.locationLots", { lots: l.lots, units: l.units })}</Td><Td className="text-end"><Button size="sm" variant="outline" onClick={() => setSel(l)}>{t("common.open")}</Button></Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("inv.newLocation")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
      <Field label={t("inv.locationCode")}>{(id) => <Input id={id} required dir="ltr" {...bind("code")} />}</Field><Field label={t("inv.locationLabel")}>{(id) => <Input id={id} {...bind("label")} />}</Field>
      <Field label={t("inv.locationKind")}>{(id) => <Select id={id} {...bind("kind")}>{KINDS.map((k) => <option key={k} value={k}>{t(`inv.lk.${k}`)}</option>)}</Select>}</Field><ErrorNote error={create.error} /><Button type="submit" disabled={create.isPending}>{t("common.save")}</Button></form></Modal>
    <Modal open={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.code} · ${t(`inv.lk.${sel.kind}`)}` : ""} wide>
      <Table dense numeric={[3, 4]} head={[t("common.product"), t("inv.lot"), t("inv.expiry"), t("inv.qty"), t("inv.stockValue")]} empty={!contents.data?.lots.length ? <Empty>{t("common.none")}</Empty> : null}>{contents.data?.lots.map((l) => <tr key={l.lotId}><Td className="font-medium">{drugName(l)} <bdi className="text-xs text-muted-foreground">{l.strength}</bdi></Td><Td className="font-mono text-xs">{l.lotNumber}</Td><Td>{fmtDate(l.expiryDate)}</Td><Td className="kx-num text-end">{l.qtyOnHand}</Td><Td className="kx-num text-end">{fmtMoney(l.value)}</Td></tr>)}</Table>
      {can("inventory.adjust") && <div className="mt-4 flex flex-wrap items-end gap-2"><Field label={t("inv.pickLot")} className="min-w-64 flex-1">{(id) => <Select id={id} value={lotId} onChange={(e) => setLotId(e.target.value)}><option value="">—</option>{lots.data?.items.filter((l) => l.qtyOnHand > 0).map((l) => <option key={l.id} value={l.id}>{drugName(l.drug)} · {l.lotNumber} · {l.qtyOnHand}</option>)}</Select>}</Field><Button disabled={!lotId || assign.isPending} onClick={() => assign.mutate()}>{t("inv.assign")}</Button></div>}
      <div className="mt-2"><ErrorNote error={assign.error} /></div></Modal>
  </Card>;
}

const CLS_TONE: Record<string, Tone> = { FAST: "good", NORMAL: "neutral", SLOW: "warn", DEAD: "bad" };
interface Mover { drugId: string; brandName: string; brandNameAr: string | null; strength: string; units: number; perDay: number; onHand: number; daysOfCover: number | null; stockValue: string; lastSold: string | null; class: string }
export function MoversTab() {
  const { t } = useTranslation(); const { branchId, can } = useAuth(); const toast = useToast();
  const [days, setDays] = useState("90"); const [cls, setCls] = useState("");
  const q = useQuery({ queryKey: ["movers", branchId, days], queryFn: () => api<{ days: number; counts: Record<string, number>; deadStockValue: string; items: Mover[] }>("/inventory/analytics/movers", { query: { branchId, days } }), enabled: !!branchId });
  const auto = useAction((overwrite: boolean) => api<{ created: number; updated: number; skipped: number }>("/inventory/analytics/auto-reorder", { body: { branchId, days: Number(days), overwrite } }), ["stock"], { silent: true, onDone: (r) => toast(t("inv.autoReorderDone", r)) });
  const rows = (q.data?.items ?? []).filter((r) => !cls || r.class === cls);
  return <div className="space-y-4">
    <div className="grid gap-4 sm:grid-cols-5">{(["FAST", "NORMAL", "SLOW", "DEAD"] as const).map((c) => <button key={c} type="button" onClick={() => setCls(cls === c ? "" : c)} className="text-start"><StatCard label={t(`inv.cls.${c}`)} value={fmtNum(q.data?.counts[c] ?? 0)} tone={c === "FAST" ? "good" : c === "SLOW" ? "warn" : c === "DEAD" ? "bad" : "neutral"} className={cls === c ? "ring-2 ring-primary" : ""} /></button>)}<StatCard label={t("inv.deadValue")} value={fmtMoney(q.data?.deadStockValue ?? 0)} tone="bad" /></div>
    <div className="flex flex-wrap items-end gap-3"><Field label={t("inv.moversWindow", { days })}>{(id) => <Select id={id} value={days} onChange={(e) => setDays(e.target.value)}>{["30", "60", "90", "180", "365"].map((d) => <option key={d} value={d}>{d}</option>)}</Select>}</Field>
      {can("inventory.adjust") && <><Button variant="outline" onClick={() => auto.mutate(false)} disabled={auto.isPending}><Wand2 aria-hidden className="size-4" />{t("inv.autoReorder")}</Button><Button variant="ghost" size="sm" onClick={() => auto.mutate(true)} disabled={auto.isPending}>{t("inv.autoOverwrite")}</Button></>}</div>
    <Card className="p-0"><Table dense numeric={[2, 3, 4, 5, 6]} head={[t("common.product"), t("common.status"), t("inv.unitsSold"), t("inv.perDay"), t("inv.onHand"), t("inv.daysCover"), t("inv.stockValue"), t("inv.lastSold")]} empty={!rows.length ? <Empty>{t("common.noResults")}</Empty> : null}>
      {rows.slice(0, 200).map((r) => <tr key={r.drugId}><Td className="font-medium">{drugName(r)} <bdi className="text-xs text-muted-foreground">{r.strength}</bdi></Td><Td><Badge tone={CLS_TONE[r.class] ?? "neutral"}>{t(`inv.cls.${r.class}`)}</Badge></Td><Td className="kx-num text-end">{fmtNum(r.units)}</Td><Td className="kx-num text-end">{r.perDay}</Td><Td className="kx-num text-end">{fmtNum(r.onHand)}</Td><Td className="kx-num text-end">{r.daysOfCover ?? "—"}</Td><Td className="kx-num text-end">{fmtMoney(r.stockValue)}</Td><Td>{fmtDate(r.lastSold)}</Td></tr>)}</Table></Card>
  </div>;
}

interface Transfer { id: string; fromBranchId: string; toBranchId: string; status: string; createdAt: string; lines: Array<{ id: string; lotId: string; drugId: string; quantity: number }> }
export function TransfersTab() {
  const { t } = useTranslation(); const { me, branchId, can } = useAuth();
  const q = useQuery({ queryKey: ["transfers"], queryFn: () => api<Transfer[]>("/inventory/transfers"), retry: false });
  const lots = useQuery({ queryKey: ["lots-pick", branchId], queryFn: () => api<Page<Lot>>("/inventory/lots", { query: { branchId, pageSize: 100 } }), enabled: !!branchId });
  const [open, setOpen] = useState(false); const [to, setTo] = useState(""); const [lines, setLines] = useState<Array<{ lotId: string; quantity: string }>>([]);
  const [disp, setDisp] = useState<Transfer | null>(null); const w = useWitness();
  const create = useAction(() => api("/inventory/transfers", { body: { fromBranchId: branchId, toBranchId: to, lines: lines.filter((l) => l.lotId && Number(l.quantity) > 0).map((l) => ({ lotId: l.lotId, quantity: Number(l.quantity) })) } }), ["transfers"], { onDone: () => { setOpen(false); setLines([]); setTo(""); } });
  const dispatch = useAction(() => api(`/inventory/transfers/${disp!.id}/dispatch`, { body: { witness: w.value } }), ["transfers", "lots", "stock"], { onDone: () => { setDisp(null); w.reset(); } });
  const act = useAction((a: { id: string; what: "receive" | "cancel" }) => api(`/inventory/transfers/${a.id}/${a.what}`, { method: "POST" }), ["transfers", "lots", "stock"]);
  const bn = (id: string) => me?.branches.find((b) => b.id === id)?.name ?? id.slice(-4);
  const needsChain = q.error instanceof ApiError && q.error.entitlementRequired;
  const tone = (s: string): Tone => (s === "RECEIVED" ? "good" : s === "IN_TRANSIT" ? "info" : s === "CANCELLED" ? "neutral" : "warn");
  if (needsChain) return <Card><Empty>{t("inv.transferNeedsChain")}</Empty></Card>;
  return <Card title={t("inv.tabTransfers")} actions={can("inventory.transfer") && <Button size="sm" onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("inv.transferNew")}</Button>}>
    <ErrorNote error={q.error || act.error} />
    <Table head={[t("common.date"), t("inv.transferFrom"), t("inv.transferTo"), t("inv.transferLines"), t("common.status"), ""]} numeric={[3]} empty={!q.data?.length ? <Empty>{t("inv.transferEmpty")}</Empty> : null}>
      {q.data?.map((x) => <tr key={x.id}><Td>{fmtDateTime(x.createdAt)}</Td><Td>{bn(x.fromBranchId)}</Td><Td>{bn(x.toBranchId)}</Td><Td className="kx-num text-end">{x.lines.reduce((a, l) => a + l.quantity, 0)}</Td><Td><Badge tone={tone(x.status)}>{t(`inv.tr.${x.status}`)}</Badge></Td>
        <Td className="text-end">{can("inventory.transfer") && <div className="flex justify-end gap-1">{x.status === "REQUESTED" && <><Button size="sm" onClick={() => setDisp(x)}>{t("inv.dispatch")}</Button><Button size="sm" variant="ghost" onClick={() => act.mutate({ id: x.id, what: "cancel" })}>{t("common.cancel")}</Button></>}{x.status === "IN_TRANSIT" && <Button size="sm" onClick={() => act.mutate({ id: x.id, what: "receive" })}>{t("inv.receiveTransfer")}</Button>}</div>}</Td></tr>)}</Table>
    <Modal open={open} onClose={() => setOpen(false)} title={t("inv.transferNew")} wide><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); create.mutate(); }}>
      <Field label={t("inv.transferTo")}>{(id) => <Select id={id} required value={to} onChange={(e) => setTo(e.target.value)}><option value="">—</option>{me?.branches.filter((b) => b.id !== branchId).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>}</Field>
      {lines.map((l, i) => <div key={i} className="flex gap-2"><Select aria-label={t("inv.pickLot")} value={l.lotId} onChange={(e) => setLines(lines.map((x, k) => k === i ? { ...x, lotId: e.target.value } : x))}><option value="">{t("inv.pickLot")}</option>{lots.data?.items.filter((x) => x.qtyOnHand > 0 && x.status === "AVAILABLE").map((x) => <option key={x.id} value={x.id}>{drugName(x.drug)} · {x.lotNumber} · {x.qtyOnHand}</option>)}</Select><Input aria-label={t("inv.qty")} type="number" min={1} className="w-24" value={l.quantity} onChange={(e) => setLines(lines.map((x, k) => k === i ? { ...x, quantity: e.target.value } : x))} /><Button type="button" variant="ghost" onClick={() => setLines(lines.filter((_, k) => k !== i))}>✕</Button></div>)}
      <Button type="button" variant="outline" size="sm" onClick={() => setLines([...lines, { lotId: "", quantity: "1" }])}>{t("rx.addDrug")}</Button><ErrorNote error={create.error} /><div><Button type="submit" disabled={create.isPending || !lines.length}>{t("common.save")}</Button></div></form></Modal>
    <Modal open={!!disp} onClose={() => setDisp(null)} title={t("inv.dispatch")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); dispatch.mutate(); }}><p className="text-sm text-muted-foreground">{t("inv.controlledWitness")}</p><WitnessFields w={w.w} setW={w.setW} /><ErrorNote error={dispatch.error} /><Button type="submit" disabled={dispatch.isPending}>{t("inv.dispatch")}</Button></form></Modal>
  </Card>;
}

interface Cold { lotId: string; brandName: string; brandNameAr: string | null; strength: string; lotNumber: string; expiryDate: string; qtyOnHand: number; status: string; lastReading: { temperatureC: string; excursion: boolean; recordedAt: string } | null; readings24h: number }
export function ColdChainTab() {
  const { t } = useTranslation(); const { branchId, can } = useAuth();
  const q = useQuery({ queryKey: ["cold", branchId], queryFn: () => api<Cold[]>("/inventory/cold-chain/lots", { query: { branchId } }), enabled: !!branchId });
  const [lot, setLot] = useState<Cold | null>(null); const [temp, setTemp] = useState("");
  const log = useAction(() => api(`/inventory/cold-chain/${lot!.lotId}/readings`, { body: { temperatureC: Number(temp) } }), ["cold", "lots", "stock"], { onDone: () => { setLot(null); setTemp(""); } });
  return <Card title={t("inv.tabCold")}>
    <Table head={[t("common.product"), t("inv.lot"), t("inv.qty"), t("inv.lastReading"), t("inv.readings24"), t("common.status"), ""]} numeric={[2, 4]} empty={!q.data?.length ? <Empty>{t("inv.coldEmpty")}</Empty> : null}>
      {q.data?.map((c) => <tr key={c.lotId} className={c.lastReading?.excursion ? "kx-row-bad" : undefined}><Td className="font-medium">{drugName(c)} <bdi className="text-xs text-muted-foreground">{c.strength}</bdi></Td><Td className="font-mono text-xs">{c.lotNumber}</Td><Td className="kx-num text-end">{c.qtyOnHand}</Td>
        <Td>{c.lastReading ? <span className="kx-num">{c.lastReading.temperatureC} °C <span className="text-xs text-muted-foreground">{fmtDateTime(c.lastReading.recordedAt)}</span></span> : <span className="text-muted-foreground">{t("inv.noReading")}</span>}</Td><Td className="kx-num text-end">{c.readings24h}</Td>
        <Td>{c.lastReading ? <Badge tone={c.lastReading.excursion || c.status === "QUARANTINE" ? "bad" : "good"}>{c.lastReading.excursion || c.status === "QUARANTINE" ? t("inv.excursion") : t("inv.inRange")}</Badge> : "—"}</Td><Td className="text-end">{can("inventory.receive") && <Button size="sm" variant="outline" onClick={() => setLot(c)}>{t("inv.logTemp")}</Button>}</Td></tr>)}</Table>
    <Modal open={!!lot} onClose={() => setLot(null)} title={t("inv.logTemp")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); log.mutate(); }}><Field label={t("inv.tempC")} hint={t("inv.tempHint")}>{(id) => <Input id={id} type="number" step="0.1" required value={temp} onChange={(e) => setTemp(e.target.value)} />}</Field><ErrorNote error={log.error} /><Button type="submit" disabled={log.isPending}>{t("common.save")}</Button></form></Modal>
  </Card>;
}

interface Movement { id: string; type: string; qtyDelta: number; reason: string | null; reasonCode: string | null; occurredAt: string; brandName: string; brandNameAr: string | null; strength: string; lotNumber: string; performedBy: string }
export function MovementsTab() {
  const { t } = useTranslation(); const { branchId } = useAuth();
  const [type, setType] = useState(""); const [code, setCode] = useState(""); const [s, setS] = useState("");
  const q = useQuery({ queryKey: ["movements", branchId, type, code, s], queryFn: () => api<{ total: number; items: Movement[] }>("/inventory/movements", { query: { branchId, type, reasonCode: code, q: s || undefined, pageSize: 100 } }), enabled: !!branchId });
  return <Card><div className="mb-3 flex flex-wrap items-end gap-3"><Field label={t("common.search")}>{(id) => <Input id={id} type="search" value={s} onChange={(e) => setS(e.target.value)} className="w-56" />}</Field>
    <Field label={t("inv.mvType")}>{(id) => <Select id={id} value={type} onChange={(e) => setType(e.target.value)}><option value="">{t("inv.allTypes")}</option>{["RECEIPT", "SALE", "DISPENSE", "RETURN_FROM_CUSTOMER", "RETURN_TO_SUPPLIER", "ADJUSTMENT", "EXPIRY_WRITE_OFF", "RECALL_WRITE_OFF", "TRANSFER_OUT", "TRANSFER_IN", "COUNT_VARIANCE"].map((x) => <option key={x} value={x}>{t(`inv.mt.${x}`)}</option>)}</Select>}</Field>
    <Field label={t("inv.reasonCode")}>{(id) => <Select id={id} value={code} onChange={(e) => setCode(e.target.value)}><option value="">{t("common.all")}</option>{["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"].map((x) => <option key={x} value={x}>{t(`inv.rc.${x}`)}</option>)}</Select>}</Field></div>
    <Table dense numeric={[3]} head={[t("common.date"), t("common.product"), t("inv.mvType"), t("inv.mvChange"), t("common.reason"), t("inv.mvBy")]} empty={!q.data?.items.length ? <Empty>{t("inv.mvEmpty")}</Empty> : null}>
      {q.data?.items.map((m) => <tr key={m.id}><Td className="whitespace-nowrap">{fmtDateTime(m.occurredAt)}</Td><Td className="font-medium">{drugName(m)} <span className="font-mono text-xs text-muted-foreground">{m.lotNumber}</span></Td><Td><Badge tone={m.qtyDelta < 0 ? "warn" : "good"}>{t(`inv.mt.${m.type}`)}</Badge>{m.reasonCode && <span className="ms-1 text-xs text-muted-foreground">{t(`inv.rc.${m.reasonCode}`)}</span>}</Td>
        <Td className={`kx-num text-end font-medium ${m.qtyDelta < 0 ? "text-[hsl(var(--danger-text))]" : ""}`}>{m.qtyDelta > 0 ? "+" : ""}{m.qtyDelta}</Td><Td className="max-w-xs truncate" title={m.reason ?? ""}>{m.reason ?? "—"}</Td><Td>{m.performedBy}</Td></tr>)}</Table></Card>;
}

export function AdjustModal({ lot, onClose }: { lot: Lot | null; onClose: () => void }) {
  const { t } = useTranslation();
  const [f, , bind, reset] = useForm({ quantity: "-1", reasonCode: "DAMAGE", reason: "" }); const w = useWitness();
  const controlled = !!lot && lot.drug.controlledSchedule !== "NONE";
  const run = useAction(() => api("/inventory/adjustments", { body: { lotId: lot!.id, quantity: Number(f.quantity), reasonCode: f.reasonCode, reason: f.reason, witness: w.value } }), ["lots", "stock", "movements", "ctl-register", "ctl-balances"], { onDone: () => { reset(); w.reset(); onClose(); } });
  return <Modal open={!!lot} onClose={onClose} title={t("inv.adjustTitle")}><form className="space-y-3" onSubmit={(e) => { e.preventDefault(); run.mutate(); }}>
    <p className="text-sm text-muted-foreground">{lot && <>{drugName(lot.drug)} · <span className="font-mono">{lot.lotNumber}</span> · {lot.qtyOnHand}</>}</p>
    <Field label={t("inv.adjustQty")}>{(id) => <Input id={id} type="number" required {...bind("quantity")} />}</Field>
    <Field label={t("inv.reasonCode")}>{(id) => <Select id={id} {...bind("reasonCode")}>{["DAMAGE", "THEFT", "LOSS", "FOUND", "COUNT_CORRECTION", "SAMPLE", "OTHER"].map((x) => <option key={x} value={x}>{t(`inv.rc.${x}`)}</option>)}</Select>}</Field>
    <Field label={t("common.reason")}>{(id) => <Input id={id} required minLength={3} {...bind("reason")} />}</Field>
    {controlled && <><p className="text-sm text-[hsl(var(--warning))]">{t("inv.controlledWitness")}</p><WitnessFields w={w.w} setW={w.setW} required /></>}
    <ErrorNote error={run.error} /><Button type="submit" disabled={run.isPending}>{t("common.confirm")}</Button></form></Modal>;
}
export const PrintLotLabel = (id: string) => void printHtml("/inventory/lots/labels.html", { ids: id, lang: document.documentElement.lang });
export { Printer };
