import { Injectable } from "@nestjs/common";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

/** Object storage adapter. Local-disk implementation for dev/mock (STORAGE_DIR); the S3 adapter (src/platform/adapters only) is a go-live task. */
@Injectable()
export class StorageAdapter {
  private root() { return resolve(process.env.STORAGE_DIR ?? join(process.cwd(), ".data")); }

  async putDataUrl(key: string, dataUrl: string): Promise<{ key: string; bytes: number }> {
    const m = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl);
    if (!m) throw new Error("Expected a base64 data URL");
    const buf = Buffer.from(m[2]!, "base64");
    if (buf.length > 5 * 1024 * 1024) throw new Error("File too large (max 5MB)");
    const safe = key.replace(/[^a-zA-Z0-9/_.-]/g, "_").replace(/\.\.+/g, ".");
    const path = join(this.root(), safe);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, buf);
    return { key: safe, bytes: buf.length };
  }
}
