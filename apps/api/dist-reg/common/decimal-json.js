"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("../generated/prisma/client");
const proto = client_1.Prisma.Decimal.prototype;
proto.toJSON = function toJSON() {
    return this.decimalPlaces() <= 2 ? this.toFixed(2) : this.toString();
};
//# sourceMappingURL=decimal-json.js.map