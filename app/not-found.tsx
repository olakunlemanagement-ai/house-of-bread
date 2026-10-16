import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { IconTile } from "@/components/shared/icons";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/teachings", label: "Teachings" },
  { href: "/plans", label: "Reading plans" },
  { href: "/new-testament", label: "New Testament" },
  { href: "/events", label: "Live sessions" },
];

// Handles unknown URLs and notFound() calls from any route.
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-surface">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 md:py-28">
          <IconTile name="compass" size="lg" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight sm:text-5xl">
            This page could not be found
          </h1>
          <p className="mt-6 text-xl leading-relaxed text-ink">
            The link may be old, or the address may have been typed differently. Try one of these
            instead.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex min-h-14 items-center rounded-xl border border-border-strong bg-surface px-5 font-semibold text-green shadow-card hover:border-green"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
