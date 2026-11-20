import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { csvCell, parseCsv, toCsvText } from "./csv";

describe("csv (pure)", () => {
  it("parses BOM, CRLF, quotes, embedded commas/newlines and Arabic", () => {
    const r = parseCsv('﻿BrandName,Note,Qty\r\n"Panadol, 500",  "say ""hi""\nthere" ,3\r\nباراسيتامول,ملاحظة,4\r\n\r\n');
    assert.deepEqual(r.headers, ["brandname", "note", "qty"]);
    assert.equal(r.rows.length, 2); assert.equal(r.rows[0]!.brandname, "Panadol, 500"); assert.equal(r.rows[0]!.note, 'say "hi"\nthere'); assert.equal(r.rows[1]!.brandname, "باراسيتامول");
  });
  it("detects semicolon and tab delimiters (Excel in Arabic locales)", () => {
    assert.deepEqual(parseCsv("a;b\n1;2").rows, [{ a: "1", b: "2" }]);
    assert.deepEqual(parseCsv("a\tb\n1\t2").rows, [{ a: "1", b: "2" }]);
  });
  it("short rows are padded; empty input has no rows", () => { assert.deepEqual(parseCsv("a,b,c\n1").rows, [{ a: "1", b: "", c: "" }]); assert.equal(parseCsv("").rows.length, 0); });
  it("export escaping neutralises formulas but keeps negative numbers", () => {
    assert.equal(csvCell("=SUM(A1)"), `"'=SUM(A1)"`); assert.equal(csvCell("-5.50"), "-5.50"); assert.equal(csvCell('a"b'), '"a""b"'); assert.equal(csvCell(null), "");
    assert.ok(toCsvText(["a"], [["x"]]).startsWith("﻿a\r\n"));
  });
});
