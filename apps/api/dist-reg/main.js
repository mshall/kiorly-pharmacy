"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const app_setup_1 = require("./app.setup");
const env_1 = require("./config/env");
const provider_env_1 = require("./providers/provider-env");
const handoff_1 = require("./auth/handoff");
const lead_signing_status_1 = require("./providers/lead-signing-status");
const runtime_env_1 = require("./config/runtime-env");
async function bootstrap() {
    (0, env_1.loadEnv)();
    (0, provider_env_1.assertProviderConfig)();
    (0, runtime_env_1.warnStartupConfig)();
    (0, lead_signing_status_1.warnIfLeadSigningMissing)();
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { rawBody: true });
    app.enableCors({ origin: [...(0, runtime_env_1.corsOrigins)(process.env, "http://localhost:5190,http://127.0.0.1:5190,http://localhost:8082,http://127.0.0.1:8082"), ...(0, handoff_1.homeOrigins)()], credentials: false });
    (0, app_setup_1.configureApp)(app);
    const port = Number(process.env.PORT ?? 3100);
    const host = process.env.LISTEN_HOST ?? "0.0.0.0";
    await app.listen(port, host);
    console.log(`Kiorly Pharmacy API listening on http://localhost:${port}/${(0, runtime_env_1.apiPrefix)()}`);
}
void bootstrap();
//# sourceMappingURL=main.js.map