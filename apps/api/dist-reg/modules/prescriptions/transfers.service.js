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
exports.RxTransfersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const prescriptions_service_1 = require("./prescriptions.service");
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
let RxTransfersService = class RxTransfersService {
    prisma;
    rx;
    constructor(prisma, rx) {
        this.prisma = prisma;
        this.rx = rx;
    }
    async out(user, id, d) {
        const rx = await this.rx.get(user.orgId, id);
        if (["DISPENSED", "CANCELLED", "REJECTED", "EXPIRED", "TRANSFERRED_OUT"].includes(rx.status))
            throw new errors_1.DomainError("RX_CLOSED", `Prescription is ${rx.status}`, 409);
        if (rx.lines.some((l) => l.controlled || (l.drug && l.drug.controlledSchedule !== "NONE")))
            throw new errors_1.DomainError("TRANSFER_NOT_ALLOWED_CONTROLLED", "Controlled medicines cannot be transferred to another pharmacy", 409);
        const remaining = rx.lines.map((l) => ({ drug: l.drug?.brandName ?? l.drugName ?? l.activeIngredient, activeIngredient: l.activeIngredient ?? l.drug?.activeIngredient, strength: l.strength, quantity: l.quantity - l.qtyDispensed, directions: l.directions })).filter((l) => l.quantity > 0);
        if (!remaining.length)
            throw new errors_1.DomainError("NOTHING_TO_TRANSFER", "No quantity remains on this prescription", 409);
        return this.prisma.$transaction(async (tx) => {
            const t = await tx.rxTransfer.create({ data: { orgId: user.orgId, branchId: rx.branchId, direction: "OUT", prescriptionId: id, counterpartyName: d.counterparty.name, counterpartyPhone: d.counterparty.phone, counterpartyPharmacist: d.counterparty.pharmacist, counterpartyLicenceNo: d.counterparty.licenceNo, reason: d.reason, snapshot: { remaining, refillsLeft: rx.refillsAllowed - rx.refillsUsed, prescriber: rx.prescriberName, prescriberLicenceNo: rx.prescriberLicenceNo, issuedAt: rx.issuedAt }, createdBy: user.userId } });
            await tx.prescription.update({ where: { id }, data: { status: "TRANSFERRED_OUT", transferredOutAt: new Date() } });
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.transfer_out", entityType: "Prescription", entityId: id, meta: { transferId: t.id, lines: remaining.length } } });
            return t;
        });
    }
    async in(user, branchId, d) {
        const drugIds = d.lines.map((l) => l.drugId).filter((x) => !!x);
        if (drugIds.length && (await this.prisma.drug.count({ where: { id: { in: drugIds }, controlledSchedule: { not: "NONE" } } })))
            throw new errors_1.DomainError("TRANSFER_NOT_ALLOWED_CONTROLLED", "Controlled medicines cannot be transferred in", 409);
        const rx = await this.rx.intakePaper(user, { branchId, patientId: d.patientId, patient: d.patient, prescriberName: d.prescriberName, prescriberLicenceNo: d.prescriberLicenceNo, issuedAt: d.issuedAt, lines: d.lines, refillsAllowed: d.refillsAllowed, source: "MANUAL_ENTRY" });
        await this.prisma.prescription.update({ where: { id: rx.id }, data: { source: "TRANSFER_IN", sourceRxRef: d.originalRef } });
        const t = await this.prisma.rxTransfer.create({ data: { orgId: user.orgId, branchId, direction: "IN", prescriptionId: rx.id, counterpartyName: d.counterparty.name, counterpartyPhone: d.counterparty.phone, counterpartyPharmacist: d.counterparty.pharmacist, counterpartyLicenceNo: d.counterparty.licenceNo, reason: d.reason, createdBy: user.userId } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "rx.transfer_in", entityType: "Prescription", entityId: rx.id, meta: { transferId: t.id } } });
        return { transfer: t, prescription: await this.rx.get(user.orgId, rx.id) };
    }
    async list(orgId, q) {
        const where = { orgId, ...(q.direction ? { direction: q.direction } : {}), ...(q.branchId ? { branchId: q.branchId } : {}) };
        const [items, total] = await Promise.all([this.prisma.rxTransfer.findMany({ where, orderBy: { createdAt: "desc" }, skip: q.skip, take: q.take }), this.prisma.rxTransfer.count({ where })]);
        return { items, total };
    }
    async noteHtml(orgId, transferId, lang) {
        const t = await this.prisma.rxTransfer.findFirst({ where: { id: transferId, orgId } });
        if (!t)
            throw (0, errors_1.notFound)("Transfer", transferId);
        const [tenant, branch, rx] = await Promise.all([this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } }), this.prisma.branch.findUnique({ where: { id: t.branchId } }), this.rx.get(orgId, t.prescriptionId)]);
        const snap = (t.snapshot ?? {});
        const ar = lang === "ar";
        const L = ar ? { h: "مذكرة تحويل روشتة", from: "من", to: "إلى", patient: "المريض", rx: "رقم الروشتة", doctor: "الطبيب", items: "الأصناف المتبقية", qty: "الكمية", dir: "الجرعة", reason: "السبب", sign: "توقيع الصيدلي" } : { h: "Prescription transfer note", from: "From", to: "To", patient: "Patient", rx: "Rx no.", doctor: "Prescriber", items: "Remaining items", qty: "Qty", dir: "Directions", reason: "Reason", sign: "Pharmacist signature" };
        return `<!doctype html><html lang="${lang}" dir="${ar ? "rtl" : "ltr"}"><head><meta charset="utf-8"><title>${L.h}</title><style>@page{size:A5;margin:10mm}body{font:12px/1.5 system-ui,"Noto Sans Arabic",sans-serif}h1{font-size:16px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ccc;padding:4px;text-align:start}</style></head><body>
<h1>${L.h}</h1><p><b>${L.from}:</b> ${esc(tenant.name)} — ${esc(branch?.name)} ${branch?.licenceNo ? `(${esc(branch.licenceNo)})` : ""}<br><b>${L.to}:</b> ${esc(t.counterpartyName)} ${esc(t.counterpartyPharmacist ?? "")} ${esc(t.counterpartyPhone ?? "")}</p>
<p><b>${L.patient}:</b> ${esc(rx.patient?.displayName)}<br><b>${L.rx}:</b> ${esc(rx.id.slice(-8).toUpperCase())}<br><b>${L.doctor}:</b> ${esc(rx.prescriberName)} ${esc(rx.prescriberLicenceNo ?? "")}</p>
<h2 style="font-size:13px">${L.items}</h2><table><tr><th></th><th>${L.qty}</th><th>${L.dir}</th></tr>${(snap.remaining ?? []).map((r) => `<tr><td>${esc(r.drug)} ${esc(r.strength ?? "")}</td><td>${r.quantity}</td><td>${esc(r.directions ?? "")}</td></tr>`).join("")}</table>
${t.reason ? `<p><b>${L.reason}:</b> ${esc(t.reason)}</p>` : ""}<p style="margin-top:28px">${L.sign}: ______________________ &nbsp; ${esc(new Date(t.createdAt).toISOString().slice(0, 10))}</p></body></html>`;
    }
};
exports.RxTransfersService = RxTransfersService;
exports.RxTransfersService = RxTransfersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(prescriptions_service_1.PrescriptionsService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, prescriptions_service_1.PrescriptionsService])
], RxTransfersService);
//# sourceMappingURL=transfers.service.js.map