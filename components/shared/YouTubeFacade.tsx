"use client";

import { useEffect, useRef, useState, type MouseEvent, type RefObject } from "react";
import { LoadingRegion, Skeleton } from "./Skeleton";
import { ButtonLink } from "./Button";

export type YouTubeSource =
  /** One video. The id must already be validated (isVideoId) by the caller. */
  | { kind: "video"; id: string }
  /** Whatever the channel is streaming live right now. */
  | { kind: "live"; channelId: string };

const YOUTUBE_ORIGIN = "https://www.youtube-nocookie.com";
const EMBED = `${YOUTUBE_ORIGIN}/embed`;

// enablejsapi lets the page send the player one command: stop when scrolled away.
function embedUrl(source: YouTubeSource): string {
  return source.kind === "video"
    ? `${EMBED}/${source.id}?autoplay=1&rel=0&enablejsapi=1`
    : `${EMBED}/live_stream?channel=${source.channelId}&autoplay=1&rel=0&enablejsapi=1`;
}

/**
 * Stops (pauses) the player once it has scrolled fully out of view, so a teaching
 * never keeps talking from a part of the page the visitor has left. It
 * does not resume on return: the visitor presses play again. Picture in
 * picture is left alone, since the visitor chose to keep watching.
 */
function useStopWhenOffscreen(frame: RefObject<HTMLIFrameElement | null>, active: boolean) {
  useEffect(() => {
    const iframe = frame.current;
    if (!active || !iframe || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting) {
          iframe.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: "pauseVideo", args: [] }),
            "https://www.youtube-nocookie.com",
          );
        }
      },
      { threshold: 0 },
    );
    observer.observe(iframe);
    return () => observer.disconnect();
  }, [frame, active]);
}

/**
 * Calls onEnded once the video plays to its end. It listens on the same
 * enablejsapi channel: the page says "listening" until the player answers,
 * then the player posts its state changes (0 is ended). Only messages from
 * this iframe and the youtube-nocookie.com origin count. No YouTube script
 * loads on the page.
 */
function useEnded(frame: RefObject<HTMLIFrameElement | null>, active: boolean, onEnded: (() => void) | undefined) {
  const callback = useRef(onEnded);
  useEffect(() => {
    callback.current = onEnded;
  });
  const wanted = onEnded !== undefined;
  useEffect(() => {
    const iframe = frame.current;
    if (!active || !wanted || !iframe) return;
    let answered = false;
    let tries = 0;
    const listen = () => {
      if (answered || tries++ > 40) return window.clearInterval(timer);
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), YOUTUBE_ORIGIN);
    };
    const timer = window.setInterval(listen, 500);
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== YOUTUBE_ORIGIN || event.source !== iframe.contentWindow || typeof event.data !== "string") return;
      let data: unknown;
      try {
        data = JSON.parse(event.data);
      } catch {
        return;
      }
      answered = true;
      if (typeof data !== "object" || data === null || !("event" in data) || !("info" in data)) return;
      const info = data.info;
      const ended =
        (data.event === "onStateChange" && info === 0) ||
        (data.event === "infoDelivery" && typeof info === "object" && info !== null && "playerState" in info && info.playerState === 0);
      if (ended) callback.current?.();
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener("message", onMessage);
    };
  }, [frame, active, wanted]);
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
  poster = "standard",
  onEnded,
}: {
  source: YouTubeSource;
  title: string;
  autoStart?: boolean;
  /** "large" (1280px wide) for a player that fills the page width; it falls back to the standard 480px one if YouTube has none. */
  poster?: "standard" | "large";
  /** Called when the video plays to its end (an Academy lesson marks itself complete). */
  onEnded?: () => void;
}) {
  const [playing, setPlaying] = useState(autoStart);
  const [large, setLarge] = useState(poster === "large");
  const frame = useRef<HTMLIFrameElement>(null);
  useStopWhenOffscreen(frame, playing);
  useEnded(frame, playing, onEnded);

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
          ref={frame}
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
          src={`https://i.ytimg.com/vi/${source.id}/${large ? "hq720" : "hqdefault"}.jpg`}
          onError={() => setLarge(false)}
          alt=""
          loading={poster === "large" ? "eager" : "lazy"}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <span
        aria-hidden="true"
        className={`absolute left-1/2 flex size-18 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald text-white shadow-raised group-hover:bg-fill-press ${
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
 * plain "Watch now" link to YouTube centred on it. React streams the real player
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
            Watch now<span className="sr-only">: {link.name}</span>
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}
