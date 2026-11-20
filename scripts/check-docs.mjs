// Fails if the Docs hub is incomplete or the build-sequence tracker is malformed.
import { readFileSync, existsSync } from "node:fs";
const need = ["Docs/README.md", "Docs/pharmacy-cursor-build-sequence.md", "Docs/NEEDS_HUMAN.md", "Docs/DESIGN_NOTES_FROM_2025.md", "Docs/ADR_REFERENCE.md", "Docs/FEATURE_MATRIX.md"];
const missing = need.filter((f) => !existsSync(f));
if (missing.length) { console.error("missing docs:", missing.join(", ")); process.exit(1); }
const seq = readFileSync("Docs/pharmacy-cursor-build-sequence.md", "utf8");
const tracker = seq.split("## 5. Progress tracker")[1] ?? "";
const boxes = tracker.match(/^- \[[ x]\] /gm) ?? [];
if (boxes.length < 20) { console.error("progress tracker looks empty:", boxes.length); process.exit(1); }
console.log("docs ok;", boxes.length, "tracked steps");
