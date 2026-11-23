import { Controller, ForbiddenException, Get, Headers, HttpCode, Inject, NotFoundException, Param, Post, Query, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators";
import { ProviderEventsService } from "./provider-events.service";
import { WEBHOOK_KINDS, type ProviderKind } from "./provider-env";
import { SIGNATURE_HEADER } from "./webhook-signature";
import { providerConfig } from "./provider-env";
import { VENDOR_WEBHOOKS, vendorOf } from "./vendor-kit";

/** Public, HMAC-authenticated callbacks: POST /api/v1/webhooks/providers/{sms|email|whatsapp|payment|consent} (header X-Kiorex-Signature: t=<unix>,v1=<hmac>). */
@ApiTags("provider-webhooks")
@Controller("webhooks/providers")
export class ProviderWebhooksController {
  constructor(@Inject(ProviderEventsService) private readonly events: ProviderEventsService) {}

  @Public()
  @Post(":kind")
  @HttpCode(200)
  receive(@Param("kind") kindParam: string, @Req() req: { rawBody?: Buffer; headers?: Record<string, unknown> }, @Headers(SIGNATURE_HEADER) signature?: string, @Query() query: Record<string, unknown> = {}) {
    const kind = kindParam.toUpperCase() as ProviderKind;
    if (!WEBHOOK_KINDS.includes(kind)) throw new NotFoundException();
    return this.events.ingest(kind, req.rawBody?.toString("utf8") ?? "", signature, { headers: req.headers ?? {}, query });
  }

  /** Vendor verification handshake (Meta WhatsApp hub.challenge). */
  @Public()
  @Get(":kind")
  handshake(@Param("kind") kindParam: string, @Query() query: Record<string, unknown>) {
    const kind = kindParam.toUpperCase() as ProviderKind;
    const vendor = providerConfig(kind).mode === "real" ? vendorOf(kind) : undefined;
    const challenge = vendor ? VENDOR_WEBHOOKS[vendor].challenge?.(query, process.env.WHATSAPP_VERIFY_TOKEN ?? "") : null;
    if (challenge === null || challenge === undefined) throw new ForbiddenException({ code: "INVALID_VERIFY_TOKEN" });
    return challenge;
  }
}
