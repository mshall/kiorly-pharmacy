import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { setLang, type Lang } from "@/lib/i18n";

type Cap = [string, string];

function useApiStatus(): "checking" | "ok" | "down" {
  const [s, setS] = useState<"checking" | "ok" | "down">("checking");
  useEffect(() => {
    let alive = true;
    fetch("/api/v1/health/live")
      .then((r) => alive && setS(r.ok ? "ok" : "down"))
      .catch(() => alive && setS("down"));
    return () => {
      alive = false;
    };
  }, []);
  return s;
}

/** Single "coming soon / product overview" page (skeleton phase). */
export function App() {
  const { t, i18n } = useTranslation();
  const api = useApiStatus();
  const caps = t("app.caps", { returnObjects: true }) as Cap[];
  const steps = t("app.steps", { returnObjects: true }) as string[];
  const next: Lang = i18n.language === "ar" ? "en" : "ar";

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" className="h-9 w-9" />
          <span className="text-lg font-semibold">{t("app.product")}</span>
        </div>
        <button
          type="button"
          onClick={() => setLang(next)}
          className="rounded-md border border-border bg-card px-3 py-1.5 text-sm hover:bg-accent"
        >
          {t("app.lang")}
        </button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        <section className="rounded-lg bg-card p-8 shadow-sm ring-1 ring-border">
          <span className="inline-block rounded-full bg-pulse/15 px-3 py-1 text-xs font-semibold text-pulse">{t("app.comingSoon")}</span>
          <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl">{t("app.headline")}</h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">{t("app.lede")}</p>
          <p className="mt-5 text-sm text-muted-foreground" data-testid="api-status">
            {t("app.status")}: <span className={api === "ok" ? "font-medium text-primary" : "font-medium"}>{api === "ok" ? t("app.statusOk") : api === "down" ? t("app.statusDown") : "…"}</span>
          </p>
        </section>

        <h2 className="mb-4 mt-10 text-xl font-semibold">{t("app.overview")}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caps.map(([title, body]) => (
            <article key={title} className="rounded-lg bg-card p-5 ring-1 ring-border">
              <h3 className="font-semibold text-accent-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </article>
          ))}
        </div>

        <section className="mt-8 rounded-lg border-s-4 border-pulse bg-accent p-5">
          <h2 className="font-semibold">{t("app.safetyTitle")}</h2>
          <p className="mt-1 text-sm text-accent-foreground">{t("app.safety")}</p>
        </section>

        <h2 className="mb-3 mt-10 text-xl font-semibold">{t("app.timeline")}</h2>
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </main>

      <footer className="mx-auto max-w-5xl px-6 pb-8 text-xs text-muted-foreground">{t("app.footer")}</footer>
    </div>
  );
}
