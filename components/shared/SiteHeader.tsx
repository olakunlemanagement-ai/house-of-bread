import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { NavLinks, StaticNavLinks } from "./NavLinks";
import { Wordmark } from "./Wordmark";

/**
 * Sticky 72px header on the green-rich to emerald gradient.
 * Wide screens: wordmark and the five nav links on the left, Subscribe
 * (secondary on green) and Get the app (primary on green) on the right.
 * Narrow screens: wordmark, a compact Get app button and a Menu button,
 * all always visible. The menu is a details element, so it opens and closes
 * without JavaScript.
 */
export function SiteHeader() {
  return (
    <header className="tone-green bg-green-header sticky top-0 z-40 shadow-[0_1px_0_rgb(4_41_14/0.35)]">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-lime-bright focus:px-5 focus:py-3 focus:font-semibold focus:text-ink"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-18 w-full max-w-[78rem] items-center gap-3 px-4 sm:px-6 xl:gap-6">
        <Link
          href="/"
          aria-label="House of Bread Global, home"
          className="shrink-0 rounded-lg py-2 text-[0.8rem] text-on-green min-[400px]:text-sm sm:text-lg"
        >
          <Wordmark className="tracking-[0.14em] sm:tracking-[0.22em]" />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <Suspense fallback={<StaticNavLinks layout="inline" />}>
            <NavLinks layout="inline" />
          </Suspense>
        </nav>

        <div className="ml-auto hidden items-center gap-3 xl:flex">
          <ButtonLink href="/subscribe" tone="green" variant="secondary" className="whitespace-nowrap">
            Subscribe
          </ButtonLink>
          <ButtonLink href="/app" tone="green" className="whitespace-nowrap">
            Get the app
          </ButtonLink>
        </div>

        {/* Narrow screens. Both controls stay visible beside the wordmark. */}
        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <ButtonLink href="/app" tone="green" size="compact" className="whitespace-nowrap">
            Get app
          </ButtonLink>
          <details data-menu className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-button border-[1.5px] border-white bg-white/12 px-3.5 text-sm font-semibold text-on-green hover:bg-white/20 [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className="h-0.5 rounded bg-current transition-transform group-open:translate-y-1.5 group-open:rotate-45" />
                <span className="h-0.5 rounded bg-current group-open:opacity-0" />
                <span className="h-0.5 rounded bg-current transition-transform group-open:-translate-y-1.5 group-open:-rotate-45" />
              </span>
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Close</span>
            </summary>
            <div className="tone-deep bg-green-feature absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-white/10 shadow-raised">
              <nav aria-label="Main" className="mx-auto w-full max-w-[78rem] px-4 py-5 sm:px-6">
                <Suspense fallback={<StaticNavLinks layout="stacked" />}>
                  <NavLinks layout="stacked" />
                </Suspense>
                <ButtonLink href="/subscribe" tone="green" variant="secondary" className="mt-5 w-full">
                  Subscribe
                </ButtonLink>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
