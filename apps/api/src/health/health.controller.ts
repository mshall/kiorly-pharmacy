import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";
import { providerStatus } from "../providers/provider-env";
import { Public } from "../auth/decorators";
import { leadSigningStatus } from "../providers/lead-signing-status";

@ApiTags("health")
@Public()
@Controller("health")
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("live")
  @ApiOperation({ summary: "Liveness probe" })
  @ApiOkResponse({ schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } })
  live() {
    return { status: "ok", product: "kiorly-pharmacy" };
  }

  @Get("providers")
  @ApiOperation({ summary: "Active mode (mock|real), vendor and readiness of every external provider (no secrets)" })
  providers() {
    return { providers: providerStatus() };
  }

  @Get("ready")
  @ApiOperation({ summary: "Readiness probe (database connectivity)" })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "ok", providers: providerStatus(), leadSigning: leadSigningStatus() };
    } catch {
      throw new ServiceUnavailableException({ status: "degraded", database: "unavailable" });
    }
  }
}
