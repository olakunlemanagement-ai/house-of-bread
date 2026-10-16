import type { Route } from "next";

export type NavLink = {
  href: Route;
  label: string;
};

/** Main navigation, shown in the header. */
export const primaryNav: NavLink[] = [
  { href: "/teachings", label: "Teachings" },
  { href: "/new-testament", label: "New Testament" },
  { href: "/plans", label: "Plans" },
  { href: "/events", label: "Live" },
  { href: "/classes", label: "Classes" },
  { href: "/about", label: "About" },
];

/** Footer link columns. */
export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Learn",
    links: [
      { href: "/teachings", label: "Teachings" },
      { href: "/new-testament", label: "New Testament" },
      { href: "/plans", label: "Reading plans" },
    ],
  },
  {
    heading: "Ministry",
    links: [
      { href: "/about", label: "About" },
      { href: "/events", label: "Live sessions" },
      { href: "/classes", label: "Classes and training" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { href: "/subscribe", label: "Subscribe" },
      { href: "/app", label: "Get the app" },
    ],
  },
];
