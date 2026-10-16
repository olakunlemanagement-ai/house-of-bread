import Link from "next/link";
import { footerNav } from "./nav-links";
import { Placeholder } from "./Placeholder";
import { Wordmark } from "./Wordmark";

const linkClass =
  "inline-block py-1.5 text-lime underline decoration-1 underline-offset-4 hover:decoration-2";

export function SiteFooter() {
  return (
    <footer className="tone-green bg-green-footer mt-auto">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <p className="text-lg text-on-green">
              <Wordmark />
            </p>
            <p className="mt-4 max-w-sm leading-relaxed text-on-green-muted">
              A teaching ministry committed to doctrinal clarity and careful
              handling of Scripture, serving readers across the United Kingdom,
              Africa and the United States.
            </p>
          </div>

          {footerNav.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-on-green">
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
                {column.heading === "Connect" ? (
                  <li className="pt-2 text-sm">
                    <Placeholder>
                      [SOCIAL LINKS: YouTube, and other pages to be supplied]
                    </Placeholder>
                  </li>
                ) : null}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-green pt-6 text-sm text-on-green-muted">
          <p>© 2026 House of Bread Global</p>
          <Link href="/privacy" className={linkClass}>
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
