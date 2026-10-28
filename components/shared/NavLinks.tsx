"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type MouseEvent } from "react";
import { closeMenuOnEscape, closeMenusOnNavigation } from "./menu";
import { isCurrent, primaryNav, type NavLink } from "./nav-links";
import { navLinkClass, navListClass, type NavLayout } from "./nav-styles";

/** The mobile menu is a details element. Close it after a client side navigation. */
function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

// Client only to mark the current page and close the mobile menu. The links
// themselves are plain anchors in the server HTML, so navigation works
// without JavaScript.
export function NavLinks({ layout, items = primaryNav }: { layout: NavLayout; items?: NavLink[] }) {
  const pathname = usePathname();

  // Any client side navigation, including the header's Explore Teachings
  // button, closes the mobile menu. Hydration is not a navigation, so a menu
  // opened before it stays open.
  const lastPath = useRef(pathname);
  useEffect(() => {
    closeMenusOnNavigation(lastPath, pathname, document);
  }, [pathname]);

  // In the phone menu, Escape closes it and returns focus to Menu.
  useEffect(() => {
    if (layout !== "stacked") return;
    const onKey = (event: KeyboardEvent) => closeMenuOnEscape(event.key, document);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [layout]);

  return (
    <ul className={navListClass[layout]}>
      {items.map((item) => {
        const current = isCurrent(item, pathname);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              onClick={layout === "stacked" ? closeMenu : undefined}
              className={navLinkClass(layout, current)}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Shown while the current path is unresolved. Same links, no current marker. */
export function StaticNavLinks({ layout, items = primaryNav }: { layout: NavLayout; items?: NavLink[] }) {
  return (
    <ul className={navListClass[layout]}>
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={navLinkClass(layout, false)}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
