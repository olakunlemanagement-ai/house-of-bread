import { Suspense, type ReactNode } from "react";
import { resolveVideoWithTitle } from "@/lib/media/oembed";
import { getLatestVideos } from "@/lib/media/videos";
import { isVideoId } from "@/lib/media/youtube-feed";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { Skeleton } from "./Skeleton";
import { ButtonLink } from "./Button";
import { VideoTitle } from "./VideoTitle";
import { YouTubeFacade, YouTubeFacadeSkeleton } from "./YouTubeFacade";

/**
 * True when the Events Watch panel should show the featured video as the
 * latest session: one is configured, no session is live and no dated replay
 * exists yet. Needs no fetch, so the page can pick its heading at once.
 */
export function showLatestSession({ liveNow, hasReplay }: { liveNow: boolean; hasReplay: boolean }): boolean {
  return !liveNow && !hasReplay && isVideoId(siteConfig.links.featuredVideoId);
}

function Layout({ player, children }: { player: ReactNode; children: ReactNode }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
      <div className="lg:col-span-8">{player}</div>
      <div className="lg:col-span-4">{children}</div>
    </div>
  );
}

/** The featured video with its best title: the feed's, then oEmbed's, then the placeholder. */
async function featuredVideo() {
  const feed = await getLatestVideos();
  return resolveVideoWithTitle(siteConfig.links.featuredVideoId, feed.status === "ok" ? feed.videos : []);
}

async function LatestSessionPlayer() {
  const video = await featuredVideo();
  if (!video) return null;
  return <YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />;
}

async function LatestSessionTitle() {
  const video = await featuredVideo();
  return video ? <VideoTitle video={video} /> : null;
}

/** Two lines at the h3's size (2 x 2.0625rem), so the title replaces them without a shift. */
function TitleSkeleton() {
  return (
    <>
      <span className="sr-only">Loading the title</span>
      <span aria-hidden="true" className="flex h-[4.125rem] flex-col justify-center gap-3">
        <Skeleton className="h-5 w-11/12 rounded-full" />
        <Skeleton className="h-5 w-2/3 rounded-full" />
      </span>
    </>
  );
}

/**
 * The featured video in the Events Watch panel, labelled as the latest
 * session, never as live. The id is configured, so only the player and the
 * title wait for the feed. Each has its own Suspense boundary sized like the
 * real thing, and the copy and links around them are in the first HTML.
 * Render only when showLatestSession() is true, so the id is valid.
 */
export function LatestSession() {
  const id = siteConfig.links.featuredVideoId;
  return (
    <Layout
      player={
        // No link on the fallback: "Watch on YouTube" below is already in the first HTML.
        <Suspense fallback={<YouTubeFacadeSkeleton label="Loading the latest session" />}>
          <LatestSessionPlayer />
        </Suspense>
      }
    >
      <p className="eyebrow">Latest session</p>
      {/* Two lines reserved and at most two shown, so every title and the fallback share one height. */}
      <h3 className="mt-3 line-clamp-2 min-h-[4.125rem] text-2xl leading-snug">
        <Suspense fallback={<TitleSkeleton />}>
          <LatestSessionTitle />
        </Suspense>
      </h3>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Sessions stream live on the ministry&apos;s YouTube channel. When the next one is live, it
        plays here.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <ButtonLink href={`https://www.youtube.com/watch?v=${id}`} variant="secondary" size="sm">
          Watch on YouTube
        </ButtonLink>
        <ButtonLink href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`} variant="tertiary" size="sm">
          Open the live page on YouTube
        </ButtonLink>
      </div>
    </Layout>
  );
}

/** The channel's live stream behind the facade, with a note for when it is not live. */
export function LivePlayer() {
  return (
    <Layout
      player={
        <YouTubeFacade source={{ kind: "live", channelId: YOUTUBE_CHANNEL_ID }} title="House of Bread Global on YouTube" />
      }
    >
      <h3 className="text-2xl leading-snug">When the channel is not live</h3>
      <p className="mt-3 leading-relaxed text-ink-muted">
        The player shows a YouTube message instead of a stream, or a countdown when the next
        session is already scheduled. The times on this page show when to come back.
      </p>
      <ButtonLink href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`} variant="secondary" size="sm" className="mt-5">
        Open the live page on YouTube
      </ButtonLink>
    </Layout>
  );
}
