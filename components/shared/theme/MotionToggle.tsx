"use client";

import { useId } from "react";
import { setMotion, useMotion } from "./motion-store";

/**
 * The one Motion control (WCAG 2.2.2), beside the theme choice in the
 * mobile menu and the footer. A toggle button named "Motion" by its visible
 * label, with aria-pressed for the state. On and Off are drawn like the
 * theme choice's pills; which one is current comes from data-motion on the
 * html element (globals.css), so it is right from the first paint, before
 * hydration. Hidden without JavaScript (data-theme-control), when no loop
 * moves anyway.
 */
export function MotionToggle({ labelClassName = "" }: { labelClassName?: string }) {
  const labelId = useId();
  const on = useMotion() === "on";
  const pill = "flex min-h-9 items-center rounded-full px-3.5";
  return (
    <div data-theme-control>
      <p id={labelId} className={labelClassName}>
        Motion
      </p>
      <button
        type="button"
        aria-labelledby={labelId}
        aria-pressed={on}
        onClick={() => setMotion(on ? "off" : "on")}
        className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full border border-(--choice-edge) p-1 text-sm font-medium text-fg hover:bg-(--chip-hover) focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--ring) focus-visible:outline-solid"
      >
        <span aria-hidden="true" data-motion-state="on" className={pill}>
          On
        </span>
        <span aria-hidden="true" data-motion-state="off" className={pill}>
          Off
        </span>
      </button>
    </div>
  );
}
