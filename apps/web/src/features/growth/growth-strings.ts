import i18n from "@/lib/i18n";
import { GROWTH_AR, GROWTH_EN } from "./growth-strings-data";

/** Growth strings live beside the feature and are merged into the app bundle at runtime, so the shared locale files stay untouched (same pattern as the Quick setup strings). */
i18n.addResourceBundle("en", "translation", { growth: GROWTH_EN }, true, true);
i18n.addResourceBundle("ar", "translation", { growth: GROWTH_AR }, true, true);
