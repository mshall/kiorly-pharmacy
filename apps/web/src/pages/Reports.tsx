import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { Button, Card, Empty, ErrorNote, Field, Input, PageHeader, Select, Spinner, Table, Td } from "@/components/ui";
import { download } from "@/lib/print";
import { todayIso } from "@/lib/format";
import { useToast } from "@/lib/toast";
import type { Report } from "@/lib/types";

const NAMES = ["sales-daily", "top-sellers", "stock-valuation", "expiry", "controlled-register", "supplier-balances", "vat-lines", "dispensing-log"] as const;

/** Reports + CSV/PDF export for the pharmacy's accountant. VAT lines are a data export only: Kiorly never submits anything to a tax authority. */
export function Reports() {
  const { t } = useTranslation();
  const { branchId, can } = useAuth();
  const toast = useToast();
  const [name, setName] = useState<(typeof NAMES)[number]>("sales-daily");
  const [from, setFrom] = useState(new Date(Date.now() - 29 * 86_400_000).toISOString().slice(0, 10)); const [to, setTo] = useState(todayIso());
  const query = { branchId: branchId ?? undefined, from: `${from}T00:00:00.000Z`, to: `${to}T23:59:59.999Z` };
  const res = useQuery({ queryKey: ["report", name, from, to, branchId], queryFn: () => api<Report>(`/reports/${name}`, { query }) });
  const names = NAMES.filter((n) => n !== "controlled-register" || can("controlled.read"));
  const exp = (format: "csv" | "pdf") => download(`/reports/${name}`, `${name}.${format}`, { ...query, format }).catch(() => toast(t("errors.network"), "err"));
  return (
    <>
      <PageHeader title={t("rep.title")} />
      <Card>
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <Field label={t("rep.report")}>{(id) => <Select id={id} value={name} onChange={(e) => setName(e.target.value as (typeof NAMES)[number])}>{names.map((n) => <option key={n} value={n}>{t(`rep.names.${n}`)}</option>)}</Select>}</Field>
          <Field label={t("rep.from")}>{(id) => <Input id={id} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />}</Field>
          <Field label={t("rep.to")}>{(id) => <Input id={id} type="date" value={to} onChange={(e) => setTo(e.target.value)} />}</Field>
          <Button variant="outline" onClick={() => void exp("csv")}>{t("rep.csv")}</Button><Button variant="outline" onClick={() => void exp("pdf")}>{t("rep.pdf")}</Button>
        </div>
        <ErrorNote error={res.error} />
        {res.isLoading ? <Spinner /> : res.data && (
          <>
            {res.data.note && <p className="mb-2 rounded-md bg-accent p-2 text-sm">{res.data.note}</p>}
            <Table head={res.data.columns.map((c) => c.label)} empty={!res.data.rows.length ? <Empty>{t("common.none")}</Empty> : null}>
              {res.data.rows.map((r, i) => <tr key={i}>{res.data.columns.map((c) => <Td key={c.key}>{String(r[c.key] ?? "")}</Td>)}</tr>)}
            </Table>
          </>
        )}
        <p className="mt-3 text-xs text-muted-foreground">{t("rep.vatNote")}</p>
      </Card>
    </>
  );
}
