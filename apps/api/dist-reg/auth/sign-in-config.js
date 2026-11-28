"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvePublicSignInConfig = exports.effectiveOrgDefault = exports.deploymentDefaultMethod = void 0;
exports.tenantLinkedToKiorex = tenantLinkedToKiorex;
exports.orgSignInFacts = orgSignInFacts;
const sign_in_default_1 = require("./sign-in-default");
Object.defineProperty(exports, "deploymentDefaultMethod", { enumerable: true, get: function () { return sign_in_default_1.deploymentDefaultMethod; } });
Object.defineProperty(exports, "effectiveOrgDefault", { enumerable: true, get: function () { return sign_in_default_1.effectiveOrgDefault; } });
Object.defineProperty(exports, "resolvePublicSignInConfig", { enumerable: true, get: function () { return sign_in_default_1.resolvePublicSignInConfig; } });
async function tenantLinkedToKiorex(prisma, t) {
    if (t.externalOrgId)
        return true;
    if ((await prisma.integrationClient.count({ where: { orgId: t.id, active: true } })) > 0)
        return true;
    return (await prisma.staffUser.count({ where: { orgId: t.id, active: true, subject: { not: null } } })) > 0;
}
async function orgSignInFacts(prisma, orgHint) {
    const id = (0, sign_in_default_1.cleanOrgHint)(orgHint);
    if (!id)
        return null;
    const t = await prisma.tenant.findUnique({ where: { id }, select: { id: true, externalOrgId: true, defaultSignInMethod: true } });
    if (!t)
        return null;
    return { stored: t.defaultSignInMethod, linkedToKiorex: await tenantLinkedToKiorex(prisma, t) };
}
//# sourceMappingURL=sign-in-config.js.map