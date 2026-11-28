"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isKiorexConnected = isKiorexConnected;
async function isKiorexConnected(prisma, orgId) {
    const t = await prisma.tenant.findUnique({ where: { id: orgId }, select: { settings: true } });
    if (!t)
        return false;
    const s = (t.settings ?? {});
    if (s.mode === "STANDALONE" && !s.kiorexConnect)
        return false;
    if (s.kiorexConnect)
        return s.kiorexConnect.status === "APPROVED";
    return (await prisma.integrationClient.count({ where: { orgId, active: true } })) > 0 && s.mode !== "STANDALONE";
}
//# sourceMappingURL=kiorex-connection.js.map