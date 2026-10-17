import type { Metadata } from "next";
import Link from "next/link";
import type { Route } from "next";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { Icon, IconTile } from "@/components/shared/icons";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Live sessions" },
  { href: "/classes", label: "Classes" },
  { href: "/teachings", label: "Teachings" },
  { href: "/app", label: "The official app" },
];

// Handles unknown URLs and notFound() calls from any route.
export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-surface">
        <div className="container-page py-20 md:py-32">
          <div className="max-w-3xl">
            <IconTile name="compass" size="lg" />
            <h1 className="mt-8 text-display">This page could not be found</h1>
            <p className="mt-6 text-lead text-ink">
              The link may be old, or the address may have been typed differently. Try one of these
              instead.
            </p>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {links.map((item) => (
              <li key={item.href} className="lift rounded-tile">
                <Link
                  href={item.href}
                  className="flex min-h-16 items-center justify-between gap-2 rounded-tile border border-border-strong bg-surface px-5 font-semibold text-emerald-deep shadow-soft"
                >
                  {item.label}
                  <Icon name="arrow-right" className="size-5 shrink-0" />
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
