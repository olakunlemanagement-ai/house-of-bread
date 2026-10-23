"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { LOOP_START_DELAY_MS, PHONE_QUERY, SLOW_CONNECTIONS, playableVideos, type LoopVideos } from "@/lib/media/loops";
import { useMotion } from "./theme/motion-store";
import { useTheme } from "./theme/theme-store";

// When a loop may move: Motion is on (the footer and menu control, which
// follows prefers-reduced-motion until the visitor chooses), Save-Data is
// off, the connection is not slow (slow-2g, 2g or 3g), and there is a
// rendition for this theme and screen. Nothing else stops it: loops carry
// no button of their own. The one Motion control meets WCAG 2.2.2 for every
// loop on the site.

const subscribePhone = (listener: () => void) => {
  const list = window.matchMedia(PHONE_QUERY);
  list.addEventListener("change", listener);
  return () => list.removeEventListener("change", listener);
};

type NetworkInformation = EventTarget & { saveData?: boolean; effectiveType?: string };
const connection = () => (navigator as Navigator & { connection?: NetworkInformation }).connection;
const subscribeConnection = (listener: () => void) => {
  const c = connection();
  c?.addEventListener?.("change", listener);
  return () => c?.removeEventListener?.("change", listener);
};

// The page has settled: window load has fired, the main thread has had an
// idle moment (requestIdleCallback, or a short timeout where it is missing),
// and LOOP_START_DELAY_MS more has passed. No loop video is created before
// this, so the poster stands alone, the first load carries no video at all,
// and the moving loop stays out of the first seconds the page is measured.
let settled = false;
let waiting = false;
const settledListeners = new Set<() => void>();
function subscribeSettled(listener: () => void) {
  settledListeners.add(listener);
  if (!settled && !waiting) {
    waiting = true;
    const done = () => {
      window.setTimeout(() => {
        settled = true;
        for (const l of settledListeners) l();
      }, LOOP_START_DELAY_MS);
    };
    const idle = () => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(done, { timeout: 2000 });
      else window.setTimeout(done, 300);
    };
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  }
  return () => {
    settledListeners.delete(listener);
  };
}

/** The videos this loop plays here, or null for the poster only. Never on the server, nor before the page settles. */
function usePlayableVideos(loop: { light: LoopVideos; dark?: LoopVideos }) {
  const { resolved } = useTheme();
  const motion = useMotion();
  const phone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE_QUERY).matches, () => false);
  const saveData = useSyncExternalStore(subscribeConnection, () => connection()?.saveData === true, () => true);
  const slowConnection = useSyncExternalStore(
    subscribeConnection,
    () => SLOW_CONNECTIONS.includes(connection()?.effectiveType ?? ""),
    () => true,
  );
  const ready = useSyncExternalStore(subscribeSettled, () => settled, () => false);
  if (!ready) return null;
  return playableVideos(loop, { motion, saveData, slowConnection, theme: resolved, phone });
}

/**
 * The moving layer over a poster. Renders no video on the server, before
 * window load, an idle moment and LOOP_START_DELAY_MS, with Motion off,
 * with Save-Data on, on a slow connection, or where the loop has no
 * rendition for the theme and screen: the poster (children) stands alone and holds the space. Otherwise
 * the sources are added only when the loop nears the viewport (phones get
 * the phone crop by <source media>), it pauses offscreen and resumes on
 * return, and it fades in once it is actually playing, so the poster never
 * flashes. A theme change swaps in a fresh video element.
 */
export function LoopVideoClient({
  light,
  dark,
  mediaClassName = "",
  children,
}: {
  light: LoopVideos;
  /** The dark rendition. Without one, the layer hides in dark and a still glow shows. */
  dark?: LoopVideos;
  /** Classes for the media layer (poster and video), such as a blend mode. */
  mediaClassName?: string;
  /** The poster image, or one per theme. */
  children: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [near, setNear] = useState<string | null>(null);
  const videos = usePlayableVideos({ light, dark });
  // One key per rendition: strings, not the object, so a re-render never restarts anything.
  const key = videos?.full.webm;
  const loaded = key !== undefined && near === key;

  // Load on approach, play while visible, pause offscreen.
  useEffect(() => {
    const video = videoRef.current;
    if (!key || !video) return;
    // React sets the muted property but not the attribute. defaultMuted
    // reflects the attribute, which some browsers need for autoplay.
    video.defaultMuted = true;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(key);
          if (video.querySelector("source")) video.play().catch(() => {});
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
  }, [key]);

  // The sources are in: start it. Inserting them begins resource selection.
  useEffect(() => {
    if (loaded) videoRef.current?.play().catch(() => {});
  }, [loaded]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${dark ? "" : "dark:hidden"} ${mediaClassName}`}>
      {children}
      {videos && key ? (
        <video
          key={key}
          ref={videoRef}
          muted
          loop
          playsInline
          preload="none"
          disablePictureInPicture
          disableRemotePlayback
          aria-hidden="true"
          tabIndex={-1}
          data-loop-video=""
          onPlaying={() => setPlaying(key)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            playing === key ? "opacity-100" : "opacity-0"
          }`}
        >
          {loaded && videos.phone ? (
            <>
              <source media={PHONE_QUERY} src={videos.phone.webm} type='video/webm; codecs="vp9"' />
              <source media={PHONE_QUERY} src={videos.phone.mp4} type="video/mp4" />
            </>
          ) : null}
          {loaded ? (
            <>
              <source src={videos.full.webm} type='video/webm; codecs="vp9"' />
              <source src={videos.full.mp4} type="video/mp4" />
            </>
          ) : null}
        </video>
      ) : null}
    </div>
  );
}
