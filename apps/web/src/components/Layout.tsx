import { usePageTitle } from "@/lib/page-title";
import { useQuery } from "@tanstack/react-query";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import "@/features/subscription/subscription-strings";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { setLang } from "@/lib/i18n";
import { Button, Select, cn } from "@/components/ui";
import { listQueue } from "@/lib/offline";
import { routeDeniedReason } from "@/lib/route-access";
import { api } from "@/lib/api";
import { SetupBar, SetupChecklist } from "@/setup/setup-core";
import { homeUrlFromEnv, LOCAL_HOME_URL, switchWorkspaceHref } from "@/lib/kiorly-home";
import { KiorlyBrandLockup, KxControlPair, LanguageToggle, ThemeToggle } from "@/brand/ui-kit";
import { BarChart3, Bell, BookLock, ScrollText, Landmark, Ticket, BookOpen, ShieldCheck, Boxes, Inbox, LayoutDashboard, Link2, Megaphone, PackagePlus, Pill, Settings, ShoppingCart, Truck, Users, type LucideIcon } from "lucide-react";

interface NavItem { to: string; label: string; perm?: string; flag?: string; icon: LucideIcon; group: "" | "counter" | "clinical" | "stock" | "money" | "admin" }

export function useOnline(): boolean {
  const [on, setOn] = useState(navigator.onLine);
  useEffect(() => {
    const a = () => setOn(true), b = () => setOn(false);
    window.addEventListener("online", a); window.addEventListener("offline", b);
    return () => { window.removeEventListener("online", a); window.removeEventListener("offline", b); };
  }, []);
  return on;
}

