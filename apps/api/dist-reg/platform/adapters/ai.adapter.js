"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiProvider = exports.RealForecastAi = exports.MockForecastAi = exports.ForecastAi = void 0;
const common_1 = require("@nestjs/common");
const ai_gateway_1 = require("./ai.gateway");
const adapter_mode_1 = require("./adapter-mode");
class ForecastAi {
}
exports.ForecastAi = ForecastAi;
function movingAverage(series, horizonDays) {
    const w = series.daily.slice(-14);
    const avg = w.length ? w.reduce((a, b) => a + b, 0) / w.length : 0;
    const a = Math.round(avg * 100) / 100;
    return { drugId: series.drugId, avgDailyDemand: a, horizonDays, expectedDemand: Math.ceil(a * horizonDays), method: "mock-moving-average-14d", explanation: `AI (mock): ${series.label} averaged ${a}/day over the last ${w.length} days.` };
}
let MockForecastAi = class MockForecastAi extends ForecastAi {
    async forecast(series, horizonDays) { return movingAverage(series, horizonDays); }
};
exports.MockForecastAi = MockForecastAi;
exports.MockForecastAi = MockForecastAi = __decorate([
    (0, common_1.Injectable)()
], MockForecastAi);
let RealForecastAi = class RealForecastAi extends ForecastAi {
    gateway;
    constructor(gateway) {
        super();
        this.gateway = gateway;
    }
    async forecast(series, horizonDays, orgId = "system") {
        const base = movingAverage(series, horizonDays);
        if (base.avgDailyDemand <= 0)
            return base;
        try {
            const r = await this.gateway.assist({ orgId, task: "forecast.explain", system: "You are a pharmacy inventory analyst. Reply with ONE short sentence.", prompt: `Explain this demand forecast to a pharmacy manager. Drug: ${series.label}. Daily units sold (oldest first): ${series.daily.slice(-14).join(", ")}. Forecast: ${base.avgDailyDemand}/day, ${base.expectedDemand} units over ${horizonDays} days.`, maxOutputTokens: 80 });
            return { ...base, method: "moving-average-14d+llm-explanation", explanation: r.text };
        }
        catch {
            return base;
        }
    }
};
exports.RealForecastAi = RealForecastAi;
exports.RealForecastAi = RealForecastAi = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(ai_gateway_1.AiGateway)),
    __metadata("design:paramtypes", [ai_gateway_1.AiGateway])
], RealForecastAi);
exports.aiProvider = { provide: ForecastAi, useFactory: (gw) => ((0, adapter_mode_1.adapterMode)("AI") === "real" ? new RealForecastAi(gw) : new MockForecastAi()), inject: [ai_gateway_1.AiGateway] };
//# sourceMappingURL=ai.adapter.js.map