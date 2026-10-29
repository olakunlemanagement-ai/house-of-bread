"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { motionAllowed, useMotion } from "./theme/motion-store";

/**
 * A list whose items rise into place once, one after another, as it scrolls
 * in (globals.css, "Rise reveal"). The server renders it still
 * (data-rise="static"), so it shows without JavaScript. After mount, with
 * Motion On and no reduced motion, a list still below the fold arms (items
 * lowered and clear) and opens once in view. A list already on screen stays
 * as it is. Transforms and opacity only, so nothing shifts.
 */
export function RiseReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) {
      el.dataset.rise = "static";
      return;
    }
    if (el.dataset.rise === "open") return;
    if (el.dataset.rise !== "armed") {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.rise = "armed";
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        el.dataset.rise = "open";
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <ul ref={ref} data-rise="static" className={className}>
      {children}
    </ul>
  );
}
