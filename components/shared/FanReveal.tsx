"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { REDUCED_MOTION_QUERY } from "./theme/theme-script";
import { useMotion } from "./theme/motion-store";

function motionAllowed(): boolean {
  if (document.documentElement.getAttribute("data-motion") === "off") return false;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/**
 * The fan of cards in StartingCards: from md the three cards sit in a fan
 * (globals.css, Starting cards). The server renders the fan open
 * (data-fan="static"), so it shows without JavaScript. After mount, with
 * Motion On and no reduced motion, a fan still below the fold folds into a
 * stack ("armed") and opens once as it scrolls into view ("open"). A fan
 * already on screen stays as it is. Transforms only, so nothing shifts.
 * Motion Off or reduced motion: the still, open fan.
 */
export function FanReveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const motion = useMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!motionAllowed()) {
      el.dataset.fan = "static";
      return;
    }
    if (el.dataset.fan === "open") return;
    if (el.dataset.fan !== "armed") {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.dataset.fan = "armed";
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        el.dataset.fan = "open";
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [motion]);

  return (
    <ul ref={ref} data-fan="static" className={className}>
      {children}
    </ul>
  );
}
