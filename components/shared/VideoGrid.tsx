import Image from "next/image";
import { getLatestVideos } from "@/lib/media/videos";
import type { FeedVideo } from "@/lib/media/youtube-feed";
import { ButtonLink } from "./Button";
import { IconTile } from "./icons";
import { PlayChip } from "./PlayChip";
import { YouTubeSubscribeButton } from "./SocialLinks";

// Dates in the ministry's own style, fixed to UTC so the server output is stable.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function VideoCard({ video, index }: { video: FeedVideo; index: number }) {
  return (
    <li className="lift flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      <div className="relative aspect-video bg-surface-mint">
        {/* hqdefault is 4:3 with letterbox bars; cover crops them to 16:9. */}
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
          loading={index < 3 ? "eager" : "lazy"}
        />
        <PlayChip className="absolute bottom-4 left-4" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug">
          {video.title}
        </h3>
        {video.publishedAt ? (
          <p className="mt-2 text-sm text-ink-muted">
            <time dateTime={video.publishedAt}>{dateFormat.format(new Date(video.publishedAt))}</time>
          </p>
        ) : null}
        <div className="mt-auto pt-5">
          <ButtonLink href={video.url} variant="secondary" arrow className="w-full">
            Watch<span className="sr-only">: {video.title}, on YouTube</span>
          </ButtonLink>
        </div>
      </div>
    </li>
  );
}

/** The latest six videos from the channel feed, or a fallback while there are none. */
export async function VideoGrid() {
  const feed = await getLatestVideos();
  if (feed.status === "unavailable") {
    return (
      <div className="flex flex-col items-start gap-6 rounded-card border border-dashed border-border-strong bg-surface p-6 sm:flex-row sm:items-center sm:p-8">
        <IconTile name="video" size="lg" />
        <p className="max-w-xl flex-1 text-lg leading-relaxed text-ink">Videos will appear here soon.</p>
        <YouTubeSubscribeButton />
      </div>
    );
  }
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {feed.videos.map((video, index) => (
        <VideoCard key={video.id} video={video} index={index} />
      ))}
    </ul>
  );
}
