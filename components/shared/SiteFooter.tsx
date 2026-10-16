import Link from "next/link";
import { ButtonLink } from "./Button";
import { CrossWatermark, Grain } from "./Decor";
import { footerNav } from "./nav-links";
import { RegionChips } from "./RegionChips";
import { SocialLinks } from "./SocialLinks";
import { Wordmark } from "./Wordmark";

const linkClass =
  "inline-flex min-h-10 items-center text-lime underline decoration-1 underline-offset-4 hover:decoration-2";

const columnHeading = "font-sans text-sm font-semibold uppercase tracking-[0.18em] text-on-green";

export function SiteFooter() {
  return (
    <footer className="tone-green bg-green-footer relative mt-auto overflow-hidden">
      <Grain />
      <CrossWatermark className="-right-10 top-24 h-96 w-64 opacity-[0.04]" />

      <div className="container-page relative">
        {/* Closing call to action. */}
        <div className="flex flex-col gap-6 border-b border-green py-12 sm:flex-row sm:items-center sm:justify-between md:py-14">
          <p className="font-serif text-3xl font-semibold leading-tight text-on-green sm:text-4xl">
            Stay close to the ministry
          </p>
          <ButtonLink href="/subscribe" tone="green" arrow className="w-full sm:w-auto">
            Subscribe
          </ButtonLink>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]">
          <div>
            <p className="text-lg text-on-green">
              <Wordmark />
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
              <ul className="mt-4 space-y-1">
                {column.links.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className={linkClass}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className={columnHeading}>Follow</h2>
            <div className="mt-5 text-sm">
              <SocialLinks layout="column" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-green py-6 text-sm text-on-green-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 House of Bread Global</p>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
          <p className="font-semibold uppercase tracking-[0.3em] text-lime">Study . Pray . Grow</p>
        </div>
      </div>
    </footer>
  );
}
