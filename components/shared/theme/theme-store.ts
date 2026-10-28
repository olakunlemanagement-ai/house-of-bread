import { useSyncExternalStore } from "react";
import { THEME_COLOR, THEME_KEY } from "./theme-script";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ThemeSnapshot = { choice: ThemeChoice; resolved: ResolvedTheme };

// Page wide theme state, in the same shape as the Motion store
// (motion-store.ts). The html element is the source of truth: the head script
// set data-theme before first paint (the saved choice, or light), and
// setTheme changes it. Every choice is saved, "system" included, because no
// saved choice means light.

const DARK_QUERY = "(prefers-color-scheme: dark)";
const SERVER_SNAPSHOT: ThemeSnapshot = { choice: "light", resolved: "light" };

const listeners = new Set<() => void>();
let snapshot: ThemeSnapshot | null = null;
let media: MediaQueryList | null = null;

/** A stored or attribute value as a choice. Anything unknown, or nothing, is light. */
export function toChoice(value: string | null | undefined): ThemeChoice {
  return value === "dark" || value === "system" ? value : "light";
}

function read(): ThemeSnapshot {
  const choice = toChoice(document.documentElement.getAttribute("data-theme"));
  const resolved: ResolvedTheme =
    choice === "system" ? (window.matchMedia(DARK_QUERY).matches ? "dark" : "light") : choice;
  return { choice, resolved };
}

/** The browser chrome follows the theme in effect. */
function syncThemeColor(resolved: ResolvedTheme) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute("content", THEME_COLOR[resolved]);
  });
}

function refresh() {
  const next = read();
  if (snapshot && next.choice === snapshot.choice && next.resolved === snapshot.resolved) return;
  snapshot = next;
  syncThemeColor(next.resolved);
  for (const listener of listeners) listener();
}

function applyAttribute(choice: ThemeChoice) {
  const root = document.documentElement;
  // Colours change at once: transitions pause for two frames (globals.css).
  root.setAttribute("data-theme-switching", "");
  root.setAttribute("data-theme", choice);
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
}

/** Another tab changed the choice. */
function onStorage(event: StorageEvent) {
  if (event.key !== THEME_KEY) return;
  applyAttribute(toChoice(event.newValue));
  refresh();
}

export function setTheme(choice: ThemeChoice) {
  try {
    window.localStorage.setItem(THEME_KEY, choice);
  } catch {
    // Storage blocked or full: the choice still holds for this page view.
  }
  applyAttribute(choice);
  refresh();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (!media) {
    media = window.matchMedia(DARK_QUERY);
    media.addEventListener("change", refresh);
    window.addEventListener("storage", onStorage);
    refresh();
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && media) {
      media.removeEventListener("change", refresh);
      window.removeEventListener("storage", onStorage);
      media = null;
    }
  };
}

function getSnapshot(): ThemeSnapshot {
  if (!snapshot) snapshot = read();
  return snapshot;
}

/** The visitor's choice and the theme in effect. On the server: light, the default. */
export function useTheme(): ThemeSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
