"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adapterMode = adapterMode;
const provider_env_1 = require("../../providers/provider-env");
function adapterMode(name) {
    if (name === "PSP")
        return (0, provider_env_1.providerMode)("PAYMENT");
    if (name === "PUSH")
        return (0, provider_env_1.providerMode)("PUSH");
    if (name === "MESSAGING")
        return ["SMS", "EMAIL", "WHATSAPP"].some((k) => (0, provider_env_1.providerMode)(k) === "real") ? "real" : "mock";
    return (0, provider_env_1.providerMode)(name);
}
//# sourceMappingURL=adapter-mode.js.map