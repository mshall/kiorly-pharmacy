import { Controller, Headers, HttpCode, Inject, NotFoundException, Param, Post, Req } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators";
import { ProviderEventsService } from "./provider-events.service";
import { WEBHOOK_KINDS, type ProviderKind } from "./provider-env";
import { SIGNATURE_HEADER } from "./webhook-signature";

/** Public, HMAC-authenticated callbacks: POST /api/v1/webhooks/providers/{sms|email|whatsapp|payment} (header X-Kiorex-Signature: t=<unix>,v1=<hmac>). */
@ApiTags("provider-webhooks")
@Controller("webhooks/providers")
export class ProviderWebhooksController {
  constructor(@Inject(ProviderEventsService) private readonly events: ProviderEventsService) {}

  @Public()
  @Post(":kind")
  @HttpCode(200)
  receive(@Param("kind") kindParam: string, @Req() req: { rawBody?: Buffer }, @Headers(SIGNATURE_HEADER) signature?: string) {
    const kind = kindParam.toUpperCase() as ProviderKind;
    if (!WEBHOOK_KINDS.includes(kind)) throw new NotFoundException();
    return this.events.ingest(kind, req.rawBody?.toString("utf8") ?? "", signature);
  }
}
