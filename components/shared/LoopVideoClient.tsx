"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { playableSource, type LoopSource } from "@/lib/media/loops";
import { useMotion } from "./theme/motion-store";
import { useTheme } from "./theme/theme-store";

// When a loop may move: Motion is on (the footer and menu control, which
// follows prefers-reduced-motion until the visitor chooses), Save-Data is
// off, and there is a rendition for this theme and screen. Nothing else
// stops it: loops carry no button of their own. The one Motion control
// meets WCAG 2.2.2 for every loop on the site.

const PHONE = "(max-width: 767px)";
const subscribePhone = (listener: () => void) => {
  const list = window.matchMedia(PHONE);
  list.addEventListener("change", listener);
  return () => list.removeEventListener("change", listener);
};
const noSubscribe = () => () => {};

type NetworkInformation = { saveData?: boolean };

/** The source this loop plays here, or null for the poster only. Never on the server. */
function usePlayableSource(loop: { full: LoopSource; mobile?: LoopSource; dark?: LoopSource }) {
  const { resolved } = useTheme();
  const motion = useMotion();
  const phone = useSyncExternalStore(subscribePhone, () => window.matchMedia(PHONE).matches, () => false);
  const saveData = useSyncExternalStore(
    noSubscribe,
    () => (navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData === true,
    () => true,
  );
  return playableSource(loop, { motion, saveData, theme: resolved, phone });
}

function pickSource(video: HTMLVideoElement, source: LoopSource): string {
  return video.canPlayType('video/webm; codecs="vp9"') ? source.webm : source.mp4;
}

/**
 * The moving layer over a poster. Renders no video on the server, with
 * Motion off, with Save-Data on, or where the loop has no rendition for the
 * theme and screen: the poster (children) stands alone. Otherwise the source
 * is set only when the loop nears the viewport, it pauses offscreen and
 * resumes on return, and it fades in once it is actually playing, so the
 * poster never flashes. A theme change swaps in a fresh video element.
 */
export function LoopVideoClient({
  full,
  mobile,
  dark,
  mediaClassName = "",
  children,
}: {
  full: LoopSource;
  mobile?: LoopSource;
  /** The dark rendition. Without one, the layer hides in dark and a still glow shows. */
  dark?: LoopSource;
  /** Classes for the media layer (poster and video), such as a blend mode. */
  mediaClassName?: string;
  /** The poster image, or one per theme. */
  children: ReactNode;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const src = usePlayableSource({ full, mobile, dark });

  // Load on approach, play while visible, pause offscreen. Strings, not the
  // source object, so a re-render never restarts this.
  const webm = src?.webm;
  const mp4 = src?.mp4;
  useEffect(() => {
    const video = videoRef.current;
    if (!webm || !mp4 || !video) return;
    // React sets the muted property but not the attribute. defaultMuted
    // reflects the attribute, which some browsers need for autoplay.
    video.defaultMuted = true;
    video.muted = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.getAttribute("src")) video.src = pickSource(video, { webm, mp4 });
          video.play().catch(() => {});
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
  }, [webm, mp4]);

  return (
    <div className={`absolute inset-0 overflow-hidden ${dark ? "" : "dark:hidden"} ${mediaClassName}`}>
      {children}
      {webm ? (
        <video
          key={webm}
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
          onPlaying={() => setPlaying(webm)}
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            playing === webm ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}
    </div>
  );
}
