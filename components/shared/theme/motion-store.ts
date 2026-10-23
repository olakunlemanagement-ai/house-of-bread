import { useSyncExternalStore } from "react";
import { MOTION_KEY, REDUCED_MOTION_QUERY } from "./theme-script";

export type Motion = "on" | "off";

// Page wide Motion setting, in the same shape as the theme store. The html
// element's data-motion is the source of truth: the head script set it
// before first paint, and setMotion changes it. Off stops and hides every
// loop video (CSS hides them at once; LoopVideoClient unmounts them).

/** A saved choice wins; with none, motion follows prefers-reduced-motion. */
export function resolveMotion(saved: string | null, reduce: boolean): Motion {
  if (saved === "on" || saved === "off") return saved;
  return reduce ? "off" : "on";
}

function readSaved(): string | null {
  try {
    return window.localStorage.getItem(MOTION_KEY);
  } catch {
    return null;
  }
}

const listeners = new Set<() => void>();
let snapshot: Motion | null = null;
let media: MediaQueryList | null = null;

function read(): Motion {
  return document.documentElement.getAttribute("data-motion") === "off" ? "off" : "on";
}

function apply(next: Motion) {
  document.documentElement.setAttribute("data-motion", next);
  if (next === snapshot) return;
  snapshot = next;
  for (const listener of listeners) listener();
}

/** The system setting changed: it matters only while nothing is saved. */
function onMediaChange() {
  apply(resolveMotion(readSaved(), window.matchMedia(REDUCED_MOTION_QUERY).matches));
}

/** Another tab changed the setting. */
function onStorage(event: StorageEvent) {
  if (event.key !== MOTION_KEY) return;
  apply(resolveMotion(event.newValue, window.matchMedia(REDUCED_MOTION_QUERY).matches));
}

export function setMotion(next: Motion) {
  try {
    window.localStorage.setItem(MOTION_KEY, next);
  } catch {
    // Storage blocked or full: the setting still holds for this page view.
  }
  apply(next);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!media) {
    media = window.matchMedia(REDUCED_MOTION_QUERY);
    media.addEventListener("change", onMediaChange);
    window.addEventListener("storage", onStorage);
    snapshot = read();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && media) {
      media.removeEventListener("change", onMediaChange);
      window.removeEventListener("storage", onStorage);
      media = null;
    }
  };
}

function getSnapshot(): Motion {
  if (!snapshot) snapshot = read();
  return snapshot;
}

/** "on" or "off". On the server, and so during hydration, "off": no loop renders a video until the client knows. */
export function useMotion(): Motion {
  return useSyncExternalStore(subscribe, getSnapshot, () => "off");
}
