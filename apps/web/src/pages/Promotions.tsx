import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Ticket } from "lucide-react";
import { api, newKey } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useAction, useForm } from "@/lib/hooks";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Select, Table, Td, type Tone } from "@/components/ui";
import { DrugPicker } from "@/components/pickers";
import { StatCard, TableSkeleton } from "@/brand/ui-kit";
import { drugName, fmtDate, fmtMoney, fmtNum } from "@/lib/format";
import type { Drug } from "@/lib/types";

interface Promo { id: string; name: string; nameAr: string | null; kind: string; couponCode: string | null; drugIds: string[]; params: Record<string, unknown>; startsAt: string; endsAt: string | null; minSubtotal: string | null; maxUses: number | null; usedCount: number; priority: number; stackable: boolean; active: boolean; state: string; totalDiscount: string }
const STATE_TONE: Record<string, Tone> = { LIVE: "good", SCHEDULED: "info", ENDED: "neutral", EXHAUSTED: "warn", OFF: "neutral" };
const KINDS = ["PERCENT_OFF", "AMOUNT_OFF", "BUY_X_GET_Y", "BUNDLE_PRICE"];
const describe = (p: Promo) => p.kind === "PERCENT_OFF" ? `${p.params.percent}%` : p.kind === "AMOUNT_OFF" ? fmtMoney(String(p.params.amount)) : p.kind === "BUY_X_GET_Y" ? `${p.params.buy}+${p.params.get}` : fmtMoney(String(p.params.price));

function PromoForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const blank = { name: "", nameAr: "", kind: "PERCENT_OFF", percent: "10", amount: "", buy: "2", get: "1", price: "", couponCode: "", startsAt: new Date().toISOString().slice(0, 10), endsAt: "", minSubtotal: "", maxUses: "", priority: "0", stackable: false };
  const [f, set, bind, reset] = useForm<typeof blank>(blank);
  const [drugs, setDrugs] = useState<Drug[]>([]); const [bundle, setBundle] = useState<Array<{ drug: Drug; qty: number; k: string }>>([]);
  const params = () => f.kind === "PERCENT_OFF" ? { percent: Number(f.percent) } : f.kind === "AMOUNT_OFF" ? { amount: f.amount } : f.kind === "BUY_X_GET_Y" ? { buy: Number(f.buy), get: Number(f.get) } : { items: bundle.map((b) => ({ drugId: b.drug.id, qty: b.qty })), price: f.price };
  const save = useAction(() => api("/pos/promotions", { body: { name: f.name, nameAr: f.nameAr || undefined, kind: f.kind, couponCode: f.couponCode || undefined, drugIds: f.kind === "BUNDLE_PRICE" ? bundle.map((b) => b.drug.id) : drugs.map((d) => d.id), params: params(), startsAt: new Date(f.startsAt).toISOString(), endsAt: f.endsAt ? new Date(`${f.endsAt}T23:59:59`).toISOString() : undefined, minSubtotal: f.minSubtotal || undefined, maxUses: f.maxUses ? Number(f.maxUses) : undefined, priority: Number(f.priority), stackable: f.stackable } }), ["promotions"], { onDone: () => { reset(); setDrugs([]); setBundle([]); onClose(); } });
  return (
    <Modal open={open} onClose={onClose} title={t("promo.new")} wide>
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={(e) => { e.preventDefault(); save.mutate(); }}>
        <Field label={t("promo.name")}>{(id) => <Input id={id} required minLength={2} {...bind("name")} />}</Field><Field label={t("promo.nameAr")}>{(id) => <Input id={id} {...bind("nameAr")} />}</Field>
        <Field label={t("promo.kindLabel")}>{(id) => <Select id={id} {...bind("kind")}>{KINDS.map((k) => <option key={k} value={k}>{t(`promo.kind.${k}`)}</option>)}</Select>}</Field>
        {f.kind === "PERCENT_OFF" && <Field label={t("promo.percent")}>{(id) => <Input id={id} type="number" min={1} max={100} required {...bind("percent")} />}</Field>}
        {f.kind === "AMOUNT_OFF" && <Field label={t("promo.amount")}>{(id) => <Input id={id} inputMode="decimal" required {...bind("amount")} />}</Field>}
        {f.kind === "BUY_X_GET_Y" && <div className="grid grid-cols-2 gap-3"><Field label={t("promo.buy")}>{(id) => <Input id={id} type="number" min={1} required {...bind("buy")} />}</Field><Field label={t("promo.get")}>{(id) => <Input id={id} type="number" min={1} required {...bind("get")} />}</Field></div>}
        {f.kind === "BUNDLE_PRICE" && <Field label={t("promo.bundlePrice")}>{(id) => <Input id={id} inputMode="decimal" required {...bind("price")} />}</Field>}
        <div className="sm:col-span-2 space-y-2"><span className="text-sm font-medium">{f.kind === "BUNDLE_PRICE" ? t("promo.bundleItems") : t("promo.products")}</span>
          <DrugPicker label={t("promo.addProduct")} filter={{ otc: "true" }} onPick={(d) => f.kind === "BUNDLE_PRICE" ? setBundle((b) => b.some((x) => x.drug.id === d.id) ? b : [...b, { drug: d, qty: 1, k: newKey() }]) : setDrugs((x) => x.some((y) => y.id === d.id) ? x : [...x, d])} />
          <div className="flex flex-wrap gap-2">{f.kind === "BUNDLE_PRICE" ? bundle.map((b) => <span key={b.k} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">{drugName(b.drug)} ×<input aria-label={t("inv.qty")} type="number" min={1} className="w-12 rounded border border-input bg-card px-1" value={b.qty} onChange={(e) => setBundle(bundle.map((x) => x.k === b.k ? { ...x, qty: Math.max(1, Number(e.target.value)) } : x))} /><button type="button" aria-label={t("common.remove")} onClick={() => setBundle(bundle.filter((x) => x.k !== b.k))}>✕</button></span>) : drugs.map((d) => <span key={d.id} className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-sm">{drugName(d)}<button type="button" aria-label={t("common.remove")} onClick={() => setDrugs(drugs.filter((x) => x.id !== d.id))}>✕</button></span>)}</div></div>
        <Field label={t("promo.coupon")}>{(id) => <Input id={id} dir="ltr" {...bind("couponCode")} />}</Field><Field label={t("promo.minSubtotal")}>{(id) => <Input id={id} inputMode="decimal" {...bind("minSubtotal")} />}</Field>
        <Field label={t("promo.starts")}>{(id) => <Input id={id} type="date" required {...bind("startsAt")} />}</Field><Field label={t("promo.ends")}>{(id) => <Input id={id} type="date" {...bind("endsAt")} />}</Field>
        <Field label={t("promo.maxUses")}>{(id) => <Input id={id} type="number" min={1} {...bind("maxUses")} />}</Field><Field label={t("promo.priority")}>{(id) => <Input id={id} type="number" {...bind("priority")} />}</Field>
        <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" checked={f.stackable} onChange={(e) => set({ stackable: e.target.checked })} />{t("promo.stackable")}</label>
        <div className="sm:col-span-2"><ErrorNote error={save.error} /><Button type="submit" disabled={save.isPending}>{t("common.save")}</Button></div>
      </form>
    </Modal>
  );
}

