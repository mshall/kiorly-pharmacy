import type { PrismaService } from "../prisma/prisma.service";
import { cleanOrgHint, deploymentDefaultMethod, effectiveOrgDefault, resolvePublicSignInConfig, type OrgSignInFacts, type SignInDefaultMethod } from "./sign-in-default";

/** Linked to Kiorex = a Kiorex org id, an active Kiorex integration client (marketplace link), or an active staff member with a Passport subject. */
export async function tenantLinkedToKiorex(prisma: PrismaService, t: { id: string; externalOrgId: string | null }): Promise<boolean> {
  if (t.externalOrgId) return true;
  if ((await prisma.integrationClient.count({ where: { orgId: t.id, active: true } })) > 0) return true;
  return (await prisma.staffUser.count({ where: { orgId: t.id, active: true, subject: { not: null } } })) > 0;
}

/** Facts for `?org=<organisation id>` (the Pharmacy has no slug: the id is remembered on this browser after a sign-in); null for a missing or unknown org. */
export async function orgSignInFacts(prisma: PrismaService, orgHint: unknown): Promise<OrgSignInFacts | null> {
  const id = cleanOrgHint(orgHint);
  if (!id) return null;
  const t = await prisma.tenant.findUnique({ where: { id }, select: { id: true, externalOrgId: true, defaultSignInMethod: true } });
  if (!t) return null;
  return { stored: t.defaultSignInMethod, linkedToKiorex: await tenantLinkedToKiorex(prisma, t) };
}

export { deploymentDefaultMethod, effectiveOrgDefault, resolvePublicSignInConfig };
export type { SignInDefaultMethod };
