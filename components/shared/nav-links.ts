import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
};

/** Main navigation, shown in the header. */
export const primaryNav: NavLink[] = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/classes", label: "Classes" },
  { href: "/teachings", label: "Teachings" },
  { href: "/new-testament", label: "New Testament" },
  { href: "/plans", label: "Reading plans" },
  { href: "/app", label: "The app" },
];

/** Secondary links, shown in the footer alongside the main navigation. */
export const secondaryNav: NavLink[] = [
  { href: "/subscribe", label: "Newsletter" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
];
