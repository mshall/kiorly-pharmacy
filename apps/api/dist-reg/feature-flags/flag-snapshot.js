"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signSnapshotRequest = signSnapshotRequest;
const contracts_1 = require("@kiorex/contracts");
function signSnapshotRequest(productKey, productSecret, path, now = Date.now(), nonce) {
    return (0, contracts_1.signControlPlaneRequest)({ productKey, productSecret, method: "GET", path, timestamp: now, nonce }).headers;
}
//# sourceMappingURL=flag-snapshot.js.map