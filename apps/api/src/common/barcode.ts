/** Dependency-free barcode SVG generators (Code 128-B and EAN-13) for labels, shelf tags and Rx labels. Pure functions. */

// Code 128 bar/space width patterns for symbols 0..106 (each 6 widths summing to 11; STOP has 7).
const C128 = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213", "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211", "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331", "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214", "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141", "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

export function code128Modules(text: string): number[] {
  const codes = [104]; // START B
  for (const ch of text) {
    const c = ch.charCodeAt(0) - 32;
    if (c < 0 || c > 94) throw new Error(`Code128-B cannot encode ${JSON.stringify(ch)}`);
    codes.push(c);
  }
  const checksum = codes.reduce((a, c, i) => a + c * (i === 0 ? 1 : i), 0) % 103;
  codes.push(checksum, 106);
  return codes.flatMap((c) => [...C128[c]!].map(Number));
}

export function code128Svg(text: string, opts: { height?: number; module?: number; label?: boolean } = {}): string {
  const mod = opts.module ?? 1.6, h = opts.height ?? 40;
  const widths = [...Array(10).fill(1), ...code128Modules(text), ...Array(10).fill(1)].slice(10, -10);
  const quiet = 10 * mod;
  let x = quiet, bars = "";
  widths.forEach((w, i) => { if (i % 2 === 0) bars += `<rect x="${x.toFixed(2)}" y="0" width="${(w * mod).toFixed(2)}" height="${h}"/>`; x += w * mod; });
  const W = x + quiet, H = h + (opts.label === false ? 0 : 12);
  const esc = text.replace(/[<>&"]/g, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${H}" width="${W.toFixed(0)}" height="${H}" role="img" aria-label="${esc}"><g fill="#000">${bars}</g>${opts.label === false ? "" : `<text x="${(W / 2).toFixed(2)}" y="${h + 10}" font-size="9" text-anchor="middle" font-family="monospace">${esc}</text>`}</svg>`;
}

const L = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
const G = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
const R = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

export const ean13Check = (d12: string): number => { let s = 0; for (let i = 0; i < 12; i++) s += Number(d12[i]) * (i % 2 ? 3 : 1); return (10 - (s % 10)) % 10; };
export const isEan13 = (c: string): boolean => /^\d{13}$/.test(c) && ean13Check(c.slice(0, 12)) === Number(c[12]);

/** EAN-13 module string (95 modules) for a valid 13-digit code. */
export function ean13Bits(code: string): string {
  if (!isEan13(code)) throw new Error("Invalid EAN-13");
  const par = PARITY[Number(code[0])]!;
  let bits = "101";
  for (let i = 0; i < 6; i++) bits += (par[i] === "L" ? L : G)[Number(code[i + 1])];
  bits += "01010";
  for (let i = 0; i < 6; i++) bits += R[Number(code[i + 7])];
  return bits + "101";
}

export function ean13Svg(code: string, opts: { height?: number; module?: number } = {}): string {
  const mod = opts.module ?? 1.4, h = opts.height ?? 40, bits = ean13Bits(code), q = 9 * mod;
  let bars = "";
  [...bits].forEach((b, i) => { if (b === "1") bars += `<rect x="${(q + i * mod).toFixed(2)}" y="0" width="${mod}" height="${h}"/>`; });
  const W = bits.length * mod + 2 * q;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W.toFixed(2)} ${h + 12}" width="${W.toFixed(0)}" height="${h + 12}" role="img" aria-label="${code}"><g fill="#000">${bars}</g><text x="${(W / 2).toFixed(2)}" y="${h + 10}" font-size="9" text-anchor="middle" font-family="monospace">${code}</text></svg>`;
}

/** Best barcode for a product code: EAN-13 when valid, else Code 128. */
export const barcodeSvg = (code: string, o: { height?: number } = {}): string => (isEan13(code) ? ean13Svg(code, o) : code128Svg(code, o));
