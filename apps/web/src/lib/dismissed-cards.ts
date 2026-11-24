/**
 * Per-user dismissed home cards: stored on the server (GET/PUT /me/preferences/dismissed-cards). The browser is only a fallback when the
 * server cannot be reached, and a dismissal kept in this browser by an older version is migrated to the server on the first load.
 */
export const HOME_CARD = "kiorex-home";
export interface KeyValueStore { getItem(k: string): string | null; setItem(k: string, v: string): void; removeItem(k: string): void }
export interface DismissedRemote { get(): Promise<string[]>; put(keys: string[]): Promise<string[]> }
export const legacyKey = (userId: string) => `kiorex.homeCard.dismissed.${userId}`;
const safe = <T>(f: () => T, d: T): T => { try { return f(); } catch { return d; } };

/** Reads the server list; moves a legacy browser dismissal up once and clears it. Falls back to the browser flag when the server is unreachable. */
export async function loadDismissed(userId: string, remote: DismissedRemote, store: KeyValueStore | null): Promise<string[]> {
  const local = safe(() => store?.getItem(legacyKey(userId)) === "1", false);
  try {
    let keys = await remote.get();
    if (local) {
      if (!keys.includes(HOME_CARD)) keys = await remote.put([...keys, HOME_CARD]);
      safe(() => store?.removeItem(legacyKey(userId)), undefined);
    }
    return keys;
  } catch { return local ? [HOME_CARD] : []; }
}

export async function setCardDismissed(userId: string, key: string, on: boolean, current: string[], remote: DismissedRemote, store: KeyValueStore | null): Promise<string[]> {
  const next = on ? [...new Set([...current, key])] : current.filter((k) => k !== key);
  try { const saved = await remote.put(next); safe(() => store?.removeItem(legacyKey(userId)), undefined); return saved; }
  catch { // server unreachable: remember it in this browser so the card still behaves
    safe(() => { if (key === HOME_CARD) { if (on) store?.setItem(legacyKey(userId), "1"); else store?.removeItem(legacyKey(userId)); } }, undefined);
    return next;
  }
}
