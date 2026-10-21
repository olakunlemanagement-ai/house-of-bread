import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";
import { NavLinks, StaticNavLinks } from "./NavLinks";
import { ThemeChoice } from "./theme/ThemeChoice";
import { ThemeToggle } from "./theme/ThemeToggle";

/**
 * 72px header that scrolls away with the page. It floats, transparent, over
 * the hero or page header tint: the negative bottom margin pulls the next
 * section up beneath it, and Hero and PageHeader add 72px to their top
 * padding. No bar or border, as nothing ever scrolls under it.
 * Wide screens: logo and the five nav links on the left; the dark theme
 * switch and one emerald primary button, Explore Teachings, on the right. Subscribe and the app are reached
 * from the Home hero, the footer and the closing newsletter card.
 * Narrow screens: logo, a compact Explore Teachings button (still 48px tall)
 * and a Menu button, all always visible. The menu is a details element, so it opens and closes
 * without JavaScript. Its panel is solid white (night in dark) and fades in
 * over 180ms. Below the links sits the Light, Dark or System choice, which
 * shows only with JavaScript.
 */
export function SiteHeader() {
  return (
    <header className="relative z-40 -mb-18">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-emerald focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-18 w-full max-w-[75rem] items-center gap-3 px-4 sm:px-6 xl:gap-6">
        <Link
          href="/"
          aria-label="House of Bread Global, home"
          className="shrink-0 rounded-lg py-2 text-sm text-ink sm:text-base"
        >
          <Logo priority compact />
        </Link>

        <nav aria-label="Main" className="hidden xl:block">
          <Suspense fallback={<StaticNavLinks layout="inline" />}>
            <NavLinks layout="inline" />
          </Suspense>
        </nav>

        <div className="ml-auto hidden items-center gap-2 xl:flex">
          <ThemeToggle />
          <ButtonLink href="/academy" className="whitespace-nowrap">
            Explore Teachings
          </ButtonLink>
        </div>

        {/* Narrow screens. Both controls stay visible beside the logo. */}
        <div className="ml-auto flex items-center gap-2 xl:hidden">
          <ButtonLink href="/academy" size="compact" className="whitespace-nowrap">
            Explore Teachings
          </ButtonLink>
          <details data-menu className="group">
            <summary className="flex min-h-12 cursor-pointer list-none items-center gap-2 rounded-button border-[1.5px] border-glyph/55 bg-surface-raised px-3.5 text-sm font-semibold text-emerald-deep hover:bg-tint [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className="h-0.5 rounded bg-current transition-transform group-open:translate-y-1.5 group-open:rotate-45" />
                <span className="h-0.5 rounded bg-current group-open:opacity-0" />
                <span className="h-0.5 rounded bg-current transition-transform group-open:-translate-y-1.5 group-open:-rotate-45" />
              </span>
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Close</span>
            </summary>
            <div className="menu-panel absolute inset-x-0 top-full max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-y border-border bg-surface shadow-raised">
              <nav aria-label="Main" className="mx-auto w-full max-w-[75rem] px-4 py-5 sm:px-6">
                <Suspense fallback={<StaticNavLinks layout="stacked" />}>
                  <NavLinks layout="stacked" />
                </Suspense>
              </nav>
              <div data-theme-control className="mx-auto w-full max-w-[75rem] px-4 pb-6 sm:px-6">
                <div className="border-t border-border pt-5">
                  <ThemeChoice legendClassName="eyebrow" />
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
