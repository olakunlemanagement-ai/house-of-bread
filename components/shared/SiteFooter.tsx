import { Suspense } from "react";
import { ButtonLink } from "./Button";
import { footerNav, legalNav } from "./nav-links";
import { NavLinks, StaticNavLinks } from "./NavLinks";
import { RegionChips } from "./RegionChips";
import { SocialLinks } from "./SocialLinks";
import { Logo } from "./Logo";

const columnHeading = "font-sans text-xs font-semibold uppercase tracking-[0.16em] text-on-green-muted";

export function SiteFooter() {
  // Deep green is the footer only. White text and links, white focus ring.
  return (
    <footer className="tone-deep bg-green-footer relative mt-auto overflow-hidden">
      <div className="container-page relative">
        {/*
          Closing call to action, only on pages that do not already end with
          the newsletter card. Hidden by .footer-cta in globals.css when the
          page holds [data-newsletter]. Without :has support it simply shows.
        */}
        <div className="footer-cta flex flex-col gap-6 border-b border-white/15 py-12 sm:flex-row sm:items-center sm:justify-between md:py-14">
          <p className="font-serif text-2xl font-medium leading-tight text-on-green sm:text-3xl">
            Stay close to the ministry
          </p>
          <ButtonLink href="/subscribe" tone="green" arrow className="w-full sm:w-auto">
            Subscribe
          </ButtonLink>
        </div>

        {/* Link columns size to their content, so no link or current pill wraps. */}
        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_auto_auto_minmax(0,1.1fr)] lg:gap-x-14">
          <div>
            <p className="text-base text-on-green">
              <Logo onDeep />
            </p>
            <p className="mt-5 max-w-sm leading-relaxed text-on-green-muted">
              A teaching ministry committed to doctrinal clarity and careful handling of Scripture,
              serving believers across the United Kingdom, Africa and the United States.
            </p>
            <div className="mt-6">
              <RegionChips />
            </div>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading.toLowerCase()}`}>
              <h2 id={`footer-${column.heading.toLowerCase()}`} className={columnHeading}>
                {column.heading}
              </h2>
              <Suspense fallback={<StaticNavLinks layout="footer" items={column.links} />}>
                <NavLinks layout="footer" items={column.links} />
              </Suspense>
            </nav>
          ))}

          <div>
            <h2 className={columnHeading}>Follow</h2>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/15 py-6 text-sm text-on-green-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 House of Bread Global</p>
          <nav aria-label="Legal">
            <Suspense fallback={<StaticNavLinks layout="legal" items={legalNav} />}>
              <NavLinks layout="legal" items={legalNav} />
            </Suspense>
          </nav>
          <p className="font-semibold uppercase tracking-[0.3em]">Study . Pray . Grow</p>
        </div>
      </div>
    </footer>
  );
}
