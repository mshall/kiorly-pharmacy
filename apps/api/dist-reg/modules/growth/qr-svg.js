"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrSvg = qrSvg;
exports.qrPng = qrPng;
const qrcode_1 = __importDefault(require("qrcode"));
const BASE = { errorCorrectionLevel: "M", margin: 4 };
async function qrSvg(url, opts) {
    return qrcode_1.default.toString(url, {
        ...BASE,
        type: "svg",
        color: { dark: opts?.color ?? "#000000", light: opts?.background ?? "#ffffff" },
    });
}
async function qrPng(url, width = 768) {
    const w = Math.min(2048, Math.max(128, Math.round(width)));
    return qrcode_1.default.toBuffer(url, { ...BASE, type: "png", width: w, color: { dark: "#000000", light: "#ffffff" } });
}
//# sourceMappingURL=qr-svg.js.map