import { Global, Module } from "@nestjs/common";
import { DispenseHooks } from "./dispense-hooks";

@Global()
@Module({ providers: [DispenseHooks], exports: [DispenseHooks] })
export class HooksModule {}
