import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
  /** Other path prefixes that mark this item as the current section. */
  also?: string[];
};

/**
 * Main navigation, as on main before the reset: Home, Academy, Teachings,
 * About, Contact. The one header button, Browse free courses, sits apart on
 * the right. Teachings is the video page (/media, once labelled Library)
 * until the routes are renamed. Ask lives in the footer and in Home's third
 * numbered row.
 */
export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/academy", label: "Academy" },
  { href: "/media", label: "Teachings", also: ["/events", "/teachings"] },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/**
 * The footer links, one list (docs/RESET-BRIEF.md section 3). What we
 * believe points at the About page's "How Scripture is handled" until a
 * beliefs section exists.
 */
export const footerNav: NavLink[] = [
  { href: "/media", label: "Teachings" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
  { href: "/about#handled" as Route, label: "What we believe" },
  { href: "/ask", label: "Ask" },
  { href: "/events", label: "Events" },
  { href: "/app", label: "App" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];

export function isCurrent(item: NavLink, pathname: string): boolean {
  // Home is current only on the home page itself.
  if (item.href === "/") return pathname === "/";
  return [item.href, ...(item.also ?? [])].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

