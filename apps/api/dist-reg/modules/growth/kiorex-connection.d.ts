import type { PrismaService } from "../../prisma/prisma.service";
export declare function isKiorexConnected(prisma: Pick<PrismaService, "tenant" | "integrationClient">, orgId: string): Promise<boolean>;
