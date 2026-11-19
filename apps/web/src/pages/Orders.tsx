import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Badge, Button, Card, Empty, ErrorNote, Field, Input, Modal, PageHeader, Spinner, type Tone } from "@/components/ui";
import { drugName, fmtMoney } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Order } from "@/lib/types";

const TONE: Record<string, Tone> = { RECEIVED: "warn", ACCEPTED: "info", PARTIALLY_ACCEPTED: "info", READY: "good", DISPENSED: "neutral", REJECTED: "bad", CANCELLED: "bad", EXPIRED: "bad" };

function Countdown({ order }: { order: Order }) {
  const { t } = useTranslation();
  const [left, setLeft] = useState(order.slaRemainingSeconds ?? 0);
  useEffect(() => { setLeft(order.slaRemainingSeconds ?? 0); const id = setInterval(() => setLeft((x) => x - 1), 1000); return () => clearInterval(id); }, [order.slaRemainingSeconds]);
  if (order.status !== "RECEIVED") return null;
  const m = Math.floor(Math.abs(left) / 60), s = Math.abs(left) % 60;
  return <span role="timer" aria-label={t("ord.sla")} className={left < 0 ? "font-bold text-danger" : left < 120 ? "font-bold text-[hsl(var(--warning))]" : "font-medium"}>{left < 0 ? "−" : ""}{m}:{String(s).padStart(2, "0")}</span>;
}

/** KPMKT02-04: Kiorex order inbox with SLA timer. Hidden (nav + API 403) when pharmacy.kiorex_orders is OFF. */
export function Orders() {
  const { t } = useTranslation();
  const { can } = useAuth();
  const qc = useQueryClient(); const toast = useToast();
  const res = useQuery({ queryKey: ["orders"], queryFn: () => api<Order[]>("/kiorex-orders"), refetchInterval: 15_000 });
  const [rej, setRej] = useState<Order | null>(null); const [reason, setReason] = useState("");
  const refresh = () => void qc.invalidateQueries({ queryKey: ["orders"] });
  const act = useMutation({ mutationFn: (v: { id: string; kind: "accept" | "ready" }) => api(`/kiorex-orders/${v.id}/${v.kind}`, { body: {} }), onSuccess: () => { toast(t("common.saved")); refresh(); } });
  const reject = useMutation({ mutationFn: () => api(`/kiorex-orders/${rej!.id}/reject`, { body: { reason, reasonCode: "PHARMACY_REJECTED" } }), onSuccess: () => { setRej(null); setReason(""); refresh(); } });
  if (res.error instanceof ApiError && res.error.featureDisabled) return <Card><p>{t("errors.featureDisabled", { key: "pharmacy.kiorex_orders" })}</p></Card>;
  return (
    <>
      <PageHeader title={t("ord.title")} subtitle={t("ord.subtitle")} />
      <ErrorNote error={res.error || act.error} />
      {res.isLoading ? <Spinner /> : !res.data?.length ? <Empty>{t("ord.empty")}</Empty> : (
        <div className="grid gap-4 lg:grid-cols-2">
          {res.data.map((o) => (
            <Card key={o.id} title={<span className="flex items-center gap-2">#{o.externalOrderId} <Badge tone={TONE[o.status] ?? "neutral"}>{t(`ordStatus.${o.status}`)}</Badge>{o.hasRx && <Badge tone="info">Rx</Badge>}</span>} actions={<Countdown order={o} />}>
              <p className="text-sm text-muted-foreground">{o.customerName} · {fmtMoney(o.orderValue)}</p>
              <ul className="my-2 text-sm">{o.lines.map((l) => <li key={l.id}>{l.qtyRequested}× {drugName(l.drug)} {l.qtyAccepted > 0 && l.qtyAccepted !== l.qtyRequested && <Badge tone="warn">{t("ord.partial", { count: l.qtyAccepted })}</Badge>}</li>)}</ul>
              {o.hasRx && o.status === "RECEIVED" && <p className="mb-2 rounded-md bg-accent p-2 text-sm">{t("ord.rxFirst")} {o.prescriptionId && <Link className="underline" to={`/rx/${o.prescriptionId}`}>{t("ord.openRx")}</Link>}</p>}
              {can("orders.respond") && (
                <div className="flex flex-wrap gap-2">
                  {o.status === "RECEIVED" && <><Button onClick={() => act.mutate({ id: o.id, kind: "accept" })}>{t("ord.accept")}</Button><Button variant="danger" onClick={() => setRej(o)}>{t("ord.reject")}</Button></>}
                  {["ACCEPTED", "PARTIALLY_ACCEPTED", "READY"].includes(o.status) && <>{o.dispensingId && <Link className="inline-flex min-h-10 items-center rounded-md border border-border bg-card px-4 text-sm font-medium hover:bg-accent" to={`/dispensing/${o.dispensingId}`}>{t("ord.openDispensing")}</Link>}{o.status !== "READY" && <Button onClick={() => act.mutate({ id: o.id, kind: "ready" })}>{t("ord.ready")}</Button>}<Button variant="danger" onClick={() => setRej(o)}>{t("ord.reject")}</Button></>}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
      <Modal open={!!rej} onClose={() => setRej(null)} title={t("ord.reject")}>
        <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); reject.mutate(); }}><Field label={t("common.reason")}>{(id) => <Input id={id} required minLength={3} value={reason} onChange={(e) => setReason(e.target.value)} />}</Field><ErrorNote error={reject.error} /><Button type="submit" variant="danger">{t("ord.reject")}</Button></form>
      </Modal>
    </>
  );
}
