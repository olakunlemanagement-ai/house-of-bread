import Image from "next/image";
import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import type { FeedVideo } from "@/lib/media/youtube-feed";
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

/**
 * Home's teaching block: the latest video from the channel feed large,
 * behind the click to load facade, with its title and date, then up to
 * three more as small links to YouTube. It lays out only what it has, with
 * no empty column: the lead alone runs full width, two videos sit side by
 * side, and a short list sits beside the lead (home-teachings-layout.ts).
 * When the feed is unavailable the configured featured video leads, full
 * width (siteConfig.links.featuredVideoId), and with neither, the image
 * slot stands in, full width. Wrap it in Suspense with HomeTeachingsSkeleton.
 */
export async function HomeTeachings() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const lead = videos[0] ?? (await resolveVideoWithTitle(siteConfig.links.featuredVideoId, videos));
  const more = videos.filter((video) => video.id !== lead?.id).slice(0, 3);
  const layout = teachingsLayout(more.length);

  return (
    <div className={layout.grid}>
      <div className={layout.lead}>
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
          <ImageSlot id="home-start-here" sizes="(min-width: 1280px) 72rem, 100vw" />
        )}
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
