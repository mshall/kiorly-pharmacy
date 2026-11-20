/** Directions parsing for the dose-range check. Pure; conservative: returns null when the sig cannot be understood (the check then skips, never guesses). */

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, half: 0.5, "½": 0.5, a: 1 };

/** "500 mg" -> 500, "0.5 mg" -> 0.5, "1 g" -> 1000, "250 mcg" -> 0.25. null for IU / % / ml etc. */
export function strengthToMg(strength: string | null | undefined): number | null {
  const m = /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|g)\b/i.exec((strength ?? "").replace(",", "."));
  if (!m) return null;
  const v = Number(m[1]);
  const u = m[2]!.toLowerCase();
  return u === "g" ? v * 1000 : u === "mg" ? v : v / 1000;
}

/** Doses per day from a sig: od/qd/daily, bid/twice, tid/3 times, qid/4 times, every N hours, N times daily. */
export function dosesPerDay(sig: string): number | null {
  const s = sig.toLowerCase();
  let m = /every\s*(\d+)\s*(?:h|hr|hrs|hour|hours)/.exec(s) ?? /q\s*(\d+)\s*h\b/.exec(s) ?? /كل\s*(\d+)\s*ساعات?/.exec(s);
  if (m) return Math.min(24 / Number(m[1]), 24);
  const NUM: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 };
  m = /(\d+|one|two|three|four|five|six)\s*(?:x|times?|مرات?)\b/.exec(s);
  if (m && /(day|daily|يوم)/.test(s)) return NUM[m[1]!] ?? Number(m[1]);
  if (/\b(qid|q\.i\.d)\b/.test(s)) return 4;
  if (/\b(tid|t\.i\.d)\b/.test(s)) return 3;
  if (/\b(bid|b\.i\.d)\b|twice|مرتين/.test(s)) return 2;
  if (/\b(od|qd|o\.d)\b|once|daily|every day|at night|nightly|at bedtime|morning|يومياً|مرة/.test(s)) return 1;
  return null;
}

/** Units (tablets/capsules) per dose: "2 tablets", "two tabs", "1/2 tablet", "1 cap". Defaults to 1 when a frequency exists but no count. */
export function unitsPerDose(sig: string): number {
  const s = sig.toLowerCase();
  const frac = /(\d+)\s*\/\s*(\d+)\s*(?:tab|cap|قرص)/.exec(s);
  if (frac) return Number(frac[1]) / Number(frac[2]);
  const n = /(\d+(?:\.\d+)?)\s*(?:tab|cap|pill|قرص|كبسول|حبة)/.exec(s);
  if (n) return Number(n[1]);
  const w = /\b(one|two|three|four|half|a)\s+(?:tab|cap|pill)/.exec(s);
  if (w) return WORDS[w[1]!]!;
  return 1;
}

export interface DailyDose { perDoseMg: number; dosesPerDay: number; dailyMg: number }
export function dailyDoseMg(sig: string | null | undefined, strength: string | null | undefined): DailyDose | null {
  if (!sig) return null;
  const mg = strengthToMg(strength);
  const n = dosesPerDay(sig);
  if (mg == null || n == null) return null;
  const perDoseMg = unitsPerDose(sig) * mg;
  return { perDoseMg, dosesPerDay: n, dailyMg: perDoseMg * n };
}
