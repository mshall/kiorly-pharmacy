export interface Gs1 { gtin?: string; expiry?: string; lot?: string; serial?: string }

const GS = "\u001d";

/**
 * Parses a GS1 element string for receiving (KPINV01): (01) GTIN-14, (17) expiry YYMMDD, (10) lot, (21) serial.
 * Accepts the human-readable "(01)...(17)...(10)..." form and the raw form (fixed-length AIs, lot ends at GS or end).
 * Expiry DD=00 means "last day of month" per GS1.
 */
export function parseGs1(code: string): Gs1 {
  const out: Gs1 = {};
  const s = code.trim();
  const take = (ai: string, value: string) => {
    if (ai === "01") out.gtin = value;
    else if (ai === "17") out.expiry = gs1Date(value);
    else if (ai === "10") out.lot = value;
    else if (ai === "21") out.serial = value;
  };
  if (s.includes("(")) {
    for (const m of s.matchAll(/\((\d{2})\)([^(]+)/g)) take(m[1]!, m[2]!.replace(GS, "").trim());
    return out;
  }
  let i = 0;
  while (i < s.length) {
    const ai = s.slice(i, i + 2);
    i += 2;
    if (ai === "01") { take(ai, s.slice(i, i + 14)); i += 14; }
    else if (ai === "17") { take(ai, s.slice(i, i + 6)); i += 6; }
    else if (ai === "10" || ai === "21") {
      let j = s.indexOf(GS, i);
      if (j < 0) j = s.length;
      take(ai, s.slice(i, j));
      i = j + 1;
    } else break;
  }
  return out;
}

function gs1Date(yymmdd: string): string | undefined {
  if (!/^\d{6}$/.test(yymmdd)) return undefined;
  const yy = Number(yymmdd.slice(0, 2)), mm = Number(yymmdd.slice(2, 4));
  let dd = Number(yymmdd.slice(4, 6));
  const year = 2000 + yy;
  if (mm < 1 || mm > 12) return undefined;
  if (dd === 0) dd = new Date(Date.UTC(year, mm, 0)).getUTCDate();
  return `${year}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}