export function Promotions() {
  const { t } = useTranslation(); const { can } = useAuth(); const [open, setOpen] = useState(false);
  const q = useQuery({ queryKey: ["promotions"], queryFn: () => api<Promo[]>("/pos/promotions") });
  const toggle = useAction((p: Promo) => api(`/pos/promotions/${p.id}`, { method: "PATCH", body: { active: !p.active } }), ["promotions"]);
  const live = q.data?.filter((p) => p.state === "LIVE").length ?? 0;
  return (<>
    <PageHeader title={t("promo.title")} subtitle={t("promo.subtitle")} actions={can("promo.manage") && <Button onClick={() => setOpen(true)}><Plus aria-hidden className="size-4" />{t("promo.new")}</Button>} />
    <div className="mb-4 grid gap-4 sm:grid-cols-3"><StatCard label={t("promo.state.LIVE")} value={fmtNum(live)} tone="good" icon={<Ticket aria-hidden className="size-4" />} /><StatCard label={t("promo.used")} value={fmtNum(q.data?.reduce((a, p) => a + p.usedCount, 0) ?? 0)} /><StatCard label={t("promo.given")} value={fmtMoney(q.data?.reduce((a, p) => a + Number(p.totalDiscount), 0) ?? 0)} tone="brand" /></div>
    <Card className="p-0">{q.isLoading ? <TableSkeleton rows={5} cols={6} /> : <Table head={[t("promo.name"), t("promo.kindLabel"), t("promo.coupon"), t("common.date"), t("promo.used"), t("promo.given"), t("common.status"), ""]} numeric={[4, 5]} empty={!q.data?.length ? <Empty hint={t("promo.emptyHint")}>{t("promo.empty")}</Empty> : null}>
      {q.data?.map((p) => <tr key={p.id}><Td className="font-medium">{p.name}</Td><Td>{t(`promo.kind.${p.kind}`)} <span className="text-muted-foreground">({describe(p)})</span></Td><Td className="font-mono text-xs" dir="ltr">{p.couponCode ?? "—"}</Td><Td className="whitespace-nowrap text-xs">{fmtDate(p.startsAt)} → {p.endsAt ? fmtDate(p.endsAt) : "∞"}</Td><Td className="kx-num text-end">{p.usedCount}{p.maxUses ? `/${p.maxUses}` : ""}</Td><Td className="kx-num text-end">{fmtMoney(p.totalDiscount)}</Td><Td><Badge tone={STATE_TONE[p.state] ?? "neutral"}>{t(`promo.state.${p.state}`)}</Badge></Td>
        <Td className="text-end">{can("promo.manage") && <Button size="sm" variant="outline" onClick={() => toggle.mutate(p)}>{p.active ? t("promo.turnOff") : t("promo.turnOn")}</Button>}</Td></tr>)}</Table>}</Card>
    <PromoForm open={open} onClose={() => setOpen(false)} />
  </>);
}
