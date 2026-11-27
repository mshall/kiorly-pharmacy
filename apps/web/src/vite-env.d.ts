/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Kiorly Home origin (domain table, ADR-038) for the header "Switch workspace" link; dev falls back to http://localhost:5194, production shows no link without it. */
  readonly VITE_KIORLY_HOME_URL?: string;
}
