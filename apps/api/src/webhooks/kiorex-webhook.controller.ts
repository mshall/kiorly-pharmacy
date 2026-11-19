import { Controller, Headers, HttpCode, Inject, Module, Post, Req, UnauthorizedException, UseGuards, BadRequestException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { verifyWebhook, WEBHOOK_HEADERS } from "@kiorex/contracts";
import { open } from "../common/secret-box";
import { Public } from "../auth/decorators";
import { PrismaService } from "../prisma/prisma.service";
import { PrescriptionsService } from "../modules/prescriptions/prescriptions.service";
import { PrescriptionsModule } from "../modules/prescriptions/prescriptions.module";
import { RequiresFlag, RequiresFlagGuard } from "../feature-flags/requires-flag.guard";
import { DomainError } from "../common/errors";

/**
 * Inbound Kiorex events (Kiorex -> pharmacy), signed with the webhook scheme (X-Kiorly-Timestamp seconds + X-Kiorly-Signature sha256=HMAC(ts.body)).
 * Handles PrescriptionIssued (KPRX01). At-least-once delivery: de-duplicated on eventId. Unknown types are acknowledged (forward compatibility).
 * Addressing (NH-PH-024 resolved, kiorex-contracts 1.4.0): Kiorex sends X-Kiorly-Client-Key (the tenant's integration client key), which
 * selects the tenant AND the per-tenant webhook secret; the branch is optional via X-Kiorex-Branch-Id (default: first active branch).
 */
@ApiTags("webhooks")
@Public()
@Controller("webhooks")
export class KiorexWebhookController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService, @Inject(PrescriptionsService) private readonly rx: PrescriptionsService) {}

  @Post("kiorex")
  @HttpCode(200)
  @UseGuards(RequiresFlagGuard)
  @RequiresFlag("pharmacy.module")
  async receive(@Req() req: { rawBody?: Buffer; body: Record<string, unknown>; flagContext?: { orgId?: string; market?: string } }, @Headers() h: Record<string, string>) {
    const key = h[WEBHOOK_HEADERS.clientKey.toLowerCase()];
    const client = key ? await this.prisma.integrationClient.findUnique({ where: { key } }) : null;
    if (!client || !client.active || !client.webhookSecretEnc) throw new UnauthorizedException({ statusCode: 401, code: "INVALID_CLIENT", message: "unknown client key" });
    const secret = open(client.webhookSecretEnc);
    const raw = req.rawBody ?? Buffer.from(JSON.stringify(req.body));
    const v = verifyWebhook({ secret, body: raw, timestamp: h["x-kiorly-timestamp"], signature: h["x-kiorly-signature"] });
    if (!v.ok) throw new UnauthorizedException({ statusCode: 401, code: "BAD_SIGNATURE", message: v.reason });
    const type = String(req.body.type ?? "");
    const eventId = String(req.body.eventId ?? "");
    if (!eventId) throw new BadRequestException({ statusCode: 400, code: "EVENT_ID_REQUIRED", message: "eventId required" });
    if (type !== "PrescriptionIssued") {
      return { accepted: true, ignored: true, type };
    }
    const tenant = await this.prisma.tenant.findUnique({ where: { id: client.orgId } });
    if (!tenant) throw new DomainError("UNKNOWN_ORG", "client key is not bound to a pharmacy tenant", 404);
    const branchId = h["x-kiorex-branch-id"] ?? (await this.prisma.branch.findFirst({ where: { orgId: tenant.id, active: true }, orderBy: { createdAt: "asc" } }))?.id;
    if (!branchId) throw new DomainError("NO_BRANCH", "Tenant has no branch", 409);
    const dup = await this.prisma.inboundEvent.findUnique({ where: { orgId_eventId: { orgId: tenant.id, eventId } } });
    if (dup) return { accepted: true, duplicate: true };
    const r = await this.rx.intakeEvent(tenant.id, branchId, req.body);
    return { accepted: true, ...r };
  }
}

@Module({ imports: [PrescriptionsModule], controllers: [KiorexWebhookController] })
export class WebhooksModule {}
