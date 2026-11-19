import { Controller, Get, Inject, Param, Query, Res, StreamableFile } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import type { Response } from "express";
import PDFDocument from "pdfkit";
import { CurrentUser, Perm } from "../../auth/decorators";
import type { AuthUser } from "../../auth/auth-user";
import { ReportsService, REPORT_NAMES, toCsv, type Report } from "./reports.service";
import { branchFilter } from "../../common/branch-scope";

function renderPdf(r: Report): Promise<Buffer> {
  return new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 36, layout: r.columns.length > 5 ? "landscape" : "portrait" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.fontSize(16).text(`Kiorly Pharmacy - ${r.title}`).moveDown(0.3);
    if (r.note) doc.fontSize(8).fillColor("#555").text(r.note).fillColor("#000");
    doc.moveDown(0.5).fontSize(9);
    const w = (doc.page.width - 72) / r.columns.length;
    const row = (cells: string[], bold = false) => { const y = doc.y; cells.forEach((c, i) => doc.font(bold ? "Helvetica-Bold" : "Helvetica").text(c.replace(/[^\x20-\x7E]/g, "?"), 36 + i * w, y, { width: w - 4, height: 12, ellipsis: true })); doc.y = y + 14; if (doc.y > doc.page.height - 50) doc.addPage(); };
    row(r.columns.map((c) => c.label), true);
    for (const x of r.rows) row(r.columns.map((c) => String(x[c.key] ?? "")));
    doc.end();
  });
}

@ApiTags("reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportsController {
  constructor(@Inject(ReportsService) private readonly svc: ReportsService) {}

  @Get() @Perm("reports.read")
  list() { return { reports: REPORT_NAMES }; }

  /** ?format=json|csv|pdf — CSV/PDF are for handing to the pharmacy's accountant; no submission to any authority. */
  @Get(":name") @Perm("reports.read")
  async run(@CurrentUser() u: AuthUser, @Param("name") name: string, @Query() q: { branchId?: string; from?: string; to?: string; format?: string }, @Res({ passthrough: true }) res: Response) {
    const to = q.to ? new Date(q.to) : new Date();
    const from = q.from ? new Date(q.from) : new Date(to.getTime() - 30 * 86_400_000);
    const report = await this.svc.run(name, { orgId: u.orgId, branchId: branchFilter(u, q.branchId).branchId, from, to });
    if (q.format === "csv") { res.setHeader("Content-Type", "text/csv; charset=utf-8"); res.setHeader("Content-Disposition", `attachment; filename="${name}.csv"`); return toCsv(report); }
    if (q.format === "pdf") { res.setHeader("Content-Type", "application/pdf"); res.setHeader("Content-Disposition", `attachment; filename="${name}.pdf"`); return new StreamableFile(await renderPdf(report)); }
    return report;
  }
}
