import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
  /** Other path prefixes that mark this item as the current section. */
  also?: string[];
};

/** Main navigation, ministry first (CONTENT-PACK section 2). */
export const primaryNav: NavLink[] = [
  { href: "/events", label: "Live" },
  { href: "/academy", label: "Academy" },
  { href: "/teachings", label: "Teachings" },
  { href: "/new-testament", label: "Study" },
  // New Testament journeys live in the official app.
  { href: "/app", label: "The App", also: ["/plans"] },
  { href: "/about", label: "About" },
];

/** Footer link columns. The Follow column is rendered from SocialLinks. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Ministry",
    links: [
      { href: "/about", label: "About" },
      { href: "/events", label: "Live sessions" },
      { href: "/academy", label: "Academy" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/teachings", label: "Teachings" },
      { href: "/new-testament", label: "Study the New Testament" },
      { href: "/plans", label: "New Testament journeys" },
      { href: "/app", label: "The official app" },
    ],
  },
];

export function isCurrent(item: NavLink, pathname: string): boolean {
  return [item.href, ...(item.also ?? [])].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
