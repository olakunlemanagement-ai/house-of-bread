import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/Button";
import { LiveLine } from "@/components/shared/LiveLine";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { bandClass } from "@/components/shared/Section";
import { VideoGrid, VideoGridSkeleton } from "@/components/shared/VideoGrid";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Teachings",
  description:
    "Need a word for this season? Every message from House of Bread Global in one place. Watch, then go deeper in the Academy.",
};

/**
 * Teachings (still at /media until the routes are renamed), per
 * docs/RESET-BRIEF.md section 5: the latest teaching large, a grid of the
 * rest, the live line, then the next step to the Academy. Both YouTube
 * channels are named here (the footer shows the ministry's only), and
 * written teaching, the New Testament and the reading plans stay one link
 * away, in a sentence.
 */
export default function MediaPage() {
  const channels = siteConfig.links.social.filter((account) => account.platform === "youtube");
  const ministry = channels.find((account) => account.owner === "ministry");
  const pastor = channels.find((account) => account.owner === "pastor");

  return (
    <main id="main" tabIndex={-1}>
      <PageHeader
        loop="water-light"
        eyebrow="Teachings"
        title="Need a word for this season?"
        lead="Every message, in one place. Watch, then go deeper in the Academy."
      />

      <section id="video" aria-labelledby="video-heading" className="bg-surface">
        <div className={bandClass}>
          <h2 id="video-heading" className="sr-only">
            All teachings
          </h2>
          <div>
            <Suspense fallback={<VideoGridSkeleton />}>
              <VideoGrid />
            </Suspense>
          </div>
          <LiveLine className="mt-8 md:mt-12" />
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            {ministry && pastor ? (
              <>
                Every message is also on YouTube, on{" "}
                <a href={ministry.href} className="link-inline">
                  the ministry&apos;s channel
                </a>{" "}
                and{" "}
                <a href={pastor.href} className="link-inline">
                  the pastor&apos;s channel
                </a>
                .{" "}
              </>
            ) : null}
            Prefer to read? Try the{" "}
            <Link href="/teachings" className="link-inline">
              written teachings
            </Link>
            , the{" "}
            <Link href="/new-testament" className="link-inline">
              New Testament, book by book
            </Link>
            , or a{" "}
            <Link href="/plans" className="link-inline">
              reading plan
            </Link>
            .
          </p>
        </div>
      </section>

      <NextStep title="Ready to go deeper?" text="Our courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
