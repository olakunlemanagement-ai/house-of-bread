import type { Metadata } from "next";
import type { Route } from "next";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { IconTile } from "@/components/shared/icons";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";
import { TextCTA } from "@/components/shared/TextCTA";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

const links: { href: Route; label: string }[] = [
  { href: "/", label: "Home" },
  { href: "/academy", label: "Academy" },
  { href: "/media", label: "Library" },
  { href: "/events", label: "Live sessions" },
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
        <div className="container-page pb-20 pt-20 md:pb-32 md:pt-32">
          <div className="max-w-3xl">
            <IconTile name="compass" size="lg" />
            <h1 className="mt-8 text-display">This page could not be found</h1>
            <p className="mt-6 text-lead text-ink">
              The link may be old, or the address may have been typed differently. Try one of these
              instead.
            </p>
          </div>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {links.map((item) => (
              <li
                key={item.href}
                className="lift cta-host flex min-h-16 items-center rounded-tile border border-border bg-surface px-5 shadow-soft"
              >
                <TextCTA href={item.href} stretch className="w-full justify-between">
                  {item.label}
                </TextCTA>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
