/** Minimal RFC-4180 CSV parser (BOM, CRLF, quoted fields, doubled quotes, `,` `;` or tab delimiter auto-detected) returning rows keyed by lower-cased, trimmed header names. */
export function parseCsv(text: string): { headers: string[]; rows: Array<Record<string, string>> } {
  const src = text.replace(/^﻿/, "");
  const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
  const delim = [",", ";", "\t"].map((d) => [d, firstLine.split(d).length] as const).sort((a, b) => b[1] - a[1])[0]![0];
  const records: string[][] = [];
  let row: string[] = [], cur = "", inQ = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i]!;
    if (inQ) {
      if (c === '"' && src[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) { row.push(cur); cur = ""; }
    else if (c === "\n" || c === "\r") { if (c === "\r" && src[i + 1] === "\n") i++; row.push(cur); cur = ""; if (row.some((x) => x.trim() !== "")) records.push(row); row = []; }
    else cur += c;
  }
  row.push(cur);
  if (row.some((x) => x.trim() !== "")) records.push(row);
  const headers = (records.shift() ?? []).map((h) => h.trim().toLowerCase());
  return { headers, rows: records.map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()]))) };
}

/** CSV cell escaping with spreadsheet-formula neutralisation (cells starting with = + - @ are prefixed with a quote). */
export const csvCell = (v: unknown): string => { const s = v == null ? "" : String(v); const danger = /^[=+\-@]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s); const t = danger ? `'${s}` : s; return /[",\n\r;]/.test(t) || danger ? `"${t.replace(/"/g, '""')}"` : t; };
export const toCsvText = (headers: string[], rows: Array<Array<unknown>>): string => "﻿" + [headers.map(csvCell).join(","), ...rows.map((r) => r.map(csvCell).join(","))].join("\r\n") + "\r\n";
