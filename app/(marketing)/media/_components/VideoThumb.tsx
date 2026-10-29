import Image from "next/image";
import { durationInWords, formatDuration } from "@/lib/youtube/duration";

/**
 * The duration over a thumbnail's corner, only when the Data API supplied
 * it: never a guess. White on green-night at 85%, as PlayChip (10:1 or
 * more over any thumbnail). The words are for screen readers.
 */
export function DurationBadge({ seconds, className = "" }: { seconds: number | null; className?: string }) {
  if (!seconds) return null;
  return (
    <span
      className={`absolute bottom-2.5 right-2.5 rounded-md bg-green-night/85 px-2 py-0.5 text-xs font-semibold tabular-nums text-white ${className}`}
    >
      <span aria-hidden="true">{formatDuration(seconds)}</span>
      <span className="sr-only">, {durationInWords(seconds)}</span>
    </span>
  );
}

/** A round play mark, decorative: the link around it carries the name. */
export function PlayMark({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald text-white shadow-raised ${
        size === "lg" ? "size-18" : "size-12"
      }`}
    >
      <svg viewBox="0 0 24 24" className={`ml-0.5 ${size === "lg" ? "size-8" : "size-5"}`} fill="currentColor" focusable="false">
        <path d="M7 4.5v15l12-7.5z" />
      </svg>
    </span>
  );
}

/**
 * A 16:9 thumbnail on a still tint (no shimmer under real images), cropped
 * from YouTube's 4:3 hqdefault, with the duration badge and an optional
 * play mark. Lazy unless `eager`, for the ones above the fold.
 */
export function VideoThumb({
  src,
  durationSeconds,
  sizes,
  eager = false,
  play = false,
  className = "",
}: {
  src: string;
  durationSeconds: number | null;
  sizes: string;
  eager?: boolean;
  play?: boolean | "lg";
  className?: string;
}) {
  return (
    <span className={`relative block aspect-video overflow-hidden bg-tint ${className}`}>
      <Image src={src} alt="" fill sizes={sizes} className="object-cover" loading={eager ? "eager" : "lazy"} />
      {play ? <PlayMark size={play === "lg" ? "lg" : "md"} /> : null}
      <DurationBadge seconds={durationSeconds} />
    </span>
  );
}
