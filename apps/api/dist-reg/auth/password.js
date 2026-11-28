"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
const node_crypto_1 = require("node:crypto");
const scrypt = (pw, salt, len) => new Promise((res, rej) => (0, node_crypto_1.scrypt)(pw, salt, len, { N: 16384, r: 8, p: 1 }, (e, k) => (e ? rej(e) : res(k))));
async function hashPassword(pw) {
    const salt = (0, node_crypto_1.randomBytes)(16);
    const key = await scrypt(pw, salt, 32);
    return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}
async function verifyPassword(pw, stored) {
    if (!stored)
        return false;
    const [alg, saltHex, keyHex] = stored.split("$");
    if (alg !== "scrypt" || !saltHex || !keyHex)
        return false;
    const key = await scrypt(pw, Buffer.from(saltHex, "hex"), 32);
    const expected = Buffer.from(keyHex, "hex");
    return key.length === expected.length && (0, node_crypto_1.timingSafeEqual)(key, expected);
}
//# sourceMappingURL=password.js.map