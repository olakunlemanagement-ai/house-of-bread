"use client";

import { Fragment, useEffect, useRef } from "react";
import { motionAllowed, useMotion } from "./theme/motion-store";

/**
 * A section heading that fades in and rises 0.35em, line by line, once,
 * when it first scrolls into view. After mount it measures where each word
 * wraps and gives the word its line number (--line), which staggers the
 * lines 90ms apart (globals.css, [data-reveal]).
 * It arms only after mount, and only while the heading is still below the
 * viewport, so nothing is ever hidden without JavaScript and a heading
 * already on screen never blinks out. Motion Off and reduced motion leave
 * it still. The phase lives on the element's data-reveal attribute, written
 * directly, so the effect renders nothing.
 */
export function RevealHeading({
  text,
  as: Tag = "h2",
  id,
  className = "",
}: {
  text: string;
  as?: "h2" | "h3";
  id?: string;
  className?: string;
}) {
  const ref = useRef<HTMLHeadingElement>(null);
  const motion = useMotion();
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const phase = el.dataset.reveal;
    if (!motionAllowed()) {
      // Motion turned off while waiting: show the heading now.
      el.dataset.reveal = "static";
      return;
    }
    if (phase === "shown") return;
    // Only a heading still below the fold arms. One on screen stays as it is.
    if (phase !== "armed") {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      const tops: number[] = [];
      for (const span of el.querySelectorAll<HTMLElement>("[data-word]")) {
        if (!tops.includes(span.offsetTop)) tops.push(span.offsetTop);
        span.style.setProperty("--line", String(tops.indexOf(span.offsetTop)));
      }
      el.dataset.reveal = "armed";
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        el.dataset.reveal = "shown";
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <Tag ref={ref} id={id} className={className} data-reveal="static">
      {words.map((word, index) => (
        <Fragment key={index}>
          <span data-word className="rh-word">
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
