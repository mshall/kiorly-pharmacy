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
var CommissionStatementService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionStatementService = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@kiorex/contracts");
const commission_statement_signing_1 = require("./commission-statement-signing");
const secret_box_1 = require("../../common/secret-box");
const outbox_delivery_service_1 = require("../../outbox/outbox-delivery.service");
const prisma_service_1 = require("../../prisma/prisma.service");
const commission_rate_service_1 = require("./commission-rate.service");
const commission_statement_1 = require("./commission-statement");
const statement_html_1 = require("./statement-html");
let CommissionStatementService = CommissionStatementService_1 = class CommissionStatementService {
    prisma;
    rates;
    log = new common_1.Logger(CommissionStatementService_1.name);
    constructor(prisma, rates) {
        this.prisma = prisma;
        this.rates = rates;
    }
    need(user) { if (!commission_rate_service_1.RATE_ROLES.has(user.role))
        throw new common_1.ForbiddenException("The commission statement is visible to owners, branch managers and chain operations"); }
    async target(orgId) {
        const c = await this.prisma.integrationClient.findFirst({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } });
        const secret = c?.webhookSecretEnc ? (0, secret_box_1.open)(c.webhookSecretEnc) : process.env.KIOREX_WEBHOOK_SECRET;
        const base = (c?.kiorexBaseUrl ?? process.env.KIOREX_API_BASE_URL ?? (process.env.KIOREX_WEBHOOK_URL ? new URL(process.env.KIOREX_WEBHOOK_URL).origin : ""))?.replace(/\/+$/, "").replace(/\/api\/v1$/, "");
        if (!c?.key || !secret || !base)
            return null;
        return { base, secret, clientKey: c.key };
    }
    async fetchKiorex(orgId, tail, r, accept) {
        if ((0, outbox_delivery_service_1.kiorexMode)() !== "real")
            throw new common_1.ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "The Kiorex statement is not connected in this environment" });
        const ref = await this.rates.kiorexOrgRef(orgId);
        const t = await this.target(orgId);
        if (!ref || !t)
            throw new common_1.ServiceUnavailableException({ code: "STATEMENT_NOT_CONNECTED", message: "The Kiorex statement is not connected yet" });
        const url = new URL(`${t.base}/api/v1/partner/commissions/settlement-statement${tail}`);
        url.searchParams.set("from", r.from.toISOString());
        url.searchParams.set("to", r.to.toISOString());
        const secret = (0, commission_statement_signing_1.statementSigningSecret)(t.secret);
        const signed = (0, contracts_1.signKiorlyRequest)({ clientKey: t.clientKey, clientSecret: secret, method: "GET", path: url.pathname, body: "" });
        const querySignature = (0, commission_statement_signing_1.signStatementQuery)(secret, { timestamp: signed.timestamp, nonce: signed.nonce, method: "GET", path: url.pathname, query: url.searchParams });
        try {
            const res = await fetch(url, { headers: { ...signed.headers, [commission_statement_signing_1.QUERY_SIGNATURE_HEADER]: querySignature, "x-kiorly-org-ref": ref, accept }, signal: AbortSignal.timeout(8000) });
            if (!res.ok)
                throw new common_1.ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: `Kiorex answered ${res.status}` });
            return res;
        }
        catch (e) {
            if (e instanceof common_1.ServiceUnavailableException)
                throw e;
            this.log.warn(`statement fetch failed: ${e instanceof Error ? e.message : String(e)}`);
            throw new common_1.ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "The Kiorex statement could not be reached" });
        }
    }
    async ledgerFeesMinor(orgId, r) {
        const a = await this.prisma.settlementEntry.aggregate({ where: { orgId, createdAt: { gte: r.from, lt: r.to } }, _sum: { feeAmount: true }, _count: true });
        return a._count > 0 ? Math.round(Number(a._sum.feeAmount?.toString() ?? "0") * 100) : null;
    }
    async statement(user, period) {
        this.need(user);
        const r = (0, commission_statement_1.periodRange)(period);
        if (!r)
            throw new common_1.BadRequestException("period must be YYYY-MM");
        const ref = (await this.rates.kiorexOrgRef(user.orgId)) ?? user.orgId;
        const body = await (await this.fetchKiorex(user.orgId, "", r, "application/json")).json().catch(() => null);
        const v = (0, commission_statement_1.normalizeStatement)(body, { orgRef: ref, from: r.from, to: r.to });
        if (!v)
            throw new common_1.ServiceUnavailableException({ code: "STATEMENT_UNAVAILABLE", message: "Kiorex sent an unreadable statement" });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.viewed", entityType: "KiorexCommissionStatement", entityId: r.key, meta: { by: user.userId } } }).catch(() => undefined);
        let feesSource = v.deductions.feesMinor === null ? null : "KIOREX";
        if (v.deductions.feesMinor === null) {
            const f = await this.ledgerFeesMinor(user.orgId, r);
            if (f !== null) {
                v.deductions.feesMinor = f;
                feesSource = "PRODUCT_LEDGER";
            }
        }
        return { ...v, orgRef: ref, period: { ...v.period, key: r.key }, feesSource };
    }
    async printHtml(user, period, o = {}) {
        const s = await this.statement(user, period);
        const tenant = await this.prisma.tenant.findUnique({ where: { id: user.orgId }, select: { name: true } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.printed", entityType: "KiorexCommissionStatement", entityId: s.period.key, meta: { by: user.userId } } }).catch(() => undefined);
        return (0, statement_html_1.renderStatementHtml)({ product: "PHARMACY", lang: o.lang === "en" ? "en" : "ar", periodKey: s.period.key, organisation: tenant?.name ?? s.orgRef, statement: s, autoPrint: o.print });
    }
    async exportCsv(user, period) {
        this.need(user);
        const r = (0, commission_statement_1.periodRange)(period);
        if (!r)
            throw new common_1.BadRequestException("period must be YYYY-MM");
        const res = await this.fetchKiorex(user.orgId, "/export", r, "text/csv");
        const body = await res.text();
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, action: "kiorex.commission_statement.exported", entityType: "KiorexCommissionStatement", entityId: r.key, meta: { by: user.userId, rows: Math.max(0, body.split(/\r?\n/).filter(Boolean).length - 1) } } }).catch(() => undefined);
        return { filename: `settlement-${r.key}.csv`, body: body.startsWith("﻿") ? body : `﻿${body}` };
    }
};
exports.CommissionStatementService = CommissionStatementService;
exports.CommissionStatementService = CommissionStatementService = CommissionStatementService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(commission_rate_service_1.CommissionRateService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, commission_rate_service_1.CommissionRateService])
], CommissionStatementService);
//# sourceMappingURL=commission-statement.service.js.map