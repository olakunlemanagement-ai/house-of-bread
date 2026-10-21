"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import type { LoopSource } from "@/lib/media/loops";
import { Icon } from "./icons";

// Page wide motion state, shared by every loop on the page: whether the
// visitor paused motion, and which loops have come into view. The first of
// those carries the one Pause/Play control (WCAG 2.2.2).

const STORAGE_KEY = "hob:motion-paused";

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function writePaused(paused: boolean) {
  try {
    if (paused) window.localStorage.setItem(STORAGE_KEY, "1");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage blocked or full: the choice still holds for this page view.
  }
}

type MotionSnapshot = { paused: boolean; owner: string | null };
const SERVER_SNAPSHOT: MotionSnapshot = { paused: false, owner: null };

const listeners = new Set<() => void>();
let paused: boolean | null = null;
let owners: string[] = [];
let snapshot: MotionSnapshot = SERVER_SNAPSHOT;

function emit() {
  snapshot = { paused: paused ?? false, owner: owners[0] ?? null };
  for (const listener of listeners) listener();
}

const motion = {
  subscribe(listener: () => void) {
    if (paused === null) {
      paused = readPaused();
      snapshot = { paused, owner: owners[0] ?? null };
    }
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => snapshot,
  server: () => SERVER_SNAPSHOT,
  register(id: string) {
    if (!owners.includes(id)) {
      owners = [...owners, id];
      emit();
    }
  },
  unregister(id: string) {
    owners = owners.filter((owner) => owner !== id);
    emit();
  },
  setPaused(next: boolean) {
    paused = next;
    writePaused(next);
    emit();
  },
};

function subscribeQuery(query: string) {
  return (listener: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", listener);
    return () => list.removeEventListener("change", listener);
  };
}
const REDUCE = "(prefers-reduced-motion: reduce)";
const PHONE = "(max-width: 767px)";
const subscribeReduce = subscribeQuery(REDUCE);
const subscribePhone = subscribeQuery(PHONE);
const noSubscribe = () => () => {};

type NetworkInformation = { saveData?: boolean };

/** Whether this loop may move on this device. Never on the server. */
function useEligible(hasMobile: boolean): { eligible: boolean; phone: boolean } {
  const reduce = useSyncExternalStore(subscribeReduce, () => window.matchMedia(REDUCE).matches, () => true);
  const phone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);
  const saveData = useSyncExternalStore(
    noSubscribe,
    () => (navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData === true,
    () => true,
  );
  return { eligible: !reduce && !saveData && (!phone || hasMobile), phone };
}

function pickSource(video: HTMLVideoElement, source: LoopSource): string {
  return video.canPlayType('video/webm; codecs="vp9"') ? source.webm : source.mp4;
}

/**
 * The moving layer over a poster. Renders no video on the server, under
 * reduced motion, with Save-Data on, or on a phone when the loop has no
 * mobile rendition: the poster (children) stands alone. Otherwise the source
 * is set only when the loop nears the viewport, it pauses offscreen, and it
 * fades in once it is actually playing, so the poster never flashes.
 */
export function LoopVideoClient({
  full,
  mobile,
  mediaClassName = "",
  children,
}: {
  full: LoopSource;
  mobile?: LoopSource;
  /** Classes for the media layer (poster and video), such as a blend mode. */
  mediaClassName?: string;
  /** The poster image. */
  children: ReactNode;
}) {
  const id = useId();
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleRef = useRef(false);
  const [shown, setShown] = useState(false);
  const { eligible, phone } = useEligible(Boolean(mobile));
  const state = useSyncExternalStore(motion.subscribe, motion.get, motion.server);
  const pausedRef = useRef(state.paused);

  // A loop keeps the control until it unmounts or may no longer move.
  useEffect(() => {
    if (!eligible) return;
    return () => motion.unregister(id);
  }, [eligible, id]);

  // Load on approach, play while visible, pause offscreen. The first loop to
  // come near the viewport claims the page's Pause/Play control, so a loop
  // hidden by CSS (display: none never intersects) never holds it.
  // Strings, not the source objects, so a re-render never restarts this.
  const src = phone && mobile ? mobile : full;
  const webm = src.webm;
  const mp4 = src.mp4;
  useEffect(() => {
    const video = videoRef.current;
    if (!eligible || !video) return;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          motion.register(id);
          if (!video.getAttribute("src")) video.src = pickSource(video, { webm, mp4 });
          if (!pausedRef.current) video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => {
      observer.disconnect();
      video.pause();
    };
  }, [eligible, webm, mp4, id]);

  // Follow the page wide Pause/Play choice.
  useEffect(() => {
    pausedRef.current = state.paused;
    const video = videoRef.current;
    if (!video || !video.getAttribute("src")) return;
    if (state.paused) video.pause();
    else if (visibleRef.current) video.play().catch(() => {});
  }, [state.paused]);

  const isOwner = eligible && state.owner === id;

  return (
    <>
      <div className={`absolute inset-0 overflow-hidden ${mediaClassName}`}>
        {children}
        {eligible ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setShown(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
              shown ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : null}
      </div>
      {isOwner ? (
        <button
          type="button"
          onClick={() => motion.setPaused(!state.paused)}
          className="absolute bottom-3 right-3 z-20 inline-flex size-11 items-center justify-center rounded-full border border-border bg-(--control-fill) text-emerald-deep shadow-soft transition-colors hover:border-border-strong hover:bg-surface-raised"
        >
          <Icon name={state.paused ? "resume" : "pause"} className="size-5" />
          <span className="sr-only">{state.paused ? "Play background motion" : "Pause background motion"}</span>
        </button>
      ) : null}
    </>
  );
}
