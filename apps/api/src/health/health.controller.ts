import { Controller, Get, Inject, ServiceUnavailableException } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PrismaService } from "../prisma/prisma.service";

@ApiTags("health")
@Controller("health")
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get("live")
  @ApiOperation({ summary: "Liveness probe" })
  @ApiOkResponse({ schema: { type: "object", properties: { status: { type: "string", example: "ok" } } } })
  live() {
    return { status: "ok", product: "kiorly-pharmacy" };
  }

  @Get("ready")
  @ApiOperation({ summary: "Readiness probe (database connectivity)" })
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: "ok", database: "ok" };
    } catch {
      throw new ServiceUnavailableException({ status: "degraded", database: "unavailable" });
    }
  }
}
