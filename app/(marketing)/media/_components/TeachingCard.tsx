import Link from "next/link";
import type { Video } from "@/lib/youtube/catalog";
import { hasPlaceholderTitle } from "@/lib/youtube/featured";
import { Placeholder } from "@/components/shared/Placeholder";
import { formatVideoDate, watchHref } from "./format";
import { VideoThumb } from "./VideoThumb";

/** A video's title, marked as a placeholder when YouTube did not supply it. */
export function TitleText({ video }: { video: Video }) {
  return hasPlaceholderTitle(video) ? <Placeholder>{video.title}</Placeholder> : <>{video.title}</>;
}

/**
 * One teaching: its thumbnail (with the duration when known), title (two
 * lines, always reserved, so every card in a row lines up) and date. The
 * whole card is one link to the teaching's page on this site, one tab stop.
 * Nothing moves on hover; the thumbnail's edge deepens.
 */
export function TeachingCard({ video, eager = false, sizes }: { video: Video; eager?: boolean; sizes: string }) {
  return (
    <Link href={watchHref(video.id)} className="group block rounded-card">
      <VideoThumb
        src={video.thumbnail}
        durationSeconds={video.durationSeconds}
        sizes={sizes}
        eager={eager}
        className="rounded-card ring-1 ring-border group-hover:ring-border-strong"
      />
      <span className="mt-4 line-clamp-2 min-h-[2lh] font-serif text-lg font-semibold leading-snug text-ink">
        <TitleText video={video} />
      </span>
      <span className="mt-1.5 block min-h-5 text-sm text-ink-muted">
        {video.publishedAt ? <time dateTime={video.publishedAt}>{formatVideoDate(video.publishedAt)}</time> : null}
      </span>
    </Link>
  );
}
