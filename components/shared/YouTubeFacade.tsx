"use client";

import { useState, type MouseEvent } from "react";
import { LoadingRegion, Skeleton } from "./Skeleton";
import { ButtonLink } from "./Button";

export type YouTubeSource =
  /** One video. The id must already be validated (isVideoId) by the caller. */
  | { kind: "video"; id: string }
  /** Whatever the channel is streaming live right now. */
  | { kind: "live"; channelId: string };

const EMBED = "https://www.youtube-nocookie.com/embed";

function embedUrl(source: YouTubeSource): string {
  return source.kind === "video"
    ? `${EMBED}/${source.id}?autoplay=1&rel=0`
    : `${EMBED}/live_stream?channel=${source.channelId}&autoplay=1&rel=0`;
}

function watchUrl(source: YouTubeSource): string {
  return source.kind === "video"
    ? `https://www.youtube.com/watch?v=${source.id}`
    : `https://www.youtube.com/channel/${source.channelId}/live`;
}

/**
 * Click to load YouTube. Until the visitor asks, this is a plain link to
 * YouTube (with the video's thumbnail, or a still panel for a live stream),
 * so nothing from YouTube runs and it works without JavaScript. On click it
 * swaps in a youtube-nocookie.com player. `autoStart` renders the player at
 * once, for when the visitor has already asked (a video card's Play button).
 * Give it a `key` per video so a new source starts from the facade.
 */
export function YouTubeFacade({
  source,
  title,
  autoStart = false,
}: {
  source: YouTubeSource;
  title: string;
  autoStart?: boolean;
}) {
  const [playing, setPlaying] = useState(autoStart);

  function play(event: MouseEvent<HTMLAnchorElement>) {
    // Let modified clicks open YouTube in a new tab as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setPlaying(true);
  }

  if (playing) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-card bg-green-night shadow-raised">
        <iframe
          src={embedUrl(source)}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  const live = source.kind === "live";
  return (
    <a
      href={watchUrl(source)}
      onClick={play}
      className={`group relative block aspect-video overflow-hidden rounded-card shadow-raised ${
        live ? "bg-panel-tint border border-border" : "bg-surface-mint"
      }`}
    >
      {live ? null : (
        // A plain img: the thumbnail loads only when this element renders, and needs no optimiser.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${source.id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald text-white shadow-raised transition-transform duration-200 motion-safe:group-hover:scale-105 ${
          live ? "top-[42%]" : "top-[44%] sm:top-1/2"
        }`}
      >
        <svg viewBox="0 0 24 24" className="ml-1 size-8" fill="currentColor" focusable="false">
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      </span>
      {/* A plain play icon only: the title already shows beside or below the player. */}
      <span className="sr-only">
        {live ? "Watch live: " : "Play: "}
        {title} (loads YouTube)
      </span>
    </a>
  );
}

/**
 * Stands in for the facade while its video loads: the same 16:9 box, with a
 * plain "Watch on YouTube" link centred on it. React streams the real player
 * in a chunk only script reveals, so without script this link is how the
 * video stays reachable. It sits outside the hidden loading region, so it
 * stays focusable, and on a white pill, so it keeps the TextCTA colours.
 * Leave `link` out where the same link already sits beside the player in
 * the first HTML (Events), so it is not there twice.
 */
export function YouTubeFacadeSkeleton({
  label = "Loading video",
  link,
}: {
  label?: string;
  link?: {
    /** The video, or the channel's videos page when the video is not known yet. */
    href: `https://${string}`;
    /** Completes the link's accessible name, such as "the start here video". */
    name: string;
  };
}) {
  return (
    <div className="relative">
      <LoadingRegion label={label}>
        <Skeleton className="aspect-video rounded-card shadow-raised" />
      </LoadingRegion>
      {link ? (
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <ButtonLink href={link.href} size="sm" className="shadow-soft">
            Watch on YouTube<span className="sr-only">: {link.name}</span>
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
