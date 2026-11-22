import { Controller, Get, Inject, NotFoundException, Query, Res, UnauthorizedException } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../auth/decorators";
import { StorageAdapter } from "./adapters/storage.adapter";

/**
 * GET /api/v1/files?key=&exp=&sig= : the ONLY way to download a stored object. Authenticated by the short-lived HMAC signature a permission-checked endpoint handed out
 * (e.g. GET /prescriptions/:id/scan-url); expired / tampered => 401. Sent as an attachment, never sniffed, never cached.
 */
@ApiTags("files")
@Controller("files")
export class FilesController {
  constructor(@Inject(StorageAdapter) private readonly storage: StorageAdapter) {}

  @Public()
  @Get()
  async download(@Query("key") key: string | undefined, @Query("exp") exp: string | undefined, @Query("sig") sig: string | undefined, @Res() res: { setHeader(n: string, v: string): void; end(b: Buffer): void }) {
    const v = this.storage.verify(key, exp, sig);
    if (!v.ok) throw new UnauthorizedException({ code: "INVALID_DOWNLOAD_SIGNATURE", message: v.reason, reason: v.reason });
    const f = await this.storage.get(key!);
    if (!f) throw new NotFoundException({ code: "NOT_FOUND", message: "File not found" });
    res.setHeader("content-type", f.contentType);
    res.setHeader("content-length", String(f.bytes.length));
    res.setHeader("content-disposition", `attachment; filename="${key!.split("/").pop()!.replace(/[^a-zA-Z0-9._-]/g, "_")}"`);
    res.setHeader("x-content-type-options", "nosniff");
    res.setHeader("cache-control", "private, no-store");
    res.setHeader("content-security-policy", "default-src 'none'; sandbox");
    res.end(f.bytes);
  }
}
