import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { NavLinks } from "./NavLinks";
import { primaryNav } from "./nav-links";
import { navLinkClass } from "./nav-styles";
import { Wordmark } from "./Wordmark";

// Shown while the current path is unresolved, for example on a not found
// response. Same links, no current page marker.
function StaticLinks({ layout }: { layout: "inline" | "stacked" }) {
  return (
    <ul className={layout === "inline" ? "flex items-center gap-1" : "flex flex-col"}>
      {primaryNav.map((item) => (
        <li key={item.href}>
          <Link href={item.href} className={navLinkClass(layout, false)}>
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Sticky green gradient bar. The mobile menu works without JavaScript. */
export function SiteHeader() {
  return (
    <header className="tone-green bg-green-header sticky top-0 z-40 border-b border-green-night shadow-[0_1px_0_rgb(166_200_89/0.18)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-lime focus:px-5 focus:py-3 focus:font-semibold focus:text-on-lime"
      >
        Skip to main content
      </a>
      <div className="container-page flex min-h-18 items-center justify-between gap-4">
        <Link
          href="/"
          aria-label="House of Bread Global, home"
          className="rounded py-2 text-base text-on-green sm:text-lg"
        >
          <Wordmark />
        </Link>

        {/* Wide screens: inline navigation and actions. */}
        <nav aria-label="Main" className="hidden xl:block">
          <Suspense fallback={<StaticLinks layout="inline" />}>
            <NavLinks layout="inline" />
          </Suspense>
        </nav>
        <div className="hidden items-center gap-5 xl:flex">
          <Link
            href="/subscribe"
            className="rounded px-1 py-2 font-semibold text-on-green underline decoration-lime decoration-2 underline-offset-4"
          >
            Subscribe
          </Link>
          <ButtonLink href="/app" tone="green">
            Get the app
          </ButtonLink>
        </div>

        {/* Narrow screens: details and summary open and close without JavaScript. */}
        <details data-menu className="group xl:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-button border-2 border-lime px-4 font-semibold text-on-green [&::-webkit-details-marker]:hidden">
            <span aria-hidden="true" className="flex w-4 flex-col gap-1">
              <span className="h-0.5 rounded bg-current" />
              <span className="h-0.5 rounded bg-current group-open:opacity-0" />
              <span className="h-0.5 rounded bg-current" />
            </span>
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <div className="bg-green-footer absolute inset-x-0 top-full flex max-h-[calc(100dvh-4.5rem)] flex-col overflow-y-auto border-t border-green-night shadow-raised">
            <nav aria-label="Main" className="container-page py-4">
              <Suspense fallback={<StaticLinks layout="stacked" />}>
                <NavLinks layout="stacked" />
              </Suspense>
              <Link
                href="/subscribe"
                className="mt-2 flex min-h-12 items-center px-4 font-semibold text-lime underline decoration-2 underline-offset-4"
              >
                Subscribe
              </Link>
            </nav>
            {/* The app button stays pinned to the bottom of the menu. */}
            <div className="bg-green-footer sticky bottom-0 mt-auto border-t border-green">
              <div className="container-page py-4">
                <ButtonLink href="/app" tone="green" arrow className="w-full">
                  Get the app
                </ButtonLink>
              </div>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
