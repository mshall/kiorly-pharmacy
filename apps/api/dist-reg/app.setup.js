"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PREFIX_EXCLUDES = void 0;
exports.configureApp = configureApp;
exports.buildOpenApi = buildOpenApi;
const common_1 = require("@nestjs/common");
const reject_nul_bytes_pipe_1 = require("./common/reject-nul-bytes.pipe");
const swagger_1 = require("@nestjs/swagger");
const http_hardening_1 = require("./common/http-hardening");
const db_error_filter_1 = require("./common/db-error.filter");
require("./common/decimal-json");
const runtime_env_1 = require("./config/runtime-env");
exports.PREFIX_EXCLUDES = ["marketplace/v1/(.*)"];
function configureApp(app) {
    (0, http_hardening_1.applyHttpHardening)(app);
    app.setGlobalPrefix((0, runtime_env_1.apiPrefix)(), { exclude: exports.PREFIX_EXCLUDES });
    app.useGlobalPipes(new reject_nul_bytes_pipe_1.RejectNulBytesPipe(), new common_1.ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
    app.useGlobalFilters(new db_error_filter_1.AllExceptionsFilter());
    if ((0, http_hardening_1.swaggerEnabled)()) {
        const doc = buildOpenApi(app);
        swagger_1.SwaggerModule.setup("docs", app, doc, { jsonDocumentUrl: "docs-json" });
    }
}
function buildOpenApi(app) {
    return swagger_1.SwaggerModule.createDocument(app, new swagger_1.DocumentBuilder().setTitle("Kiorly Pharmacy API").setDescription("Kiorly Pharmacy (KX-06): catalogue, inventory/lots/FEFO, Rx + dispensing with pharmacist sign-off, POS, suppliers, Kiorex orders.").setVersion("1.0.0").addBearerAuth().build());
}
//# sourceMappingURL=app.setup.js.map