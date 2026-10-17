import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
  /** Other path prefixes that mark this item as the current section. */
  also?: string[];
};

/**
 * Main navigation. Subscribe and Get the app sit apart from this list, as
 * buttons on the right of the header.
 */
export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/academy", label: "Academy" },
  // Live sessions are part of the Media Library.
  { href: "/media", label: "Media Library", also: ["/events"] },
  { href: "/contact", label: "Contact" },
];

/** Footer link columns. The Follow column is rendered from SocialLinks. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Ministry",
    links: [
      { href: "/about", label: "About" },
      { href: "/academy", label: "Academy" },
      { href: "/media", label: "Media Library" },
      { href: "/events", label: "Live sessions" },
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
  // Home is current only on the home page itself.
  if (item.href === "/") return pathname === "/";
  return [item.href, ...(item.also ?? [])].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
