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
var FeatureFlagsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeatureFlagsService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@kiorex/contracts");
const prisma_service_1 = require("../prisma/prisma.service");
const feature_flag_keys_1 = require("./feature-flag-keys");
const flag_snapshot_1 = require("./flag-snapshot");
const safety_controls_1 = require("./safety-controls");
const CODE_DEFAULTS = Object.fromEntries(feature_flag_keys_1.FLAG_DEFINITIONS.map((f) => [f.key, { launchLocked: f.launchLocked, dependsOn: f.dependsOn }]));
let FeatureFlagsService = FeatureFlagsService_1 = class FeatureFlagsService {
    prisma;
    log = new common_1.Logger(FeatureFlagsService_1.name);
    snapshot = null;
    etag = null;
    timer = null;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onModuleInit() {
        await this.restore();
        if (process.env.FLAGS_POLL_ENABLED === "true") {
            void this.refresh();
            this.timer = setInterval(() => void this.refresh(), Number(process.env.FLAGS_POLL_INTERVAL_MS ?? 30_000));
            this.timer.unref();
        }
    }
    onModuleDestroy() { if (this.timer)
        clearInterval(this.timer); }
    async restore() {
        if (!this.prisma)
            return;
        try {
            const row = await this.prisma.flagSnapshotCache.findUnique({ where: { product: "kiorly-pharmacy" } });
            if (row && !this.snapshot) {
                this.snapshot = row.body;
                this.etag = row.etag;
            }
        }
        catch (e) {
            this.log.warn(`could not restore flag snapshot: ${e.message}`);
        }
    }
    setSnapshot(snapshot, etag = null) {
        this.snapshot = snapshot;
        this.etag = etag;
    }
    getSnapshotVersion() { return this.snapshot?.version ?? null; }
    async persist() {
        if (!this.prisma || !this.snapshot)
            return;
        const data = { version: String(this.snapshot.version), etag: this.etag, body: this.snapshot, fetchedAt: new Date() };
        await this.prisma.flagSnapshotCache.upsert({ where: { product: "kiorly-pharmacy" }, create: { product: "kiorly-pharmacy", ...data }, update: data });
    }
    async refresh(fetchImpl = fetch) {
        const base = process.env.KIOREX_FLAGS_URL;
        const key = process.env.KIOREX_PRODUCT_KEY;
        const secret = process.env.KIOREX_PRODUCT_SECRET;
        if (!base || !key || !secret)
            return "failed";
        try {
            const url = new URL(base);
            url.searchParams.set("product", "kiorly-pharmacy");
            const headers = { ...(0, flag_snapshot_1.signSnapshotRequest)(key, secret, url.pathname) };
            if (this.etag)
                headers["if-none-match"] = this.etag;
            const res = await fetchImpl(url, { headers });
            if (res.status === 304)
                return "not-modified";
            if (!res.ok)
                throw new Error(`snapshot HTTP ${res.status}`);
            const body = (await res.json());
            if (body.signature && !(0, contracts_1.verifySnapshot)(secret, body))
                throw new Error("snapshot signature invalid");
            this.snapshot = body;
            this.etag = res.headers.get("etag");
            await this.persist().catch((e) => this.log.warn(`persist snapshot failed: ${e.message}`));
            return "updated";
        }
        catch (err) {
            this.log.warn(`flag snapshot refresh failed (keeping last good): ${err.message}`);
            return "failed";
        }
    }
    evaluate(key, ctx = {}) {
        if ((0, safety_controls_1.isSafetyControlKey)(key))
            throw new safety_controls_1.SafetyControlNotAFlagError(key);
        if (!(0, feature_flag_keys_1.isKnownFlagKey)(key))
            throw new Error(`Unknown flag key "${key}"`);
        const d = (0, contracts_1.evaluateFlag)(this.snapshot, key, { orgId: ctx.orgId, market: ctx.market, entitled: ctx.entitled }, CODE_DEFAULTS);
        if (d.enabled)
            return { key, enabled: true, reason: d.reason };
        const scope = d.reason === "dependency_off" ? "dependency"
            : d.reason === "not_entitled" ? "entitlement"
                : d.reason === "awaiting_gate" || d.reason === "no_snapshot_launch_locked" ? "launch-locked"
                    : d.scope;
        return { key, enabled: false, scope, reason: d.reason };
    }
    isEnabled(key, ctx = {}) { return this.evaluate(key, ctx).enabled; }
};
exports.FeatureFlagsService = FeatureFlagsService;
exports.FeatureFlagsService = FeatureFlagsService = FeatureFlagsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Optional)()),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FeatureFlagsService);
//# sourceMappingURL=feature-flags.service.js.map