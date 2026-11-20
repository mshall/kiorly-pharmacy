import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { PrismaClient } from "../generated/prisma/client";
import { createPgAdapter } from "./pg-adapter";

/** Connects lazily so the HTTP server boots before Postgres is ready. */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor() {
    super({ adapter: createPgAdapter(), log: process.env.NODE_ENV === "production" ? ["error"] : process.env.NODE_ENV === "test" ? [] : ["warn", "error"] });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
