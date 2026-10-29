import Link from "next/link";
import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { Logo } from "./Logo";
import { NavLinks, StaticNavLinks } from "./NavLinks";
import { ThemeToggle } from "./theme/ThemeToggle";

/**
 * A small 64px header that sits transparent on top of the hero and scrolls
 * away with the page: no background, border or blur. A negative margin
 * pulls the page's first element (always a full screen hero: Hero or
 * PageHeader) up beneath it, so its text sits on the hero scrim, which
 * holds full strength behind the nav (scripts/check-noscript.mjs).
 * Wide screens (lg): logo, then Home, Academy, Teachings, About and Contact,
 * then one primary pill, Browse courses, and the theme switch.
 * Below lg: logo, the pill (from sm), the theme switch and a Menu button.
 * The menu is a details element, so it opens and closes without
 * JavaScript. Its panel fills the screen below the header: the same five
 * links, large, then the pill, nothing else.
 * The theme switch shows at every width; the footer keeps the full theme
 * choice and the site's one Motion control.
 */
export function SiteHeader() {
  return (
    <header data-site-header className="relative z-40 -mb-16">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-button focus:bg-fill-primary focus:px-5 focus:py-3 focus:font-semibold focus:text-white"
      >
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 w-full max-w-[75rem] items-center gap-3 px-4 sm:px-6 lg:gap-6">
        <Link
          href="/"
          aria-label="House of Bread Global, home"
          className="shrink-0 rounded-lg py-2 text-sm text-ink sm:text-base"
        >
          <Logo priority compact />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <Suspense fallback={<StaticNavLinks layout="inline" />}>
            <NavLinks layout="inline" />
          </Suspense>
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          {/* Wrapped, because the button's own inline-flex would beat a hidden class on it. */}
          <div className="hidden sm:block">
            <ButtonLink href="/academy" size="sm" className="whitespace-nowrap lg:px-5">
              Browse courses
            </ButtonLink>
          </div>
          <ThemeToggle />
          <details data-menu className="group lg:hidden">
            <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-button border-[1.5px] border-glyph px-4 text-sm font-semibold text-emerald-deep hover:bg-tint active:bg-tint-strong [&::-webkit-details-marker]:hidden">
              <span aria-hidden="true" className="flex w-4 flex-col gap-1">
                <span className="h-0.5 rounded bg-current transition-transform group-open:translate-y-1.5 group-open:rotate-45" />
                <span className="h-0.5 rounded bg-current group-open:opacity-0" />
                <span className="h-0.5 rounded bg-current transition-transform group-open:-translate-y-1.5 group-open:-rotate-45" />
              </span>
              <span className="group-open:hidden">Menu</span>
              <span className="hidden group-open:inline">Close</span>
            </summary>
            <div className="menu-panel absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-surface">
              <nav aria-label="Main" className="mx-auto w-full max-w-[75rem] px-4 pb-6 pt-8 sm:px-6">
                <Suspense fallback={<StaticNavLinks layout="stacked" />}>
                  <NavLinks layout="stacked" />
                </Suspense>
              </nav>
              <div className="mx-auto w-full max-w-[75rem] px-4 pb-10 sm:px-6">
                <ButtonLink href="/academy" className="w-full sm:w-auto">
                  Browse courses
                </ButtonLink>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
