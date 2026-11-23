import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { Me } from "@/lib/types";
import { takeEndSessionUrl } from "@/lib/passport";
import { rememberSignInOrg } from "@/lib/sign-in-default";
import { useToast } from "@/lib/toast";
import { useTranslation } from "react-i18next";

interface AuthCtx {
  me: Me | null;
  loading: boolean;
  signedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Adopt a session issued after a Kiorex Passport sign-in. */
  adoptSession: (accessToken: string) => Promise<void>;
  logout: () => void;
  can: (perm: string) => boolean;
  flag: (key: string) => boolean;
  branchId: string | null;
  setBranchId: (id: string) => void;
}
const Ctx = createContext<AuthCtx | null>(null);
export const useAuth = (): AuthCtx => { const c = useContext(Ctx); if (!c) throw new Error("AuthProvider missing"); return c; };

const BRANCH_KEY = "kiorly.branch";
export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient(); const toast = useToast(); const { t } = useTranslation();
  const [token, setTok] = useState<string | null>(getToken());
  const [branch, setBranch] = useState<string | null>(() => { try { return localStorage.getItem(BRANCH_KEY); } catch { return null; } });
  // re-check every minute: a session Passport ended (back-channel logout) or a deactivated account leaves the app within a minute even when idle
  const meQ = useQuery({ queryKey: ["me", token], queryFn: () => api<Me>("/auth/me"), enabled: !!token, retry: false, staleTime: 60_000, refetchInterval: 60_000 });
  // the next visit to the login page asks the API for THIS organisation's default sign-in method
  const orgId = meQ.data?.tenant.id;
  useEffect(() => { rememberSignInOrg(orgId); }, [orgId]);
  useEffect(() => { const h = (e: Event) => { setTok(null); qc.clear(); takeEndSessionUrl(); if ((e as CustomEvent<{ code?: string }>).detail?.code === "SESSION_REVOKED") toast(t("errors.codes.SESSION_REVOKED")); }; window.addEventListener("kiorly:unauthorized", h); return () => window.removeEventListener("kiorly:unauthorized", h); }, [qc, toast, t]);
  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ accessToken: string }>("/auth/login", { body: { email, password } });
    setToken(r.accessToken); setTok(r.accessToken); await qc.invalidateQueries();
  }, [qc]);
  const adoptSession = useCallback(async (accessToken: string) => { setToken(accessToken); setTok(accessToken); await qc.invalidateQueries(); }, [qc]);
  const logout = useCallback(() => {
    setToken(null); setTok(null); qc.clear();
    // Passport-started session: end the Passport session too (RP-initiated logout with id_token_hint), otherwise "Sign in with Kiorex Passport" would silently sign the user back in
    const end = takeEndSessionUrl();
    if (end) window.location.assign(end);
  }, [qc]);
  const me = meQ.data ?? null;
  const branchId = useMemo(() => {
    if (!me) return null;
    if (me.user.branchId) return me.user.branchId;
    return me.branches.some((b) => b.id === branch) ? branch : me.branches[0]?.id ?? null;
  }, [me, branch]);
  const value: AuthCtx = {
    me, loading: !!token && meQ.isLoading, signedIn: !!token && !!me, login, adoptSession, logout,
    can: (p) => !!me?.permissions.includes(p), flag: (k) => me?.flags[k] ?? true, branchId,
    setBranchId: (id) => { setBranch(id); try { localStorage.setItem(BRANCH_KEY, id); } catch { /* ignore */ } void qc.invalidateQueries(); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
