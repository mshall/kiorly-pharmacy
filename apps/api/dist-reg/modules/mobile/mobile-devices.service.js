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
exports.MobileDevicesService = exports.isDeviceAdmin = exports.sha256 = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
const audit_service_1 = require("../../audit/audit.service");
const errors_1 = require("../../common/errors");
const sha256 = (s) => (0, node_crypto_1.createHash)("sha256").update(s).digest("hex");
exports.sha256 = sha256;
const MANAGER_ROLES = ["OWNER", "BRANCH_MANAGER"];
const isDeviceAdmin = (u) => MANAGER_ROLES.includes(u.role);
exports.isDeviceAdmin = isDeviceAdmin;
const view = (d, userName) => ({
    id: d.id, deviceId: d.deviceId, userId: d.userId, userName: userName ?? null, platform: d.platform, name: d.name, appVersion: d.appVersion, status: d.status,
    pushRegistered: !!d.pushToken, pushProvider: d.pushProvider, lastSeenAt: d.lastSeenAt, createdAt: d.createdAt, revokedAt: d.revokedAt,
});
let MobileDevicesService = class MobileDevicesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async register(u, d) {
        const deviceToken = (0, node_crypto_1.randomBytes)(32).toString("base64url");
        const data = { orgId: u.orgId, platform: d.platform, name: d.name, appVersion: d.appVersion ?? null, tokenHash: (0, exports.sha256)(deviceToken), status: "ACTIVE", revokedAt: null, revokedBy: null, lastSeenAt: new Date(), ...(d.pushToken ? { pushToken: d.pushToken, pushProvider: "expo" } : {}) };
        const row = await this.prisma.mobileDevice.upsert({ where: { userId_deviceId: { userId: u.userId, deviceId: d.deviceId } }, create: { ...data, userId: u.userId, deviceId: d.deviceId }, update: data });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.device_register", entityType: "MobileDevice", entityId: row.id, meta: { platform: d.platform } });
        return { id: row.id, deviceToken, status: row.status };
    }
    async list(u) {
        const rows = await this.prisma.mobileDevice.findMany({ where: { orgId: u.orgId, ...((0, exports.isDeviceAdmin)(u) ? {} : { userId: u.userId }) }, orderBy: { createdAt: "desc" }, take: 200 });
        const users = await this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.userId))] } }, select: { id: true, displayName: true } });
        const nm = new Map(users.map((x) => [x.id, x.displayName]));
        return { items: rows.map((r) => view(r, nm.get(r.userId))) };
    }
    async revoke(u, id) {
        const row = await this.prisma.mobileDevice.findFirst({ where: { id, orgId: u.orgId } });
        if (!row || (row.userId !== u.userId && !(0, exports.isDeviceAdmin)(u)))
            throw (0, errors_1.notFound)("Device", id);
        if (row.status === "REVOKED")
            return view(row);
        const r = await this.prisma.mobileDevice.update({ where: { id }, data: { status: "REVOKED", revokedAt: new Date(), revokedBy: u.userId, pushToken: null } });
        await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.device_revoke", entityType: "MobileDevice", entityId: id, meta: { own: row.userId === u.userId } });
        return view(r);
    }
    async setPushToken(u, id, token, provider) {
        const row = await this.prisma.mobileDevice.findFirst({ where: { id, orgId: u.orgId, userId: u.userId } });
        if (!row)
            throw (0, errors_1.notFound)("Device", id);
        if (row.status !== "ACTIVE")
            throw new errors_1.DomainError("DEVICE_REVOKED", "This device was signed out remotely", 401);
        return view(await this.prisma.mobileDevice.update({ where: { id }, data: { pushToken: token, pushProvider: provider } }));
    }
    async verify(u, deviceRef, token) {
        if (!deviceRef || !token)
            return null;
        const row = await this.prisma.mobileDevice.findFirst({ where: { userId: u.userId, orgId: u.orgId, OR: [{ id: deviceRef }, { deviceId: deviceRef }] } });
        const a = Buffer.from(row?.tokenHash ?? "0"), b = Buffer.from((0, exports.sha256)(token));
        if (!row || row.status !== "ACTIVE" || a.length !== b.length || !(0, node_crypto_1.timingSafeEqual)(a, b))
            throw new errors_1.DomainError("DEVICE_REVOKED", "This device is not registered or was signed out", 401);
        if (!row.lastSeenAt || Date.now() - row.lastSeenAt.getTime() > 30_000)
            await this.prisma.mobileDevice.update({ where: { id: row.id }, data: { lastSeenAt: new Date() } });
        return { id: row.id, status: row.status };
    }
    async peek(u, deviceRef) {
        if (!deviceRef)
            return null;
        const row = await this.prisma.mobileDevice.findFirst({ where: { userId: u.userId, OR: [{ id: deviceRef }, { deviceId: deviceRef }] } });
        return row ? { id: row.id, status: row.status } : null;
    }
};
exports.MobileDevicesService = MobileDevicesService;
exports.MobileDevicesService = MobileDevicesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(prisma_service_1.PrismaService)),
    __param(1, (0, common_1.Inject)(audit_service_1.AuditService)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], MobileDevicesService);
//# sourceMappingURL=mobile-devices.service.js.map