/** Dependency-free SVG/CSS charts drawn with the brand ramps (indigo -> ocean). Every chart has a text equivalent (the report table below it). */
import type { ReactNode } from "react";
import { cn } from "@/components/ui";

/** Brand categorical ramp: indigo 700 -> ocean 600 -> indigo 400 -> ocean 400. */
export const RAMP = ["var(--kx-indigo-800)", "var(--kx-ocean-700)", "var(--kx-indigo-500)", "var(--kx-ocean-500)", "var(--kx-indigo-300)", "var(--kx-ocean-300)"];

export function ChartCard({ title, subtitle, legend, children, className }: { title: ReactNode; subtitle?: ReactNode; legend?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={cn("rounded-xl border border-border/80 bg-card p-5 shadow-[var(--kx-shadow-1)]", className)}>
      <figcaption className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div><div className="text-sm font-semibold">{title}</div>{subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}</div>
        {legend && <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">{legend}</div>}
      </figcaption>
      {children}
    </figure>
  );
}
export const LegendDot = ({ color, children }: { color: string; children: ReactNode }) => <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-sm" style={{ background: color }} />{children}</span>;

/** Vertical bars (time series). Axis labels thin out automatically; values read via title tooltips. */
export function Columns({ data, format, ariaLabel, height = 180 }: { data: Array<{ label: string; value: number }>; format: (n: number) => string; ariaLabel: string; height?: number }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const every = Math.ceil(data.length / 8);
  return (
    <div role="img" aria-label={ariaLabel} className="relative">
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col justify-between text-[10px] text-muted-foreground" style={{ height }}>
        {[1, 0.5, 0].map((f) => <div key={f} className="flex items-center gap-2"><span className="kx-num w-12 shrink-0 text-end">{format(max * f)}</span><span className="h-px flex-1 bg-border/70" /></div>)}
      </div>
      <div className="flex items-end gap-1 ps-14" style={{ height }} dir="ltr">
        {data.map((d, i) => (
          <div key={i} className="group relative flex h-full flex-1 items-end" title={`${d.label}: ${format(d.value)}`}>
            <div className="kx-bar w-full rounded-t-md bg-gradient-to-t from-[var(--kx-indigo-800)] to-[var(--kx-ocean-600)] opacity-90 transition-opacity group-hover:opacity-100" style={{ height: `${Math.max(2, (d.value / max) * 100)}%`, animationDelay: `${Math.min(i * 12, 240)}ms` }} />
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-1 ps-14 text-[10px] text-muted-foreground" dir="ltr">{data.map((d, i) => <div key={i} className="flex-1 text-center">{i % every === 0 ? d.label : ""}</div>)}</div>
    </div>
  );
}

/** Ranked horizontal bars with the value on the end; optional second marker (e.g. credit limit). */
export function HBars({ rows, format, ariaLabel, marker }: { rows: Array<{ label: string; value: number; sub?: string; tone?: "bad" | "warn"; marker?: number }>; format: (n: number) => string; ariaLabel: string; marker?: string }) {
  const max = Math.max(1, ...rows.map((r) => Math.max(r.value, r.marker ?? 0)));
  return (
    <ul role="img" aria-label={ariaLabel} className="space-y-2.5">
      {rows.map((r, i) => (
        <li key={i} className="grid grid-cols-[minmax(0,10rem)_1fr_auto] items-center gap-3 text-sm max-sm:grid-cols-[minmax(0,7rem)_1fr_auto]">
          <span className="truncate" title={r.label}>{r.label}{r.sub && <span className="ms-1 text-xs text-muted-foreground">{r.sub}</span>}</span>
          <span className="relative h-3 rounded-full bg-muted/70" dir="ltr">
            <span className="kx-hbar absolute inset-y-0 start-0 rounded-full" style={{ width: `${Math.max(1.5, (r.value / max) * 100)}%`, background: r.tone === "bad" ? "hsl(var(--danger-text))" : r.tone === "warn" ? "hsl(var(--warning))" : `linear-gradient(90deg, var(--kx-indigo-800), var(--kx-ocean-600))`, animationDelay: `${i * 30}ms` }} />
            {r.marker !== undefined && <span aria-hidden className="absolute -inset-y-1 w-0.5 rounded bg-foreground/70" style={{ left: `${(r.marker / max) * 100}%` }} title={marker} />}
          </span>
          <span className="kx-num min-w-16 text-end font-medium">{format(r.value)}</span>
        </li>
      ))}
    </ul>
  );
}

/** Stacked proportion bar with legend counts (e.g. expiry buckets). */
export function Stack({ parts, ariaLabel }: { parts: Array<{ label: string; value: number; color: string }>; ariaLabel: string }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;
  return (
    <div>
      <div role="img" aria-label={ariaLabel} className="flex h-4 overflow-hidden rounded-full bg-muted" dir="ltr">
        {parts.filter((p) => p.value > 0).map((p) => <span key={p.label} className="kx-hbar h-full" style={{ width: `${(p.value / total) * 100}%`, background: p.color }} title={`${p.label}: ${p.value}`} />)}
      </div>
      <ul className="mt-3 grid gap-2 sm:grid-cols-3">
        {parts.map((p) => <li key={p.label} className="flex items-center gap-2 text-sm"><span aria-hidden className="size-2.5 rounded-sm" style={{ background: p.color }} /><span className="text-muted-foreground">{p.label}</span><span className="kx-num ms-auto font-semibold">{p.value}</span></li>)}
      </ul>
    </div>
  );
}

/** Tiny line for price history. */
export function Sparkline({ values, label }: { values: number[]; label: string }) {
  if (values.length < 2) return null;
  const w = 120, h = 32, min = Math.min(...values), max = Math.max(...values), span = max - min || 1;
  const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - 3 - ((v - min) / span) * (h - 6)}`);
  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${w} ${h}`} className="h-8 w-28 overflow-visible" style={{ direction: "ltr" }}>
      <polyline points={pts.join(" ")} fill="none" stroke="var(--kx-ocean-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={pts[pts.length - 1]!.split(",")[0]} cy={pts[pts.length - 1]!.split(",")[1]} r="3" fill="var(--kx-coral-500)" />
    </svg>
  );
}
