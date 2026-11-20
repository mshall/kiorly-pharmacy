import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, type ReactNode } from "react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ToastProvider } from "@/lib/toast";
import { Layout } from "@/components/Layout";
import { Spinner } from "@/components/ui";
import { registerServiceWorker } from "@/lib/offline";
import { Login, Signup } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Catalogue } from "@/pages/Catalogue";
import { Inventory } from "@/pages/Inventory";
import { Receiving } from "@/pages/Receiving";
import { RxQueue } from "@/pages/RxQueue";
import { DispensingPage, RxDetail } from "@/pages/RxDetail";
import { Pos } from "@/pages/Pos";
import { Purchasing } from "@/pages/Purchasing";
import { Orders } from "@/pages/Orders";
import { Reports } from "@/pages/Reports";
import { Settings } from "@/pages/Settings";
import { Onboarding } from "@/pages/Onboarding";
import { Customers } from "@/pages/Customers";
import { Controlled } from "@/pages/Controlled";
import { Safety } from "@/pages/Safety";
import { Promotions } from "@/pages/Promotions";
import { Finance } from "@/pages/Finance";

const qc = new QueryClient({ /** networkMode "always": the till must keep running (and queue sales) while offline; react-query would otherwise pause mutations. */
  defaultOptions: { queries: { retry: false, refetchOnWindowFocus: false, staleTime: 15_000, networkMode: "always" }, mutations: { networkMode: "always" } } });

function Guard({ children }: { children: ReactNode }) {
  const { signedIn, loading, me } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center"><Spinner /></div>;
  if (!signedIn) return <Navigate to="/login" replace />;
  if (me && !me.tenant.onboarded && me.permissions.includes("settings.write")) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

/** Touch-first POS PWA + back-office. Routes are permission/flag aware (the API enforces; the UI only avoids dead ends). */
export function App() {
  useEffect(() => { registerServiceWorker(); }, []);
  return (
    <QueryClientProvider client={qc}>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route element={<Guard><Layout /></Guard>}>
                <Route index element={<Dashboard />} />
                <Route path="pos" element={<Pos />} />
                <Route path="rx" element={<RxQueue />} />
                <Route path="rx/:id" element={<RxDetail />} />
                <Route path="dispensing/:id" element={<DispensingPage />} />
                <Route path="customers" element={<Customers />} />
                <Route path="controlled" element={<Controlled />} />
                <Route path="promotions" element={<Promotions />} />
                <Route path="finance" element={<Finance />} />
                <Route path="safety" element={<Safety />} />
                <Route path="orders" element={<Orders />} />
                <Route path="catalogue" element={<Catalogue />} />
                <Route path="inventory" element={<Inventory />} />
                <Route path="receiving" element={<Receiving />} />
                <Route path="purchasing" element={<Purchasing />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
