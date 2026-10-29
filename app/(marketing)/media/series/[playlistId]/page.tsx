import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";

import { RevealHeading } from "@/components/shared/RevealHeading";
import { summarise } from "@/lib/youtube/catalog";
import { getSeries, seriesParams } from "@/lib/youtube/teachings";
import { seriesHref, teachingCount, watchHref } from "../../_components/format";
import { ShareButton } from "../../_components/ShareButton";
import { TitleText } from "../../_components/TeachingCard";
import { teachingsBandClass, teachingsHeadingClass, TeachingsHero } from "../../_components/TeachingsLayout";
import { VideoThumb } from "../../_components/VideoThumb";

// Render the full page before responding, so an unknown playlist returns a real 404.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return (await seriesParams()).map((playlistId) => ({ playlistId }));
}

export async function generateMetadata({ params }: PageProps<"/media/series/[playlistId]">): Promise<Metadata> {
  const { playlistId } = await params;
  const series = await getSeries(playlistId);
  if (!series) return {};
  return {
    title: series.title,
    description: summarise(series.description) ?? `${teachingCount(series)} from House of Bread Global, in order.`,
    alternates: { canonical: seriesHref(series.id) },
  };
}

/**
 * One series (a YouTube playlist): its cover, name, description when the
 * Data API supplies one, Share, then every episode in playlist order, each
 * opening its teaching page here.
 */
export default async function SeriesPage({ params }: PageProps<"/media/series/[playlistId]">) {
  const { playlistId } = await params;
  const series = await getSeries(playlistId);
  if (!series) notFound();
  const first = series.episodes[0];

  return (
    <main id="main" tabIndex={-1}>
      <TeachingsHero
        eyebrow="Series"
        title={series.title}
        lead={summarise(series.description, 220) ?? undefined}
        meta={<p className="text-base text-ink-muted">{teachingCount(series)}</p>}
        actions={
          <>
            <ButtonLink href={watchHref(first.id)}>
              Watch now
            </ButtonLink>
            <ShareButton title={series.title} path={seriesHref(series.id)} />
          </>
        }
        visual={
          <span className="relative block aspect-video overflow-hidden rounded-card bg-tint ring-1 ring-border">
            <Image src={first.thumbnail} alt="" fill priority sizes="(min-width: 1024px) 42rem, 100vw" className="object-cover" />
          </span>
        }
      />

      <section aria-labelledby="episodes-heading" className="bg-surface">
        <div className={teachingsBandClass}>
          <RevealHeading id="episodes-heading" text="What's in this series?" className={teachingsHeadingClass} />
          <ol className={`mt-4 md:mt-5 divide-y divide-border border-y border-border`}>
            {series.episodes.map((video, index) => (
              <li key={video.id}>
                <Link
                  href={watchHref(video.id)}
                  className="group grid grid-cols-[8.5rem_1fr] items-start gap-4 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6 sm:py-5"
                >
                  <VideoThumb
                    src={video.thumbnail}
                    durationSeconds={video.durationSeconds}
                    sizes="(min-width: 640px) 14rem, 8.5rem"
                    className="rounded-tile ring-1 ring-border group-hover:ring-border-strong"
                  />
                  <span className="min-w-0">
                    <span className="block text-sm text-ink-muted">Part {index + 1}</span>
                    <span className="mt-1 line-clamp-2 font-serif text-lg font-semibold leading-snug text-ink sm:text-xl">
                      <TitleText video={video} />
                    </span>
                    {video.description ? (
                      <span className="mt-2 line-clamp-2 text-base leading-relaxed text-ink-muted">
                        {summarise(video.description, 400)}
                      </span>
                    ) : null}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <NextStep tight title="Ready to go deeper?" text="Our courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
