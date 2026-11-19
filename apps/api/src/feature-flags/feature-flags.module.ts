import { Global, Module } from "@nestjs/common";
import { FeatureFlagsService } from "./feature-flags.service";
import { RequiresFlagGuard } from "./requires-flag.guard";

@Global()
@Module({ providers: [FeatureFlagsService, RequiresFlagGuard], exports: [FeatureFlagsService, RequiresFlagGuard] })
export class FeatureFlagsModule {}
