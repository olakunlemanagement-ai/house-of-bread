"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, type MouseEvent } from "react";
import { isCurrent, primaryNav } from "./nav-links";
import { navLinkClass } from "./nav-styles";

/** The mobile menu is a details element. Close it after a client side navigation. */
function closeMenu(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

// Client only to mark the current page and close the mobile menu. The links
// themselves are plain anchors in the server HTML, so navigation works
// without JavaScript.
export function NavLinks({ layout }: { layout: "inline" | "stacked" }) {
  const pathname = usePathname();

  // Any client side navigation, including the menu's Subscribe and app
  // links, closes the mobile menu.
  useEffect(() => {
    document.querySelectorAll("details[data-menu]").forEach((menu) => menu.removeAttribute("open"));
  }, [pathname]);

  return (
    <ul className={layout === "inline" ? "flex items-center gap-1" : "flex flex-col"}>
      {primaryNav.map((item) => {
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
