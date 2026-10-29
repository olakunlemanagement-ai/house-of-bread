"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button } from "@/components/shared/Button";
import { rowClass, rowItemClass } from "./rows";

export type ShortItem = { id: string; title: string };

const EMBED = "https://www.youtube-nocookie.com/embed";

/**
 * A Short's 9:16 thumbnail. YouTube's vertical frame (oar2) exists for
 * recent Shorts; when it does not, the standard 4:3 one stands in, cropped.
 */
function ShortThumb({ id, eager }: { id: string; eager: boolean }) {
  const [src, setSrc] = useState(`https://i.ytimg.com/vi/${id}/oar2.jpg`);
  return (
    <span className="relative block aspect-[9/16] overflow-hidden rounded-card bg-tint ring-1 ring-border group-hover:ring-border-strong">
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 12rem, (min-width: 640px) 27vw, 42vw"
        className="object-cover"
        loading={eager ? "eager" : "lazy"}
        onError={() => setSrc(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
      />
    </span>
  );
}

/**
 * Bible nuggets: the latest Shorts as tall cards. Without script each card
 * is a link to the Short on YouTube. With script a tap plays it here, in a
 * modal dialog: the youtube-nocookie player loads only then, and closing
 * the dialog (Esc, the Close button or a tap outside) removes it, so
 * nothing keeps playing. Focus moves to Close on open and back to the card
 * on close (the dialog element does both).
 */
export function ShortsRow({ shorts, layout = "row" }: { shorts: ShortItem[]; layout?: "row" | "grid" }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState<ShortItem | null>(null);

  useEffect(() => {
    if (playing && !dialog.current?.open) dialog.current?.showModal();
  }, [playing]);

  function open(event: MouseEvent<HTMLAnchorElement>, short: ShortItem) {
    // Modified clicks open YouTube in a new tab as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
    event.preventDefault();
    setPlaying(short);
  }

  return (
    <>
      <ul className={layout === "row" ? rowClass(6) : "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-5"}>
        {shorts.map((short, index) => (
          <li key={short.id} className={layout === "row" ? rowItemClass(6) : undefined}>
            <a
              href={`https://www.youtube.com/shorts/${short.id}`}
              onClick={(event) => open(event, short)}
              className="group block rounded-card"
            >
              <ShortThumb id={short.id} eager={index < 2} />
              <span className="mt-3 line-clamp-2 min-h-[2lh] text-base font-semibold leading-snug text-ink">
                {short.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-labelledby="short-player-title"
        onClose={() => setPlaying(null)}
        onClick={(event) => {
          // A tap on the backdrop lands on the dialog itself.
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
        className="m-auto max-h-[calc(100svh-2rem)] w-fit max-w-[calc(100vw-2rem)] rounded-card bg-surface p-4 text-ink shadow-raised backdrop:bg-green-night/80 sm:p-5"
      >
        {playing ? (
          <div className="flex flex-col gap-4">
            {/* w-0 min-w-full: the header takes the player's width and never sets it. */}
            <div className="flex w-0 min-w-full items-start justify-between gap-4">
              <h2 id="short-player-title" className="line-clamp-2 text-lg leading-snug">
                {playing.title}
              </h2>
              <Button variant="secondary" size="sm" onClick={() => dialog.current?.close()} className="shrink-0">
                Close
              </Button>
            </div>
            <div className="relative mx-auto aspect-[9/16] h-[min(calc(100svh-10rem),44rem)] max-w-full overflow-hidden rounded-tile bg-green-night">
              <iframe
                src={`${EMBED}/${playing.id}?autoplay=1&rel=0&playsinline=1`}
                title={playing.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                className="absolute inset-0 size-full"
              />
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
