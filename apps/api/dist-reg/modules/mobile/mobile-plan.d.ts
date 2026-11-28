import type { Edition } from "../../generated/prisma/client";
export declare const MOBILE_FLAG = "mobile_staff_app";
export type MobilePlan = "BASIC" | "PRO" | "ENTERPRISE";
export declare function normalisePlan(edition: Edition | string): MobilePlan;
export declare const planIncludesMobile: (edition: Edition | string, subscriptionStatus?: string) => boolean;
export interface ModuleDef {
    key: string;
    perms: string[];
    screens: string[];
    extra?: "kiorex_orders" | "growth";
}
export declare const MODULE_DEFS: readonly ModuleDef[];
export declare function modulesFor(perms: ReadonlySet<string>, kiorexOrders: boolean, growth?: "admin" | "read" | "none"): {
    key: string;
    enabled: boolean;
    screens: string[];
}[];
