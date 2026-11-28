"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.Perm = exports.REQUIRES_PERM = exports.Public = exports.IS_PUBLIC = void 0;
const common_1 = require("@nestjs/common");
exports.IS_PUBLIC = "kx:public";
const Public = () => (0, common_1.SetMetadata)(exports.IS_PUBLIC, true);
exports.Public = Public;
exports.REQUIRES_PERM = "kx:perm";
const Perm = (...p) => (0, common_1.SetMetadata)(exports.REQUIRES_PERM, p);
exports.Perm = Perm;
exports.CurrentUser = (0, common_1.createParamDecorator)((_d, ctx) => ctx.switchToHttp().getRequest().user);
//# sourceMappingURL=decorators.js.map