export function Layout() {
  const { t } = useTranslation();
  usePageTitle(t("app.docTitle"));
  const { me, can, flag, logout, branchId, setBranchId } = useAuth();
  const switchHref = switchWorkspaceHref(homeUrlFromEnv({ VITE_KIORLY_HOME_URL: import.meta.env.VITE_KIORLY_HOME_URL as string | undefined, DEV: import.meta.env.DEV, localDefault: import.meta.env.DEV ? LOCAL_HOME_URL : undefined }));
  const online = useOnline();
  const unreadQ = useQuery({ queryKey: ["alerts-count"], queryFn: () => api<{ unread: number; critical: number }>("/notifications/unread-count"), enabled: can("notifications.read"), refetchInterval: 60_000 });
  const queued = useQuery({ queryKey: ["offline-queue"], queryFn: () => listQueue().then((q) => q.length), refetchInterval: 5000 });
  const all: NavItem[] = [
    { to: "/", label: t("nav.dashboard"), icon: LayoutDashboard, group: "" },
    { to: "/pos", label: t("nav.pos"), perm: "pos.sell", icon: ShoppingCart, group: "counter" },
    { to: "/customers", label: t("nav.customers"), perm: "customer.read", icon: Users, group: "counter" },
    { to: "/orders", label: t("nav.orders"), perm: "orders.read", flag: "pharmacy.kiorex_orders", icon: Inbox, group: "counter" },
    { to: "/rx", label: t("nav.rx"), perm: "rx.read", icon: Pill, group: "clinical" },
    { to: "/controlled", label: t("nav.controlled"), perm: "controlled.read", icon: BookLock, group: "clinical" },
    { to: "/safety", label: t("nav.safety"), perm: "rx.read", icon: ShieldCheck, group: "clinical" },
    { to: "/catalogue", label: t("nav.catalogue"), perm: "catalogue.read", icon: BookOpen, group: "stock" },
    { to: "/inventory", label: t("nav.inventory"), perm: "inventory.read", icon: Boxes, group: "stock" },
    { to: "/receiving", label: t("nav.receiving"), perm: "inventory.receive", icon: PackagePlus, group: "stock" },
    { to: "/purchasing", label: t("nav.purchasing"), perm: "supplier.read", icon: Truck, group: "stock" },
    { to: "/finance", label: t("nav.finance"), perm: "finance.read", icon: Landmark, group: "money" },
    { to: "/promotions", label: t("nav.promotions"), perm: "promo.manage", icon: Ticket, group: "money" },
    { to: "/reports", label: t("nav.reports"), perm: "reports.read", icon: BarChart3, group: "money" },
    { to: "/notifications", label: t("nav.notifications"), perm: "notifications.read", icon: Bell, group: "admin" },
    { to: "/audit", label: t("nav.audit"), perm: "audit.read", icon: ScrollText, group: "admin" },
    { to: "/growth", label: t("nav.growth"), icon: Megaphone, group: "money" },
    { to: "/kiorex-connect", label: t("kiorexConnect.title", "Connect to Kiorex"), perm: "settings.write", icon: Link2, group: "admin" },
    { to: "/plan", label: t("sub.nav"), perm: "settings.read", icon: Landmark, group: "admin" },
    { to: "/settings", label: t("nav.settings"), perm: "settings.read", icon: Settings, group: "admin" },
  ];
  const { pathname } = useLocation();
  // Direct-URL guard: a route whose nav entry is hidden for this user must say so, not sit on a skeleton fed by a 403.
  const routeDenied = me ? routeDeniedReason(pathname, all, can, flag) : null;
  const items = all.filter((i) => (!i.perm || can(i.perm)) && (!i.flag || flag(i.flag)));
  const groups = ["", "counter", "clinical", "stock", "money", "admin"].map((g) => ({ g, items: items.filter((i) => i.group === g) })).filter((x) => x.items.length);

  return (
    <div className="min-h-screen md:flex">
      <a href="#main" className="skip-link">{t("common.skip")}</a>
      <nav aria-label={t("nav.main")} className="no-print border-b border-border bg-card md:sticky md:top-0 md:h-screen md:w-60 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-e">
        <div className="px-4 py-3 md:py-4"><KiorlyBrandLockup height={36} /></div>
        <div className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:gap-0 md:overflow-visible">
          {groups.map(({ g, items: gi }) => (
            <ul key={g || "root"} className="flex gap-1 md:mb-2 md:flex-col">
              {g && <li aria-hidden className="hidden px-3 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:block rtl:normal-case rtl:tracking-normal">{t(`nav.group${g[0]!.toUpperCase()}${g.slice(1)}`)}</li>}
              {gi.map((i) => (
                <li key={i.to}>
                  <NavLink to={i.to} end={i.to === "/"} className={({ isActive }) => cn("relative flex min-h-10 items-center gap-3 whitespace-nowrap rounded-lg px-3 text-sm text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground", isActive && "bg-accent font-semibold text-accent-foreground before:absolute before:inset-y-2 before:inset-s-0 before:w-[3px] before:rounded-full before:bg-primary")}>
                    <i.icon aria-hidden="true" className="size-[18px] shrink-0" />{i.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </nav>
      <div className="min-w-0 flex-1">
        <header className="no-print z-20 flex flex-wrap items-center justify-between gap-2 border-b border-border bg-card/90 px-4 py-2 backdrop-blur-sm md:sticky md:top-0">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            {me && me.branches.length > 1 && !me.user.branchId ? (
              <label className="flex items-center gap-2 text-sm">{t("common.branch")}
                <Select aria-label={t("common.branch")} value={branchId ?? ""} onChange={(e) => setBranchId(e.target.value)} className="w-44">{me.branches.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}</Select>
              </label>
            ) : <span className="text-sm text-muted-foreground">{me?.branches.find((b) => b.id === branchId)?.name}</span>}
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset", online ? "bg-[hsl(var(--success)/0.12)] text-[hsl(var(--success))] ring-[hsl(var(--success)/0.25)]" : "bg-[hsl(var(--danger-text)/0.12)] text-[hsl(var(--danger-text))] ring-[hsl(var(--danger-text)/0.28)]")} data-testid="online-status"><span aria-hidden className={cn("size-1.5 rounded-full", online ? "bg-[hsl(var(--success))]" : "bg-[hsl(var(--danger-text))]")} />{online ? t("common.online") : t("common.offline")}</span>
            {!!queued.data && <span className="rounded-full bg-[hsl(var(--warning)/0.18)] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--warning))]">{t("pos.queued", { count: queued.data })}</span>}
          </div>
          <div className="flex items-center gap-2">
            {can("notifications.read") && <Link to="/notifications" aria-label={`${t("nav.notifications")}${unreadQ.data?.unread ? ` (${unreadQ.data.unread})` : ""}`} className="relative inline-flex size-8 items-center justify-center rounded-lg border border-input text-muted-foreground hover:bg-muted hover:text-foreground"><Bell aria-hidden className="size-4" />{!!unreadQ.data?.unread && <span aria-hidden="true" className={cn("absolute -inset-e-1 -top-1 grid min-w-4 place-items-center rounded-full px-1 text-[10px] font-bold text-white", unreadQ.data.critical ? "bg-[hsl(0_74%_42%)]" : "bg-primary")}>{unreadQ.data.unread > 99 ? "99+" : unreadQ.data.unread}</span>}</Link>}
            <span className="hidden text-sm sm:inline">{me?.user.displayName} · {me ? t(`roles.${me.user.role}`) : ""}</span>
            <KxControlPair><ThemeToggle labels={{ theme: t("theme.label"), light: t("theme.light"), dark: t("theme.dark"), system: t("theme.system") }} /><LanguageToggle onChange={setLang} /></KxControlPair>
            {switchHref ? <a href={switchHref} data-testid="switch-workspace" className="inline-flex h-8 items-center rounded-lg px-2 text-sm font-medium text-primary underline-offset-4 hover:underline">{t("auth.switchWorkspace")}</a> : null}
            <Button variant="outline" size="sm" onClick={logout}>{t("auth.logout")}</Button>
          </div>
        </header>
        <main id="main" tabIndex={-1} className="p-4 md:p-6">
          <SetupBar onEntity={setBranchId} />
          {pathname === "/" && !routeDenied ? <SetupChecklist /> : null}
          {routeDenied ? (
            <div role="alert" data-testid="route-denied" className="mx-auto mt-16 max-w-md space-y-3 text-center">
              <h1 className="text-xl font-semibold">{routeDenied === "flag" ? t("common.featureOffTitle") : t("common.noAccessTitle")}</h1>
              <p className="text-sm text-muted-foreground">{routeDenied === "flag" ? t("common.featureOffBody") : t("common.noAccessBody")}</p>
              <Link to="/" className="inline-block text-sm font-medium text-primary underline-offset-2 hover:underline">{t("nav.dashboard")}</Link>
            </div>
          ) : <Outlet />}
        </main>
      </div>
    </div>
  );
}
