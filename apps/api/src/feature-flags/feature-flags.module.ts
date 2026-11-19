import { Global, Module } from "@nestjs/common";
import { FeatureFlagsService } from "./feature-flags.service";
import { RequiresFlagGuard } from "./requires-flag.guard";
import { FlagsController } from "./flags.controller";

@Global()
@Module({ controllers: [FlagsController], providers: [FeatureFlagsService, RequiresFlagGuard], exports: [FeatureFlagsService, RequiresFlagGuard] })
export class FeatureFlagsModule {}
