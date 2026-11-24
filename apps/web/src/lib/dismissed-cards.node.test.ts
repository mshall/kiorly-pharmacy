import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HOME_CARD, legacyKey, loadDismissed, setCardDismissed, type DismissedRemote, type KeyValueStore } from "./dismissed-cards";

const mem = (init: Record<string, string> = {}): KeyValueStore & { m: Map<string, string> } => { const m = new Map(Object.entries(init)); return { m, getItem: (k) => m.get(k) ?? null, setItem: (k, v) => void m.set(k, v), removeItem: (k) => void m.delete(k) }; };
const server = (keys: string[] = [], fail = false): DismissedRemote & { keys: string[] } => { const s = { keys, get: async () => { if (fail) throw new Error("down"); return s.keys; }, put: async (k: string[]) => { if (fail) throw new Error("down"); s.keys = k; return k; } }; return s; };

describe("dismissed cards (server first, browser fallback)", () => {
  it("returns the server list and leaves an empty browser alone", async () => {
    assert.deepEqual(await loadDismissed("u1", server([HOME_CARD]), mem()), [HOME_CARD]);
    assert.deepEqual(await loadDismissed("u1", server([]), mem()), []);
  });
  it("migrates a legacy localStorage dismissal to the server on first load, then clears it", async () => {
    const store = mem({ [legacyKey("u1")]: "1" }); const s = server([]);
    assert.deepEqual(await loadDismissed("u1", s, store), [HOME_CARD]);
    assert.deepEqual(s.keys, [HOME_CARD]); assert.equal(store.m.has(legacyKey("u1")), false);
  });
  it("falls back to the browser flag when the server is unreachable", async () => {
    assert.deepEqual(await loadDismissed("u1", server([], true), mem({ [legacyKey("u1")]: "1" })), [HOME_CARD]);
    assert.deepEqual(await loadDismissed("u1", server([], true), mem()), []);
  });
  it("dismiss and show write to the server; when it is down they use the browser", async () => {
    const s = server([]); assert.deepEqual(await setCardDismissed("u1", HOME_CARD, true, [], s, mem()), [HOME_CARD]); assert.deepEqual(s.keys, [HOME_CARD]);
    assert.deepEqual(await setCardDismissed("u1", HOME_CARD, false, [HOME_CARD], s, mem()), []);
    const store = mem(); assert.deepEqual(await setCardDismissed("u1", HOME_CARD, true, [], server([], true), store), [HOME_CARD]); assert.equal(store.m.get(legacyKey("u1")), "1");
    await setCardDismissed("u1", HOME_CARD, false, [HOME_CARD], server([], true), store); assert.equal(store.m.has(legacyKey("u1")), false);
  });
});
