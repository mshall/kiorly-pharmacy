"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pdfkit_1 = __importDefault(require("pdfkit"));
const decorators_1 = require("../../auth/decorators");
const reports_service_1 = require("./reports.service");
const permissions_service_1 = require("../../auth/permissions.service");
const errors_1 = require("../../common/errors");
const branch_scope_1 = require("../../common/branch-scope");
function renderPdf(r) {
    return new Promise((resolve) => {
        const doc = new pdfkit_1.default({ size: "A4", margin: 36, layout: r.columns.length > 5 ? "landscape" : "portrait" });
        const chunks = [];
        doc.on("data", (c) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.fontSize(16).text(`Kiorly Pharmacy - ${r.title}`).moveDown(0.3);
        if (r.note)
            doc.fontSize(8).fillColor("#555").text(r.note).fillColor("#000");
        doc.moveDown(0.5).fontSize(9);
        const w = (doc.page.width - 72) / r.columns.length;
        const row = (cells, bold = false) => { const y = doc.y; cells.forEach((c, i) => doc.font(bold ? "Helvetica-Bold" : "Helvetica").text(c.replace(/[^\x20-\x7E]/g, "?"), 36 + i * w, y, { width: w - 4, height: 12, ellipsis: true })); doc.y = y + 14; if (doc.y > doc.page.height - 50)
            doc.addPage(); };
        row(r.columns.map((c) => c.label), true);
        for (const x of r.rows)
            row(r.columns.map((c) => String(x[c.key] ?? "")));
        doc.end();
    });
}
let ReportsController = class ReportsController {
    svc;
    perms;
    constructor(svc, perms) {
        this.svc = svc;
        this.perms = perms;
    }
    list() { return { reports: reports_service_1.REPORT_CATALOGUE.map((r) => r.name), catalogue: reports_service_1.REPORT_CATALOGUE }; }
    async run(u, name, q, res) {
        if (name === "controlled-register" && !(await this.perms.has(u.orgId, u.role, "controlled.read")))
            throw (0, errors_1.forbidden)("PERMISSION_DENIED", "The controlled-substance register needs controlled.read");
        const to = q.to ? new Date(q.to) : new Date();
        const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 86_400_000);
        const report = await this.svc.run(name, { orgId: u.orgId, branchId: (0, branch_scope_1.branchFilter)(u, q.branchId).branchId, from, to });
        if (q.format === "csv") {
            res.setHeader("Content-Type", "text/csv; charset=utf-8");
            res.setHeader("Content-Disposition", `attachment; filename="${name}.csv"`);
            return (0, reports_service_1.toCsv)(report);
        }
        if (q.format === "pdf") {
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename="${name}.pdf"`);
            return new common_1.StreamableFile(await renderPdf(report));
        }
        return report;
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)(),
    (0, decorators_1.Perm)("reports.read"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(":name"),
    (0, decorators_1.Perm)("reports.read"),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("name")),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportsController.prototype, "run", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)("reports"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)("reports"),
    __param(0, (0, common_1.Inject)(reports_service_1.ReportsService)),
    __param(1, (0, common_1.Inject)(permissions_service_1.PermissionsService)),
    __metadata("design:paramtypes", [reports_service_1.ReportsService, permissions_service_1.PermissionsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map