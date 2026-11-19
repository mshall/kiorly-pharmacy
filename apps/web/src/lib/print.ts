import { fetchBlob } from "@/lib/api";

/** Fetches an authenticated HTML document (receipt / shelf labels) and opens it in a print-ready window. */
export async function printHtml(path: string, query?: Record<string, string | undefined>): Promise<void> {
  const blob = await fetchBlob(path, query);
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank", "noopener,width=420,height=640");
  if (w) w.addEventListener("load", () => { try { w.print(); } catch { /* user can print manually */ } });
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function download(path: string, filename: string, query?: Record<string, string | undefined>): Promise<void> {
  const blob = await fetchBlob(path, query);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 10_000);
}
