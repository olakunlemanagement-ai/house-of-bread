import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { NavLinks } from "./NavLinks";
import { primaryNav } from "./nav-links";
import { Wordmark } from "./Wordmark";

// Shown while the current path is unresolved, for example on a not found
// response. Same links, no current page marker.
function StaticLinks({ layout }: { layout: "inline" | "stacked" }) {
  return (
    <ul className={layout === "inline" ? "flex items-center gap-1" : "flex flex-col"}>
      {primaryNav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            className={
              layout === "inline"
                ? "block rounded px-3 py-2 font-medium text-on-green"
                : "block min-h-12 rounded px-4 py-3 text-lg font-medium text-on-green"
            }
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  return (
    <header className="tone-green bg-green-header sticky top-0 z-40 border-b border-green-night shadow-[0_1px_0_rgb(166_200_89/0.2)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:font-semibold focus:text-on-lime"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
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
        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/subscribe"
            className="rounded px-1 py-2 font-semibold text-on-green underline decoration-lime decoration-2 underline-offset-4"
          >
            Subscribe
          </Link>
          <ButtonLink href="/app" tone="green" className="min-h-11 px-5 py-2">
            Get the app
          </ButtonLink>
        </div>

        {/* Narrow screens: details and summary open and close without JavaScript. */}
        <details className="group xl:hidden">
          <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-full border-2 border-lime px-4 font-semibold text-on-green [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">Menu</span>
            <span className="hidden group-open:inline">Close</span>
          </summary>
          <div className="bg-green-footer absolute inset-x-0 top-full border-t border-green-night px-4 pb-6 pt-2 shadow-lg">
            <nav aria-label="Main">
              <Suspense fallback={<StaticLinks layout="stacked" />}>
                <NavLinks layout="stacked" />
              </Suspense>
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-green px-4 pt-5">
              <ButtonLink href="/app" tone="green">
                Get the app
              </ButtonLink>
              <ButtonLink href="/subscribe" tone="green" variant="secondary">
                Subscribe
              </ButtonLink>
            </div>
          </div>
        </details>
      </div>
    </header>
  );
}
