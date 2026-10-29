import type { Metadata } from "next";
import { ButtonLink } from "@/components/shared/Button";
import { NEXT_STEP_COURSES, NextStep } from "@/components/shared/NextStep";
import { siteConfig } from "@/lib/site-config";
import { getTeachingsCatalog } from "@/lib/youtube/teachings";
import { FeedFallback } from "../_components/FeedFallback";
import { ShortsRow } from "../_components/ShortsRow";
import { TeachingCard } from "../_components/TeachingCard";
import { TeachingsHero, TeachingsSection } from "../_components/TeachingsLayout";

// Static output like /media, refreshed hourly with the same catalog.
export const ensureStatic = "navigation";

export const metadata: Metadata = {
  title: "All teachings",
  description:
    "Every teaching and Bible nugget from House of Bread Global, newest first. New uploads appear here by themselves.",
  alternates: { canonical: "/media/all" },
};

const [ministry] = siteConfig.teachingChannels;
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

/**
 * Every teaching the catalog holds, newest first, then every Short. Both
 * lists come from lib/youtube and follow each upload within the hour. With
 * YOUTUBE_API_KEY that is every upload on the teaching channels; without
 * it, the latest 15 per channel and list (the feeds' cap).
 */
export default async function AllTeachingsPage() {
  const catalog = await getTeachingsCatalog();
  const { longForm, shorts } = catalog;

  return (
    <main id="main" tabIndex={-1}>
      <TeachingsHero
        eyebrow="Teachings"
        title="Looking for a particular teaching?"
        lead="Every teaching, newest first. New ones appear here as soon as they are posted."
        meta={
          <p className="text-base text-ink-muted">
            {plural(longForm.length, "teaching", "teachings")}, {plural(shorts.length, "Bible nugget", "Bible nuggets")}
          </p>
        }
      />

      <TeachingsSection id="all-teachings" title="Teachings">
        {longForm.length > 0 ? (
          <ul className="grid gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {longForm.map((video, index) => (
              <li key={video.id}>
                <TeachingCard
                  video={video}
                  eager={index < 2}
                  sizes="(min-width: 1024px) 18rem, (min-width: 640px) 50vw, 100vw"
                />
              </li>
            ))}
          </ul>
        ) : (
          <FeedFallback
            text="New teachings will show here soon."
            href={`${ministry.url}/videos`}
            name="the ministry's videos"
            className="min-h-56"
          />
        )}
      </TeachingsSection>

      <TeachingsSection id="all-nuggets" title="Bible nuggets">
        {shorts.length > 0 ? (
          <ShortsRow layout="grid" shorts={shorts.map(({ id, title }) => ({ id, title }))} />
        ) : (
          <FeedFallback
            text="Short Bible nuggets will show here soon."
            href={`${ministry.url}/shorts`}
            name="the ministry's Shorts"
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
