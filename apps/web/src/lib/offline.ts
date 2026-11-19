/**
 * POS offline support (KPPOS01): IndexedDB holds (a) the catalogue bundle for lookups and (b) a queue of sales rung up offline.
 * Every queued sale carries its own idempotencyKey, so replaying the queue (POST /pos/sync) is safe. The server re-validates
 * lots/prices at sync time and turns anything unsatisfiable into a manager-resolved conflict (never a silent drop).
 */
export interface OfflineItem { id: string; brandName: string; brandNameAr: string | null; gtin: string | null; strength: string; dosageForm: string; available: number; price: string }
export interface QueuedSale { idempotencyKey: string; clientCreatedAt: string; lines: Array<{ drugId: string; quantity: number }>; payments: Array<{ method: string; amount: string }>; customerAccountId?: string; total: string; label: string }

const DB = "kiorly-pos";
function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => { const d = r.result; d.createObjectStore("queue", { keyPath: "idempotencyKey" }); d.createObjectStore("catalogue", { keyPath: "id" }); d.createObjectStore("meta"); };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    t.oncomplete = () => { db.close(); resolve(req ? (req.result as T) : undefined); };
    t.onerror = () => { db.close(); reject(t.error); };
  });
}

export const queueSale = (s: QueuedSale) => tx("queue", "readwrite", (st) => { st.put(s); });
export const listQueue = async (): Promise<QueuedSale[]> => ((await tx<QueuedSale[]>("queue", "readonly", (st) => st.getAll())) ?? []).sort((a, b) => a.clientCreatedAt.localeCompare(b.clientCreatedAt));
export const removeQueued = (key: string) => tx("queue", "readwrite", (st) => { st.delete(key); });
export async function saveCatalogue(items: OfflineItem[], generatedAt: string): Promise<void> {
  const db = await open();
  await new Promise<void>((resolve, reject) => {
    const t = db.transaction(["catalogue", "meta"], "readwrite");
    const c = t.objectStore("catalogue"); c.clear(); for (const i of items) c.put(i);
    t.objectStore("meta").put(generatedAt, "catalogueAt");
    t.oncomplete = () => { db.close(); resolve(); }; t.onerror = () => { db.close(); reject(t.error); };
  });
}
export const loadCatalogue = async (): Promise<OfflineItem[]> => (await tx<OfflineItem[]>("catalogue", "readonly", (s) => s.getAll())) ?? [];
export function searchOffline(items: OfflineItem[], q: string): OfflineItem[] {
  const s = q.trim().toLowerCase();
  if (!s) return items.slice(0, 40);
  return items.filter((i) => i.gtin === s || i.brandName.toLowerCase().includes(s) || (i.brandNameAr ?? "").includes(s)).slice(0, 40);
}

export function registerServiceWorker(): void {
  if ("serviceWorker" in navigator && import.meta.env.PROD) void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
}
