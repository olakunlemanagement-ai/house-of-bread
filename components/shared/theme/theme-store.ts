import { useSyncExternalStore } from "react";
import { THEME_COLOR, THEME_KEY } from "./theme-script";

export type ThemeChoice = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";
export type ThemeSnapshot = { choice: ThemeChoice; resolved: ResolvedTheme };

// Page wide theme state, in the same shape as the motion store in
// LoopVideoClient. The html element is the source of truth: the head script
// set data-theme from storage before first paint, and setTheme changes it.

const DARK_QUERY = "(prefers-color-scheme: dark)";
const SERVER_SNAPSHOT: ThemeSnapshot = { choice: "system", resolved: "light" };

const listeners = new Set<() => void>();
let snapshot: ThemeSnapshot | null = null;
let media: MediaQueryList | null = null;

function read(): ThemeSnapshot {
  const attr = document.documentElement.getAttribute("data-theme");
  const choice: ThemeChoice = attr === "light" || attr === "dark" ? attr : "system";
  const resolved: ResolvedTheme =
    choice === "system" ? (window.matchMedia(DARK_QUERY).matches ? "dark" : "light") : choice;
  return { choice, resolved };
}

/** An explicit choice paints the browser chrome in that theme; system restores each meta's own colour. */
function syncThemeColor(choice: ThemeChoice) {
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    const own = (meta.getAttribute("media") ?? "").includes("dark") ? THEME_COLOR.dark : THEME_COLOR.light;
    meta.setAttribute("content", choice === "system" ? own : THEME_COLOR[choice]);
  });
}

function refresh() {
  const next = read();
  if (snapshot && next.choice === snapshot.choice && next.resolved === snapshot.resolved) return;
  snapshot = next;
  syncThemeColor(next.choice);
  for (const listener of listeners) listener();
}

function applyAttribute(choice: ThemeChoice) {
  const root = document.documentElement;
  // Colours change at once: transitions pause for two frames (globals.css).
  root.setAttribute("data-theme-switching", "");
  if (choice === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", choice);
  requestAnimationFrame(() => requestAnimationFrame(() => root.removeAttribute("data-theme-switching")));
}

/** Another tab changed the choice. */
function onStorage(event: StorageEvent) {
  if (event.key !== THEME_KEY) return;
  const value = event.newValue;
  applyAttribute(value === "light" || value === "dark" ? value : "system");
  refresh();
}

export function setTheme(choice: ThemeChoice) {
  try {
    if (choice === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, choice);
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

/** The visitor's choice and the theme in effect. On the server: system, light. */
export function useTheme(): ThemeSnapshot {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_SNAPSHOT);
}
