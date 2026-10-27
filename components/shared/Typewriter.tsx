"use client";

import { useEffect, useRef, useState } from "react";
import { REDUCED_MOTION_QUERY } from "./theme/theme-script";
import { useMotion } from "./theme/motion-store";

/** Motion is on (the visitor's choice, or no reduced motion until they choose) and the system asks for no less. */
function motionAllowed(): boolean {
  if (document.documentElement.getAttribute("data-motion") === "off") return false;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * A heading typed out once, with a blinking cursor, when it first scrolls
 * into view. Screen readers get the whole sentence at once (sr-only copy);
 * the typed layer is hidden from them. The full text always holds its
 * space: the untyped rest is laid out invisibly after the cursor, and the
 * cursor has no width, so no line ever moves. While typing, the cursor is a
 * new element for each character, so the browser reads it as inserted, not
 * shifted (no layout shift is counted). Once typed it blinks for a second,
 * then fades out.
 * The phase (pending, armed, typing, done, static) lives on the layer's
 * data-typewriter attribute, written directly. The server renders
 * "pending": with script and Motion On, CSS hides the text from first
 * paint until it types, and shows it after 4 s should the script never run.
 * Without JavaScript, with Motion Off or under reduced motion the full text
 * shows, with no cursor (globals.css, Text motion).
 */
export function Typewriter({
  text,
  id,
  className = "",
  durationMs = 2700,
}: {
  text: string;
  id?: string;
  className?: string;
  /** Total typing time. The cursor then fades out over 600ms. */
  durationMs?: number;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  // Characters typed so far, or null when the whole text shows.
  const [count, setCount] = useState<number | null>(null);
  const motion = useMotion();

  useEffect(() => {
    const heading = headingRef.current;
    const layer = layerRef.current;
    if (!heading || !layer) return;
    const phase = layer.dataset.typewriter;
    if (!motionAllowed()) {
      // Never on, or turned off while waiting: show the text now. A frame
      // already typing sees the change and stops itself.
      layer.dataset.typewriter = "static";
      return;
    }
    if (phase !== "pending" && phase !== "armed") return;
    layer.dataset.typewriter = "armed";

    let frame = 0;
    let fade = 0;
    let alive = true;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        layer.dataset.typewriter = "typing";
        setCount(0);
        const start = performance.now();
        const tick = (now: number) => {
          if (!alive) return;
          if (!motionAllowed()) {
            layer.dataset.typewriter = "static";
            setCount(null);
            return;
          }
          const n = Math.min(text.length, Math.ceil(((now - start) / durationMs) * text.length));
          setCount(n);
          if (n < text.length) {
            frame = requestAnimationFrame(tick);
            return;
          }
          fade = window.setTimeout(() => {
            if (!alive) return;
            layer.dataset.typewriter = "done";
            fade = window.setTimeout(() => {
              layer.dataset.typewriter = "static";
              setCount(null);
            }, 700);
          }, 1000);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(heading);
    return () => {
      alive = false;
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(fade);
      // Cut off mid way (the effect reran): show the whole text.
      if (layer.dataset.typewriter === "typing" || layer.dataset.typewriter === "done") {
        layer.dataset.typewriter = "static";
        setCount(null);
      }
    };
  }, [motion, text, durationMs]);

  return (
    <h2 ref={headingRef} id={id} className={className}>
      <span className="sr-only">{text}</span>
      <span ref={layerRef} aria-hidden="true" data-typewriter="pending">
        {count === null ? (
          text
        ) : (
          <>
            {text.slice(0, count)}
            <span key={count} className="tw-cursor" />
            <span className="invisible">{text.slice(count)}</span>
          </>
        )}
      </span>
    </h2>
  );
}
