"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "./nav-links";

// Client only to mark the current page. The links themselves are plain
// anchors in the server HTML, so navigation works without JavaScript.
export function NavLinks({ layout }: { layout: "inline" | "stacked" }) {
  const pathname = usePathname();

  return (
    <ul className={layout === "inline" ? "flex items-center gap-1" : "flex flex-col"}>
      {primaryNav.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={
                layout === "inline"
                  ? `block rounded px-3 py-2 font-medium text-on-green underline-offset-8 decoration-lime decoration-2 hover:underline ${
                      current ? "underline decoration-[3px]" : ""
                    }`
                  : `block min-h-12 rounded px-4 py-3 text-lg font-medium text-on-green ${
                      current ? "underline decoration-lime decoration-[3px] underline-offset-8" : ""
                    }`
              }
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
