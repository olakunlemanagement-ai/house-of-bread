import type { ReactNode } from "react";
import { resolveVideo } from "@/lib/media/featured";
import { getLatestVideos } from "@/lib/media/videos";
import { isVideoId } from "@/lib/media/youtube-feed";
import { siteConfig, YOUTUBE_CHANNEL_ID } from "@/lib/site-config";
import { Skeleton } from "./Skeleton";
import { TextCTA } from "./TextCTA";
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

/**
 * The featured video in the Events Watch panel, labelled as the latest
 * session, never as live. Its title comes from the feed when the video is
 * there, otherwise the placeholder title.
 */
export async function LatestSession() {
  const feed = await getLatestVideos();
  const video = resolveVideo(siteConfig.links.featuredVideoId, feed.status === "ok" ? feed.videos : []);
  if (!video) return null;

  return (
    <Layout player={<YouTubeFacade source={{ kind: "video", id: video.id }} title={video.title} />}>
      <p className="eyebrow">Latest session</p>
      <h3 className="mt-3 text-2xl leading-snug">
        <VideoTitle video={video} />
      </h3>
      <p className="mt-3 leading-relaxed text-ink-muted">
        Sessions stream live on the ministry&apos;s YouTube channel. When the next one is live, it
        plays here.
      </p>
      <p className="mt-5">
        <TextCTA href={video.url}>Watch on YouTube</TextCTA>
      </p>
      <p className="mt-3">
        <TextCTA href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`}>
          Open the live page on YouTube
        </TextCTA>
      </p>
    </Layout>
  );
}

/** Suspense fallback for LatestSession: the same player box and caption lines. */
export function LatestSessionSkeleton() {
  return (
    <Layout player={<YouTubeFacadeSkeleton label="Loading the latest session" />}>
      <div aria-hidden="true">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="mt-4 h-5 w-11/12 rounded-full" />
        <Skeleton className="mt-6 h-4 w-full rounded-full" />
        <Skeleton className="mt-3 h-4 w-4/5 rounded-full" />
        <Skeleton className="mt-6 h-7 w-44 rounded-full" />
        <Skeleton className="mt-4 h-7 w-56 rounded-full" />
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
      <p className="mt-5">
        <TextCTA href={`https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}/live`}>
          Open the live page on YouTube
        </TextCTA>
      </p>
    </Layout>
  );
}
