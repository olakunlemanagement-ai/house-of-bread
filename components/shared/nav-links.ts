import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
  /** Other path prefixes that mark this item as the current section. */
  also?: string[];
};

/**
 * Main navigation. The one header button, Explore Teachings, sits apart from
 * this list on the right of the header.
 */
export const primaryNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/academy", label: "Academy" },
  // Live sessions are part of the Library.
  { href: "/media", label: "Library", also: ["/events"] },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

/** Footer link columns. The Follow column is rendered from SocialLinks. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    // Same order as the header. Subscribe stays here on every page, since the
    // header no longer carries it.
    heading: "Ministry",
    links: [
      { href: "/academy", label: "Academy" },
      { href: "/media", label: "Library" },
      { href: "/events", label: "Live sessions" },
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/subscribe", label: "Subscribe" },
    ],
  },
  {
    heading: "Learn",
    links: [
      { href: "/teachings", label: "Teachings" },
      { href: "/new-testament", label: "Study the New Testament" },
      { href: "/plans", label: "New Testament journeys" },
      { href: "/app", label: "Get the official app" },
      { href: "/ask", label: "Ask a question" },
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

/** The footer's bottom line. */
export const legalNav: NavLink[] = [{ href: "/privacy", label: "Privacy" }];
