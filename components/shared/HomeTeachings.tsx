import Image from "next/image";
import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import type { FeedVideo } from "@/lib/media/youtube-feed";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
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
  arrives: the lead title keeps two lines and the date one; a small video
  is a 72px row on phones (thumbnail beside two title lines and the date),
  a column from sm, and a row again from lg, where the three stack beside
  the lead video.
*/
const layout = "grid gap-10 lg:grid-cols-12 lg:gap-12";
const leadCol = "lg:col-span-8";
const leadTitle = "mt-5 line-clamp-2 min-h-14 text-xl leading-7";
const leadDate = "mt-1 h-5 text-sm leading-5 text-ink-muted";
const smallList = "grid content-start gap-5 sm:grid-cols-3 lg:col-span-4 lg:grid-cols-1 lg:gap-6";
const smallItem = "grid h-18 grid-cols-[8rem_1fr] gap-4 sm:h-auto sm:grid-cols-1 sm:gap-3 lg:grid-cols-[9rem_1fr] lg:gap-4";
const smallThumb = "relative aspect-video w-32 overflow-hidden rounded-xl bg-tint sm:w-full lg:w-36";
const smallTitle = "line-clamp-2 min-h-12 text-base font-semibold leading-6 text-ink";
const smallDate = "mt-1 h-5 text-sm leading-5 text-ink-muted";

/**
 * Home's teaching block: the latest video from the channel feed large,
 * behind the click to load facade, with its title and date, then the next
 * three as small links to YouTube. When the feed is unavailable the
 * configured featured video leads (siteConfig.links.featuredVideoId), and
 * with neither, the image slot stands in. Wrap it in Suspense with
 * HomeTeachingsSkeleton.
 */
export async function HomeTeachings() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const lead = videos[0] ?? (await resolveVideoWithTitle(siteConfig.links.featuredVideoId, videos));
  const more = videos.filter((video) => video.id !== lead?.id).slice(0, 3);

  return (
    <div className={layout}>
      <div className={leadCol}>
        {lead ? (
          <>
            <YouTubeFacade source={{ kind: "video", id: lead.id }} title={lead.title} />
            <h3 className={leadTitle}>
              <VideoTitle video={lead} />
            </h3>
            <p className={leadDate}>
              <PublishedDate video={lead} />
            </p>
          </>
        ) : (
          <ImageSlot id="home-start-here" sizes="(min-width: 1024px) 48rem, 100vw" />
        )}
      </div>
      {more.length > 0 ? (
        <ul className={smallList}>
          {more.map((video) => (
            <li key={video.id}>
              <a href={video.url} className={`${smallItem} rounded-xl`}>
                <span className={smallThumb}>
                  {/* hqdefault is 4:3 with letterbox bars; cover crops them to 16:9. */}
                  <Image
                    src={video.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 9rem, (min-width: 640px) 30vw, 8rem"
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
 * Suspense fallback for HomeTeachings, sized like it: the 16:9 player box
 * with a link to the channel's videos on it (reachable without script), the
 * title and date lines, and three small rows.
 */
export function HomeTeachingsSkeleton() {
  return (
    <div className={layout}>
      <div className={leadCol}>
        <YouTubeFacadeSkeleton
          label="Loading the latest teaching"
          link={{ href: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`, name: "the latest teaching" }}
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
      <ul aria-hidden="true" className={smallList}>
        {[0, 1, 2].map((key) => (
          <li key={key} className={smallItem}>
            <Skeleton className={smallThumb} />
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
