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
exports.MarketplaceService = void 0;
const kiorex_front_door_core_1 = require("./kiorex-front-door.core");
const push_service_1 = require("../mobile/push.service");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const errors_1 = require("../../common/errors");
const money_1 = require("../../common/money");
const outbox_service_1 = require("../../outbox/outbox.service");
const dispense_hooks_1 = require("../../common/dispense-hooks");
const dispensing_service_1 = require("../dispensing/dispensing.service");
const inventory_service_1 = require("../inventory/inventory.service");
const ports_1 = require("../../kernel-adapter/ports");
const kiorex_projection_1 = require("../catalogue/kiorex-projection");
const notifications_service_1 = require("../../platform/adapters/notifications.service");
const prescriptions_service_1 = require("../prescriptions/prescriptions.service");
const price_service_1 = require("../catalogue/price.service");
const kiorex_projection_2 = require("../catalogue/kiorex-projection");
const secret_box_1 = require("../../common/secret-box");
const acquisition_fact_1 = require("../growth/acquisition-fact");
const node_crypto_1 = require("node:crypto");
const toMinor = (v) => Math.round((0, money_1.D)(v).mul(100).toNumber());
let MarketplaceService = class MarketplaceService {
    prisma;
    outbox;
    hooks;
    dispensing;
    inv;
    settlement;
    notify;
    prices;
    push;
    constructor(prisma, outbox, hooks, dispensing, inv, settlement, notify, prices, push) {
        this.prisma = prisma;
        this.outbox = outbox;
        this.hooks = hooks;
        this.dispensing = dispensing;
        this.inv = inv;
        this.settlement = settlement;
        this.notify = notify;
        this.prices = prices;
        this.push = push;
    }
    onModuleInit() {
        this.hooks.register(async (tx, c) => {
            if (!c.kiorexOrderRef)
                return;
            const order = await tx.kiorexOrder.findFirst({ where: { id: c.kiorexOrderRef, orgId: c.orgId }, include: { lines: true } });
            if (!order)
                return;
            await tx.kiorexOrder.update({ where: { id: order.id }, data: { status: "DISPENSED", dispensingId: c.dispensingId } });
            await (0, acquisition_fact_1.creditLinkOnce)(tx, c.orgId, order.id, "completed", c.dispensedAt);
            const pharmacyId = await this.pharmacyId(tx, c.orgId);
            await this.outbox.enqueue({
                orgId: c.orgId, type: "DispenseCompleted", aggregateId: order.externalOrderId, dedupeKey: `DispenseCompleted:${order.id}`,
                data: { orderId: order.externalOrderId, pharmacyId, branchId: c.branchId, dispensedAt: c.dispensedAt.toISOString(), pharmacistSignoff: { userId: c.pharmacistId, signedAt: c.signedOffAt.toISOString() }, partial: order.lines.some((l) => l.qtyAccepted < l.qtyRequested), lines: order.lines.map((l) => ({ sku: l.drugId, quantityRequested: l.qtyRequested, quantityDispensed: Math.min(l.qtyAccepted, l.qtyRequested) })) },
            }, tx);
            await this.settlement.recordFulfilledOrder({ orgId: c.orgId, orderRef: order.externalOrderId, orderValue: c.saleTotal });
        });
    }
    async pharmacyId(db, orgId) {
        const t = await db.tenant.findUniqueOrThrow({ where: { id: orgId } });
        return t.externalOrgId ?? t.id;
    }
    async getSetting(orgId, branchId) {
        return (await this.prisma.branchMarketplaceSetting.findUnique({ where: { branchId } })) ?? { orgId, branchId, optedIn: false, deliveryRadiusKm: (0, money_1.D)(5), openingHours: null, prepMinutes: 30, slaMinutes: 10, latitude: null, longitude: null };
    }
    async listSettings(orgId) { return this.prisma.branchMarketplaceSetting.findMany({ where: { orgId } }); }
    async putSetting(user, branchId, d) {
        const branch = await this.prisma.branch.findFirst({ where: { id: branchId, orgId: user.orgId } });
        if (!branch)
            throw (0, errors_1.notFound)("Branch", branchId);
        const data = { optedIn: d.optedIn, deliveryRadiusKm: d.deliveryRadiusKm, openingHours: d.openingHours, prepMinutes: d.prepMinutes, slaMinutes: d.slaMinutes, latitude: d.latitude, longitude: d.longitude, updatedAt: new Date() };
        const r = await this.prisma.branchMarketplaceSetting.upsert({ where: { branchId }, create: { orgId: user.orgId, branchId, ...data }, update: data });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "marketplace.settings", entityType: "Branch", entityId: branchId, meta: { optedIn: d.optedIn } } });
        return r;
    }
    async availability(orgId) {
        const { settings } = await this.optedInBranches(orgId);
        const branches = [];
        for (const s of settings) {
            const atp = await this.inv.atp(orgId, s.branchId);
            const drugs = await this.prisma.drug.findMany({ where: { id: { in: [...atp.keys()] } } });
            const items = drugs.filter((d) => (0, kiorex_projection_1.isKiorexExposable)(d)).map((d) => ({ sku: d.id, gtin: d.gtin, name: d.brandName, availableQty: atp.get(d.id) ?? 0, requiresPrescription: d.rxOnly }));
            branches.push({ branchId: s.branchId, deliveryRadiusKm: s.deliveryRadiusKm.toString(), prepMinutes: s.prepMinutes, openingHours: s.openingHours, items });
        }
        return { generatedAt: new Date().toISOString(), branches };
    }
    async ingest(orgId, input) {
        const dup = await this.prisma.kiorexOrder.findUnique({ where: { orgId_externalOrderId: { orgId, externalOrderId: input.orderId } }, include: { lines: true } });
        if (dup)
            return { order: dup, replayed: true };
        if ((0, kiorex_front_door_core_1.listingPause)((await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId }, select: { settings: true } })).settings))
            throw new errors_1.DomainError("LISTING_PAUSED", "This pharmacy paused its Kiorex listing and is not taking new orders", 409);
        const setting = await this.prisma.branchMarketplaceSetting.findFirst({ where: { orgId, branchId: input.branchId, optedIn: true } });
        if (!setting)
            throw new errors_1.DomainError("BRANCH_NOT_OPTED_IN", "Branch is not accepting Kiorex orders", 409);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: input.lines.map((l) => l.sku) }, OR: [{ orgId: null }, { orgId }] } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        for (const l of input.lines) {
            const d = dm.get(l.sku);
            if (!d)
                throw new errors_1.DomainError("UNKNOWN_SKU", `Unknown sku ${l.sku}`, 422, { sku: l.sku });
            if (!(0, kiorex_projection_1.isKiorexExposable)(d))
                throw new errors_1.DomainError("CONTROLLED_NOT_ORDERABLE", "Controlled medicines can never be ordered through Kiorex", 422, { sku: l.sku });
        }
        const priced = await this.prices.pricesAt(orgId, input.branchId, input.lines.map((l) => l.sku));
        for (const l of input.lines) {
            const p = priced.get(l.sku);
            if (!p)
                throw new errors_1.DomainError("NO_PRICE", `No price in force for ${l.sku}`, 422, { sku: l.sku });
            if (!p.equals((0, money_1.D)(l.unitPrice)))
                throw new errors_1.DomainError("PRICE_CHANGED", "The pharmacy price changed; re-quote the cart", 409, { sku: l.sku, unitPrice: (0, money_1.money)(p) });
        }
        const hasRx = input.lines.some((l) => dm.get(l.sku).rxOnly);
        const erx = input.prescription?.verificationToken && input.prescription.recordRef;
        if (hasRx && !input.prescription?.prescriberName && !erx)
            throw new errors_1.DomainError("PRESCRIPTION_REQUIRED", "Rx items need a Kiorex prescription (recordRef + verificationToken) or prescription details", 422);
        const orderValue = (0, money_1.sum)(input.lines.map((l) => (0, money_1.D)(l.unitPrice).mul(l.quantity)));
        const created = await this.prisma.$transaction(async (tx) => {
            let prescriptionId;
            if (hasRx) {
                const p = input.prescription;
                const patient = await tx.patientRef.create({ data: { orgId, externalId: p.patientRef ?? input.patientRef, displayName: input.customer?.name ?? "Kiorex patient", phone: input.customer?.phone } });
                const issued = p.issuedAt ? new Date(p.issuedAt) : new Date();
                const rx = await tx.prescription.create({
                    data: {
                        orgId, branchId: input.branchId, source: "KIOREX_UPLOAD", patientId: patient.id,
                        prescriberName: p.prescriberName ?? "Kiorex e-Rx (clinic prescriber)", prescriberLicenceNo: p.prescriberLicenceNo ?? (erx ? "KIOREX-ERX" : undefined),
                        issuedAt: issued, validUntil: new Date(issued.getTime() + prescriptions_service_1.DEFAULT_RX_VALIDITY_DAYS * 86_400_000), sourceRxRef: p.recordRef ?? p.scanRef, kiorexOrderId: input.orderId,
                    },
                });
                for (const l of input.lines.filter((x) => dm.get(x.sku).rxOnly)) {
                    const d = dm.get(l.sku);
                    await tx.prescriptionLine.create({ data: { prescriptionId: rx.id, drugId: d.id, activeIngredient: d.activeIngredient, strength: d.strength, dosageForm: d.dosageForm, drugName: d.brandName, quantity: l.quantity, controlled: false } });
                }
                prescriptionId = rx.id;
            }
            const block = (0, acquisition_fact_1.parseAcquisitionBlock)(input.acquisition, "PHARMACY");
            const acq = block ? await (0, acquisition_fact_1.acquisitionColumns)(tx, orgId, block) : {};
            const o = await tx.kiorexOrder.create({
                data: {
                    ...acq,
                    orgId, branchId: input.branchId, externalOrderId: input.orderId, hasRx, prescriptionId, customerName: input.customer?.name, customerPhone: input.customer?.phone, deliveryAddress: input.customer?.address ?? (input.delivery?.address ? JSON.stringify(input.delivery.address) : undefined), prepaid: input.prepaid ?? true,
                    patientRef: input.patientRef, deliveryMethod: input.delivery?.method, paymentRef: input.payment?.reference,
                    orderValue, slaDueAt: new Date(Date.now() + setting.slaMinutes * 60_000), lines: { create: input.lines.map((l) => ({ drugId: l.sku, qtyRequested: l.quantity, unitPrice: l.unitPrice })) },
                },
                include: { lines: true },
            });
            await tx.auditLog.create({ data: { orgId, action: "order.received", entityType: "KiorexOrder", entityId: o.id, meta: { externalOrderId: input.orderId, hasRx, lines: input.lines.length, ...(block ? { acquisitionOrigin: block.origin } : {}) } } });
            await (0, acquisition_fact_1.creditLinkOnce)(tx, orgId, o.id, "orders");
            return o;
        });
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const s = (tenant.settings ?? {});
        if (s.ownerPhone)
            await this.notify.send({ orgId, channel: "WHATSAPP", recipient: s.ownerPhone, template: "order.inbox", locale: s.defaultLocale ?? "ar", vars: { order: input.orderId, minutes: setting.slaMinutes }, refType: "KiorexOrder", refId: created.id });
        void this.push?.sendTemplate(orgId, "order.received", { order: input.orderId, minutes: setting.slaMinutes }, { roles: ["PHARMACIST", "OWNER", "BRANCH_MANAGER"], branchId: created.branchId }, { orderId: created.id });
        return { order: created, replayed: false };
    }
    async inbox(orgId, q) {
        const orders = await this.prisma.kiorexOrder.findMany({ where: { orgId, ...(q.branchId ? { branchId: q.branchId } : {}), ...(q.status ? { status: q.status } : {}) }, include: { lines: true }, orderBy: { createdAt: "desc" }, take: 100 });
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: orders.flatMap((o) => o.lines.map((l) => l.drugId)) } }, select: { id: true, brandName: true, brandNameAr: true, rxOnly: true } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        const now = Date.now();
        return orders.map((o) => ({ ...o, orderValue: (0, money_1.money)(o.orderValue), slaRemainingSeconds: o.status === "RECEIVED" ? Math.floor((o.slaDueAt.getTime() - now) / 1000) : null, slaBreached: o.status === "RECEIVED" && o.slaDueAt.getTime() < now, lines: o.lines.map((l) => ({ ...l, unitPrice: (0, money_1.money)(l.unitPrice), drug: dm.get(l.drugId) })) }));
    }
    async get(orgId, id) {
        const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId }, include: { lines: true } });
        if (!order)
            throw (0, errors_1.notFound)("Order", id);
        return order;
    }
    async accept(user, id, lineAcceptances) {
        const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId }, include: { lines: true } });
        if (!order)
            throw (0, errors_1.notFound)("Order", id);
        if (order.status !== "RECEIVED")
            throw new errors_1.DomainError("BAD_STATE", `Order is ${order.status}`, 409);
        if (order.hasRx) {
            const rx = order.prescriptionId ? await this.prisma.prescription.findFirst({ where: { id: order.prescriptionId, orgId: user.orgId } }) : null;
            if (!rx || rx.status !== "VALIDATED" || !rx.validatedBy)
                throw new errors_1.DomainError("RX_VALIDATION_REQUIRED", "A pharmacist must validate the prescription before the order can be accepted", 409, { prescriptionId: order.prescriptionId });
        }
        const want = order.lines.map((l) => ({ line: l, qty: Math.min(lineAcceptances?.find((a) => a.lineId === l.id)?.qtyAccepted ?? l.qtyRequested, l.qtyRequested) })).filter((x) => x.qty > 0);
        if (!want.length)
            throw new errors_1.DomainError("NOTHING_ACCEPTED", "Accept at least one line or reject the order", 400);
        const atp = await this.inv.atp(user.orgId, order.branchId);
        const accepted = want.map((x) => ({ ...x, qty: Math.min(x.qty, atp.get(x.line.drugId) ?? 0) })).filter((x) => x.qty > 0);
        if (!accepted.length)
            throw new errors_1.DomainError("NO_STOCK", "None of the requested items can be reserved; reject the order", 409);
        const disp = await this.dispensing.create(user, {
            branchId: order.branchId, prescriptionId: order.prescriptionId ?? undefined, kiorexOrderId: order.id,
            items: accepted.map((a) => ({ drugId: a.line.drugId, quantity: a.qty })),
        });
        const full = accepted.length === order.lines.length && accepted.every((a) => a.qty === a.line.qtyRequested);
        try {
            await this.prisma.$transaction(async (tx) => {
                const won = await tx.kiorexOrder.updateMany({ where: { id, status: "RECEIVED" }, data: { status: full ? "ACCEPTED" : "PARTIALLY_ACCEPTED", respondedAt: new Date(), respondedBy: user.userId, dispensingId: disp.id } });
                if (!won.count)
                    throw new errors_1.DomainError("BAD_STATE", "Order is no longer open (cancelled, rejected or expired while it was being accepted)", 409);
                for (const a of accepted)
                    await tx.kiorexOrderLine.update({ where: { id: a.line.id }, data: { qtyAccepted: a.qty } });
                await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.accept", entityType: "KiorexOrder", entityId: id, meta: { partial: !full, dispensingId: disp.id } } });
            });
        }
        catch (e) {
            await this.dispensing.cancel(user, disp.id, "Order no longer open when accepted").catch(() => undefined);
            throw e;
        }
        return { order: await this.get(user.orgId, id), dispensing: disp };
    }
    async reject(user, id, reason, reasonCode) {
        const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId } });
        if (!order)
            throw (0, errors_1.notFound)("Order", id);
        if (!["RECEIVED", "ACCEPTED", "PARTIALLY_ACCEPTED", "READY", "OUT_FOR_DELIVERY"].includes(order.status))
            throw new errors_1.DomainError("BAD_STATE", `Order is ${order.status}`, 409);
        if (order.dispensingId)
            await this.dispensing.cancel(user, order.dispensingId, `Order rejected: ${reason}`);
        await this.prisma.$transaction(async (tx) => {
            const won = await tx.kiorexOrder.updateMany({ where: { id, status: order.status }, data: { status: "REJECTED", rejectionReason: reason, rejectionCode: reasonCode, respondedAt: new Date(), respondedBy: user.userId } });
            if (!won.count)
                throw new errors_1.DomainError("BAD_STATE", "Order changed while it was being rejected; reload", 409);
            await this.outbox.enqueue({ orgId: user.orgId, type: "OrderRejected", aggregateId: order.externalOrderId, dedupeKey: `OrderRejected:${order.id}`, data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, user.orgId), rejectedAt: new Date().toISOString(), reason, ...(reasonCode ? { reasonCode } : {}) } }, tx);
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.reject", entityType: "KiorexOrder", entityId: id, meta: { reasonCode: reasonCode ?? null } } });
        });
        return this.get(user.orgId, id);
    }
    async markReady(user, id) {
        const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId } });
        if (!order)
            throw (0, errors_1.notFound)("Order", id);
        if (!["ACCEPTED", "PARTIALLY_ACCEPTED"].includes(order.status) || !order.dispensingId)
            throw new errors_1.DomainError("BAD_STATE", `Order is ${order.status}`, 409);
        const d = await this.prisma.dispensing.findUniqueOrThrow({ where: { id: order.dispensingId } });
        if (d.status !== "SIGNED_OFF" || !d.pharmacistId || !d.signedOffAt)
            throw new errors_1.DomainError("SIGNOFF_REQUIRED", "A pharmacist must sign off the dispensing before the order is ready", 409);
        await this.prisma.$transaction(async (tx) => {
            await tx.kiorexOrder.update({ where: { id }, data: { status: "READY", readyAt: new Date() } });
            await this.outbox.enqueue({
                orgId: user.orgId, type: "OrderReady", aggregateId: order.externalOrderId, dedupeKey: `OrderReady:${order.id}`,
                data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, user.orgId), branchId: order.branchId, readyAt: new Date().toISOString(), pharmacistSignoff: { userId: d.pharmacistId, signedAt: d.signedOffAt.toISOString() } },
            }, tx);
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.ready", entityType: "KiorexOrder", entityId: id } });
        });
        if (order.customerPhone) {
            const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
            const locale = (tenant.settings ?? {}).defaultLocale ?? "ar";
            const method = order.deliveryMethod === "DELIVERY" ? (locale === "ar" ? "التوصيل" : "delivery") : locale === "ar" ? "الاستلام" : "pickup";
            await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: order.customerPhone, template: "order.ready", locale, vars: { pharmacy: tenant.name, order: order.externalOrderId, method }, refType: "KiorexOrder", refId: order.id }).catch(() => undefined);
        }
        return this.get(user.orgId, id);
    }
    async markOutForDelivery(user, id, d = {}) {
        const order = await this.prisma.kiorexOrder.findFirst({ where: { id, orgId: user.orgId } });
        if (!order)
            throw (0, errors_1.notFound)("Order", id);
        if (order.deliveryMethod !== "DELIVERY")
            throw new errors_1.DomainError("NOT_A_DELIVERY_ORDER", "Only delivery orders can be sent out for delivery", 409);
        if (order.status === "OUT_FOR_DELIVERY")
            return this.get(user.orgId, id);
        if (order.status !== "READY")
            throw new errors_1.DomainError("BAD_STATE", `Order is ${order.status}; it must be READY first`, 409);
        const now = new Date();
        await this.prisma.$transaction(async (tx) => {
            const moved = await tx.kiorexOrder.updateMany({ where: { id, orgId: user.orgId, status: "READY" }, data: { status: "OUT_FOR_DELIVERY", outForDeliveryAt: now } });
            if (!moved.count)
                return;
            await this.outbox.enqueue({
                orgId: user.orgId, type: "OrderOutForDelivery", aggregateId: order.externalOrderId, dedupeKey: `OrderOutForDelivery:${order.id}`,
                data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, user.orgId), branchId: order.branchId, outForDeliveryAt: now.toISOString(), ...(d.estimatedMinutes ? { estimatedDeliveryMinutes: d.estimatedMinutes } : {}), dispatchedBy: { userId: user.userId } },
            }, tx);
            await tx.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "order.out_for_delivery", entityType: "KiorexOrder", entityId: id } });
        });
        if (order.customerPhone) {
            const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: user.orgId } });
            const locale = (tenant.settings ?? {}).defaultLocale ?? "ar";
            await this.notify.send({ orgId: user.orgId, channel: "WHATSAPP", recipient: order.customerPhone, template: "order.out_for_delivery", locale, vars: { pharmacy: tenant.name, order: order.externalOrderId }, refType: "KiorexOrder", refId: order.id }).catch(() => undefined);
        }
        return this.get(user.orgId, id);
    }
    async cancelByKiorex(orgId, externalOrderId) {
        for (let attempt = 0; attempt < 4; attempt++) {
            const order = await this.prisma.kiorexOrder.findUnique({ where: { orgId_externalOrderId: { orgId, externalOrderId } } });
            if (!order)
                throw (0, errors_1.notFound)("Order", externalOrderId);
            if (order.status === "DISPENSED")
                throw new errors_1.DomainError("ALREADY_DISPENSED", "Order already dispensed", 409);
            if (["REJECTED", "EXPIRED", "CANCELLED"].includes(order.status))
                return { status: order.status };
            if (order.dispensingId && ["ACCEPTED", "PARTIALLY_ACCEPTED", "READY", "OUT_FOR_DELIVERY"].includes(order.status)) {
                const sys = await this.prisma.staffUser.findFirst({ where: { orgId, role: "OWNER" } });
                if (sys)
                    await this.dispensing.cancel({ userId: sys.id, orgId, role: sys.role, displayName: sys.displayName, branchId: null, market: "EG", edition: "LITE", pharmacistLicenceNo: null, mfa: false }, order.dispensingId, "Cancelled by Kiorex").catch((e) => { if (e?.code !== "BAD_STATE" && e?.status !== 409)
                        throw e; });
            }
            const won = await this.prisma.kiorexOrder.updateMany({ where: { id: order.id, status: order.status, dispensingId: order.dispensingId }, data: { status: "CANCELLED" } });
            if (!won.count)
                continue;
            await this.prisma.auditLog.create({ data: { orgId, action: "order.cancel_by_kiorex", entityType: "KiorexOrder", entityId: order.id } });
            return { status: "CANCELLED" };
        }
        throw new errors_1.DomainError("ORDER_BUSY", "The order is being changed; try again", 409);
    }
    async expireOverdue(orgId) {
        const overdue = await this.prisma.kiorexOrder.findMany({ where: { ...(orgId ? { orgId } : {}), status: "RECEIVED", slaDueAt: { lt: new Date() } } });
        for (const o of overdue) {
            await this.prisma.$transaction(async (tx) => {
                const won = await tx.kiorexOrder.updateMany({ where: { id: o.id, status: "RECEIVED" }, data: { status: "EXPIRED", rejectionCode: "SLA_EXPIRED", rejectionReason: "No response within SLA" } });
                if (!won.count)
                    return;
                await this.outbox.enqueue({ orgId: o.orgId, type: "OrderRejected", aggregateId: o.externalOrderId, dedupeKey: `OrderRejected:${o.id}`, data: { orderId: o.externalOrderId, pharmacyId: await this.pharmacyId(tx, o.orgId), rejectedAt: new Date().toISOString(), reason: "No response within SLA", reasonCode: "SLA_EXPIRED" } }, tx);
            });
        }
        return { expired: overdue.length };
    }
    async optedInBranches(orgId, branchId) {
        const tenant = await this.prisma.tenant.findUniqueOrThrow({ where: { id: orgId } });
        const settings = (0, kiorex_front_door_core_1.listingPause)(tenant.settings) ? [] : await this.prisma.branchMarketplaceSetting.findMany({ where: { orgId, optedIn: true, ...(branchId ? { branchId } : {}) } });
        const branches = await this.prisma.branch.findMany({ where: { orgId, id: { in: settings.map((x) => x.branchId) }, active: true } });
        return { settings, branches, tenant };
    }
    async pharmacies(orgId) {
        const { settings, branches, tenant } = await this.optedInBranches(orgId);
        const fee = Number((tenant.settings ?? {}).kiorexDeliveryFeeMinor ?? 0);
        return {
            items: settings.flatMap((s) => {
                const b = branches.find((x) => x.id === s.branchId);
                if (!b)
                    return [];
                const radius = Number(s.deliveryRadiusKm.toString());
                return [{ id: b.id, name: `${tenant.name} - ${b.name}`, delivery: { enabled: radius > 0, feeMinor: fee, radiusKm: radius }, pickup: true, prepMinutes: s.prepMinutes }];
            }),
        };
    }
    async catalogue(orgId, q) {
        const { settings } = await this.optedInBranches(orgId, q.branchId);
        const items = [];
        for (const s of settings) {
            const atp = await this.inv.atp(orgId, s.branchId);
            const needle = q.q?.trim();
            const drugs = await this.prisma.drug.findMany({
                where: { id: { in: [...atp.keys()] }, active: true, controlledSchedule: "NONE", ...(needle ? { OR: [{ brandName: { contains: needle, mode: "insensitive" } }, { activeIngredient: { contains: needle, mode: "insensitive" } }, { brandNameAr: { contains: needle } }] } : {}) },
                take: 100, orderBy: { brandName: "asc" },
            });
            const priced = await this.prices.pricesAt(orgId, s.branchId, drugs.map((d) => d.id));
            for (const d of drugs) {
                const p = priced.get(d.id);
                const proj = (0, kiorex_projection_2.projectDrugForKiorex)(d);
                if (!p || !proj)
                    continue;
                items.push({ pharmacyId: s.branchId, sku: d.id, name: d.brandName, ...(d.brandNameAr ? { nameAr: d.brandNameAr } : {}), activeIngredient: d.activeIngredient, strength: d.strength, form: d.dosageForm, ...((0, kiorex_projection_2.dosageFormAr)(d.dosageForm) ? { formAr: (0, kiorex_projection_2.dosageFormAr)(d.dosageForm) } : {}), priceMinor: toMinor(p), rxRequired: d.rxOnly, controlled: false, available: (atp.get(d.id) ?? 0) > 0, availableQty: atp.get(d.id) ?? 0 });
            }
        }
        return { items };
    }
    async quote(orgId, b) {
        const { settings, branches, tenant } = await this.optedInBranches(orgId, b.pharmacyId);
        if (!settings.length || !branches.length)
            throw new errors_1.DomainError("BRANCH_NOT_OPTED_IN", "Branch is not accepting Kiorex orders", 409);
        const drugs = await this.prisma.drug.findMany({ where: { id: { in: b.items.map((i) => i.sku) }, OR: [{ orgId: null }, { orgId }] } });
        const dm = new Map(drugs.map((d) => [d.id, d]));
        const atp = await this.inv.atp(orgId, b.pharmacyId);
        const priced = await this.prices.pricesAt(orgId, b.pharmacyId, drugs.map((d) => d.id));
        const items = b.items.map((i) => {
            const d = dm.get(i.sku);
            if (!d)
                throw new errors_1.DomainError("UNKNOWN_SKU", `Unknown sku ${i.sku}`, 422, { sku: i.sku });
            const controlled = d.controlledSchedule !== "NONE";
            const p = priced.get(d.id);
            return { sku: d.id, name: d.brandName, ...(d.brandNameAr ? { nameAr: d.brandNameAr } : {}), strength: d.strength, form: d.dosageForm, ...((0, kiorex_projection_2.dosageFormAr)(d.dosageForm) ? { formAr: (0, kiorex_projection_2.dosageFormAr)(d.dosageForm) } : {}), qty: i.qty, unitPriceMinor: p ? toMinor(p) : 0, rxRequired: d.rxOnly, controlled, available: !controlled && !!p && d.active && (atp.get(d.id) ?? 0) >= i.qty };
        });
        const fee = Number((tenant.settings ?? {}).kiorexDeliveryFeeMinor ?? 0);
        return { items, ...(b.delivery?.method === "DELIVERY" ? { delivery: { feeMinor: fee } } : {}) };
    }
    async kiorexBase(orgId) {
        const c = await this.prisma.integrationClient.findFirst({ where: { orgId, active: true }, orderBy: { createdAt: "asc" } });
        return (c?.kiorexBaseUrl ?? process.env.KIOREX_BASE_URL ?? "http://localhost:4000").replace(/\/+$/, "");
    }
    async verifyWithKiorex(orgId, token) {
        try {
            const res = await fetch(`${await this.kiorexBase(orgId)}/api/v1/rx/verify?t=${encodeURIComponent(token)}`, { signal: AbortSignal.timeout(5000) });
            return res.ok ? (await res.json()) : null;
        }
        catch {
            return null;
        }
    }
    async validatePrescription(orgId, b) {
        const order = await this.prisma.kiorexOrder.findUnique({ where: { orgId_externalOrderId: { orgId, externalOrderId: b.orderId } } });
        if (!order)
            throw (0, errors_1.notFound)("Order", b.orderId);
        if (!order.hasRx || !order.prescriptionId)
            return { status: "INVALID", reason: "ORDER_HAS_NO_PRESCRIPTION" };
        const verdict = await this.verifyWithKiorex(orgId, b.verificationToken);
        if (!verdict)
            return { status: "PENDING", reason: "KIOREX_UNREACHABLE" };
        if (!verdict.valid) {
            await this.prisma.prescription.update({ where: { id: order.prescriptionId }, data: { status: "REJECTED", rejectionReason: `Kiorex token ${verdict.status ?? "INVALID"}` } });
            if (["RECEIVED", "ACCEPTED", "PARTIALLY_ACCEPTED"].includes(order.status)) {
                await this.prisma.$transaction(async (tx) => {
                    await tx.kiorexOrder.update({ where: { id: order.id }, data: { status: "REJECTED", rejectionReason: "Prescription token invalid", rejectionCode: "RX_INVALID", respondedAt: new Date() } });
                    await this.outbox.enqueue({ orgId, type: "OrderRejected", aggregateId: order.externalOrderId, dedupeKey: `OrderRejected:${order.id}`, data: { orderId: order.externalOrderId, pharmacyId: await this.pharmacyId(tx, orgId), rejectedAt: new Date().toISOString(), reason: "Prescription token invalid", reasonCode: "RX_INVALID" } }, tx);
                    await tx.auditLog.create({ data: { orgId, action: "order.rx_invalid", entityType: "KiorexOrder", entityId: order.id } });
                });
            }
            return { status: "INVALID", reason: `RX_${verdict.status ?? "INVALID"}` };
        }
        const rx = await this.prisma.prescription.update({ where: { id: order.prescriptionId }, data: { clinicRef: verdict.clinicId ?? undefined, ...(verdict.signedAt ? { issuedAt: new Date(verdict.signedAt) } : {}) } });
        return rx.status === "VALIDATED" && rx.validatedBy ? { status: "VALID" } : { status: "PENDING", reason: "PHARMACIST_VALIDATION_REQUIRED" };
    }
    async createClient(user, d) {
        const key = d.key ?? `kp_${(0, node_crypto_1.randomBytes)(9).toString("hex")}`;
        const secret = d.secret ?? (0, node_crypto_1.randomBytes)(32).toString("base64url");
        const webhookSecret = d.webhookSecret ?? (0, node_crypto_1.randomBytes)(32).toString("base64url");
        const c = await this.prisma.integrationClient.create({ data: { orgId: user.orgId, key, secretEnc: (0, secret_box_1.seal)(secret), webhookSecretEnc: (0, secret_box_1.seal)(webhookSecret), kiorexBaseUrl: d.kiorexBaseUrl } });
        await this.prisma.auditLog.create({ data: { orgId: user.orgId, actorId: user.userId, action: "integration_client.create", entityType: "IntegrationClient", entityId: c.id } });
        return { id: c.id, key, secret, webhookSecret, kiorexBaseUrl: c.kiorexBaseUrl };
    }
    listClients(orgId) { return this.prisma.integrationClient.findMany({ where: { orgId }, select: { id: true, key: true, source: true, kiorexBaseUrl: true, active: true, createdAt: true } }); }
};
exports.MarketplaceService = MarketplaceService;
exports.MarketplaceService = MarketplaceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(outbox_service_1.OutboxService)),
    __param(2, (0, common_1.Inject)(dispense_hooks_1.DispenseHooks)),
    __param(3, (0, common_1.Inject)(dispensing_service_1.DispensingService)),
    __param(4, (0, common_1.Inject)(inventory_service_1.InventoryService)),
    __param(5, (0, common_1.Inject)(ports_1.KERNEL.settlement)),
    __param(6, (0, common_1.Inject)(notifications_service_1.NotificationsService)),
    __param(7, (0, common_1.Inject)(price_service_1.PriceService)),
    __param(8, (0, common_1.Optional)()),
    __param(8, (0, common_1.Inject)(push_service_1.PushService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        outbox_service_1.OutboxService,
        dispense_hooks_1.DispenseHooks,
        dispensing_service_1.DispensingService,
        inventory_service_1.InventoryService, Object, notifications_service_1.NotificationsService,
        price_service_1.PriceService,
        push_service_1.PushService])
], MarketplaceService);
//# sourceMappingURL=marketplace.service.js.map