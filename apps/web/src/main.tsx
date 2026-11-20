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
