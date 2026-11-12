export interface NavItem {
  href: string;
  label: string;
  icon: "dashboard" | "activity" | "suspicious" | "settings" | "profile";
}

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/suspicious", label: "Suspicious accounts", icon: "suspicious" },
  { href: "/activity", label: "Moderation activity", icon: "activity" },
  { href: "/settings", label: "Settings", icon: "settings" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

/** Active when on the page itself or any page nested beneath it. */
export function isActivePath(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
