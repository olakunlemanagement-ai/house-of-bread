import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { siteConfig } from "@/lib/site-config";
import { getTeachingsCatalog } from "@/lib/youtube/teachings";
import { FeedFallback } from "../_components/FeedFallback";
import { SeriesGrid } from "../_components/SeriesGrid";
import { TeachingsHero, TeachingsSection } from "../_components/TeachingsLayout";

// Static output like /media, refreshed hourly with the same catalog.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "All series",
  description: "Every teaching series from House of Bread Global, newest first, each in order from the first part.",
  alternates: { canonical: "/media/series" },
};

const [, pastor] = siteConfig.teachingChannels;

/**
 * Every series the catalog holds, newest first. With YOUTUBE_API_KEY that is
 * every public playlist on the teaching channels, so a new playlist shows
 * within the hour; without it, the configured ones (siteConfig.seriesPlaylistIds).
 */
export default async function AllSeriesPage() {
  const { series } = await getTeachingsCatalog();

  return (
    <main id="main" tabIndex={-1}>
      <TeachingsHero
        eyebrow="Series"
        title="Want to go through a subject from start to finish?"
        lead="Every series, newest first. Each one runs in order from the first part."
        meta={
          <p className="text-base text-ink-muted">
            {series.length} series
          </p>
        }
      />

      <TeachingsSection id="all-series" title="Series">
        {series.length > 0 ? (
          <SeriesGrid series={series} />
        ) : (
          <FeedFallback
            text="Teaching series will show here soon."
            href={`${pastor.url}/playlists`}
            name="the playlists on YouTube"
            className="min-h-56"
          />
        )}
      </TeachingsSection>

      <NextStep tight title={NEXT_STEP_COURSES.title} text={NEXT_STEP_COURSES.text}>
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
