import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/shared/Button";
import { NextStep } from "@/components/shared/NextStep";
import { YouTubeFacade } from "@/components/shared/YouTubeFacade";
import { summarise, type Video } from "@/lib/youtube/catalog";
import { getWatchTeaching, watchParams } from "@/lib/youtube/teachings";
import { formatVideoDate, seriesHref, watchHref } from "../../_components/format";
import { ShareButton } from "../../_components/ShareButton";
import { TitleText } from "../../_components/TeachingCard";
import { VideoThumb } from "../../_components/VideoThumb";

// Render the full page before responding, so an unknown or foreign video id
// returns a real 404 status rather than a 200 shell.
export const ensureStatic = "navigation";

export async function generateStaticParams() {
  return (await watchParams()).map((videoId) => ({ videoId }));
}

export async function generateMetadata({ params }: PageProps<"/media/watch/[videoId]">): Promise<Metadata> {
  const { videoId } = await params;
  const data = await getWatchTeaching(videoId);
  if (!data) return {};
  return {
    title: data.video.title,
    description: summarise(data.video.description) ?? "A teaching from House of Bread Global.",
    alternates: { canonical: watchHref(data.video.id) },
  };
}

/** The description as paragraphs, line breaks kept. Plain text: links in it are not made live. */
function Description({ text }: { text: string }) {
  return (
    <div className="mt-8 max-w-[68ch] space-y-4 text-base leading-relaxed text-ink [overflow-wrap:anywhere]">
      {text.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** One row in "More teachings": the thumbnail with its duration, and the title. The whole row is one link. */
function MoreRow({ video }: { video: Video }) {
  return (
    <li>
      <Link href={watchHref(video.id)} className="group grid grid-cols-[8.5rem_1fr] items-start gap-4 rounded-tile">
        <VideoThumb
          src={video.thumbnail}
          durationSeconds={video.durationSeconds}
          sizes="8.5rem"
          className="rounded-tile ring-1 ring-border group-hover:ring-border-strong"
        />
        <span className="line-clamp-3 font-serif text-base font-semibold leading-snug text-ink">
          <TitleText video={video} />
        </span>
      </Link>
    </li>
  );
}

/**
 * One teaching. The video comes first, so this page has no looping hero:
 * an exception to the full screen hero rule, agreed on 29 October 2026.
 * The page starts on the plain surface below the transparent header. The
 * player loads nothing from YouTube until the visitor presses play.
 */
export default async function WatchPage({ params }: PageProps<"/media/watch/[videoId]">) {
  const { videoId } = await params;
  const data = await getWatchTeaching(videoId);
  if (!data) notFound();
  const { video, series, more } = data;

  return (
    <main id="main" tabIndex={-1}>
      <div className="bg-surface">
        <div className="container-page pb-8 pt-24 sm:pt-28 md:pb-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <li>
                <Link href="/media" className="link-inline">
                  Teachings
                </Link>
              </li>
              {series ? (
                <>
                  <li aria-hidden="true" className="text-ink-muted">
                    ›
                  </li>
                  <li>
                    <Link href={seriesHref(series.id)} className="link-inline">
                      {series.title}
                    </Link>
                  </li>
                </>
              ) : null}
            </ol>
          </nav>

          <div className="mt-5">
            <YouTubeFacade key={video.id} source={{ kind: "video", id: video.id }} title={video.title} poster="large" />
          </div>

          <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-12 lg:gap-12">
            <article className="lg:col-span-8">
              <h1 className="text-h2">
                <TitleText video={video} />
              </h1>
              {video.publishedAt ? (
                <p className="mt-3 text-sm text-ink-muted">
                  <time dateTime={video.publishedAt}>{formatVideoDate(video.publishedAt)}</time>
                </p>
              ) : null}
              <div className="mt-6">
                <ShareButton title={video.title} path={watchHref(video.id)} />
              </div>
              {video.description ? <Description text={video.description} /> : null}
            </article>

            {more.length > 0 ? (
              <aside aria-labelledby="more-heading" className="lg:col-span-4">
                <h2 id="more-heading" className="text-2xl leading-tight">
                  More teachings
                </h2>
                <ul className="mt-6 space-y-5">
                  {more.map((other) => (
                    <MoreRow key={other.id} video={other} />
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </div>

      <NextStep tight title="Ready to go deeper?" text="Our courses take you through it, one lesson at a time.">
        <ButtonLink href="/academy">Browse courses</ButtonLink>
      </NextStep>
    </main>
  );
}
