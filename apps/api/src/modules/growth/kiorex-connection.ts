import type { PrismaService } from "../../prisma/prisma.service";

/**
 * Is this pharmacy connected to Kiorex? The same reading the Connect to Kiorex front door uses (`KiorexConnectService.get`), without the Kiorex pull or the
 * catalogue count: a pharmacy is connected when its recorded connection status is APPROVED, or it is a legacy connection (no recorded state, an active
 * integration client and a tenant that is not STANDALONE). A paused, requested or standalone pharmacy is NOT connected, so no link event reaches Kiorex.
 */
export async function isKiorexConnected(prisma: Pick<PrismaService, "tenant" | "integrationClient">, orgId: string): Promise<boolean> {
  const t = await prisma.tenant.findUnique({ where: { id: orgId }, select: { settings: true } });
  if (!t) return false;
  const s = (t.settings ?? {}) as { mode?: string; kiorexConnect?: { status?: string } };
  if (s.mode === "STANDALONE" && !s.kiorexConnect) return false;
  if (s.kiorexConnect) return s.kiorexConnect.status === "APPROVED";
  return (await prisma.integrationClient.count({ where: { orgId, active: true } })) > 0 && s.mode !== "STANDALONE";
}
