import type { Metadata } from "next";
import { AnnouncementBar } from "@/components/shared/AnnouncementBar";
import { ButtonLink } from "@/components/shared/Button";
import { PageHeader } from "@/components/shared/PageHeader";
import { SiteFooter } from "@/components/shared/SiteFooter";
import { SiteHeader } from "@/components/shared/SiteHeader";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

// Handles unknown URLs and notFound() calls from any route. Copy from
// docs/RESET-BRIEF.md section 5 (404 page).
export default function NotFound() {
  return (
    <>
      <AnnouncementBar />
      <SiteHeader />
      <main id="main" tabIndex={-1} className="bg-surface">
        <PageHeader
          loop="green-mesh"
          eyebrow="Page not found"
          title="This page isn't here."
          lead="The link may be old, or the address may have been typed differently."
          actions={
            <>
              <ButtonLink href="/academy">Browse free courses</ButtonLink>
              <ButtonLink href="/" variant="secondary">
                Go home
              </ButtonLink>
            </>
          }
        />
      </main>
      <SiteFooter />
    </>
  );
}
