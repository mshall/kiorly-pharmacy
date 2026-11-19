import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api, getToken, setToken } from "@/lib/api";
import type { Me } from "@/lib/types";

interface AuthCtx {
  me: Me | null;
  loading: boolean;
  signedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
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
  const qc = useQueryClient();
  const [token, setTok] = useState<string | null>(getToken());
  const [branch, setBranch] = useState<string | null>(() => { try { return localStorage.getItem(BRANCH_KEY); } catch { return null; } });
  const meQ = useQuery({ queryKey: ["me", token], queryFn: () => api<Me>("/auth/me"), enabled: !!token, retry: false, staleTime: 60_000 });
  useEffect(() => { const h = () => { setTok(null); qc.clear(); }; window.addEventListener("kiorly:unauthorized", h); return () => window.removeEventListener("kiorly:unauthorized", h); }, [qc]);
  const login = useCallback(async (email: string, password: string) => {
    const r = await api<{ accessToken: string }>("/auth/login", { body: { email, password } });
    setToken(r.accessToken); setTok(r.accessToken); await qc.invalidateQueries();
  }, [qc]);
  const logout = useCallback(() => { setToken(null); setTok(null); qc.clear(); }, [qc]);
  const me = meQ.data ?? null;
  const branchId = useMemo(() => {
    if (!me) return null;
    if (me.user.branchId) return me.user.branchId;
    return me.branches.some((b) => b.id === branch) ? branch : me.branches[0]?.id ?? null;
  }, [me, branch]);
  const value: AuthCtx = {
    me, loading: !!token && meQ.isLoading, signedIn: !!token && !!me, login, logout,
    can: (p) => !!me?.permissions.includes(p), flag: (k) => me?.flags[k] ?? true, branchId,
    setBranchId: (id) => { setBranch(id); try { localStorage.setItem(BRANCH_KEY, id); } catch { /* ignore */ } void qc.invalidateQueries(); },
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
