import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/shared/Button";
import { LiveLine } from "@/components/shared/LiveLine";
import { NextStep } from "@/components/shared/NextStep";
import { PageHeader } from "@/components/shared/PageHeader";
import { bandBodyClass, bandClass, SectionHeader, toneClass, type SectionTone } from "@/components/shared/Section";
import { summarise, type Video } from "@/lib/youtube/catalog";
import { getFeaturedTeaching, getTeachingsCatalog } from "@/lib/youtube/teachings";
import { siteConfig } from "@/lib/site-config";
import { FeedFallback, YouTubeButton } from "./_components/FeedFallback";
import { watchHref } from "./_components/format";
import { rowClass, rowItemClass } from "./_components/rows";
import { SeriesGrid } from "./_components/SeriesGrid";
import { ShortsRow } from "./_components/ShortsRow";
import { TeachingCard, TitleText } from "./_components/TeachingCard";
import { DurationBadge, PlayMark } from "./_components/VideoThumb";

// The whole page is static output, rebuilt hourly in the background. With a
// Suspense boundary here, Next streamed the sections after the first HTML,
// so they needed script.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "Teachings",
  description:
    "Every message from House of Bread Global in one place: the latest teachings, short Bible nuggets and whole series. Watch, then go deeper in the Academy.",
};

const [ministry, pastor] = siteConfig.teachingChannels;
const LATEST = 4;
const NUGGETS = 6;
const cardSizes = "(min-width: 1024px) 18rem, (min-width: 640px) 44vw, 78vw";

/** A section in the Home rhythm, labelled by its heading, with a marked region whose height check-noscript measures. */
function Band({
  id,
  title,
  tone = "white",
  children,
}: {
  id: string;
  title: string;
  tone?: SectionTone;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={toneClass[tone]}>
      <div className={bandClass}>
        <SectionHeader id={`${id}-heading`}>{title}</SectionHeader>
        <div data-region={id} className={bandBodyClass}>
          {children}
        </div>
      </div>
    </section>
  );
}

/** The featured teaching's thumbnail, large, on the right of the hero. The Watch now button is the named link; this one repeats it for pointers. */
function FeaturedThumb({ video }: { video: Video }) {
  return (
    <Link
      href={watchHref(video.id)}
      tabIndex={-1}
      aria-hidden="true"
      className="group relative block aspect-video overflow-hidden rounded-card bg-tint shadow-raised ring-1 ring-border hover:ring-border-strong"
    >
      <Image
        src={video.thumbnail}
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 34rem, 100vw"
        className="object-cover"
      />
      <PlayMark size="lg" />
      <DurationBadge seconds={video.durationSeconds} className="bottom-4 right-4 text-sm" />
    </Link>
  );
}

function Hero({ featured }: { featured: Video | null }) {
  if (!featured) {
    return (
      <PageHeader
        loop="water-light"
        eyebrow="Featured teaching"
        title="Need a word for this season?"
        lead="Every message, in one place. The latest teaching will show here soon."
        actions={<YouTubeButton href={`${ministry.url}/videos`} name="the ministry's videos" />}
      />
    );
  }
  return (
    <PageHeader
      loop="water-light"
      eyebrow="Featured teaching"
      title={<TitleText video={featured} />}
      lead={summarise(featured.description) ?? undefined}
      actions={
        <ButtonLink href={watchHref(featured.id)}>
          Watch now
        </ButtonLink>
      }
      visual={<FeaturedThumb video={featured} />}
    />
  );
}

/** Latest teachings: four cards. With fewer, the next slot is the fallback tile, so the row never ends in a gap. */
function Latest({ videos }: { videos: Video[] }) {
  if (videos.length === 0) {
    return (
      <FeedFallback
        text="New teachings will show here soon."
        href={`${ministry.url}/videos`}
        name="the ministry's videos"
        className="min-h-72"
      />
    );
  }
  return (
    <ul className={rowClass(4)}>
      {videos.map((video, index) => (
        <li key={video.id} className={rowItemClass(4)}>
          <TeachingCard video={video} sizes={cardSizes} eager={index < 2} />
        </li>
      ))}
      {videos.length < LATEST ? (
        <li className={rowItemClass(4)}>
          <FeedFallback
            text="Every teaching is also on YouTube."
            href={`${ministry.url}/videos`}
            name="the ministry's videos"
            compact
            className="aspect-video"
          />
        </li>
      ) : null}
    </ul>
  );
}

async function TeachingsContent() {
  const catalog = await getTeachingsCatalog();
  const featured = await getFeaturedTeaching(catalog);
  const latest = catalog.longForm.filter((video) => video.id !== featured?.id).slice(0, LATEST);
  const nuggets = catalog.shorts.slice(0, NUGGETS).map(({ id, title }) => ({ id, title }));

  return (
    <>
      <Hero featured={featured} />

      <Band id="latest" title="Latest teachings">
        <Latest videos={latest} />
      </Band>

      <Band id="nuggets" title="Bible nuggets" tone="warm">
        {nuggets.length > 0 ? (
          <ShortsRow shorts={nuggets} />
        ) : (
          <FeedFallback
            text="Short Bible nuggets will show here soon."
            href={`${ministry.url}/shorts`}
            name="the ministry's Shorts"
            className="min-h-72"
          />
        )}
      </Band>

      <Band id="series" title="Explore series">
        {catalog.series.length > 0 ? (
          <SeriesGrid series={catalog.series} />
        ) : (
          <FeedFallback
            text="Teaching series will show here soon."
            href={`${pastor.url}/playlists`}
            name="the playlists on YouTube"
            className="min-h-72"
          />
        )}
        <LiveLine className="mt-10 md:mt-14" />
      </Band>
    </>
  );
}

/**
 * Teachings (still at /media until the routes are renamed), in the shape of
 * BibleProject's Videos page: the featured teaching as the hero, the latest
 * four, the latest Shorts ("Bible nuggets"), the series, then the live line
 * and the next step to the Academy. Every card opens a page on this site
 * (/media/watch, /media/series); only a Short plays in place. All YouTube
 * data comes through lib/youtube, refreshed hourly. No Suspense: the page
 * must reach visitors without script, so the whole of it is prerendered
 * (ensureStatic), the cached catalog included.
 */
export default function MediaPage() {
  return (
    <main id="main" tabIndex={-1}>
      <TeachingsContent />

      <NextStep title="Ready to go deeper?" text="Our courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
