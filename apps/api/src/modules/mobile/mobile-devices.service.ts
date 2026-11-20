import { Inject, Injectable } from "@nestjs/common";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { PrismaService } from "../../prisma/prisma.service";
import { AuditService } from "../../audit/audit.service";
import { DomainError, notFound } from "../../common/errors";
import type { AuthUser } from "../../auth/auth-user";

export const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");
const MANAGER_ROLES = ["OWNER", "BRANCH_MANAGER"];
export const isDeviceAdmin = (u: AuthUser) => MANAGER_ROLES.includes(u.role);

const view = (d: { id: string; deviceId: string; userId: string; platform: string; name: string; appVersion: string | null; status: string; pushProvider: string | null; pushToken: string | null; lastSeenAt: Date | null; createdAt: Date; revokedAt: Date | null }, userName?: string) => ({
  id: d.id, deviceId: d.deviceId, userId: d.userId, userName: userName ?? null, platform: d.platform, name: d.name, appVersion: d.appVersion, status: d.status,
  pushRegistered: !!d.pushToken, pushProvider: d.pushProvider, lastSeenAt: d.lastSeenAt, createdAt: d.createdAt, revokedAt: d.revokedAt,
});

@Injectable()
export class MobileDevicesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(AuditService) private readonly audit: AuditService) {}

  /** Idempotent per (user, deviceId): re-registering rotates the device token and re-activates the row (the user just authenticated again). */
  async register(u: AuthUser, d: { deviceId: string; platform: string; name: string; appVersion?: string; pushToken?: string }) {
    const deviceToken = randomBytes(32).toString("base64url");
    const data = { orgId: u.orgId, platform: d.platform, name: d.name, appVersion: d.appVersion ?? null, tokenHash: sha256(deviceToken), status: "ACTIVE", revokedAt: null, revokedBy: null, lastSeenAt: new Date(), ...(d.pushToken ? { pushToken: d.pushToken, pushProvider: "expo" } : {}) };
    const row = await this.prisma.mobileDevice.upsert({ where: { userId_deviceId: { userId: u.userId, deviceId: d.deviceId } }, create: { ...data, userId: u.userId, deviceId: d.deviceId }, update: data });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.device_register", entityType: "MobileDevice", entityId: row.id, meta: { platform: d.platform } });
    return { id: row.id, deviceToken, status: row.status as "ACTIVE" };
  }

  async list(u: AuthUser) {
    const rows = await this.prisma.mobileDevice.findMany({ where: { orgId: u.orgId, ...(isDeviceAdmin(u) ? {} : { userId: u.userId }) }, orderBy: { createdAt: "desc" }, take: 200 });
    const users = await this.prisma.staffUser.findMany({ where: { id: { in: [...new Set(rows.map((r) => r.userId))] } }, select: { id: true, displayName: true } });
    const nm = new Map(users.map((x) => [x.id, x.displayName]));
    return { items: rows.map((r) => view(r, nm.get(r.userId))) };
  }

  /** Remote sign-out: own device, or any tenant device for OWNER / BRANCH_MANAGER. Idempotent. */
  async revoke(u: AuthUser, id: string) {
    const row = await this.prisma.mobileDevice.findFirst({ where: { id, orgId: u.orgId } });
    if (!row || (row.userId !== u.userId && !isDeviceAdmin(u))) throw notFound("Device", id);
    if (row.status === "REVOKED") return view(row);
    const r = await this.prisma.mobileDevice.update({ where: { id }, data: { status: "REVOKED", revokedAt: new Date(), revokedBy: u.userId, pushToken: null } });
    await this.audit.record({ orgId: u.orgId, actorId: u.userId, action: "mobile.device_revoke", entityType: "MobileDevice", entityId: id, meta: { own: row.userId === u.userId } });
    return view(r);
  }

  async setPushToken(u: AuthUser, id: string, token: string, provider: "expo" | "mock") {
    const row = await this.prisma.mobileDevice.findFirst({ where: { id, orgId: u.orgId, userId: u.userId } });
    if (!row) throw notFound("Device", id);
    if (row.status !== "ACTIVE") throw new DomainError("DEVICE_REVOKED", "This device was signed out remotely", 401);
    return view(await this.prisma.mobileDevice.update({ where: { id }, data: { pushToken: token, pushProvider: provider } }));
  }

  /** Resolve the calling device from headers (X-Kiorly-Device = server id or client deviceId). Returns null when no device headers were sent. */
  async verify(u: AuthUser, deviceRef: string | undefined, token: string | undefined): Promise<{ id: string; status: string } | null> {
    if (!deviceRef || !token) return null;
    const row = await this.prisma.mobileDevice.findFirst({ where: { userId: u.userId, orgId: u.orgId, OR: [{ id: deviceRef }, { deviceId: deviceRef }] } });
    const a = Buffer.from(row?.tokenHash ?? "0"), b = Buffer.from(sha256(token));
    if (!row || row.status !== "ACTIVE" || a.length !== b.length || !timingSafeEqual(a, b)) throw new DomainError("DEVICE_REVOKED", "This device is not registered or was signed out", 401);
    if (!row.lastSeenAt || Date.now() - row.lastSeenAt.getTime() > 30_000) await this.prisma.mobileDevice.update({ where: { id: row.id }, data: { lastSeenAt: new Date() } });
    return { id: row.id, status: row.status };
  }

  /** Bootstrap helper: device status for the header without failing (a revoked device is reported, the guard already rejected bad tokens). */
  async peek(u: AuthUser, deviceRef: string | undefined) {
    if (!deviceRef) return null;
    const row = await this.prisma.mobileDevice.findFirst({ where: { userId: u.userId, OR: [{ id: deviceRef }, { deviceId: deviceRef }] } });
    return row ? { id: row.id, status: row.status } : null;
  }
}
