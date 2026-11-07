import Image from "next/image";
import { resolveVideoWithTitle } from "@/lib/youtube/oembed";
import { getLatestVideos } from "@/lib/youtube/videos";
import type { FeedVideo } from "@/lib/youtube/feed";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { teachingsLayout, thumbSizes } from "./home-teachings-layout";
import { ImageSlot } from "./ImageSlot";
import { Skeleton } from "./Skeleton";
import { VideoTitle } from "./VideoTitle";
import { YouTubeFacade, YouTubeFacadeSkeleton } from "./YouTubeFacade";

// Dates in the ministry's own style, fixed to UTC so server and browser agree.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function PublishedDate({ video }: { video: FeedVideo }) {
  if (!video.publishedAt) return null;
  return <time dateTime={video.publishedAt}>{dateFormat.format(new Date(video.publishedAt))}</time>;
}

/*
  Fixed boxes, shared with the skeleton so nothing shifts when the feed
  arrives: the lead title keeps two lines and the date one, and a small
  video keeps two title lines and the date. The grid depends on how many
  videos there are (home-teachings-layout.ts); the skeleton draws the full
  one, the lead and three.
*/
const leadTitle = "mt-5 line-clamp-2 min-h-14 text-xl leading-7";
const leadDate = "mt-1 h-5 text-sm leading-5 text-ink-muted";
const smallTitle = "line-clamp-2 min-h-12 text-base font-semibold leading-6 text-ink";
const smallDate = "mt-1 h-5 text-sm leading-5 text-ink-muted";
const full = teachingsLayout(3);

const channelVideos = `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos` as const;

/** The large video with its title and date, or the image slot with the same lines held empty. */
function Lead({ video, sizes }: { video: FeedVideo | null; sizes: string }) {
  if (!video) {
    return (
      <>
        <ImageSlot id="home-start-here" sizes={sizes} />
        <div aria-hidden="true" className={leadTitle} />
        <div aria-hidden="true" className={leadDate} />
      </>
    );
  }
  return (
    <>
      <YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />
      <h3 className={leadTitle}>
        <VideoTitle video={video} />
      </h3>
      <p className={leadDate}>
        <PublishedDate video={video} />
      </p>
    </>
  );
}

/**
 * Home's teaching block: the latest video from the channel feed large,
 * behind the click to load facade, with its title and date, then up to
 * three more as small links to YouTube. It lays out only what it has, with
 * no empty column: the lead alone runs full width, two videos sit side by
 * side, and a short list sits beside the lead (home-teachings-layout.ts).
 * When the feed is unavailable it keeps the full layout instead, the same
 * height as the loaded block and the skeleton (HomeTeachingsFallback).
 * Wrap it in Suspense with HomeTeachingsSkeleton.
 */
export async function HomeTeachings() {
  const feed = await getLatestVideos();
  if (feed.status !== "ok") {
    return <HomeTeachingsFallback lead={await resolveVideoWithTitle(siteConfig.links.featuredVideoId, [])} />;
  }
  const { videos } = feed;
  const lead = videos[0] ?? null;
  const more = videos.filter((video) => video.id !== lead?.id).slice(0, 3);
  const layout = teachingsLayout(more.length);

  return (
    <div className={layout.grid}>
      <div className={layout.lead}>
        <Lead video={lead} sizes="(min-width: 1280px) 72rem, 100vw" />
      </div>
      {more.length > 0 ? (
        <ul className={layout.list}>
          {more.map((video) => (
            <li key={video.id}>
              <a href={video.url} className={`${layout.item} rounded-xl`}>
                <span className={layout.thumb}>
                  {/* hqdefault is 4:3 with letterbox bars; cover crops them to 16:9. */}
                  <Image
                    src={video.thumbnail}
                    alt=""
                    fill
                    sizes={thumbSizes(more.length)}
                    className="object-cover"
                    loading="lazy"
                  />
                </span>
                <span>
                  <span className={smallTitle}>
                    <VideoTitle video={video} />
                    <span className="sr-only"> (opens YouTube)</span>
                  </span>
                  <span className={`${smallDate} block`}>
                    <PublishedDate video={video} />
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * The block while the feed is unavailable: the full layout, like the
 * skeleton, so it is the same height as the loaded block at every width
 * and nothing shifts. The configured featured video leads
 * (siteConfig.links.featuredVideoId), or the image slot with neither. The
 * list column holds three invisible rows built like the real ones, so it
 * keeps their exact size, with one calm line over them pointing to the
 * channel. Exported for the tests and the screenshots.
 */
export function HomeTeachingsFallback({ lead }: { lead: FeedVideo | null }) {
  return (
    <div className={full.grid} data-state="unavailable">
      <div className={full.lead}>
        <Lead video={lead} sizes="(min-width: 1280px) 48rem, (min-width: 1024px) 66vw, 100vw" />
      </div>
      <div className={`${full.list} relative`}>
        {[0, 1, 2].map((key) => (
          <div key={key} aria-hidden="true" className={`${full.item} invisible`}>
            <span className={full.thumb} />
            <span>
              <span className={`${smallTitle} block`} />
              <span className={`${smallDate} block`} />
            </span>
          </div>
        ))}
        <div className="absolute inset-0 flex items-center rounded-card border border-dashed border-border-strong bg-surface p-5 sm:p-6">
          <p className="max-w-md text-base leading-relaxed text-ink">
            The latest teachings can&apos;t be shown right now. They are all on the ministry&apos;s{" "}
            <a href={channelVideos} className="link-inline">
              YouTube channel
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Suspense fallback for HomeTeachings, sized like it: the 16:9 player box
 * with a link to the channel's videos on it (reachable without script), the
 * title and date lines, and three small rows.
 */
export function HomeTeachingsSkeleton() {
  return (
    <div className={full.grid}>
      <div className={full.lead}>
        <YouTubeFacadeSkeleton
          label="Loading the latest teaching"
          link={{ href: channelVideos, name: "the latest teaching" }}
        />
        <div aria-hidden="true">
          <div className={`${leadTitle} flex flex-col justify-center gap-2.5`}>
            <Skeleton className="h-5 w-11/12 rounded-full" />
            <Skeleton className="h-5 w-2/3 rounded-full" />
          </div>
          <div className={`${leadDate} flex items-center`}>
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
        </div>
      </div>
      <ul aria-hidden="true" className={full.list}>
        {[0, 1, 2].map((key) => (
          <li key={key} className={full.item}>
            <Skeleton className={full.thumb} />
            <span>
              <span className={`${smallTitle} flex flex-col justify-center gap-2`}>
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </span>
              <span className={`${smallDate} flex items-center`}>
                <Skeleton className="h-3 w-24 rounded-full" />
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
