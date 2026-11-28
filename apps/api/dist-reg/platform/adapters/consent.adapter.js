"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ConsentVerifier_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.consentProvider = exports.ConsentVerifier = void 0;
const common_1 = require("@nestjs/common");
const http_1 = require("../../providers/http");
const consent_provider_1 = require("../../providers/consent-provider");
let ConsentVerifier = class ConsentVerifier {
    static { ConsentVerifier_1 = this; }
    static fetchImpl;
    async verify(token, ctx) {
        try {
            const r = await (0, consent_provider_1.consentRegistry)(process.env, ConsentVerifier_1.fetchImpl).introspect(token, ctx);
            return { valid: r.valid, reason: r.reason, expiresAt: r.expiresAt ? new Date(r.expiresAt) : undefined };
        }
        catch (e) {
            if (e instanceof http_1.ProviderError)
                return { valid: false, reason: "REGISTRY_UNAVAILABLE" };
            throw e;
        }
    }
};
exports.ConsentVerifier = ConsentVerifier;
exports.ConsentVerifier = ConsentVerifier = ConsentVerifier_1 = __decorate([
    (0, common_1.Injectable)()
], ConsentVerifier);
exports.consentProvider = ConsentVerifier;
//# sourceMappingURL=consent.adapter.js.map