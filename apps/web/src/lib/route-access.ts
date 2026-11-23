export interface GuardedNavItem { to: string; perm?: string; flag?: string }

/**
 * Direct-URL guard for the back-office shell: a page whose nav entry is hidden for this user must show a
 * "no access" panel instead of a skeleton that waits on a 403. Detail routes resolve to their parent entry.
 * Returns null when the route is allowed (or not a nav-governed route).
 */
export function routeDeniedReason(
  pathname: string,
  items: readonly GuardedNavItem[],
  can: (perm: string) => boolean,
  flag: (key: string) => boolean,
): "perm" | "flag" | null {
  const aliases: Record<string, string> = { "/dispensing": "/rx" };
  const alias = Object.keys(aliases).find((a) => pathname === a || pathname.startsWith(`${a}/`));
  const path = alias ? aliases[alias]! : pathname;
  const hit = items
    .filter((i) => i.to !== "/" && (path === i.to || path.startsWith(`${i.to}/`)))
    .sort((a, b) => b.to.length - a.to.length)[0];
  if (!hit) return null;
  if (hit.perm && !can(hit.perm)) return "perm";
  if (hit.flag && !flag(hit.flag)) return "flag";
  return null;
}
