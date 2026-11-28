"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = loadEnv;
const dotenv_1 = require("dotenv");
const node_path_1 = require("node:path");
function loadEnv() {
    (0, dotenv_1.config)({ path: (0, node_path_1.resolve)(__dirname, "../../.env"), quiet: true });
    process.env.DATABASE_URL ??= "postgresql://postgres:postgres@127.0.0.1:5433/kiorly_pharmacy?schema=public";
    process.env.PORT ??= "3100";
}
//# sourceMappingURL=env.js.map