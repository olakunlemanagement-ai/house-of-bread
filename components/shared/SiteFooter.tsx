import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { primaryNav, secondaryNav } from "./nav-links";

export function SiteFooter() {
  const links = [{ href: "/" as const, label: "Home" }, ...primaryNav, ...secondaryNav];

  return (
    <footer className="mt-auto border-t border-border bg-surface-deep">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <nav aria-label="Footer">
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-link underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="mt-6 text-sm text-text-muted">
          {siteConfig.name}. Placeholder footer text.
        </p>
      </div>
    </footer>
  );
}
