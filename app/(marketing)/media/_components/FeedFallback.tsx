import { ButtonLink } from "@/components/shared/Button";

type YouTubeHref = `https://www.youtube.com/${string}`;

/**
 * The one way out to YouTube, for a fallback state only: never beside
 * working content. "Watch on YouTube" was retired in the reset and came
 * back on 29 October 2026 for this use alone, so this file is the only
 * place it may appear (lib/content/reset-copy.test.ts).
 */
export function YouTubeButton({ href, name }: { href: YouTubeHref; name: string }) {
  return (
    <ButtonLink href={href} variant="secondary" size="sm">
      Watch on YouTube<span className="sr-only">: {name}</span>
    </ButtonLink>
  );
}

/**
 * What a section shows when YouTube gave it nothing, or not enough to fill
 * its row: one line and the YouTubeButton. `className` sizes it like the
 * content it stands in for, so nothing shifts.
 */
export function FeedFallback({
  text,
  href,
  name,
  compact = false,
  className = "",
}: {
  text: string;
  /** The channel's videos, Shorts or playlists page. */
  href: YouTubeHref;
  /** Completes the button's accessible name, such as "the ministry's Shorts". */
  name: string;
  /** Less padding and a smaller line, for a tile the size of a thumbnail. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center rounded-card border border-dashed border-border-strong bg-surface ${compact ? "gap-3 p-5" : "gap-5 p-6 sm:p-8"} ${className}`}
    >
      <p className={`max-w-md leading-relaxed text-ink ${compact ? "text-base" : "text-lg"}`}>{text}</p>
      <YouTubeButton href={href} name={name} />
    </div>
  );
}
