import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { IconTile } from "./icons";
import { Skeleton } from "./Skeleton";
import { YouTubeSubscribeButton } from "./SocialLinks";
import { VideoLibrary } from "./VideoLibrary";
import { YouTubeFacadeSkeleton } from "./YouTubeFacade";

function NoVideosYet({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex flex-col items-start gap-6 rounded-card border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:items-center sm:p-8 ${className}`}
    >
      <IconTile name="video" size="lg" />
      <p className="max-w-xl flex-1 text-lg leading-relaxed text-ink">Videos will appear here soon.</p>
      <YouTubeSubscribeButton />
    </div>
  );
}

/**
 * The player and the latest six videos from the channel feed
 * (VideoLibrary). The featured video (siteConfig.links.featuredVideoId)
 * leads the player when set, otherwise the newest feed video does. When the
 * feed is unavailable the featured video still plays, above the fallback.
 */
export async function VideoGrid() {
  const feed = await getLatestVideos();
  const videos = feed.status === "ok" ? feed.videos : [];
  const featured = await resolveVideoWithTitle(siteConfig.links.featuredVideoId, videos);
  const lead = featured ?? videos[0];

  if (!lead) return <NoVideosYet />;
  return (
    <>
      <VideoLibrary lead={lead} leadLabel={featured ? "Featured video" : "Latest video"} videos={videos} />
      {videos.length === 0 ? <NoVideosYet className="mt-12" /> : null}
    </>
  );
}

/**
 * Suspense fallback for VideoGrid: the player, with a link to the channel's
 * videos page on it, and its caption, then six cards the size of the real
 * ones (16:9 frame, two title lines, the date line, the Play button and the
 * YouTube link). The player box carries the loading status; the rest is
 * hidden from assistive technology.
 */
export function VideoGridSkeleton() {
  return (
    <div>
      <div className="grid gap-6 lg:grid-cols-12 lg:items-center lg:gap-10">
        <div className="lg:col-span-8">
          <YouTubeFacadeSkeleton
            label="Loading videos"
            link={{
              href: `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/videos`,
              name: "the ministry's videos",
            }}
          />
        </div>
        <div aria-hidden="true" className="lg:col-span-4">
          <div className="flex h-[1.05rem] items-center">
            <Skeleton className="h-3 w-28 rounded-full" />
          </div>
          <div className="mt-3 flex h-[4.125rem] flex-col justify-center gap-3">
            <Skeleton className="h-5 w-11/12 rounded-full" />
            <Skeleton className="h-5 w-2/3 rounded-full" />
          </div>
          <div className="mt-2 flex h-5 items-center">
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
          <div className="mt-5 flex h-11 items-center">
            <Skeleton className="h-7 w-44 rounded-full" />
          </div>
        </div>
      </div>
      <ul aria-hidden="true" className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map((key) => (
          <li key={key} className="flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft">
            <Skeleton className="aspect-video" />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex h-[3.4375rem] flex-col justify-center gap-2.5">
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </div>
              <div className="mt-2 flex h-5 items-center">
                <Skeleton className="h-3 w-32 rounded-full" />
              </div>
              <div className="mt-auto pt-5">
                <Skeleton className="h-12 w-full rounded-button sm:h-13" />
                <Skeleton className="mt-3 h-11 w-full rounded-button" />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
