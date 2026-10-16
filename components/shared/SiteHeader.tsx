import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { primaryNav } from "./nav-links";

const linkClass =
  "text-link underline-offset-4 hover:underline rounded-sm px-1 py-2";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface-deep">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-on-accent"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <Link href="/" className="text-lg font-semibold text-heading">
          {siteConfig.name}
        </Link>

        {/* Wide screens: inline list. */}
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex flex-wrap gap-x-4">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Narrow screens: details and summary open and close without JavaScript. */}
        <details className="w-full md:hidden">
          <summary className="cursor-pointer list-none rounded border border-border px-3 py-2 text-link">
            Menu
          </summary>
          <nav aria-label="Main">
            <ul className="mt-2 flex flex-col">
              {primaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`block ${linkClass}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      </div>
    </header>
  );
}
