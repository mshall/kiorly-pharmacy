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
exports.KiorexConnectService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../../audit/audit.service");
const errors_1 = require("../../common/errors");
const secret_box_1 = require("../../common/secret-box");
const prisma_service_1 = require("../../prisma/prisma.service");
const storage_adapter_1 = require("../../platform/adapters/storage.adapter");
const marketplace_service_1 = require("./marketplace.service");
const kiorex_connect_core_1 = require("./kiorex-connect.core");
const kiorex_connect_logic_1 = require("./kiorex-connect.logic");
const kek = () => process.env.INTEGRATION_KEK ?? "dev-kek-change-me-dev-kek-change-me!";
let KiorexConnectService = class KiorexConnectService {
    prisma;
    audit;
    market;
    storage;
    constructor(prisma, audit, market, storage) {
        this.prisma = prisma;
        this.audit = audit;
        this.market = market;
        this.storage = storage;
    }
    async tenant(orgId) { return this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }); }
    doc(settings) { return settings?.kiorexConnect; }
    async save(orgId, patch) {
        const t = await this.tenant(orgId);
        const cur = this.doc(t.settings) ?? { status: "STANDALONE" };
        const settings = { ...(t.settings ?? {}), kiorexConnect: patch(cur) };
        await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: settings } });
    }
    async setMode(orgId, mode) {
        const t = await this.tenant(orgId);
        await this.prisma.tenant.update({ where: { id: orgId }, data: { settings: { ...(t.settings ?? {}), mode } } });
    }
    async get(orgId, opts = {}) {
        let t = await this.tenant(orgId);
        let d = this.doc(t.settings);
        const activeClients = await this.prisma.integrationClient.count({ where: { orgId, active: true } });
        const legacy = !d && activeClients > 0 && (t.settings ?? {}).mode !== "STANDALONE";
        if (opts.pull !== false && d?.request && ["REQUESTED", "CHANGES_REQUESTED", "APPROVED", "PAUSED"].includes(d.status)) {
            await this.pull(orgId, d);
            t = await this.tenant(orgId);
            d = this.doc(t.settings);
        }
        const status = d?.status ?? (legacy ? "APPROVED" : "STANDALONE");
        const settings = await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true } });
        const branches = await this.prisma.branch.findMany({ where: { orgId, id: { in: settings.map((x) => x.branchId) }, active: true } });
        let priced = 0;
        try {
            priced = (await this.market.catalogue(orgId, {})).items.length;
        }
        catch {
            priced = 0;
        }
        const steps = (0, kiorex_connect_logic_1.computePharmacySteps)({
            status, subscriptionStatus: t.subscriptionStatus, optedInBranches: branches.length, pricedItems: priced,
            branchesMissingHours: settings.filter((s) => !s.openingHours || Object.keys(s.openingHours).length === 0 || s.latitude == null || s.longitude == null).length,
            branchesMissingLicenceNo: branches.filter((b) => !b.licenceNo?.trim()).length, licenceDocument: !!d?.licenceDocument, payoutLabel: !!d?.payoutLabel, termsAccepted: !!d?.terms,
            liveOnKiorex: status === "APPROVED",
        });
        return { legacy, status, progress: legacy ? 100 : (0, kiorex_connect_core_1.progressPct)(steps), canRequest: !legacy && (0, kiorex_connect_core_1.canRequest)(steps, status), steps, kiorex: d?.kiorex ?? null, requestId: d?.request?.id ?? null, clientKey: d?.request?.clientKey ?? null, enrolmentCodeRequired: !d?.intakeKeyEnc, termsVersion: kiorex_connect_core_1.KIOREX_TERMS_VERSION, payoutLabel: d?.payoutLabel ?? null, terms: d?.terms ? { at: d.terms.at, version: d.terms.version } : null, licenceDocument: d?.licenceDocument ?? null, mode: (t.settings ?? {}).mode ?? (activeClients > 0 ? "INTEGRATED" : "STANDALONE") };
    }
    async branches(orgId) {
        const [branches, settings] = await Promise.all([this.prisma.branch.findMany({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } }), this.prisma.branchMarketplaceSetting.findMany({ where: { orgId } })]);
        return branches.map((b) => { const s = settings.find((x) => x.branchId === b.id); return { id: b.id, name: b.name, licenceNo: b.licenceNo, optedIn: s?.optedIn ?? false, openingHours: s?.openingHours ?? null, deliveryRadiusKm: s ? s.deliveryRadiusKm.toString() : "5", prepMinutes: s?.prepMinutes ?? 30, latitude: s?.latitude?.toString() ?? null, longitude: s?.longitude?.toString() ?? null }; });
    }
    async setBranch(u, branchId, d) {
        if (d.licenceNo !== undefined) {
            const r = await this.prisma.branch.updateMany({ where: { id: branchId, orgId: u.orgId }, data: { licenceNo: d.licenceNo.trim() || null } });
            if (!r.count)
                throw (0, errors_1.badRequest)("BRANCH_NOT_FOUND", "Branch not found");
        }
        await this.market.putSetting(u, branchId, d);
        return this.branches(u.orgId);
    }
    async acceptTerms(u, version) {
        if (version !== kiorex_connect_core_1.KIOREX_TERMS_VERSION)
            throw (0, errors_1.badRequest)("TERMS_VERSION_MISMATCH", "Reload the page: the terms changed");
        await this.save(u.orgId, (d) => ({ ...d, status: d.status === "STANDALONE" ? "CONSENTED" : d.status, terms: { at: new Date().toISOString(), userId: u.userId, version } }));
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.terms_accepted", entityType: "Tenant", entityId: u.orgId, meta: { version } });
        return this.get(u.orgId, { pull: false });
    }
    async setPayout(u, label) {
        const v = (0, kiorex_connect_core_1.validatePayoutLabel)(label);
        if (!v.ok)
            throw (0, errors_1.badRequest)(v.code, v.code === "PAYOUT_LOOKS_LIKE_ACCOUNT_NUMBER" ? "Enter a short label only. Bank details are never stored here" : "Enter a short label (2 to 40 characters)");
        await this.save(u.orgId, (d) => ({ ...d, payoutLabel: v.value }));
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.payout_label_set", entityType: "Tenant", entityId: u.orgId });
        return this.get(u.orgId, { pull: false });
    }
    async uploadLicence(u, name, contentBase64) {
        const bytes = Buffer.from(contentBase64, "base64");
        const type = /\.pdf$/i.test(name) ? "application/pdf" : /\.png$/i.test(name) ? "image/png" : "image/jpeg";
        const put = await this.storage.put(`tenants/${u.orgId}/kiorex-connect/licence`, bytes, type);
        await this.save(u.orgId, (d) => ({ ...d, licenceDocument: { at: new Date().toISOString(), bytes: put.bytes } }));
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "kiorex_connect.licence_uploaded", entityType: "Tenant", entityId: u.orgId, meta: { bytes: put.bytes } });
        return this.get(u.orgId, { pull: false });
    }
    async request(u, o = {}) {
        const state = await this.get(u.orgId, { pull: false });
        const d0 = this.doc((await this.tenant(u.orgId)).settings);
        if (state.legacy)
            throw (0, errors_1.conflict)("ALREADY_CONNECTED", "This pharmacy is already connected");
        const rotating = !!o.rotate && state.status === "APPROVED";
        if (!rotating && !state.canRequest && state.status !== "REQUESTED")
            throw (0, errors_1.conflict)("CONNECT_NOT_READY", "Finish every required step first", { open: state.steps.filter((s) => !s.optional && !["request", "live"].includes(s.key) && s.status !== "done").map((s) => s.key) });
        const code = o.enrolmentCode?.trim();
        const intakeKey = d0?.intakeKeyEnc ? (0, secret_box_1.open)(d0.intakeKeyEnc) : undefined;
        if (code && !(0, kiorex_connect_core_1.isEnrolmentCode)(code))
            throw (0, errors_1.badRequest)("ENROLMENT_CODE_INVALID", "That enrolment code is not valid. Copy it exactly as Kiorex gave it to you");
        if (!code && !intakeKey)
            throw (0, errors_1.conflict)("ENROLMENT_CODE_REQUIRED", "Enter the enrolment code Kiorex gave you");
        const t = await this.tenant(u.orgId);
        const host = (0, kiorex_connect_core_1.kiorexHost)();
        const contact = o.contactEmail ?? d0?.contactEmail ?? (await this.prisma.staffUser.findUnique({ where: { id: u.userId }, select: { email: true } }))?.email ?? undefined;
        const clientKey = (0, kiorex_connect_core_1.newClientKey)("kp");
        const clientSecret = (0, kiorex_connect_core_1.newSecret)();
        const webhookSecret = (0, kiorex_connect_core_1.newSecret)();
        await this.prisma.integrationClient.create({ data: { orgId: u.orgId, key: clientKey, secretEnc: (0, secret_box_1.seal)(clientSecret), webhookSecretEnc: (0, secret_box_1.seal)(webhookSecret), kiorexBaseUrl: host } });
        const body = JSON.stringify({
            nonce: (0, kiorex_connect_core_1.newIntakeNonce)(), statusToken: (0, kiorex_connect_core_1.deriveStatusToken)(kek(), u.orgId), kind: "PHARMACY", orgRef: u.orgId, name: t.name, market: t.marketCode, locale: "en", contactEmail: contact,
            baseUrl: (0, kiorex_connect_core_1.publicApiBase)(), clientKey, clientSecret, webhookSecret,
            readiness: { counts: { branches: state.steps.find((s) => s.key === "branch_optin")?.detail?.branches, items: state.steps.find((s) => s.key === "catalogue")?.detail?.priced }, documents: { licence: state.steps.find((s) => s.key === "licence")?.status === "done" }, termsAcceptedAt: d0?.terms?.at, termsVersion: d0?.terms?.version, steps: state.steps.map((s) => ({ key: s.key, status: s.status })) },
        });
        const ts = Math.floor(Date.now() / 1000);
        let res;
        try {
            res = await fetch((0, kiorex_connect_core_1.intakeUrl)(host), { method: "POST", headers: (0, kiorex_connect_core_1.intakeHeaders)(code ?? intakeKey, ts, body, code), body, signal: AbortSignal.timeout(8000) });
        }
        catch {
            await this.prisma.integrationClient.updateMany({ where: { orgId: u.orgId, key: clientKey }, data: { active: false } });
            throw (0, errors_1.conflict)("KIOREX_UNREACHABLE", "Kiorex could not be reached. Nothing was sent. Try again.");
        }
        if (!res.ok) {
            await this.prisma.integrationClient.updateMany({ where: { orgId: u.orgId, key: clientKey }, data: { active: false } });
            throw (0, errors_1.conflict)(res.status === 401 ? "ENROLMENT_CODE_REJECTED" : res.status === 429 ? "KIOREX_BUSY" : "KIOREX_REJECTED_REQUEST", res.status === 401 ? "Kiorex did not accept the enrolment code. Check it, or ask Kiorex for a new one" : "Kiorex did not accept the request", { status: res.status, ...(res.status === 429 ? { retryAfterSec: Number(res.headers.get("retry-after")) || undefined } : {}) });
        }
        const sent = (await res.json());
        await this.save(u.orgId, (d) => ({ ...d, status: rotating ? d.status : "REQUESTED", request: { id: sent.id, submittedAt: new Date().toISOString(), clientKey }, contactEmail: o.contactEmail ?? d.contactEmail, ...(sent.intakeKey ? { intakeKeyEnc: (0, secret_box_1.seal)(sent.intakeKey) } : {}) }));
        await this.setMode(u.orgId, "INTEGRATED");
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: rotating ? "kiorex_connect.credentials_rotated" : "kiorex_connect.requested", entityType: "Tenant", entityId: u.orgId, meta: { requestId: sent.id, clientKey } });
        return { ...(await this.get(u.orgId, { pull: false })), ...(rotating ? { credentials: { clientKey, clientSecret, webhookSecret, shownOnce: true } } : {}) };
    }
    async pull(orgId, d) {
        if (!d.request)
            return;
        try {
            const res = await fetch(`${(0, kiorex_connect_core_1.intakeUrl)((0, kiorex_connect_core_1.kiorexHost)())}/${encodeURIComponent(d.request.id)}`, { headers: { "x-connection-token": (0, kiorex_connect_core_1.deriveStatusToken)(kek(), orgId) }, signal: AbortSignal.timeout(4000) });
            if (!res.ok)
                return;
            const s = (await res.json());
            const map = { LIVE: "APPROVED", PAUSED: "PAUSED", REJECTED: "REJECTED", CHANGES_REQUESTED: "CHANGES_REQUESTED" };
            const next = map[s.status];
            await this.save(orgId, (cur) => ({ ...cur, kiorex: { status: s.status, at: new Date().toISOString() }, ...(next ? { status: next } : {}) }));
            if (next === "REJECTED")
                await this.setMode(orgId, "STANDALONE");
        }
        catch { }
    }
};
exports.KiorexConnectService = KiorexConnectService;
exports.KiorexConnectService = KiorexConnectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __param(2, (0, common_1.Inject)(marketplace_service_1.MarketplaceService)),
    __param(3, (0, common_1.Inject)(storage_adapter_1.StorageAdapter)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService,
        marketplace_service_1.MarketplaceService, storage_adapter_1.StorageAdapter])
], KiorexConnectService);
//# sourceMappingURL=kiorex-connect.service.js.map