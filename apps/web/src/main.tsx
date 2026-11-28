import "@/lib/western-digits"; // Western digits 0-9 by default in Arabic (founder decision 28 Nov 2026)
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/lib/i18n";
import "@/styles/globals.css";
import { initTheme } from "@/brand/ui-kit";
import { App } from "@/app/App";

initTheme();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
