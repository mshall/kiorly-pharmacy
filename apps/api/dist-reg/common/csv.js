"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCsvText = exports.csvCell = void 0;
exports.parseCsv = parseCsv;
function parseCsv(text) {
    const src = text.replace(/^﻿/, "");
    const firstLine = src.split(/\r?\n/, 1)[0] ?? "";
    const delim = [",", ";", "\t"].map((d) => [d, firstLine.split(d).length]).sort((a, b) => b[1] - a[1])[0][0];
    const records = [];
    let row = [], cur = "", inQ = false;
    for (let i = 0; i < src.length; i++) {
        const c = src[i];
        if (inQ) {
            if (c === '"' && src[i + 1] === '"') {
                cur += '"';
                i++;
            }
            else if (c === '"')
                inQ = false;
            else
                cur += c;
        }
        else if (c === '"')
            inQ = true;
        else if (c === delim) {
            row.push(cur);
            cur = "";
        }
        else if (c === "\n" || c === "\r") {
            if (c === "\r" && src[i + 1] === "\n")
                i++;
            row.push(cur);
            cur = "";
            if (row.some((x) => x.trim() !== ""))
                records.push(row);
            row = [];
        }
        else
            cur += c;
    }
    row.push(cur);
    if (row.some((x) => x.trim() !== ""))
        records.push(row);
    const headers = (records.shift() ?? []).map((h) => h.trim().toLowerCase());
    return { headers, rows: records.map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] ?? "").trim()]))) };
}
const csvCell = (v) => { const s = v == null ? "" : String(v); const danger = /^[=+\-@]/.test(s) && !/^-?\d+(\.\d+)?$/.test(s); const t = danger ? `'${s}` : s; return /[",\n\r;]/.test(t) || danger ? `"${t.replace(/"/g, '""')}"` : t; };
exports.csvCell = csvCell;
const toCsvText = (headers, rows) => "﻿" + [headers.map(exports.csvCell).join(","), ...rows.map((r) => r.map(exports.csvCell).join(","))].join("\r\n") + "\r\n";
exports.toCsvText = toCsvText;
//# sourceMappingURL=csv.js.map