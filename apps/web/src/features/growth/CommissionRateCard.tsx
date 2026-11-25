import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { api, ApiError } from "@/lib/api";
import { Badge, Card, Spinner } from "@/components/ui";

type Spec = { feeType: "PERCENT" | "FLAT"; percentBps: number | null; flatMinor: number | null; minMinor: number | null; maxMinor: number | null; mode: string | null };
type Eff = { state: "SET" | "NOT_SET"; source: "OVERRIDE" | "DEFAULT" | null; version: number | null; reason: string | null; spec: Spec | null };
type Hist = { version: number; scope: "DEFAULT" | "ORG"; kind: "RATE" | "INHERIT"; effectiveFrom: string; reason: string | null; spec: Spec | null };
interface RateView { known: boolean; state: "SET" | "NOT_SET"; effective: Eff; default: Eff; override: Eff | null; inheriting: boolean; upcoming: Hist | null; history: Hist[] }

function RateText({ spec }: { spec: Spec | null }) {
  const { t, i18n } = useTranslation();
  if (!spec) return <span data-testid="rate-not-set"><Badge tone="warn">{t("growth.rate.notSet")}</Badge></span>;
  const money = (n: number) => new Intl.NumberFormat(i18n.language, { style: "currency", currency: "EGP" }).format(n / 100);
  const base = spec.feeType === "PERCENT" ? t("growth.rate.percentOf", { pct: new Intl.NumberFormat(i18n.language, { style: "percent", maximumFractionDigits: 2 }).format((spec.percentBps ?? 0) / 10_000) }) : t("growth.rate.flatPer", { amount: money(spec.flatMinor ?? 0) });
  const bounds = [spec.minMinor != null ? `${t("growth.rate.min")} ${money(spec.minMinor)}` : null, spec.maxMinor != null ? `${t("growth.rate.max")} ${money(spec.maxMinor)}` : null].filter(Boolean).join(", ");
  return <span>{base}{bounds ? ` (${bounds})` : ""}</span>;
}

/** COM-2: the pharmacy's Kiorex commission rate, read only (Kiorex sets it). Shown to the roles that may see it; others get one line saying so. */
export function CommissionRateCard() {
  const { t } = useTranslation();
  const q = useQuery({ queryKey: ["growth", "commission-rate"], queryFn: () => api<RateView>("/growth/commission-rate"), retry: false });
  const forbidden = q.error instanceof ApiError && q.error.status === 403;
  return (
    <Card title={t("growth.statementTitle")}>
      <div data-testid="growth-statement" className="min-w-0">
        {q.isLoading && <Spinner />}
        {forbidden && <p className="text-sm text-muted-foreground" data-testid="growth-rate-role">{t("growth.rate.roleOnly")}</p>}
        {q.data && (
          <div className="space-y-3" data-testid="growth-rate">
            <p className="text-sm text-muted-foreground">{t("growth.rate.hint")}</p>
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
