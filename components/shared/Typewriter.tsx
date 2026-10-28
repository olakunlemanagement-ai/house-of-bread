"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
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
 * space: the untyped rest is laid out invisibly, after an empty marker span.
 * Nothing else sits in the text, because generated content there breaks
 * text shaping, widens a split word by a pixel or two and can push a word
 * to the next line. The cursor is a separate bar, moved onto the marker by
 * transform (a transform is never a layout shift). Once typed, the cursor
 * stays at the end of the sentence and keeps blinking, following the text
 * if it rewraps (a resize).
 * The phase (pending, armed, typing, done, static) lives on the layer's
 * data-typewriter attribute, written directly. The server renders
 * "pending": with script and Motion On, CSS hides the text from first
 * paint until it types, and shows it after 4 s should the script never run.
 * Without JavaScript, with Motion Off or under reduced motion the full text
 * shows, with no cursor; turning Motion Off at any point removes the
 * cursor at once (WCAG 2.2.2: the footer's Motion control stops the blink).
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
  /** Total typing time. The cursor then keeps blinking at the end. */
  durationMs?: number;
}) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const layerRef = useRef<HTMLSpanElement>(null);
  const markerRef = useRef<HTMLSpanElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  // Characters typed so far, or null when the whole text shows with no cursor.
  const [count, setCount] = useState<number | null>(null);
  const motion = useMotion();

  useEffect(() => {
    const heading = headingRef.current;
    const layer = layerRef.current;
    if (!heading || !layer) return;
    const phase = layer.dataset.typewriter;
    if (!motionAllowed()) {
      // Never on, or turned off while waiting: show the text now. A frame
      // already typing sees the change and stops itself, and a cursor
      // already blinking went with the cleanup below.
      layer.dataset.typewriter = "static";
      return;
    }
    if (phase !== "pending" && phase !== "armed") return;
    layer.dataset.typewriter = "armed";

    let frame = 0;
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
          // Typed. The cursor stays at the end and keeps blinking.
          layer.dataset.typewriter = "done";
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
      // Cut off mid way, or Motion turned off while the cursor blinks (the
      // effect reran): show the whole text, with no cursor.
      if (layer.dataset.typewriter === "typing" || layer.dataset.typewriter === "done") {
        layer.dataset.typewriter = "static";
        setCount(null);
      }
    };
  }, [motion, text, durationMs]);

  // Put the cursor bar on the marker after each typed character, and again
  // whenever the heading changes size (the text rewraps), while it shows.
  useLayoutEffect(() => {
    const heading = headingRef.current;
    const marker = markerRef.current;
    const caret = caretRef.current;
    if (!heading || !marker || !caret) return;
    const place = () => {
      const box = heading.getBoundingClientRect();
      const at = marker.getBoundingClientRect();
      caret.style.height = `${at.height * 0.62}px`;
      caret.style.transform = `translate(${at.left - box.left}px, ${at.top - box.top + at.height * 0.2}px)`;
    };
    place();
    if (count !== text.length) return;
    const resize = new ResizeObserver(place);
    resize.observe(heading);
    return () => resize.disconnect();
  }, [count, text.length]);

  return (
    // Plain wrapping, not the headings' balance: balancing a half typed
    // sentence can pick a different number of lines for a frame.
    <h2 ref={headingRef} id={id} className={`relative text-wrap ${className}`}>
      <span className="sr-only">{text}</span>
      <span ref={layerRef} aria-hidden="true" data-typewriter="pending">
        {count === null ? (
          text
        ) : (
          <>
            {text.slice(0, count)}
            <span ref={markerRef} />
            <span className="invisible">{text.slice(count)}</span>
          </>
        )}
      </span>
      {count === null ? null : <span ref={caretRef} aria-hidden="true" className="tw-caret" />}
    </h2>
  );
}
