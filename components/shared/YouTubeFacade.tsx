"use client";

import { useState, type MouseEvent } from "react";

/**
 * Click to load YouTube. Until the visitor asks, this is a plain link to the
 * video on YouTube with a thumbnail, so nothing from YouTube runs and it
 * works without JavaScript. On click it swaps in a youtube-nocookie.com
 * player. The id must already be validated (isVideoId) by the caller.
 */
export function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [playing, setPlaying] = useState(false);

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
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      </div>
    );
  }

  return (
    <a
      href={`https://www.youtube.com/watch?v=${videoId}`}
      onClick={play}
      className="group relative block aspect-video overflow-hidden rounded-card bg-surface-mint shadow-raised"
    >
      {/* A plain img: the thumbnail loads only when this element renders, and needs no optimiser. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        className="absolute inset-0 size-full object-cover"
      />
      <span
        aria-hidden="true"
        className="bg-green-tile absolute left-1/2 top-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-white shadow-raised transition-transform duration-200 motion-safe:group-hover:scale-105"
      >
        <svg viewBox="0 0 24 24" className="ml-1 size-8" fill="currentColor" focusable="false">
          <path d="M7 4.5v15l12-7.5z" />
        </svg>
      </span>
      <span className="absolute inset-x-0 bottom-0 bg-white/95 px-5 py-3 font-semibold text-ink">
        Play: {title}
        <span className="sr-only"> (loads YouTube)</span>
      </span>
    </a>
  );
}
