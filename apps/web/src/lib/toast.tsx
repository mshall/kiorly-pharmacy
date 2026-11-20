import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

interface Toast { id: number; text: string; tone: "ok" | "err" }
const Ctx = createContext<(text: string, tone?: "ok" | "err") => void>(() => undefined);
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setItems((x) => [...x, { id, text, tone }]);
    setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 4500);
  }, []);
  return (
    <Ctx.Provider value={push}>
      {children}
      <div role="status" aria-live="polite" className="pointer-events-none fixed bottom-4 inset-e-4 z-50 flex flex-col gap-2">
        {items.map((i) => <div key={i.id} className={`pointer-events-auto rounded-md px-4 py-3 text-sm shadow-lg ${i.tone === "ok" ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}`}>{i.text}</div>)}
      </div>
    </Ctx.Provider>
  );
}
