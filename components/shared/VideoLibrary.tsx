"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { FeedVideo } from "@/lib/media/youtube-feed";
import { Button } from "./Button";
import { Icon } from "./icons";
import { PlayChip } from "./PlayChip";
import { TextCTA } from "./TextCTA";
import { VideoTitle } from "./VideoTitle";
import { YouTubeFacade } from "./YouTubeFacade";

// Dates in the ministry's own style, fixed to UTC so server and browser agree.
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function PublishedDate({ video }: { video: FeedVideo }) {
  if (!video.publishedAt) return null;
  return <time dateTime={video.publishedAt}>{dateFormat.format(new Date(video.publishedAt))}</time>;
}

function VideoCard({
  video,
  index,
  current,
  onPlay,
}: {
  video: FeedVideo;
  index: number;
  current: boolean;
  onPlay: () => void;
}) {
  return (
    <li className="lift flex flex-col overflow-hidden rounded-card border border-border bg-surface shadow-soft">
      {/* A still tint holds the frame while the thumbnail loads. No shimmer under real images. */}
      <div className="relative aspect-video bg-tint">
        {/* hqdefault is 4:3 with letterbox bars; cover crops them to 16:9. */}
        <Image
          src={video.thumbnail}
          alt=""
          fill
          sizes="(min-width: 1024px) 24rem, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
          loading={index < 3 ? "eager" : "lazy"}
        />
        {/* The thumbnail plays too, for pointers. Keyboard users have the Play button below. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={onPlay}
          className="absolute inset-0 size-full cursor-pointer"
        />
        {current ? (
          <span className="absolute bottom-4 left-4 inline-flex items-center rounded-full bg-white px-3.5 py-1.5 text-sm font-semibold text-emerald-deep shadow-soft">
            Now playing
          </span>
        ) : (
          <PlayChip className="pointer-events-none absolute bottom-4 left-4" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl leading-snug">
          <VideoTitle video={video} />
        </h3>
        <p className="mt-2 text-sm text-ink-muted">
          <PublishedDate video={video} />
        </p>
        <div className="mt-auto pt-5">
          <Button variant="secondary" onClick={onPlay} className="w-full">
            <Icon name="play" className="size-5" />
            Play here<span className="sr-only">: {video.title}</span>
          </Button>
          <p className="mt-4">
            <TextCTA href={video.url}>
              Watch on YouTube<span className="sr-only">: {video.title}</span>
            </TextCTA>
          </p>
        </div>
      </div>
    </li>
  );
}

/**
 * The Media Library player and the latest videos. The lead video (the
 * featured video, or the newest) waits in the click to load facade at the
 * top. A card's Play button (or its thumbnail) loads that video into the
 * player and starts it, scrolls the player into view and moves focus to it.
 * Every card keeps a plain link to YouTube, which also works without
 * JavaScript.
 */
export function VideoLibrary({
  lead,
  leadLabel,
  videos,
}: {
  /** The video in the player before the visitor picks one. */
  lead: FeedVideo;
  /** Its eyebrow, such as "Featured video" or "Latest video". */
  leadLabel: string;
  /** The feed. May be empty when only the featured video is known. */
  videos: FeedVideo[];
}) {
  const [selected, setSelected] = useState(lead);
  const [started, setStarted] = useState(false);
  const [request, setRequest] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (request === 0) return;
    const player = playerRef.current;
    if (!player) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    player.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    player.focus({ preventScroll: true });
  }, [request]);

  function play(video: FeedVideo) {
    setSelected(video);
    setStarted(true);
    setRequest((n) => n + 1);
  }

  return (
    <div>
      <div
        ref={playerRef}
        tabIndex={-1}
        role="region"
        aria-label={`Now playing: ${selected.title}`}
        className="grid gap-6 rounded-card lg:grid-cols-12 lg:items-center lg:gap-10"
      >
        <div className="lg:col-span-8">
          <YouTubeFacade
            key={`${selected.id}-${started}`}
            source={{ kind: "video", id: selected.id }}
            title={selected.title}
            autoStart={started}
          />
        </div>
        <div className="lg:col-span-4">
          <p className="eyebrow">{started ? "Now playing" : leadLabel}</p>
          <h3 className="mt-3 text-2xl leading-snug">
            <VideoTitle video={selected} />
          </h3>
          <p className="mt-2 text-sm text-ink-muted">
            <PublishedDate video={selected} />
          </p>
          <p className="mt-5">
            <TextCTA href={selected.url}>Watch on YouTube</TextCTA>
          </p>
        </div>
      </div>

      {videos.length > 0 ? (
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {videos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              index={index}
              current={started && video.id === selected.id}
              onPlay={() => play(video)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}
